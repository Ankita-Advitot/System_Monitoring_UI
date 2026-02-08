import apiClient from './apiClient';
import { USE_MOCK_API, API_ENDPOINTS, MOCK_DELAY_MS } from '@/config/apiConfig';
import { generateMockMetric } from '@/features/dashboard/utils/dashboardUtils';
import type { MetricData } from '@/features/dashboard/types/dashboardTypes';

// For mock mode, we'll use a generator function
let mockIntervalId: NodeJS.Timeout | null = null;

export interface MetricStreamCallbacks {
  onData: (data: MetricData) => void;
  onError: (error: Error) => void;
}

// Mock SSE implementation using setInterval
const mockStreamMetrics = (callbacks: MetricStreamCallbacks): (() => void) => {
  mockIntervalId = setInterval(() => {
    try {
      const metric = generateMockMetric();
      callbacks.onData(metric);
    } catch (error) {
      callbacks.onError(error as Error);
    }
  }, 2500);

  // Return cleanup function
  return () => {
    if (mockIntervalId) {
      clearInterval(mockIntervalId);
      mockIntervalId = null;
    }
  };
};

// Real SSE implementation
const realStreamMetrics = (callbacks: MetricStreamCallbacks): (() => void) => {
  let eventSource: EventSource | null = null;
  let retryTimeout: NodeJS.Timeout | null = null;
  let isManuallyClosed = false;

  const connect = () => {
    if (isManuallyClosed) return;

    const url = `${apiClient.defaults.baseURL}${API_ENDPOINTS.METRICS.STREAM}`;
    console.log(`Connecting to metrics SSE: ${url}`);

    eventSource = new EventSource(url);

    const handleMetricUpdate = (event: MessageEvent) => {
      try {
        const rawData = JSON.parse(event.data);
        const mappedData: MetricData = {
          timestamp: new Date(rawData.timestamp).getTime(),
          cpuUsagePercent: rawData.cpu_usage_percent,
          memoryUsagePercent: rawData.memory_usage_percent,
          networkInKb: rawData.network_in_kb,
          networkOutKb: rawData.network_out_kb,
        };
        callbacks.onData(mappedData);
      } catch (error) {
        console.error('Failed to parse metric data:', error);
        callbacks.onError(new Error('Failed to parse metric data'));
      }
    };

    eventSource.addEventListener('metric_update', handleMetricUpdate as EventListener);

    eventSource.onopen = () => {
      console.log('Metrics SSE connection established');
    };

    eventSource.onerror = (error) => {
      if (isManuallyClosed) return;

      console.error('Metrics SSE connection error:', error);
      callbacks.onError(new Error('SSE connection error. Attempting to reconnect...'));

      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }

      // Retry connection after 5 seconds if not manually closed
      if (!isManuallyClosed) {
        if (retryTimeout) clearTimeout(retryTimeout);
        retryTimeout = setTimeout(connect, 5000);
      }
    };
  };

  connect();

  // Return cleanup function
  return () => {
    console.log('Closing metrics SSE connection');
    isManuallyClosed = true;
    if (retryTimeout) clearTimeout(retryTimeout);
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  };
};

export const metricService = {
  streamMetrics: USE_MOCK_API ? mockStreamMetrics : realStreamMetrics,
};
