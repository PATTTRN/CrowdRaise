'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authService } from '@/services';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('If that email exists, a reset link has been sent.');
    } catch {
      toast.error('Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle2 className="size-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
        <p className="text-muted-foreground mb-6">
          If an account exists for <strong className="text-foreground">{email}</strong>, you&apos;ll receive a password reset link shortly.
        </p>
        <Link href="/auth/login" className="text-primary font-medium hover:underline text-sm">
          Back to Sign In
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="size-4" /> Back to home
      </Link>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Reset Password</h1>
        <p className="text-sm text-muted-foreground">Enter your email and we&apos;ll send you a reset link</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="forgot-email" className="text-sm font-medium text-foreground">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input id="forgot-email" type="email" value={email} autoFocus autoComplete="email" onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="pl-10" required />
          </div>
        </div>

        <Button type="submit" className="w-full h-12" disabled={isLoading || !email}>
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : 'Send Reset Link'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/auth/login" className="text-sm text-primary font-medium hover:underline">
          Back to Sign In
        </Link>
      </div>
    </Card>
  );
}
