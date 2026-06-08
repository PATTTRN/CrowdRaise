'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Lock, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      toast.error('Invalid or missing reset link parameters.');
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    setIsSubmitting(true);
    try {
      await authService.resetPassword(email!, token!, password);
      setDone(true);
      toast.success('Password reset successful!');
    } catch {
      toast.error('Failed to reset password. The link may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-[var(--header-height)]">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">🔗</div>
          <h1 className="text-2xl font-bold mb-2">Invalid Link</h1>
          <p className="text-muted-foreground mb-6">This password reset link is invalid or missing parameters.</p>
          <Link href="/"><Button>Go Home</Button></Link>
        </Card>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-[var(--header-height)]">
        <Card className="p-8 max-w-md w-full text-center">
          <CheckCircle2 className="size-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Password Reset</h1>
          <p className="text-muted-foreground mb-6">Your password has been reset successfully.</p>
          <Button onClick={() => { window.dispatchEvent(new CustomEvent('open-auth-modal')); router.push('/'); }}>
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-[var(--header-height)]">
      <Card className="p-8 max-w-md w-full">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="size-4" /> Back to home
        </Link>
        <h1 className="text-2xl font-bold mb-1">Set New Password</h1>
        <p className="text-sm text-muted-foreground mb-6">Enter your new password for <strong>{email}</strong></p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className="pl-10" minLength={8} required autoFocus />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat your password" className="pl-10" minLength={8} required />
            </div>
          </div>
          <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : 'Reset Password'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
