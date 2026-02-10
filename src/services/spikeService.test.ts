import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from './apiClient';
import { spikeService } from './spikeService';
import { API_ENDPOINTS } from '@/config/apiConfig';

// Mock apiClient
vi.mock('./apiClient', () => ({
    default: {
        post: vi.fn(),
    },
}));

// Mock apiConfig to force real API implementation for testing
vi.mock('@/config/apiConfig', async () => {
    const actual = await vi.importActual('@/config/apiConfig');
    return {
        ...actual,
        USE_MOCK_API: false,
    };
});

describe('spikeService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('simulateSpike', () => {
        it('should map camelCase data to snake_case payload and call the API', async () => {
            const spikeData = {
                durationSeconds: 60,
                cpuUsagePercent: 80,
                memoryUsagePercent: 70,
                networkInKb: 1000,
                networkOutKb: 500,
            };

            const expectedPayload = {
                duration_seconds: 60,
                cpu_usage_percent: 80,
                memory_usage_percent: 70,
                network_in_kb: 1000,
                network_out_kb: 500,
            };

            const mockResponse = { data: { message: 'Spike started' } };
            (apiClient.post as any).mockResolvedValueOnce(mockResponse);

            const result = await spikeService.simulateSpike(spikeData);

            expect(apiClient.post).toHaveBeenCalledWith(
                API_ENDPOINTS.METRICS.SIMULATE_SPIKE,
                expectedPayload
            );
            expect(result).toEqual(mockResponse.data);
        });

        it('should only include provided metrics in the payload', async () => {
            const spikeData = {
                durationSeconds: 30,
                cpuUsagePercent: 90,
            };

            const expectedPayload = {
                duration_seconds: 30,
                cpu_usage_percent: 90,
            };

            const mockResponse = { data: { message: 'Spike started' } };
            (apiClient.post as any).mockResolvedValueOnce(mockResponse);

            await spikeService.simulateSpike(spikeData);

            expect(apiClient.post).toHaveBeenCalledWith(
                API_ENDPOINTS.METRICS.SIMULATE_SPIKE,
                expectedPayload
            );
        });

        it('should throw an error when the API call fails', async () => {
            const spikeData = { durationSeconds: 60 };
            const error = new Error('API Error');

            (apiClient.post as any).mockRejectedValueOnce(error);

            await expect(spikeService.simulateSpike(spikeData)).rejects.toThrow('API Error');
        });
    });
});
