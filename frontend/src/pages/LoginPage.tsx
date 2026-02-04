import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/auth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await authApi.login(data.email, data.password);
      login(response.user, response.accessToken, response.refreshToken);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{
        background: `
          radial-gradient(ellipse at 30% 20%, hsl(32 50% 92% / 0.8) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, hsl(220 40% 94% / 0.8) 0%, transparent 50%),
          linear-gradient(135deg, hsl(40 30% 97%) 0%, hsl(220 20% 96%) 100%)
        `,
      }}
    >
      <div
        className="w-full max-w-md animate-fade-in-up"
        style={{
          background: 'linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(40 20% 99%) 100%)',
          borderRadius: '1.5rem',
          boxShadow: `
            0 4px 6px hsl(220 25% 10% / 0.02),
            0 12px 24px hsl(220 25% 10% / 0.04),
            0 24px 48px hsl(220 25% 10% / 0.04)
          `,
          border: '1px solid hsl(220 20% 92%)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          className="px-8 py-10 text-center"
          style={{
            background: 'linear-gradient(180deg, hsl(220 25% 12%) 0%, hsl(220 30% 8%) 100%)',
          }}
        >
          <div
            className="h-14 w-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, hsl(32 95% 50%) 0%, hsl(32 80% 40%) 100%)',
              boxShadow: '0 8px 24px hsl(32 95% 40% / 0.4)',
            }}
          >
            <span
              className="text-2xl font-bold text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              S
            </span>
          </div>
          <h1
            className="text-2xl font-normal"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'hsl(40 20% 95%)',
            }}
          >
            Sourcing Dashboard
          </h1>
          <p
            className="text-sm mt-2"
            style={{ color: 'hsl(220 15% 55%)' }}
          >
            Sign in to manage your projects
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div
                className="rounded-xl p-4 text-sm"
                style={{
                  background: 'linear-gradient(135deg, hsl(0 80% 97%) 0%, hsl(0 60% 95%) 100%)',
                  border: '1px solid hsl(0 60% 85%)',
                  color: 'hsl(0 70% 40%)',
                }}
              >
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: 'hsl(220 15% 45%)' }}
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                {...register('email')}
                className="h-12 rounded-xl border-2 transition-all duration-200"
                style={{
                  borderColor: errors.email ? 'hsl(0 70% 50%)' : 'hsl(220 20% 90%)',
                  background: 'hsl(40 20% 99%)',
                }}
              />
              {errors.email && (
                <p className="text-xs" style={{ color: 'hsl(0 70% 50%)' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: 'hsl(220 15% 45%)' }}
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="h-12 rounded-xl border-2 transition-all duration-200"
                style={{
                  borderColor: errors.password ? 'hsl(0 70% 50%)' : 'hsl(220 20% 90%)',
                  background: 'hsl(40 20% 99%)',
                }}
              />
              {errors.password && (
                <p className="text-xs" style={{ color: 'hsl(0 70% 50%)' }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-medium transition-all duration-200"
              disabled={isLoading}
              style={{
                background: 'linear-gradient(135deg, hsl(32 95% 44%) 0%, hsl(32 80% 38%) 100%)',
                boxShadow: isLoading ? 'none' : '0 4px 16px hsl(32 95% 40% / 0.35)',
                border: 'none',
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <p
              className="text-center text-xs pt-2"
              style={{ color: 'hsl(220 15% 55%)' }}
            >
              Demo credentials: admin@example.com / admin123
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
