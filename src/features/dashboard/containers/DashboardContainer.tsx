import { CpuChart } from '../components/CpuChart';
import { MemoryChart } from '../components/MemoryChart';
import { NetworkChart } from '../components/NetworkChart';
import { MetricCard } from '../components/MetricCard';
import { CpuAllocationCard } from '../components/CpuAllocationCard';
import { formatTime } from '../utils/dashboardUtils';
import { METRIC_LABELS } from '../constants/dashboardConstants';
import type { ChartData, NetworkChartData } from '../types/dashboardTypes';
import { useSystemStore } from '@/store/systemStore';

export const DashboardContainer = () => {
  const metrics = useSystemStore((state) => state.metrics);
  const latestMetric = useSystemStore((state) => state.latestMetric);
  const cpuAllocation = useSystemStore((state) => state.cpuAllocation);
  const isLoadingCpu = useSystemStore((state) => state.isLoadingCpu);

  const cpuChartData: ChartData[] = metrics.map((m) => ({
    time: formatTime(m.timestamp),
    value: m.cpuUsagePercent,
  }));

  const memoryChartData: ChartData[] = metrics.map((m) => ({
    time: formatTime(m.timestamp),
    value: m.memoryUsagePercent,
  }));

  const networkChartData: NetworkChartData[] = metrics.map((m) => ({
    time: formatTime(m.timestamp),
    networkIn: m.networkInKb,
    networkOut: m.networkOutKb,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Real-time system resource monitoring</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label={METRIC_LABELS.CPU}
          value={latestMetric?.cpuUsagePercent ?? 0}
          unit="%"
          type="cpu"
        />
        <MetricCard
          label={METRIC_LABELS.MEMORY}
          value={latestMetric?.memoryUsagePercent ?? 0}
          unit="%"
          type="memory"
        />
        <MetricCard
          label={METRIC_LABELS.NETWORK_IN}
          value={latestMetric?.networkInKb ?? 0}
          unit="KB"
          type="networkIn"
        />
        <MetricCard
          label={METRIC_LABELS.NETWORK_OUT}
          value={latestMetric?.networkOutKb ?? 0}
          unit="KB"
          type="networkOut"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CpuChart data={cpuChartData} />
        <MemoryChart data={memoryChartData} />
        <NetworkChart data={networkChartData} />
        <CpuAllocationCard data={cpuAllocation} loading={isLoadingCpu} />
      </div>
    </div>
  );
};