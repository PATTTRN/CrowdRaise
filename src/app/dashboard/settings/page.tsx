'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { withdrawalService, notificationService } from '@/services';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, User, Mail, Shield, Banknote, CheckCircle2, Bell } from 'lucide-react';
import api from '@/lib/axios';
import type { Bank } from '@/lib/api-types';

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  // Bank details
  const [banks, setBanks] = useState<Bank[]>([]);
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBankCode, setSelectedBankCode] = useState('');
  const [selectedBankName, setSelectedBankName] = useState('');
  const [resolvedAccountName, setResolvedAccountName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSavingBank, setIsSavingBank] = useState(false);

  // Notification prefs
  const [notifPrefs, setNotifPrefs] = useState({ emailOnContribution: true, emailOnWithdrawal: true, emailOnCampaignUpdate: true });
  const [savingNotifPrefs, setSavingNotifPrefs] = useState(false);

  useEffect(() => {
    withdrawalService.getBanks().then((res) => {
      const list = (res.data as { name: string; code: string }[]).map((b) => ({ name: b.name, code: b.code }));
      setBanks(list);
    }).catch(() => {});
  }, []);

  const handleSaveProfile = async () => {
    if (!name.trim()) { toast.error('Name is required'); return; }
    setIsSaving(true);
    try {
      await api.patch(`/auth/user/${user?._id}`, { name });
      updateUser({ name });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerifyAccount = async () => {
    if (!accountNumber || accountNumber.length < 10 || !selectedBankCode) {
      toast.error('Enter a valid account number and select a bank');
      return;
    }
    setIsVerifying(true);
    try {
      const res = await withdrawalService.verifyAccount(accountNumber, selectedBankCode);
      setResolvedAccountName(res.data.accountName);
      toast.success('Account verified!');
    } catch {
      toast.error('Could not verify account');
      setResolvedAccountName('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSaveBank = async () => {
    if (!resolvedAccountName) { toast.error('Verify your account first'); return; }
    setIsSavingBank(true);
    try {
      await withdrawalService.saveBankDetails({
        accountNumber,
        bankCode: selectedBankCode,
        accountName: resolvedAccountName,
        bankName: selectedBankName,
      });
      toast.success('Bank details saved!');
    } catch {
      toast.error('Failed to save bank details');
    } finally {
      setIsSavingBank(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your profile and payment details.</p>
      </div>

      {/* Profile */}
      <Card className="p-6 sm:p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <User className="size-5 text-primary" /> Personal Information
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
              <span>{user?.email}</span>
              {user?.emailVerified ? (
                <span className="ml-auto text-xs text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> Verified
                </span>
              ) : (
                <span className="ml-auto text-xs text-amber-600 font-medium bg-amber-100 px-2 py-0.5 rounded-full">Unverified</span>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted text-muted-foreground">
              <Shield className="size-4" />
              <span className="capitalize">{user?.role}</span>
            </div>
          </div>
          <Button onClick={handleSaveProfile} disabled={isSaving || name === user?.name}>
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6 sm:p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Bell className="size-5 text-primary" /> Notification Preferences
        </h2>
        <div className="space-y-4">
          {[
            { key: 'emailOnContribution', label: 'Email me when I receive a contribution' },
            { key: 'emailOnWithdrawal', label: 'Email me about withdrawal status changes' },
            { key: 'emailOnCampaignUpdate', label: 'Email me about campaign updates' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-muted">
              <span className="text-sm">{label}</span>
              <button
                onClick={() => setNotifPrefs((p) => ({ ...p, [key]: !(p as any)[key] }))}
                className={`w-11 h-6 rounded-full transition-colors ${(notifPrefs as any)[key] ? 'bg-primary' : 'bg-muted-foreground/30'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${(notifPrefs as any)[key] ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
          <Button
            onClick={async () => {
              setSavingNotifPrefs(true);
              try {
                await notificationService.updatePrefs(notifPrefs);
                toast.success('Preferences updated');
              } catch { toast.error('Failed to update'); }
              finally { setSavingNotifPrefs(false); }
            }}
            disabled={savingNotifPrefs}
          >
            {savingNotifPrefs ? <Loader2 className="size-4 animate-spin" /> : null}
            Save Preferences
          </Button>
        </div>
      </Card>

      {/* Bank Details */}
      <Card className="p-6 sm:p-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <Banknote className="size-5 text-primary" /> Bank Details
        </h2>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Bank</Label>
            <select
              value={selectedBankCode}
              onChange={(e) => {
                const bank = banks.find((b) => b.code === e.target.value);
                setSelectedBankCode(e.target.value);
                setSelectedBankName(bank?.name || '');
                setResolvedAccountName('');
              }}
              className="w-full h-10 rounded-xl border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a bank</option>
              {banks.map((b, i) => (
                <option key={`${b.code}-${i}`} value={b.code}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Account Number</Label>
            <Input
              value={accountNumber}
              onChange={(e) => { setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10)); setResolvedAccountName(''); }}
              placeholder="0123456789"
              maxLength={10}
            />
          </div>
          <Button onClick={handleVerifyAccount} disabled={isVerifying || accountNumber.length < 10 || !selectedBankCode}>
            {isVerifying ? <Loader2 className="size-4 animate-spin" /> : null}
            Verify Account
          </Button>
          {resolvedAccountName && (
            <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-800 flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-600" />
              {resolvedAccountName}
            </div>
          )}
          {resolvedAccountName && (
            <Button onClick={handleSaveBank} disabled={isSavingBank}>
              {isSavingBank ? <Loader2 className="size-4 animate-spin" /> : null}
              Save Bank Details
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
