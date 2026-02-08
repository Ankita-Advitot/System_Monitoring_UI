import apiClient from './apiClient';
import { USE_MOCK_API, API_ENDPOINTS, MOCK_DELAY_MS } from '@/config/apiConfig';
import type { SpikeSimulationData, SpikeSimulationResponse } from '@/features/spikeSimulation/types/spikeTypes';

// Mock implementation
const mockSimulateSpike = async (data: SpikeSimulationData): Promise<SpikeSimulationResponse> => {
  // Simulate 1-2 second delay
  const delay = 1000 + Math.random() * 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  console.log('Mock spike simulation started:', data);

  return {
    message: `Spike simulation started for ${data.durationSeconds} seconds`
  };
};

// Real API implementation
const realSimulateSpike = async (data: SpikeSimulationData): Promise<SpikeSimulationResponse> => {
  const payload = {
    duration_seconds: data.durationSeconds,
    ...(data.cpuUsagePercent !== undefined && { cpu_usage_percent: data.cpuUsagePercent }),
    ...(data.memoryUsagePercent !== undefined && { memory_usage_percent: data.memoryUsagePercent }),
    ...(data.networkInKb !== undefined && { network_in_kb: data.networkInKb }),
    ...(data.networkOutKb !== undefined && { network_out_kb: data.networkOutKb }),
  };

  const response = await apiClient.post<SpikeSimulationResponse>(
    API_ENDPOINTS.METRICS.SIMULATE_SPIKE,
    payload
  );
  return response.data;
};

export const spikeService = {
  simulateSpike: USE_MOCK_API ? mockSimulateSpike : realSimulateSpike,
};
