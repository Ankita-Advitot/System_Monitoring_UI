import { z } from 'zod';
import { AUTH_VALIDATION } from '../../constants/authConstants';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .regex(
      AUTH_VALIDATION.EMAIL.REGEX,
      AUTH_VALIDATION.EMAIL.MESSAGE
    ),

  password: z
    .string()
    .trim()
    .min(1, 'Password is required'),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
