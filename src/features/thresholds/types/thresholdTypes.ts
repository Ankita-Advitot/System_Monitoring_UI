export interface ThresholdData {
  cpuThreshold: number;
  memoryThreshold: number;
  networkInThreshold: number;
  networkOutThreshold: number;
}

export interface ThresholdResponse {
  message: string;
}
