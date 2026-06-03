"use client";

import React, { useState, useEffect, useRef } from 'react';
import { authService } from '@/services';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import type { RegisterPayload, LoginPayload } from '@/lib/api-types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Loader2, Mail, Lock, User } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

interface AxiosErrorResponse {
  response?: { data?: { message?: string } };
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'verify'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      firstInputRef.current?.focus();
    }
  }, [isOpen, mode]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register' && formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    try {
      if (mode === 'login') {
        const res = await authService.login({ email: formData.email, password: formData.password });
        setAuth(res.data.user, res.data.token);
        toast.success(`Welcome back, ${res.data.user.name}!`);
        onClose();
      } else if (mode === 'register') {
        const res = await authService.register({ name: formData.name, email: formData.email, password: formData.password });
        setAuth(res.data.user, res.data.token);
        toast.success('Account created! A verification code has been sent to your email.');
        setMode('verify');
      } else if (mode === 'verify') {
        await api.post('/auth/email/verify-otp', { otp });
        toast.success('Email verified successfully!');
        onClose();
      }
    } catch (error) {
      const err = error as AxiosErrorResponse;
      toast.error(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      await api.post('/auth/email/send-otp');
      toast.success('New verification code sent!');
    } catch (error) {
      const err = error as AxiosErrorResponse;
      toast.error(err.response?.data?.message || 'Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl p-8 shadow-xl mx-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'login' ? 'Login' : mode === 'register' ? 'Create account' : 'Verify email'}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Join CrowdRaise'}
          </h2>
          <p className="text-muted-foreground">
            {mode === 'login' ? 'Login to manage your collections' : 'Create an account to start raising funds'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1">
              <label htmlFor="auth-name" className="text-sm text-muted-foreground ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  ref={firstInputRef}
                  id="auth-name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="pl-10"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
          )}

          {mode === 'verify' && (
            <div className="space-y-1">
              <label htmlFor="auth-otp" className="text-sm text-muted-foreground ml-1">Verification Code</label>
              <Input
                ref={firstInputRef}
                id="auth-otp"
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                className="text-center text-2xl tracking-[0.5em]"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-xs text-primary hover:underline disabled:opacity-50"
                >
                  Resend Code
                </button>
              </div>
            </div>
          )}

          {mode !== 'verify' && (
            <>
              <div className="space-y-1">
                <label htmlFor="auth-email" className="text-sm text-muted-foreground ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    ref={mode === 'login' ? firstInputRef : undefined}
                    id="auth-email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="auth-password" className="text-sm text-muted-foreground ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="auth-password"
                    type="password"
                    required
                    minLength={6}
                    placeholder={mode === 'register' ? 'At least 6 characters' : '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              {mode === 'login' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => toast.info('Please contact support to reset your password.')}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </>
          )}

          <Button type="submit" disabled={isLoading} className="w-full h-12">
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              mode === 'login' ? 'Login' : mode === 'register' ? 'Create Account' : 'Verify Email'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-primary font-medium hover:underline"
            >
              {mode === 'login' ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
