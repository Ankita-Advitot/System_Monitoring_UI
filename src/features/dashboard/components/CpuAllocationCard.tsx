import { Layers, Calendar } from 'lucide-react';
import type { CpuAllocationData } from '../types/dashboardTypes';
import { format } from 'date-fns';

interface CpuAllocationCardProps {
    data: CpuAllocationData | null;
    loading?: boolean;
}

export const CpuAllocationCard = ({ data, loading }: CpuAllocationCardProps) => {
    if (loading && !data) {
        return (
            <div className="metric-card animate-pulse h-80 flex items-center justify-center">
                <p className="text-muted-foreground">Loading CPU allocation status...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="metric-card h-80 flex items-center justify-center">
                <p className="text-muted-foreground">No CPU allocation data available</p>
            </div>
        );
    }

    const allocationPercent = (data.allocated_cores / data.total_cores) * 100;

    return (
        <div className="metric-card h-80 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Layers className="w-5 h-5 text-chart-cpu" />
                    <h3 className="font-semibold text-foreground">CPU Core Allocation</h3>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total Cores</p>
                            <p className="text-2xl font-bold text-foreground">{data.total_cores}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Allocated</p>
                            <p className="text-2xl font-bold text-chart-cpu">{data.allocated_cores}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Allocation Load</span>
                            <span className="font-medium">{allocationPercent.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                                className="h-full bg-chart-cpu transition-all duration-1000 ease-out"
                                style={{ width: `${allocationPercent}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                    Last Scaled: {(() => {
                        try {
                            const date = new Date(data.last_scaled_at);
                            if (isNaN(date.getTime())) return 'Unknown';
                            return format(date, 'MMM d, HH:mm:ss');
                        } catch (e) {
                            return 'Unknown';
                        }
                    })()}
                </span>
            </div>
        </div>
    );
};
