import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { spikeSimulationSchema, type SpikeSimulationSchemaType } from '../schemas/spikeSchema';
import { SPIKE_FORM_LABELS, DEFAULT_SPIKE_VALUES } from '../constants/spikeConstants';
import { Loader2, Cpu, HardDrive, ArrowDown, ArrowUp, Clock } from 'lucide-react';

interface SpikeSimulationFormProps {
  onSubmit: (data: SpikeSimulationSchemaType) => void;
  isLoading: boolean;
}

export const SpikeSimulationForm = ({ onSubmit, isLoading }: SpikeSimulationFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SpikeSimulationSchemaType>({
    resolver: zodResolver(spikeSimulationSchema),
    defaultValues: DEFAULT_SPIKE_VALUES,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errors.cpuUsagePercent && errors.cpuUsagePercent.message?.includes('At least') && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{errors.cpuUsagePercent.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="cpuUsagePercent" className="flex items-center gap-2 text-foreground">
            <Cpu className="w-4 h-4 text-chart-cpu" />
            {SPIKE_FORM_LABELS.CPU}
          </Label>
          <Input
            id="cpuUsagePercent"
            type="number"
            step="1"
            min="0"
            max="100"
            placeholder="0-100"
            className="form-input"
            {...register('cpuUsagePercent', { 
              setValueAs: (v) => v === '' ? undefined : Number(v) 
            })}
          />
          {errors.cpuUsagePercent && !errors.cpuUsagePercent.message?.includes('At least') && (
            <p className="text-sm text-destructive">{errors.cpuUsagePercent.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="memoryUsagePercent" className="flex items-center gap-2 text-foreground">
            <HardDrive className="w-4 h-4 text-chart-memory" />
            {SPIKE_FORM_LABELS.MEMORY}
          </Label>
          <Input
            id="memoryUsagePercent"
            type="number"
            step="1"
            min="0"
            max="100"
            placeholder="0-100"
            className="form-input"
            {...register('memoryUsagePercent', { 
              setValueAs: (v) => v === '' ? undefined : Number(v) 
            })}
          />
          {errors.memoryUsagePercent && (
            <p className="text-sm text-destructive">{errors.memoryUsagePercent.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="networkInKb" className="flex items-center gap-2 text-foreground">
            <ArrowDown className="w-4 h-4 text-chart-networkIn" />
            {SPIKE_FORM_LABELS.NETWORK_IN}
          </Label>
          <Input
            id="networkInKb"
            type="number"
            step="1"
            min="0"
            placeholder="KB"
            className="form-input"
            {...register('networkInKb', { 
              setValueAs: (v) => v === '' ? undefined : Number(v) 
            })}
          />
          {errors.networkInKb && (
            <p className="text-sm text-destructive">{errors.networkInKb.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="networkOutKb" className="flex items-center gap-2 text-foreground">
            <ArrowUp className="w-4 h-4 text-chart-networkOut" />
            {SPIKE_FORM_LABELS.NETWORK_OUT}
          </Label>
          <Input
            id="networkOutKb"
            type="number"
            step="1"
            min="0"
            placeholder="KB"
            className="form-input"
            {...register('networkOutKb', { 
              setValueAs: (v) => v === '' ? undefined : Number(v) 
            })}
          />
          {errors.networkOutKb && (
            <p className="text-sm text-destructive">{errors.networkOutKb.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2 max-w-xs">
        <Label htmlFor="durationSeconds" className="flex items-center gap-2 text-foreground">
          <Clock className="w-4 h-4 text-primary" />
          {SPIKE_FORM_LABELS.DURATION}
        </Label>
        <Input
          id="durationSeconds"
          type="number"
          step="1"
          min="1"
          className="form-input"
          {...register('durationSeconds', { valueAsNumber: true })}
        />
        {errors.durationSeconds && (
          <p className="text-sm text-destructive">{errors.durationSeconds.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="btn-primary"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {SPIKE_FORM_LABELS.LOADING}
          </>
        ) : (
          SPIKE_FORM_LABELS.SUBMIT
        )}
      </Button>
    </form>
  );
};
