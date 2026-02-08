import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useSystemStore } from '@/store/systemStore';
import { cpuService } from '@/services/cpuService';

export const SystemStreamManager = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const startStreams = useSystemStore((state) => state.startStreams);
    const stopStreams = useSystemStore((state) => state.stopStreams);
    const clearData = useSystemStore((state) => state.clearData);
    const fetchCpuAllocation = useSystemStore((state) => state.fetchCpuAllocation);

    useEffect(() => {
        if (isAuthenticated) {
            startStreams();
            fetchCpuAllocation(); // Force initial fetch
        } else {
            stopStreams();
            clearData();
        }

        return () => {
            stopStreams();
        };
    }, [isAuthenticated, startStreams, stopStreams, clearData, fetchCpuAllocation]);

    return null; // Headless component
};
