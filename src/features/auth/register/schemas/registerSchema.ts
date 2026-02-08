import { z } from 'zod';
import { AUTH_VALIDATION } from '../../constants/authConstants';

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(AUTH_VALIDATION.NAME.MIN, `Name must be at least ${AUTH_VALIDATION.NAME.MIN} characters`)
      .max(AUTH_VALIDATION.NAME.MAX, `Name must not exceed ${AUTH_VALIDATION.NAME.MAX} characters`)
      .regex(AUTH_VALIDATION.NAME.REGEX, AUTH_VALIDATION.NAME.MESSAGE),

    email: z
      .string()
      .min(1, 'Email is required')
      .regex(AUTH_VALIDATION.EMAIL.REGEX, AUTH_VALIDATION.EMAIL.MESSAGE),

    password: z
      .string()
      .min(AUTH_VALIDATION.PASSWORD.MIN, `Password must be at least ${AUTH_VALIDATION.PASSWORD.MIN} characters`)
      .max(AUTH_VALIDATION.PASSWORD.MAX, `Password must not exceed ${AUTH_VALIDATION.PASSWORD.MAX} characters`)
      .regex(AUTH_VALIDATION.PASSWORD.UPPERCASE_REGEX, 'Password must contain at least one uppercase letter')
      .regex(AUTH_VALIDATION.PASSWORD.LOWERCASE_REGEX, 'Password must contain at least one lowercase letter')
      .regex(AUTH_VALIDATION.PASSWORD.NUMBER_REGEX, 'Password must contain at least one number')
      .regex(
        AUTH_VALIDATION.PASSWORD.SPECIAL_CHAR_REGEX,
        'Password must contain at least one special character'
      )
      .refine((val) => AUTH_VALIDATION.PASSWORD.NO_SPACE_REGEX.test(val), {
        message: 'Password must not contain spaces',
      }),

    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(
    (data) => !data.password.toLowerCase().includes(data.name.toLowerCase()),
    {
      message: 'Password should not contain your name',
      path: ['password'],
    }
  )
  .refine(
    (data) => !data.password.toLowerCase().includes(data.email.split('@')[0]),
    {
      message: 'Password should not contain your email',
      path: ['password'],
    }
  );

export type RegisterSchemaType = z.infer<typeof registerSchema>;
