import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from './apiClient';
import { authService } from './authService';
import { API_ENDPOINTS } from '@/config/apiConfig';

// Mock apiClient
vi.mock('./apiClient', () => ({
    default: {
        post: vi.fn(),
    },
}));

describe('authService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('login', () => {
        it('should call the login endpoint with correct data and return response data', async () => {
            const loginData = { email: 'test@example.com', password: 'password123' };
            const mockResponse = { data: { token: 'fake-token' } };

            (apiClient.post as any).mockResolvedValueOnce(mockResponse);

            const result = await authService.login(loginData);

            expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.LOGIN, loginData);
            expect(result).toEqual(mockResponse.data);
        });

        it('should throw an error when the login request fails', async () => {
            const loginData = { email: 'test@example.com', password: 'wrong-password' };
            const error = new Error('Invalid credentials');

            (apiClient.post as any).mockRejectedValueOnce(error);

            await expect(authService.login(loginData)).rejects.toThrow('Invalid credentials');
        });
    });

    describe('register', () => {
        it('should call the register endpoint with correct data and return response data', async () => {
            const registerData = { name: 'John Doe', email: 'john@example.com', password: 'password123', confirmPassword: 'password123' };
            const mockResponse = { data: { message: 'Success' } };

            (apiClient.post as any).mockResolvedValueOnce(mockResponse);

            const result = await authService.register(registerData);

            expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.AUTH.REGISTER, registerData);
            expect(result).toEqual(mockResponse.data);
        });

        it('should throw an error when the registration request fails', async () => {
            const registerData = { name: 'John Doe', email: 'existing@example.com', password: 'password123', confirmPassword: 'password123' };
            const error = new Error('Email already exists');

            (apiClient.post as any).mockRejectedValueOnce(error);

            await expect(authService.register(registerData)).rejects.toThrow('Email already exists');
        });
    });
});
