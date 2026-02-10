import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from './apiClient';
import { cpuService } from './cpuService';
import { API_ENDPOINTS } from '@/config/apiConfig';

// Mock apiClient
vi.mock('./apiClient', () => ({
    default: {
        get: vi.fn(),
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

describe('cpuService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getCpuAllocation', () => {
        it('should call the cpu allocation endpoint and return mapped data', async () => {
            const mockBackendData = {
                id: 1,
                total_cores: 16,
                allocated_cores: 8,
                reason: 'Initial allocation',
                created_at: '2024-01-01T10:00:00Z',
                updated_at: '2024-01-01T11:00:00Z',
            };

            const mockResponse = { data: mockBackendData };
            (apiClient.get as any).mockResolvedValueOnce(mockResponse);

            const result = await cpuService.getCpuAllocation();

            expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.CPU.ALLOCATION);
            expect(result).toEqual({
                total_cores: 16,
                allocated_cores: 8,
                last_scaled_at: '2024-01-01T11:00:00Z',
            });
        });

        it('should use created_at if updated_at is missing', async () => {
            const mockBackendData = {
                id: 1,
                total_cores: 16,
                allocated_cores: 4,
                reason: 'Initial allocation',
                created_at: '2024-01-01T10:00:00Z',
                updated_at: null,
            };

            const mockResponse = { data: mockBackendData };
            (apiClient.get as any).mockResolvedValueOnce(mockResponse);

            const result = await cpuService.getCpuAllocation();

            expect(result.last_scaled_at).toBe('2024-01-01T10:00:00Z');
        });

        it('should throw an error when the API request fails', async () => {
            const error = new Error('Network Error');
            (apiClient.get as any).mockRejectedValueOnce(error);

            await expect(cpuService.getCpuAllocation()).rejects.toThrow('Network Error');
        });
    });
});
