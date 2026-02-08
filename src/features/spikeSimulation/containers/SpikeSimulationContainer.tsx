import { useState } from 'react';
import { SpikeSimulationForm } from '../components/SpikeSimulationForm';
import { spikeService } from '@/services/spikeService';
import { SPIKE_MESSAGES } from '../constants/spikeConstants';
import type { SpikeSimulationSchemaType } from '../schemas/spikeSchema';
import type { SpikeSimulationData } from '../types/spikeTypes';
import { useToast } from '@/hooks/use-toast';
import { Zap } from 'lucide-react';

export const SpikeSimulationContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: SpikeSimulationSchemaType) => {
    setIsLoading(true);

    // Convert form data to API format
    const apiData: SpikeSimulationData = {
      durationSeconds: data.durationSeconds,
      ...(typeof data.cpuUsagePercent === 'number' && { cpuUsagePercent: data.cpuUsagePercent }),
      ...(typeof data.memoryUsagePercent === 'number' && { memoryUsagePercent: data.memoryUsagePercent }),
      ...(typeof data.networkInKb === 'number' && { networkInKb: data.networkInKb }),
      ...(typeof data.networkOutKb === 'number' && { networkOutKb: data.networkOutKb }),
    };

    try {
      await spikeService.simulateSpike(apiData);
      toast({
        title: 'Success',
        description: SPIKE_MESSAGES.SUCCESS,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: SPIKE_MESSAGES.ERROR,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Spike Simulation</h1>
        <p className="text-muted-foreground">Simulate resource spikes for testing purposes</p>
      </div>

      {/* Form Card */}
      <div className="glass-card p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-warning/10">
            <Zap className="w-6 h-6 text-warning" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Simulation Settings</h2>
            <p className="text-sm text-muted-foreground">
              Enter values for the metrics you want to spike. At least one metric is required.
            </p>
          </div>
        </div>

        <SpikeSimulationForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};
