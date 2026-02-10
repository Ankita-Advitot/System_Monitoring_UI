import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { metricService } from './metricService';
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

describe('metricService', () => {
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
            onopen: null,
        };

        global.EventSource = vi.fn(() => mockEventSource) as any;
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('streamMetrics', () => {
        it('should create an EventSource with the correct URL', () => {
            const callbacks = {
                onData: vi.fn(),
                onError: vi.fn(),
            };

            metricService.streamMetrics(callbacks);

            expect(global.EventSource).toHaveBeenCalledWith('http://localhost:8080/metrics/stream');
        });

        it('should handle metric_update events and call onData with mapped data', () => {
            const callbacks = {
                onData: vi.fn(),
                onError: vi.fn(),
            };

            metricService.streamMetrics(callbacks);

            const rawData = {
                timestamp: '2024-01-01T00:00:00Z',
                cpu_usage_percent: 45.5,
                memory_usage_percent: 60.2,
                network_in_kb: 150.5,
                network_out_kb: 75.3,
            };

            // Simulate receiving an event
            if (eventListeners['metric_update']) {
                eventListeners['metric_update']({ data: JSON.stringify(rawData) });
            }

            expect(callbacks.onData).toHaveBeenCalledWith({
                timestamp: new Date('2024-01-01T00:00:00Z').getTime(),
                cpuUsagePercent: 45.5,
                memoryUsagePercent: 60.2,
                networkInKb: 150.5,
                networkOutKb: 75.3,
            });
        });

        it('should call onError when parsing fails', () => {
            const callbacks = {
                onData: vi.fn(),
                onError: vi.fn(),
            };

            metricService.streamMetrics(callbacks);

            // Simulate receiving invalid JSON
            if (eventListeners['metric_update']) {
                eventListeners['metric_update']({ data: 'invalid-json' });
            }

            expect(callbacks.onError).toHaveBeenCalledWith(expect.any(Error));
            expect(callbacks.onError).toHaveBeenCalledWith(new Error('Failed to parse metric data'));
        });

        it('should handle connection errors and attempt to reconnect', () => {
            const callbacks = {
                onData: vi.fn(),
                onError: vi.fn(),
            };

            metricService.streamMetrics(callbacks);

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
                onData: vi.fn(),
                onError: vi.fn(),
            };

            const cleanup = metricService.streamMetrics(callbacks);
            cleanup();

            expect(mockEventSource.close).toHaveBeenCalled();

            // Ensure no reconnection occurs after cleanup
            vi.advanceTimersByTime(5000);
            expect(global.EventSource).toHaveBeenCalledTimes(1);
        });
    });
});
