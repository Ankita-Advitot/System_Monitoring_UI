export interface MetricData {
  timestamp: number;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  networkInKb: number;
  networkOutKb: number;
}

export interface MetricCardData {
  label: string;
  value: number;
  unit: string;
  color: string;
  icon: string;
}

export interface ChartData {
  time: string;
  value: number;
}

export interface NetworkChartData {
  time: string;
  networkIn: number;
  networkOut: number;
}

export type AlertSeverity = 'warning' | 'critical';

export interface AlertEvent {
  resource_type: string;
  severity: AlertSeverity;
  event_type: string;
  reason: string;
  event_at: string;
  is_resolved?: boolean;
}

export interface CpuAllocationData {
  total_cores: number;
  allocated_cores: number;
  last_scaled_at: string;
}
