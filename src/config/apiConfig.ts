// API Configuration
// Set to false when real backend is ready
export const USE_MOCK_API = false;

export const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'auth/login',
    REGISTER: 'auth/register',
  },
  METRICS: {
    STREAM: '/metrics/stream',
    SIMULATE_SPIKE: '/metrics/simulate-spike',
  },
  THRESHOLDS: {
    GET: '/threshold',
    UPDATE: '/threshold',
  },
  ALERTS: {
    STREAM: '/alerts/stream',
  },
  CPU: {
    ALLOCATION: '/cpu-allocation',
  },
} as const;

export const MOCK_DELAY_MS = 800;
