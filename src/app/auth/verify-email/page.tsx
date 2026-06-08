'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setInterval(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCountdown]);

  useEffect(() => {
    if (otp.length === 6 && !isLoading) handleVerify();
  }, [otp]);

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setIsLoading(true);
    try {
      await authService.verifyOtp(otp);
      setDone(true);
      toast.success('Email verified successfully!');
    } catch {
      toast.error('Invalid or expired code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authService.sendOtp();
      setResendCountdown(60);
      toast.success('Code resent');
    } catch {
      toast.error('Failed to resend');
    }
  };

  if (!isAuthenticated) return null;

  if (done) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle2 className="size-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Email Verified</h1>
        <p className="text-muted-foreground mb-6">Your email has been verified successfully.</p>
        <Button onClick={() => router.push('/dashboard')} className="w-full h-12">
          Go to Dashboard
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="size-4" /> Back to home
      </Link>
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Mail className="size-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Verify Your Email</h1>
        <p className="text-sm text-muted-foreground">
          We sent a code to <strong className="text-foreground">{user?.email}</strong>
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="verify-otp" className="text-sm font-medium text-foreground">Verification Code</label>
          <Input
            id="verify-otp"
            type="text" inputMode="numeric" required maxLength={6} placeholder="000000"
            className="text-center text-2xl tracking-[0.5em] h-14"
            value={otp} autoFocus autoComplete="one-time-code"
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          {resendCountdown > 0 ? (
            <span className="text-muted-foreground">Resend in {resendCountdown}s</span>
          ) : (
            <button type="button" onClick={handleResend} className="text-primary hover:underline">
              Resend Code
            </button>
          )}
          {isLoading && <span className="text-muted-foreground flex items-center gap-1"><Loader2 className="size-3 animate-spin" /> Verifying...</span>}
        </div>

        <Button onClick={handleVerify} disabled={isLoading || otp.length !== 6} className="w-full h-12">
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : 'Verify Email'}
        </Button>
      </div>

      <div className="mt-6 text-center">
        <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          Use a different account
        </Link>
      </div>
    </Card>
  );
}
