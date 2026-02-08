import apiClient from './apiClient';
import { USE_MOCK_API, API_ENDPOINTS, MOCK_DELAY_MS } from '@/config/apiConfig';
import type { ThresholdData, ThresholdResponse } from '@/features/thresholds/types/thresholdTypes';
import { DEFAULT_THRESHOLDS } from '@/features/thresholds/constants/thresholdConstants';

// Mock storage
let mockThresholds: ThresholdData = { ...DEFAULT_THRESHOLDS };

// Mock implementations
const mockGetThresholds = async (): Promise<ThresholdData> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  return { ...mockThresholds };
};

const mockUpdateThresholds = async (data: ThresholdData): Promise<ThresholdResponse> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  mockThresholds = { ...data };
  return { message: 'Thresholds updated successfully' };
};

// Real API implementations
const realGetThresholds = async (): Promise<ThresholdData> => {
  const response = await apiClient.get(API_ENDPOINTS.THRESHOLDS.GET);

  const apiData = response.data;

  return {
    cpuThreshold: apiData.cpu_threshold,
    memoryThreshold: apiData.memory_threshold,
    networkInThreshold: apiData.network_in_threshold,
    networkOutThreshold: apiData.network_out_threshold,
  };
};

const realUpdateThresholds = async (
  data: ThresholdData
): Promise<ThresholdResponse> => {
  const payload = {
    cpu_threshold: data.cpuThreshold,
    memory_threshold: data.memoryThreshold,
    network_in_threshold: data.networkInThreshold,
    network_out_threshold: data.networkOutThreshold,
  };

  const response = await apiClient.patch(
    API_ENDPOINTS.THRESHOLDS.UPDATE,
    payload
  );

  return response.data;
};


export const thresholdService = {
  getThresholds: USE_MOCK_API ? mockGetThresholds : realGetThresholds,
  updateThresholds: USE_MOCK_API ? mockUpdateThresholds : realUpdateThresholds,
};
