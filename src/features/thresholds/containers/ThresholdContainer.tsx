import { useState, useEffect } from 'react';
import { ThresholdForm } from '../components/ThresholdForm';
import { thresholdService } from '@/services/thresholdService';
import { THRESHOLD_MESSAGES, DEFAULT_THRESHOLDS } from '../constants/thresholdConstants';
import type { ThresholdData } from '../types/thresholdTypes';
import { useToast } from '@/hooks/use-toast';
import { Sliders } from 'lucide-react';

export const ThresholdContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [thresholds, setThresholds] = useState<ThresholdData>(DEFAULT_THRESHOLDS);
  const { toast } = useToast();

  useEffect(() => {
    const fetchThresholds = async () => {
      try {
        const data = await thresholdService.getThresholds();
        setThresholds(data);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: THRESHOLD_MESSAGES.LOAD_ERROR,
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchThresholds();
  }, [toast]);

  const handleSubmit = async (data: ThresholdData) => {
    setIsLoading(true);
    try {
      await thresholdService.updateThresholds(data);
      setThresholds(data);
      toast({
        title: 'Success',
        description: THRESHOLD_MESSAGES.SUCCESS,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: THRESHOLD_MESSAGES.ERROR,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Thresholds</h1>
        <p className="text-muted-foreground">Configure alert thresholds for system resources</p>
      </div>

      {/* Form Card */}
      <div className="glass-card p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-primary/10">
            <Sliders className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Alert Configuration</h2>
            <p className="text-sm text-muted-foreground">
              Set thresholds to trigger alerts when metrics exceed these values
            </p>
          </div>
        </div>

        {isFetching ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <ThresholdForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            initialValues={thresholds}
          />
        )}
      </div>
    </div>
  );
};
