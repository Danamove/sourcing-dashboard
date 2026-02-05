import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { Mail, CheckCircle } from 'lucide-react';

const ALLOWED_DOMAIN = 'added-value.co.il';

const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .refine(
      (email) => email.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`),
      `Only @${ALLOWED_DOMAIN} emails are allowed`
    ),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState('');

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
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: window.location.origin + window.location.pathname,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setEmailSent(true);
        setSentToEmail(data.email);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send login link');
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
            Added Value Team Access
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          {emailSent ? (
            <div className="text-center py-4">
              <div
                className="h-16 w-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, hsl(145 60% 45%) 0%, hsl(145 50% 40%) 100%)' }}
              >
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: 'hsl(220 25% 20%)' }}>
                Check your email
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                We sent a login link to:
              </p>
              <p className="font-medium" style={{ color: 'hsl(32 95% 44%)' }}>
                {sentToEmail}
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                Click the link in the email to sign in
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => { setEmailSent(false); setSentToEmail(''); }}
              >
                Use a different email
              </Button>
            </div>
          ) : (
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

              <div
                className="rounded-xl p-3 text-xs text-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(220 60% 97%) 0%, hsl(220 40% 95%) 100%)',
                  border: '1px solid hsl(220 40% 85%)',
                  color: 'hsl(220 50% 40%)',
                }}
              >
                Access for @{ALLOWED_DOMAIN} team members only
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'hsl(220 15% 45%)' }}
                >
                  Work Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={`your.name@${ALLOWED_DOMAIN}`}
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

              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-base font-medium transition-all duration-200 gap-2"
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(135deg, hsl(32 95% 44%) 0%, hsl(32 80% 38%) 100%)',
                  boxShadow: isLoading ? 'none' : '0 4px 16px hsl(32 95% 40% / 0.35)',
                  border: 'none',
                }}
              >
                <Mail className="h-4 w-4" />
                {isLoading ? 'Sending...' : 'Send Login Link'}
              </Button>

              <p className="text-xs text-center text-muted-foreground pt-2">
                We'll email you a magic link to sign in instantly
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
