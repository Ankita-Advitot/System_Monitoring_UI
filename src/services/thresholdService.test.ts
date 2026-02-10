import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from './apiClient';
import { thresholdService } from './thresholdService';
import { API_ENDPOINTS } from '@/config/apiConfig';

// Mock apiClient
vi.mock('./apiClient', () => ({
    default: {
        get: vi.fn(),
        patch: vi.fn(),
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

describe('thresholdService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getThresholds', () => {
        it('should call the get endpoint and map snake_case to camelCase', async () => {
            const mockApiResponse = {
                data: {
                    cpu_threshold: 80,
                    memory_threshold: 70,
                    network_in_threshold: 1000,
                    network_out_threshold: 500,
                },
            };

            (apiClient.get as any).mockResolvedValueOnce(mockApiResponse);

            const result = await thresholdService.getThresholds();

            expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.THRESHOLDS.GET);
            expect(result).toEqual({
                cpuThreshold: 80,
                memoryThreshold: 70,
                networkInThreshold: 1000,
                networkOutThreshold: 500,
            });
        });

        it('should throw an error when the get request fails', async () => {
            const error = new Error('Failed to fetch');
            (apiClient.get as any).mockRejectedValueOnce(error);

            await expect(thresholdService.getThresholds()).rejects.toThrow('Failed to fetch');
        });
    });

    describe('updateThresholds', () => {
        it('should map camelCase to snake_case and call the patch endpoint', async () => {
            const thresholdData = {
                cpuThreshold: 85,
                memoryThreshold: 75,
                networkInThreshold: 1500,
                networkOutThreshold: 600,
            };

            const expectedPayload = {
                cpu_threshold: 85,
                memory_threshold: 75,
                network_in_threshold: 1500,
                network_out_threshold: 600,
            };

            const mockResponse = { data: { message: 'Updated' } };
            (apiClient.patch as any).mockResolvedValueOnce(mockResponse);

            const result = await thresholdService.updateThresholds(thresholdData);

            expect(apiClient.patch).toHaveBeenCalledWith(
                API_ENDPOINTS.THRESHOLDS.UPDATE,
                expectedPayload
            );
            expect(result).toEqual(mockResponse.data);
        });

        it('should throw an error when the update request fails', async () => {
            const thresholdData = {
                cpuThreshold: 85,
                memoryThreshold: 75,
                networkInThreshold: 1500,
                networkOutThreshold: 600,
            };

            const error = new Error('Update failed');
            (apiClient.patch as any).mockRejectedValueOnce(error);

            await expect(thresholdService.updateThresholds(thresholdData)).rejects.toThrow('Update failed');
        });
    });
});
