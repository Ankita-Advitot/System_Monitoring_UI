import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { thresholdSchema, type ThresholdSchemaType } from '../schemas/thresholdSchema';
import { THRESHOLD_FORM_LABELS } from '../constants/thresholdConstants';
import { Loader2, Cpu, HardDrive, ArrowDown, ArrowUp } from 'lucide-react';
import { useEffect } from 'react';

interface ThresholdFormProps {
  onSubmit: (data: ThresholdSchemaType) => void;
  isLoading: boolean;
  initialValues?: ThresholdSchemaType;
}

export const ThresholdForm = ({ onSubmit, isLoading, initialValues }: ThresholdFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ThresholdSchemaType>({
    resolver: zodResolver(thresholdSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="cpuThreshold" className="flex items-center gap-2 text-foreground">
            <Cpu className="w-4 h-4 text-chart-cpu" />
            {THRESHOLD_FORM_LABELS.CPU}
          </Label>
          <Input
            id="cpuThreshold"
            type="number"
            step="1"
            min="0"
            max="100"
            className="form-input"
            {...register('cpuThreshold', { valueAsNumber: true })}
          />
          {errors.cpuThreshold && (
            <p className="text-sm text-destructive">{errors.cpuThreshold.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="memoryThreshold" className="flex items-center gap-2 text-foreground">
            <HardDrive className="w-4 h-4 text-chart-memory" />
            {THRESHOLD_FORM_LABELS.MEMORY}
          </Label>
          <Input
            id="memoryThreshold"
            type="number"
            step="1"
            min="0"
            max="100"
            className="form-input"
            {...register('memoryThreshold', { valueAsNumber: true })}
          />
          {errors.memoryThreshold && (
            <p className="text-sm text-destructive">{errors.memoryThreshold.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="networkInThreshold" className="flex items-center gap-2 text-foreground">
            <ArrowDown className="w-4 h-4 text-chart-networkIn" />
            {THRESHOLD_FORM_LABELS.NETWORK_IN}
          </Label>
          <Input
            id="networkInThreshold"
            type="number"
            step="1"
            min="0"
            className="form-input"
            {...register('networkInThreshold', { valueAsNumber: true })}
          />
          {errors.networkInThreshold && (
            <p className="text-sm text-destructive">{errors.networkInThreshold.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="networkOutThreshold" className="flex items-center gap-2 text-foreground">
            <ArrowUp className="w-4 h-4 text-chart-networkOut" />
            {THRESHOLD_FORM_LABELS.NETWORK_OUT}
          </Label>
          <Input
            id="networkOutThreshold"
            type="number"
            step="1"
            min="0"
            className="form-input"
            {...register('networkOutThreshold', { valueAsNumber: true })}
          />
          {errors.networkOutThreshold && (
            <p className="text-sm text-destructive">{errors.networkOutThreshold.message}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="btn-primary"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {THRESHOLD_FORM_LABELS.LOADING}
          </>
        ) : (
          THRESHOLD_FORM_LABELS.SUBMIT
        )}
      </Button>
    </form>
  );
};
