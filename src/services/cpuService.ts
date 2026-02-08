import apiClient from './apiClient';
import { USE_MOCK_API, API_ENDPOINTS, MOCK_DELAY_MS } from '@/config/apiConfig';
import type { CpuAllocationData } from '@/features/dashboard/types/dashboardTypes';

// Mock implementation for CPU allocation
const getMockCpuAllocation = async (): Promise<CpuAllocationData> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

    return {
        total_cores: 16,
        allocated_cores: Math.floor(Math.random() * 12) + 4,
        last_scaled_at: new Date().toISOString(),
    };
};

interface BackendCpuAllocation {
    id: number;
    total_cores: number;
    allocated_cores: number;
    reason: string;
    created_at: string;
    updated_at: string;
}

// Real API implementation
const getRealCpuAllocation = async (): Promise<CpuAllocationData> => {
    const response = await apiClient.get<BackendCpuAllocation>(API_ENDPOINTS.CPU.ALLOCATION);
    const data = response.data;

    return {
        total_cores: data.total_cores,
        allocated_cores: data.allocated_cores,
        last_scaled_at: data.updated_at || data.created_at || new Date().toISOString(),
    };
};

export const cpuService = {
    getCpuAllocation: USE_MOCK_API ? getMockCpuAllocation : getRealCpuAllocation,
};
