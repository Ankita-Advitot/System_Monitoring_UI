import { z } from 'zod';

export const thresholdSchema = z
  .object({
    cpuThreshold: z
      .coerce.number({
        invalid_type_error: 'CPU threshold must be a number',
      })
      .int('CPU threshold must be an integer')
      .min(0, 'CPU threshold cannot be less than 0')
      .max(100, 'CPU threshold cannot exceed 100'),

    memoryThreshold: z
      .coerce.number({
        invalid_type_error: 'Memory threshold must be a number',
      })
      .int('Memory threshold must be an integer')
      .min(0, 'Memory threshold cannot be less than 0')
      .max(100, 'Memory threshold cannot exceed 100'),

    networkInThreshold: z
      .coerce.number({
        invalid_type_error: 'Network In threshold must be a number',
      })
      .int('Network In threshold must be an integer')
      .min(0, 'Network In threshold cannot be negative')
      .max(10_000, 'Network In threshold is unrealistically high'),

    networkOutThreshold: z
      .coerce.number({
        invalid_type_error: 'Network Out threshold must be a number',
      })
      .int('Network Out threshold must be an integer')
      .min(0, 'Network Out threshold cannot be negative')
      .max(10_000, 'Network Out threshold is unrealistically high'),
  })
  .refine(
    (data) =>
      data.cpuThreshold + data.memoryThreshold <= 180,
    {
      message:
        'CPU and Memory thresholds combined should not exceed safe limits',
      path: ['cpuThreshold'],
    }
  );

export type ThresholdSchemaType = z.infer<typeof thresholdSchema>;
