import type { MetricData } from '../types/dashboardTypes';

export const generateMockMetric = (): MetricData => {
  const now = Date.now();
  
  // Generate realistic fluctuating values
  const cpuBase = 35 + Math.random() * 40;
  const cpuNoise = Math.sin(now / 5000) * 10;
  
  const memoryBase = 45 + Math.random() * 30;
  const memoryNoise = Math.cos(now / 7000) * 8;
  
  return {
    timestamp: now,
    cpuUsagePercent: Math.min(100, Math.max(0, cpuBase + cpuNoise)),
    memoryUsagePercent: Math.min(100, Math.max(0, memoryBase + memoryNoise)),
    networkInKb: Math.floor(100 + Math.random() * 500),
    networkOutKb: Math.floor(50 + Math.random() * 300),
  };
};

export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatKb = (value: number): string => {
  if (value >= 1024) {
    return `${(value / 1024).toFixed(1)} MB`;
  }
  return `${value.toFixed(0)} KB`;
};
