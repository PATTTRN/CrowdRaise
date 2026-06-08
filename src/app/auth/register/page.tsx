'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { authService } from '@/services';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Mail, Lock, User as UserIcon, Loader2, ArrowLeft, Shield } from 'lucide-react';

type FormValues = { name: string; email: string; password: string };

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

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      setAuth(res.data.user, res.data.token);
      toast.success('Account created! A verification code has been sent.');
      router.push('/auth/verify-email');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValue = watch('password') || '';
  const pwStrength = getPasswordStrength(passwordValue);

  return (
    <Card className="p-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="size-4" /> Back to home
      </Link>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Join CrowdRaise</h1>
        <p className="text-sm text-muted-foreground">Create an account to start raising funds</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="reg-name" className="text-sm font-medium text-foreground">Full Name</label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input id="reg-name" {...register('name', { required: true })} autoComplete="name" placeholder="John Doe" className="pl-10" autoFocus />
          </div>
          {errors.name && <p className="text-xs text-red-500 ml-1">Name is required</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="reg-email" className="text-sm font-medium text-foreground">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input id="reg-email" {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })} type="email" autoComplete="email" placeholder="name@example.com" className="pl-10" />
          </div>
          {errors.email && <p className="text-xs text-red-500 ml-1">Valid email is required</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="reg-password" className="text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input id="reg-password" {...register('password', { required: true, minLength: 8 })} type="password" autoComplete="new-password" placeholder="At least 8 characters" className="pl-10" />
          </div>
          {errors.password && <p className="text-xs text-red-500 ml-1">Password must be at least 8 characters</p>}
          {passwordValue && (
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

        <Button type="submit" disabled={isLoading} className="w-full h-12">
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : 'Create Account'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-muted-foreground text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </Card>
  );
}
