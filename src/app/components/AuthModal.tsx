"use client";

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { authService } from '@/services';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Loader2, Mail, Lock, User as UserIcon, Shield, ExternalLink } from 'lucide-react';
import { useLogin, useRegister, useVerifyOtp } from '@/hooks/use-queries';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

type FormValues = {
  name: string;
  email: string;
  password: string;
};

type Mode = 'login' | 'register' | 'verify' | 'forgot';

function FocusTrap({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    el.addEventListener('keydown', handler);
    return () => el.removeEventListener('keydown', handler);
  }, []);
  return <div ref={ref}>{children}</div>;
}

function ResendTimer() {
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const handleResend = async () => {
    setLoading(true);
    try {
      await authService.sendOtp();
      setCountdown(60);
      toast.success('Code resent');
    } catch {
      toast.error('Failed to resend');
    } finally {
      setLoading(false);
    }
  };

  if (countdown > 0) {
    return <span className="text-xs text-muted-foreground">Resend in {countdown}s</span>;
  }

  return (
    <button type="button" onClick={handleResend} disabled={loading} className="text-xs text-primary hover:underline disabled:opacity-50">
      {loading ? <Loader2 className="size-3 animate-spin inline" /> : 'Resend Code'}
    </button>
  );
}

function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  if (!pw) return { label: '', color: '', width: '0%' };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: '20%' };
  if (score <= 2) return { label: 'Fair', color: 'bg-orange-500', width: '40%' };
  if (score <= 3) return { label: 'Good', color: 'bg-yellow-500', width: '60%' };
  if (score <= 4) return { label: 'Strong', color: 'bg-lime-500', width: '80%' };
  return { label: 'Very strong', color: 'bg-green-500', width: '100%' };
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [otp, setOtp] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const { register, handleSubmit, watch, formState: { errors }, setFocus } = useForm<FormValues>();

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const verifyOtpMutation = useVerifyOtp();

  useEffect(() => {
    if (isOpen && mode !== 'verify') {
      const field = mode === 'login' ? 'email' : 'name';
      setTimeout(() => setFocus(field), 0);
    }
  }, [isOpen, mode, setFocus]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (mode === 'verify' && otp.length === 6 && !verifyOtpMutation.isPending) {
      handleVerify();
    }
  }, [otp, mode]);

  if (!isOpen) return null;

  const onSubmit = async (data: FormValues) => {
    if (mode === 'login') {
      const res = await loginMutation.mutateAsync({ email: data.email, password: data.password });
      setAuth(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      onClose();
    } else if (mode === 'register') {
      const res = await registerMutation.mutateAsync({ name: data.name, email: data.email, password: data.password });
      setAuth(res.data.user, res.data.token);
      toast.success('Account created! A verification code has been sent.');
      setMode('verify');
    }
  };

  const handleVerify = async () => {
    await verifyOtpMutation.mutateAsync(otp);
    toast.success('Email verified successfully!');
    onClose();
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending || verifyOtpMutation.isPending;
  const passwordValue = watch('password') || '';
  const pwStrength = mode === 'register' ? getPasswordStrength(passwordValue) : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <FocusTrap>
        <div className="relative w-full max-w-md bg-white rounded-2xl p-8 shadow-xl mx-4" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={mode === 'login' ? 'Login' : mode === 'register' ? 'Create account' : 'Verify email'}>
          <button onClick={onClose} aria-label="Close modal" className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"><X className="size-5" /></button>

          <div className="text-center mb-8">
            <div className="text-2xl font-bold text-foreground mb-1 tracking-tight">{mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Join CrowdRaise' : 'Verify Email'}</div>
            <div className="text-sm text-muted-foreground">{mode === 'login' ? 'Sign in to manage your collections' : mode === 'register' ? 'Create an account to start raising funds' : 'Enter the code sent to your email'}</div>
          </div>

          {mode !== 'verify' ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {mode === 'register' && (
                  <div className="space-y-1.5">
                  <label htmlFor="auth-name" className="text-sm font-medium text-foreground">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="auth-name" {...register('name', { required: mode === 'register' })} autoComplete="name" placeholder="John Doe" className="pl-10" />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 ml-1">Name is required</p>}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="auth-email" className="text-sm font-medium text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input id="auth-email" {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })} type="email" autoComplete="email" placeholder="name@example.com" className="pl-10" />
                </div>
                {errors.email && <p className="text-xs text-red-500 ml-1">Valid email is required</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="auth-password" className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input id="auth-password" {...register('password', { required: true, minLength: mode === 'register' ? 8 : 1 })} type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} placeholder={mode === 'register' ? 'At least 8 characters' : 'Enter password'} className="pl-10" />
                </div>
                {errors.password && <p className="text-xs text-red-500 ml-1">Password must be at least 8 characters</p>}
                {mode === 'register' && pwStrength && passwordValue && (
                  <div className="mt-2">
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full ${pwStrength.color} transition-all duration-300 rounded-full`} style={{ width: pwStrength.width }} />
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Shield className="size-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{pwStrength.label}</span>
                    </div>
                  </div>
                )}
              </div>

              {mode === 'login' && (
                <div className="text-right">
                  <button type="button" onClick={() => setMode('forgot')} className="text-xs text-muted-foreground hover:text-primary transition-colors">Forgot password?</button>
                </div>
              )}

              <Button type="submit" disabled={isLoading} className="w-full h-12">
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Verification Code</label>
                <Input
                  type="text" inputMode="numeric" required maxLength={6} placeholder="000000"
                  className="text-center text-2xl tracking-[0.5em] h-14"
                  value={otp} autoFocus autoComplete="one-time-code"
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
                <div className="flex justify-between items-center mt-3">
                  <ResendTimer />
                  {verifyOtpMutation.isPending && <span className="text-xs text-muted-foreground flex items-center gap-1"><Loader2 className="size-3 animate-spin" /> Verifying...</span>}
                </div>
              </div>
              <Button onClick={handleVerify} disabled={isLoading || otp.length !== 6} className="w-full h-12">
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : 'Verify Email'}
              </Button>
            </div>
          )}

          {mode === 'forgot' ? (
            <div className="space-y-4 mt-4">
                <div className="space-y-1.5">
                <label htmlFor="forgot-email" className="text-sm font-medium text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input id="forgot-email" type="email" value={forgotEmail} autoFocus autoComplete="email" onChange={(e) => setForgotEmail(e.target.value)} placeholder="name@example.com" className="pl-10" />
                </div>
              </div>
              <Button className="w-full h-12" disabled={!forgotEmail} onClick={async () => {
                try {
                  await authService.forgotPassword(forgotEmail);
                  setForgotSent(true);
                  toast.success('If that email exists, a reset link has been sent.');
                } catch { toast.error('Failed to send reset email'); }
              }}>
                {forgotSent ? 'Check your email' : 'Send Reset Link'}
              </Button>
              <div className="text-center">
                <button onClick={() => { setMode('login'); setForgotSent(false); }} className="text-sm text-primary font-medium hover:underline">Back to Sign In</button>
              </div>
            </div>
          ) : mode !== 'verify' && (
            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-primary font-medium hover:underline">
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-border/50 text-center">
            <a
              href={mode === 'login' ? '/auth/login' : mode === 'register' ? '/auth/register' : '/auth/verify-email'}
              onClick={onClose}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="size-3" />
              Open full page
            </a>
          </div>
        </div>
      </FocusTrap>
    </div>
  );
};

export default AuthModal;
