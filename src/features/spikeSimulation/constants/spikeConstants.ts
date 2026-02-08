export const SPIKE_FORM_LABELS = {
  CPU: 'CPU Usage (%)',
  MEMORY: 'Memory Usage (%)',
  NETWORK_IN: 'Network In (KB)',
  NETWORK_OUT: 'Network Out (KB)',
  DURATION: 'Duration (seconds)',
  SUBMIT: 'Simulate Spike',
  LOADING: 'Simulating...',
} as const;

export const SPIKE_MESSAGES = {
  SUCCESS: 'Spike simulation started successfully!',
  ERROR: 'Failed to start spike simulation. Please try again.',
} as const;

export const DEFAULT_SPIKE_VALUES = {
  cpuUsagePercent: undefined,
  memoryUsagePercent: undefined,
  networkInKb: undefined,
  networkOutKb: undefined,
  durationSeconds: 10,
} as const;
