import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';
import { authService } from '@/services/authService';
import { REGISTER_MESSAGES } from '../constants/registerConstants';
import type { RegisterFormData } from '../types/registerTypes';
import type { RegisterSchemaType } from '../schemas/registerSchema';
import { Activity } from 'lucide-react';

export const RegisterContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.register(data);
      navigate('/login');
    } catch (err) {
      setError(REGISTER_MESSAGES.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="auth-card animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground mt-2">
            Start monitoring your system resources
          </p>
        </div>

        <RegisterForm onSubmit={handleRegister} isLoading={isLoading} error={error} />

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
