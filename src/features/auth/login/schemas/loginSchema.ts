import { z } from 'zod';
import { AUTH_VALIDATION } from '../../constants/authConstants';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(AUTH_VALIDATION.EMAIL.REGEX, AUTH_VALIDATION.EMAIL.MESSAGE),
  password: z
    .string()
    .min(AUTH_VALIDATION.PASSWORD.MIN, `Password must be at least ${AUTH_VALIDATION.PASSWORD.MIN} characters`)
    .max(AUTH_VALIDATION.PASSWORD.MAX, `Password must not exceed ${AUTH_VALIDATION.PASSWORD.MAX} characters`),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
