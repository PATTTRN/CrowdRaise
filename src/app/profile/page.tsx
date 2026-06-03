'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Loader2, User, Mail, Shield, ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const router = useRouter();
  useEffect(() => { document.title = 'Profile - CrowdRaise'; }, []);
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="p-10 max-w-md text-center shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <User className="size-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Profile</h2>
          <p className="text-muted-foreground mb-8">Please log in to view your profile.</p>
          <Button size="lg" className="w-full" onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal'))}>
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  const handleSave = async () => {
    if (!name.trim()) { toast.error('Name is required'); return; }
    setIsSaving(true);
    try {
      await api.patch(`/auth/user/${user._id}`, { name });
      updateUser({ name });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <ParticleBackground />
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="size-4" /> Back
          </button>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-8">Profile</h1>

          <div className="grid gap-6">
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <User className="size-5 text-primary" />
                Personal Information
              </h2>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted text-muted-foreground">
                    <Mail className="size-4" />
                    <span>{user.email}</span>
                    {user.emailVerified ? (
                      <span className="ml-auto text-xs text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded-full">Verified</span>
                    ) : (
                      <span className="ml-auto text-xs text-amber-600 font-medium bg-amber-100 px-2 py-0.5 rounded-full">Unverified</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted text-muted-foreground">
                    <Shield className="size-4" />
                    <span className="capitalize">{user.role}</span>
                  </div>
                </div>
                <Button onClick={handleSave} disabled={isSaving || name === user.name}>
                  {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
                  Save Changes
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
