import { Cpu, HardDrive, ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: number;
  unit: string;
  type: 'cpu' | 'memory' | 'networkIn' | 'networkOut';
}

const iconMap = {
  cpu: Cpu,
  memory: HardDrive,
  networkIn: ArrowDown,
  networkOut: ArrowUp,
};

const colorMap = {
  cpu: 'text-chart-cpu border-chart-cpu/30 bg-chart-cpu/10',
  memory: 'text-chart-memory border-chart-memory/30 bg-chart-memory/10',
  networkIn: 'text-chart-networkIn border-chart-networkIn/30 bg-chart-networkIn/10',
  networkOut: 'text-chart-networkOut border-chart-networkOut/30 bg-chart-networkOut/10',
};

export const MetricCard = ({ label, value, unit, type }: MetricCardProps) => {
  const Icon = iconMap[type];
  const colorClass = colorMap[type];

  return (
    <div className="metric-card group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">
              {typeof value === 'number' ? value.toFixed(1) : value}
            </span>
            <span className="text-lg text-muted-foreground">{unit}</span>
          </div>
        </div>
        <div
          className={cn(
            'p-3 rounded-xl border transition-all duration-300',
            colorClass
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4 h-1 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            type === 'cpu' && 'bg-chart-cpu',
            type === 'memory' && 'bg-chart-memory',
            type === 'networkIn' && 'bg-chart-networkIn',
            type === 'networkOut' && 'bg-chart-networkOut'
          )}
          style={{ width: `${type.includes('network') ? Math.min(100, value / 10) : value}%` }}
        />
      </div>
    </div>
  );
};
