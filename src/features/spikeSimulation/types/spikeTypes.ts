export interface SpikeSimulationData {
  cpuUsagePercent?: number;
  memoryUsagePercent?: number;
  networkInKb?: number;
  networkOutKb?: number;
  durationSeconds: number;
}

export interface SpikeSimulationResponse {
  message: string;
}
