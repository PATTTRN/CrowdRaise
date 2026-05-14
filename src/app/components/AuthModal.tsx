"use client";

import React, { useState } from 'react';
import { authService } from '@/services';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'verify'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await authService.login({
          email: formData.email,
          password: formData.password,
        });
        setAuth(res.user, res.token);
        toast.success(`Welcome back, ${res.user.name}!`);
        onClose();
      } else if (mode === 'register') {
        const res = await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        setAuth(res.user, res.token); // Login immediately to enable verify-otp call
        toast.success('Account created! A verification code has been sent to your email.');
        setMode('verify');
      } else if (mode === 'verify') {
        await api.post('/auth/email/verify-otp', { otp });
        toast.success('Email verified successfully!');
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      await api.post('/auth/email/send-otp');
      toast.success('New verification code sent!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Join Crowdraise'}
          </h2>
          <p className="text-white/60">
            {mode === 'login' ? 'Login to manage your collections' : 'Create an account to start raising funds'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-sm text-white/70 ml-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          {mode === 'verify' && (
            <div className="space-y-1">
              <label className="text-sm text-white/70 ml-1">Verification Code</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
              <div className="text-right mt-2">
                <button 
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-xs text-pink-400 hover:underline disabled:opacity-50"
                >
                  Resend Code
                </button>
              </div>
            </div>
          )}

          {mode !== 'verify' && (
            <>
              <div className="space-y-1">
                <label className="text-sm text-white/70 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-white/70 ml-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-500/20 hover:scale-[1.02] cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <i className="fas fa-circle-notch fa-spin"></i>
            ) : (
              mode === 'login' ? 'Login' : mode === 'register' ? 'Create Account' : 'Verify Email'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/60">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-pink-400 font-medium hover:underline cursor-pointer"
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
