import { z } from 'zod';

// helper: convert empty string to undefined
const emptyToUndefined = (val: unknown) =>
  val === '' ? undefined : val;

export const spikeSimulationSchema = z
  .object({
    cpuUsagePercent: z
      .preprocess(
        emptyToUndefined,
        z.coerce
          .number({ invalid_type_error: 'CPU usage must be a number' })
          .int('CPU usage must be an integer')
          .min(0, 'CPU usage must be at least 0')
          .max(100, 'CPU usage must be at most 100')
          .optional()
      ),

    memoryUsagePercent: z
      .preprocess(
        emptyToUndefined,
        z.coerce
          .number({ invalid_type_error: 'Memory usage must be a number' })
          .int('Memory usage must be an integer')
          .min(0, 'Memory usage must be at least 0')
          .max(100, 'Memory usage must be at most 100')
          .optional()
      ),

    networkInKb: z
      .preprocess(
        emptyToUndefined,
        z.coerce
          .number({ invalid_type_error: 'Network In must be a number' })
          .int('Network In must be an integer')
          .min(0, 'Network In must be at least 0')
          .max(1_000_000, 'Network In spike is too high')
          .optional()
      ),

    networkOutKb: z
      .preprocess(
        emptyToUndefined,
        z.coerce
          .number({ invalid_type_error: 'Network Out must be a number' })
          .int('Network Out must be an integer')
          .min(0, 'Network Out must be at least 0')
          .max(1_000_000, 'Network Out spike is too high')
          .optional()
      ),

    durationSeconds: z
      .coerce
      .number({ invalid_type_error: 'Duration must be a number' })
      .int('Duration must be an integer')
      .min(1, 'Duration must be at least 1 second')
      .max(3600, 'Duration cannot exceed 1 hour'),
  })
  .refine(
    (data) =>
      data.cpuUsagePercent !== undefined ||
      data.memoryUsagePercent !== undefined ||
      data.networkInKb !== undefined ||
      data.networkOutKb !== undefined,
    {
      message: 'At least one spike metric must be provided',
      path: ['cpuUsagePercent'],
    }
  );

export type SpikeSimulationSchemaType = z.infer<
  typeof spikeSimulationSchema
>;
