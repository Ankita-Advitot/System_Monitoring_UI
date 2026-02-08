export const MAX_DATA_POINTS = 30;

export const METRIC_UPDATE_INTERVAL_MS = 2500;

export const CHART_COLORS = {
  CPU: '#06b6d4',
  MEMORY: '#a855f7',
  NETWORK_IN: '#22c55e',
  NETWORK_OUT: '#f59e0b',
} as const;

export const METRIC_LABELS = {
  CPU: 'CPU Usage',
  MEMORY: 'Memory Usage',
  NETWORK_IN: 'Network In',
  NETWORK_OUT: 'Network Out',
} as const;
