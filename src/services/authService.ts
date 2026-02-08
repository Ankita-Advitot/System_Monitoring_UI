import apiClient from './apiClient';
import { USE_MOCK_API, API_ENDPOINTS, MOCK_DELAY_MS } from '@/config/apiConfig';
import type { LoginFormData, LoginResponse } from '@/features/auth/login/types/loginTypes';
import type { RegisterFormData, RegisterResponse } from '@/features/auth/register/types/registerTypes';

// Mock implementations
const mockLogin = async (data: LoginFormData): Promise<LoginResponse> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  // Simulate validation
  if (data.email === 'test@example.com' && data.password === 'password123') {
    return { token: 'mock-jwt-token-' + Date.now() };
  }

  // Accept any email/password for demo
  return { token: 'mock-jwt-token-' + Date.now() };
};

const mockRegister = async (data: RegisterFormData): Promise<RegisterResponse> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  // Simulate email already exists check
  if (data.email === 'existing@example.com') {
    throw new Error('Email already exists');
  }

  return { message: 'Registration successful' };
};

// Real API implementations
const realLogin = async (data: LoginFormData): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
  return response.data;
};

const realRegister = async (data: RegisterFormData): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, {
    name: data.name,
    email: data.email,
    password: data.password,
  });
  return response.data;
};

// Exported service functions
export const authService = {
  login: realLogin,
  register: realRegister,
};
