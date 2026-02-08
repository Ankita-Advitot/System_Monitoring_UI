import apiClient from './apiClient';
import { USE_MOCK_API, API_ENDPOINTS } from '@/config/apiConfig';
import type { AlertEvent } from '@/features/dashboard/types/dashboardTypes';

export interface AlertStreamCallbacks {
    onAlert: (alert: AlertEvent) => void;
    onError: (error: Error) => void;
}

// Mock Alerts implementation
const mockStreamAlerts = (callbacks: AlertStreamCallbacks): (() => void) => {
    const alertTypes = ['cpu', 'memory', 'network'];
    const severities: ('warning' | 'critical')[] = ['warning', 'critical'];

    const intervalId = setInterval(() => {
        // 20% chance of an alert every 10 seconds
        if (Math.random() > 0.8) {
            const resourceType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
            const severity = severities[Math.floor(Math.random() * severities.length)];

            const alert: AlertEvent = {
                resource_type: resourceType,
                severity: severity,
                event_type: severity === 'critical' ? 'escalated' : 'triggered',
                reason: `${resourceType.toUpperCase()} usage is abnormally high`,
                event_at: new Date().toISOString(),
            };
            callbacks.onAlert(alert);
        }
    }, 10000);

    return () => clearInterval(intervalId);
};

// Real SSE implementation for Alerts
const realStreamAlerts = (callbacks: AlertStreamCallbacks): (() => void) => {
    let eventSource: EventSource | null = null;
    let retryTimeout: NodeJS.Timeout | null = null;
    let isManuallyClosed = false;

    const connect = () => {
        if (isManuallyClosed) return;

        eventSource = new EventSource(
            `${apiClient.defaults.baseURL}${API_ENDPOINTS.ALERTS.STREAM}`
        );

        const handleAlertEvent = (event: MessageEvent) => {
            try {
                const rawData = JSON.parse(event.data);

                // Map backend fields to AlertEvent interface
                const mappedAlert: AlertEvent = {
                    resource_type: rawData.resource_type || 'system',
                    severity: rawData.severity || 'warning',
                    event_type: rawData.event_type || rawData.type || 'status_change',
                    reason: rawData.reason || rawData.message || 'No details provided',
                    event_at: rawData.event_at || rawData.timestamp || new Date().toISOString(),
                };

                callbacks.onAlert(mappedAlert);
            } catch (error) {
                console.error('Failed to parse alert event data', error);
            }
        };

        eventSource.addEventListener('alert_event', handleAlertEvent as EventListener);

        eventSource.onerror = (error) => {
            if (isManuallyClosed) return;

            console.error('Alert SSE connection error:', error);
            callbacks.onError(new Error('Alert stream disconnected. Attempting to reconnect...'));

            if (eventSource) {
                eventSource.close();
            }

            // Retry connection after 5 seconds if not manually closed
            if (!isManuallyClosed) {
                retryTimeout = setTimeout(connect, 5000);
            }
        };
    };

    connect();

    return () => {
        isManuallyClosed = true;
        if (retryTimeout) clearTimeout(retryTimeout);
        if (eventSource) {
            eventSource.close();
        }
    };
};

export const alertService = {
    streamAlerts: USE_MOCK_API ? mockStreamAlerts : realStreamAlerts,
};
