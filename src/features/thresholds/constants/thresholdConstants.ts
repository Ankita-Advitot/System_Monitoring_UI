export const THRESHOLD_FORM_LABELS = {
  CPU: 'CPU Threshold (%)',
  MEMORY: 'Memory Threshold (%)',
  NETWORK_IN: 'Network In Threshold (KB)',
  NETWORK_OUT: 'Network Out Threshold (KB)',
  SUBMIT: 'Save Thresholds',
  LOADING: 'Saving...',
} as const;

export const THRESHOLD_MESSAGES = {
  SUCCESS: 'Thresholds updated successfully!',
  ERROR: 'Failed to update thresholds. Please try again.',
  LOAD_ERROR: 'Failed to load thresholds.',
} as const;

export const DEFAULT_THRESHOLDS = {
  cpuThreshold: 80,
  memoryThreshold: 85,
  networkInThreshold: 1000,
  networkOutThreshold: 500,
} as const;
