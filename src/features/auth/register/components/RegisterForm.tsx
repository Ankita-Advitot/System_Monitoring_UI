import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { registerSchema, type RegisterSchemaType } from '../schemas/registerSchema';
import { REGISTER_FORM_LABELS } from '../constants/registerConstants';
import { Loader2, User, Mail, Lock } from 'lucide-react';
import { PasswordRequirementList } from '../../components/PasswordRequirementList';
import { AUTH_VALIDATION } from '../../constants/authConstants';

interface RegisterFormProps {
  onSubmit: (data: RegisterSchemaType) => void;
  isLoading: boolean;
  error?: string | null;
}

export const RegisterForm = ({ onSubmit, isLoading, error }: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password');

  // Handle name input to strip numbers in real-time
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[0-9]/g, '');
    if (value !== filteredValue) {
      // If numbers were removed, we manually set the value back
      setValue('name', filteredValue, { shouldValidate: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground">
          {REGISTER_FORM_LABELS.NAME}
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            className="pl-10 form-input"
            {...register('name', {
              onChange: handleNameChange
            })}
          />
        </div>
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          {REGISTER_FORM_LABELS.EMAIL}
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="pl-10 form-input"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground">
          {REGISTER_FORM_LABELS.PASSWORD}
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            className="pl-10 form-input"
            {...register('password')}
          />
        </div>
        <PasswordRequirementList value={passwordValue} />
        {errors.password && (
          <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-foreground">
          {REGISTER_FORM_LABELS.CONFIRM_PASSWORD}
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            className="pl-10 form-input"
            {...register('confirmPassword')}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full btn-primary"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {REGISTER_FORM_LABELS.LOADING}
          </>
        ) : (
          REGISTER_FORM_LABELS.SUBMIT
        )}
      </Button>
    </form>
  );
};
