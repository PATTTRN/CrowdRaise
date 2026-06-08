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
import { Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';

type FormValues = { email: string; password: string };

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const res = await authService.login(data);
      setAuth(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
      router.push(params.get('redirect') || '/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="size-4" /> Back to home
      </Link>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">Sign in to manage your collections</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="text-sm font-medium text-foreground">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input id="login-email" {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })} type="email" autoComplete="email" placeholder="name@example.com" className="pl-10" autoFocus />
          </div>
          {errors.email && <p className="text-xs text-red-500 ml-1">Valid email is required</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="login-password" className="text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input id="login-password" {...register('password', { required: true })} type="password" autoComplete="current-password" placeholder="Enter password" className="pl-10" />
          </div>
          {errors.password && <p className="text-xs text-red-500 ml-1">Password is required</p>}
        </div>

        <div className="text-right">
          <Link href="/auth/forgot-password" className="text-xs text-muted-foreground hover:text-primary transition-colors">Forgot password?</Link>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full h-12">
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-muted-foreground text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-primary font-medium hover:underline">Sign Up</Link>
        </p>
      </div>
    </Card>
  );
}
