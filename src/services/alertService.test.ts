import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { alertService } from './alertService';
import apiClient from './apiClient';

// Mock apiClient defaults
vi.mock('./apiClient', () => ({
    default: {
        defaults: {
            baseURL: 'http://localhost:8080',
        },
    },
}));

// Mock apiConfig
vi.mock('@/config/apiConfig', async () => {
    const actual = await vi.importActual('@/config/apiConfig');
    return {
        ...actual,
        USE_MOCK_API: false,
    };
});

describe('alertService', () => {
    let mockEventSource: any;
    let eventListeners: Record<string, Function> = {};

    beforeEach(() => {
        vi.clearAllMocks();
        eventListeners = {};

        // Mock EventSource globally
        mockEventSource = {
            addEventListener: vi.fn((event, cb) => {
                eventListeners[event] = cb;
            }),
            close: vi.fn(),
            onerror: null,
        };

        global.EventSource = vi.fn(() => mockEventSource) as any;
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('streamAlerts', () => {
        it('should create an EventSource with the correct URL', () => {
            const callbacks = {
                onAlert: vi.fn(),
                onError: vi.fn(),
            };

            alertService.streamAlerts(callbacks);

            expect(global.EventSource).toHaveBeenCalledWith('http://localhost:8080/alerts/stream');
        });

        it('should handle alert events and call onAlert with mapped data', () => {
            const callbacks = {
                onAlert: vi.fn(),
                onError: vi.fn(),
            };

            alertService.streamAlerts(callbacks);

            const rawAlert = {
                resource_type: 'cpu',
                severity: 'critical',
                event_type: 'triggered',
                reason: 'High CPU',
                event_at: '2024-01-01T00:00:00Z',
            };

            // Simulate receiving an event
            if (eventListeners['alert_event']) {
                eventListeners['alert_event']({ data: JSON.stringify(rawAlert) });
            }

            expect(callbacks.onAlert).toHaveBeenCalledWith(expect.objectContaining({
                resource_type: 'cpu',
                severity: 'critical',
                event_type: 'triggered',
                reason: 'High CPU',
                event_at: '2024-01-01T00:00:00Z',
            }));
        });

        it('should handle connection errors and attempt to reconnect', () => {
            const callbacks = {
                onAlert: vi.fn(),
                onError: vi.fn(),
            };

            alertService.streamAlerts(callbacks);

            // Simulate an error
            if (mockEventSource.onerror) {
                mockEventSource.onerror(new Event('error'));
            }

            expect(callbacks.onError).toHaveBeenCalledWith(expect.any(Error));
            expect(mockEventSource.close).toHaveBeenCalled();

            // Check for reconnection attempt after 5 seconds
            vi.advanceTimersByTime(5000);
            expect(global.EventSource).toHaveBeenCalledTimes(2);
        });

        it('should stop streaming when the returned cleanup function is called', () => {
            const callbacks = {
                onAlert: vi.fn(),
                onError: vi.fn(),
            };

            const cleanup = alertService.streamAlerts(callbacks);
            cleanup();

            expect(mockEventSource.close).toHaveBeenCalled();

            // Ensure no reconnection occurs after cleanup
            vi.advanceTimersByTime(5000);
            expect(global.EventSource).toHaveBeenCalledTimes(1);
        });
    });
});
