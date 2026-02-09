import { create } from 'zustand';
import { metricService } from '@/services/metricService';
import { alertService } from '@/services/alertService';
import { cpuService } from '@/services/cpuService';
import { MAX_DATA_POINTS } from '@/features/dashboard/constants/dashboardConstants';
import type { MetricData, AlertEvent, CpuAllocationData } from '@/features/dashboard/types/dashboardTypes';
import { toast } from '@/components/ui/sonner';

interface SystemState {
    metrics: MetricData[];
    latestMetric: MetricData | null;
    alerts: AlertEvent[];
    cpuAllocation: CpuAllocationData | null;
    isLoadingCpu: boolean;
    isMetricsConnected: boolean;
    isAlertsConnected: boolean;
    metricsCleanup: (() => void) | null;
    alertsCleanup: (() => void) | null;

    // Actions
    addMetric: (metric: MetricData) => void;
    addAlert: (alert: AlertEvent) => void;
    fetchCpuAllocation: () => Promise<void>;
    startStreams: () => void;
    stopStreams: () => void;
    clearData: () => void;
}

export const useSystemStore = create<SystemState>((set, get) => ({
    metrics: [],
    latestMetric: null,
    alerts: [],
    cpuAllocation: null,
    isLoadingCpu: false,
    isMetricsConnected: false,
    isAlertsConnected: false,
    metricsCleanup: null,
    alertsCleanup: null,

    addMetric: (metric: MetricData) => {
        set((state) => {
            const updatedMetrics = [...state.metrics, metric].slice(-MAX_DATA_POINTS);
            return {
                metrics: updatedMetrics,
                latestMetric: metric,
            };
        });
    },

    addAlert: (alert: AlertEvent) => {
        set((state) => ({
            alerts: [alert, ...state.alerts].slice(0, 50), // Keep last 50 alerts
        }));

        // Show severity-based toast
        const resourceName = alert.resource_type.toUpperCase();
        const eventName = alert.event_type ? alert.event_type.replace('_', ' ') : 'Update';
        const title = `${resourceName} ${alert.severity === 'critical' ? 'Critical' : 'Warning'}: ${eventName}`;

        if (alert.is_resolved) {
            toast.success(`${resourceName} Resolved: ${eventName}`, {
                description: `The issue with ${resourceName.toLowerCase()} has been resolved.`,
            });
        } else if (alert.severity === 'critical') {
            toast.error(title, {
                description: alert.reason,
            });
        } else {
            toast.warning(title, {
                description: alert.reason,
            });
        }

        // Trigger CPU allocation update automatically for CPU alerts
        if (alert.resource_type === 'cpu') {
            get().fetchCpuAllocation();
        }
    },

    fetchCpuAllocation: async () => {
        set({ isLoadingCpu: true });
        try {
            const data = await cpuService.getCpuAllocation();
            set({ cpuAllocation: data });
        } catch (error) {
            console.error('Failed to fetch CPU allocation:', error);
        } finally {
            set({ isLoadingCpu: false });
        }
    },

    startStreams: () => {
        const { metricsCleanup, alertsCleanup } = get();

        // Already connected
        if (metricsCleanup && alertsCleanup) return;

        console.log('Starting global SSE streams...');

        const newMetricsCleanup = metricService.streamMetrics({
            onData: (data) => {
                get().addMetric(data);
                set({ isMetricsConnected: true });
            },
            onError: (error) => {
                console.error('Global Metric stream error:', error);
                set({ isMetricsConnected: false });
            },
        });

        const newAlertsCleanup = alertService.streamAlerts({
            onAlert: (alert) => {
                get().addAlert(alert);
                set({ isAlertsConnected: true });
            },
            onError: (error) => {
                console.error('Global Alert stream error:', error);
                set({ isAlertsConnected: false });
                toast.error('Alert stream disconnected', {
                    description: 'Attempting to reconnect...',
                });
            },
        });

        set({
            metricsCleanup: newMetricsCleanup,
            alertsCleanup: newAlertsCleanup,
        });
    },

    stopStreams: () => {
        const { metricsCleanup, alertsCleanup } = get();
        console.log('Stopping global SSE streams...');

        if (metricsCleanup) metricsCleanup();
        if (alertsCleanup) alertsCleanup();

        set({
            metricsCleanup: null,
            alertsCleanup: null,
            isMetricsConnected: false,
            isAlertsConnected: false,
        });
    },

    clearData: () => {
        set({
            metrics: [],
            latestMetric: null,
            alerts: [],
            cpuAllocation: null,
        });
    },
}));
