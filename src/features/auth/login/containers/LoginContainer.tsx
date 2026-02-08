import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { LOGIN_MESSAGES } from '../constants/loginConstants';
import type { LoginSchemaType } from '../schemas/loginSchema';
import type { LoginFormData } from '../types/loginTypes';
import { Activity } from 'lucide-react';

export const LoginContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(data);
      setToken(response.token);
      navigate('/app/dashboard');
    } catch (err) {
      setError(LOGIN_MESSAGES.ERROR);
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
          <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to monitor your system resources
          </p>
        </div>

        <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary hover:underline font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
