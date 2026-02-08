export const REGISTER_FORM_LABELS = {
  NAME: 'Full Name',
  EMAIL: 'Email',
  PASSWORD: 'Password',
  CONFIRM_PASSWORD: 'Confirm Password',
  SUBMIT: 'Create Account',
  LOADING: 'Creating account...',
} as const;

export const REGISTER_MESSAGES = {
  SUCCESS: 'Account created successfully! Please login.',
  ERROR: 'Registration failed. Please try again.',
  EMAIL_EXISTS: 'Email already exists',
} as const;
