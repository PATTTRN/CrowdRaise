'use client';

import { useState, useEffect } from 'react';
import { withdrawalService } from '@/services';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { statusStyle } from '@/lib/status';
import {
  TrendingUp, Banknote, PiggyBank, CheckCircle2, Coins,
  History, RefreshCw, ExternalLink, ArrowUpRight, Loader2
} from 'lucide-react';
import type { Bank, Balance, Withdrawal } from '@/lib/api-types';

export function WithdrawTab() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBankCode, setSelectedBankCode] = useState('');
  const [selectedBankName, setSelectedBankName] = useState('');
  const [resolvedAccountName, setResolvedAccountName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSavingBank, setIsSavingBank] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [balance, setBalance] = useState<Balance>({
    totalGross: 0, totalFees: 0, totalEarned: 0,
    totalPaid: 0, pendingAmount: 0, available: 0,
  });
  const [withdrawHistory, setWithdrawHistory] = useState<Withdrawal[]>([]);

  const loadWithdrawData = async () => {
    try {
      const [balanceData, historyData, banksData] = await Promise.all([
        withdrawalService.getBalance(),
        withdrawalService.getMyWithdrawals(),
        withdrawalService.getBanks(),
      ]);
      setBalance(balanceData.data as Balance);
      setWithdrawHistory(historyData.data ?? []);
      setBanks((banksData.data as { name: string; code: string }[]).map((b) => ({ name: b.name, code: b.code })));
    } catch {
      toast.error('Failed to load withdrawal data');
    }
  };

  useEffect(() => {
    loadWithdrawData();
  }, []);

  const handleVerifyAccount = async () => {
    if (!accountNumber || !selectedBankCode) {
      toast.error('Enter account number and select a bank');
      return;
    }
    setIsVerifying(true);
    try {
      const result = await withdrawalService.verifyAccount(accountNumber, selectedBankCode);
      setResolvedAccountName(result.data.accountName);
      toast.success(`Verified: ${result.data.accountName}`);
    } catch {
      toast.error('Could not verify account. Check the number and bank.');
      setResolvedAccountName('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSaveBankDetails = async () => {
    if (!resolvedAccountName) { toast.error('Verify your account first'); return; }
    setIsSavingBank(true);
    try {
      await withdrawalService.saveBankDetails({
        accountNumber, bankCode: selectedBankCode,
        accountName: resolvedAccountName, bankName: selectedBankName,
      });
      toast.success('Bank details saved!');
    } catch { toast.error('Failed to save bank details'); }
    finally { setIsSavingBank(false); }
  };

  const handleRequestWithdrawal = async () => {
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt < 1000) { toast.error('Minimum withdrawal is ₦1,000'); return; }
    if (amt > balance.available) { toast.error(`Only ₦${balance.available.toLocaleString()} available`); return; }
    setIsRequesting(true);
    try {
      await withdrawalService.requestWithdrawal(amt);
      toast.success('Withdrawal request submitted! Processing in 1–3 business days.');
      setWithdrawAmount('');
      loadWithdrawData();
    } catch { toast.error('Request failed'); }
    finally { setIsRequesting(false); }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Withdraw Funds</h2>
        <div className="px-4 py-2 bg-muted rounded-xl text-muted-foreground text-sm flex items-center gap-2">
          <History className="size-4 text-primary" />
          Withdrawals processed within 1-3 business days
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {[
          { label: 'Gross Revenue', value: balance.totalGross, icon: TrendingUp, accent: 'text-blue-500', bg: 'bg-blue-100' },
          { label: 'Platform Fees', value: balance.totalFees, icon: Banknote, accent: 'text-red-500', bg: 'bg-red-100' },
          { label: 'Net Earnings', value: balance.totalEarned, icon: PiggyBank, accent: 'text-indigo-500', bg: 'bg-indigo-100' },
          { label: 'Total Paid', value: balance.totalPaid, icon: CheckCircle2, accent: 'text-green-500', bg: 'bg-green-100' },
          { label: 'Available Now', value: balance.available, icon: Coins, accent: 'text-pink-500', bg: 'bg-pink-100', highlight: true },
        ].map((item, i) => (
          <Card
            key={i}
            className={`p-6 ${item.highlight ? 'border-primary/30 shadow-[0_0_20px_rgba(244,63,94,0.08)]' : ''}`}
          >
            <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
              <item.icon className={`size-5 ${item.accent}`} />
            </div>
            <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-1">{item.label}</div>
            <div className={`text-2xl font-bold ${item.accent}`}>₦{item.value.toLocaleString()}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <ExternalLink className="size-5 text-primary" />
              Payout Bank Account
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-muted-foreground text-xs font-medium mb-1.5 block">Select Bank</label>
                <select
                  value={selectedBankCode}
                  onChange={(e) => {
                    setSelectedBankCode(e.target.value);
                    const bank = banks.find((b) => b.code === e.target.value);
                    if (bank) setSelectedBankName(bank.name);
                    setResolvedAccountName('');
                  }}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select a bank</option>
                  {banks.map((bank) => (
                    <option key={bank.code} value={bank.code}>{bank.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-muted-foreground text-xs font-medium mb-1.5 block">Account Number</label>
                <div className="flex gap-2">
                  <Input
                    type="text" maxLength={10} value={accountNumber}
                    onChange={(e) => { setAccountNumber(e.target.value.replace(/\D/g, '')); setResolvedAccountName(''); }}
                    placeholder="0123456789"
                  />
                  <Button
                    variant="outline" size="sm"
                    onClick={handleVerifyAccount}
                    disabled={isVerifying || accountNumber.length !== 10 || !selectedBankCode}
                  >
                    {isVerifying ? <Loader2 className="size-4 animate-spin" /> : 'Verify'}
                  </Button>
                </div>
              </div>
              {resolvedAccountName && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                  <div className="text-green-600 text-xs font-bold uppercase tracking-widest mb-1">Account Name Found</div>
                  <div className="text-foreground text-sm font-bold">{resolvedAccountName}</div>
                </div>
              )}
              <Button
                className="w-full"
                onClick={handleSaveBankDetails}
                disabled={isSavingBank || !resolvedAccountName}
              >
                {isSavingBank ? <Loader2 className="size-4 animate-spin" /> : null}
                Save Bank Details
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <ArrowUpRight className="size-5 text-primary" />
              Request Payout
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-muted-foreground text-xs font-medium mb-1.5 block">Amount to Withdraw (₦)</label>
                <Input
                  type="number" value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="e.g. 5000"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-muted-foreground font-medium">Available: ₦{balance.available.toLocaleString()}</span>
                  <button onClick={() => setWithdrawAmount(balance.available.toString())} className="text-xs text-primary font-bold hover:underline">
                    Withdraw All
                  </button>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={handleRequestWithdrawal}
                disabled={isRequesting || !withdrawAmount || parseFloat(withdrawAmount) < 1000}
              >
                {isRequesting ? <Loader2 className="size-4 animate-spin" /> : null}
                Submit Request
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <History className="size-5 text-primary" />
                Withdrawal History
              </h3>
              <Button variant="ghost" size="sm" onClick={loadWithdrawData}>
                <RefreshCw className="size-4" />
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    {['Date', 'Amount', 'Bank Details', 'Status'].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {withdrawHistory.length > 0 ? (
                    withdrawHistory.map((item) => (
                      <tr key={item._id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-foreground text-sm font-medium">{new Date(item.createdAt).toLocaleDateString()}</div>
                          <div className="text-muted-foreground text-xs">{new Date(item.createdAt).toLocaleTimeString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-foreground font-bold">₦{item.amount.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-foreground text-sm font-medium">{item.bankDetails.bankName}</div>
                          <div className="text-muted-foreground text-xs">{item.bankDetails.accountNumber} • {item.bankDetails.accountName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={statusStyle(item.status)}>
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="text-4xl mb-4 opacity-20">💸</div>
                        <div className="text-muted-foreground text-sm">No withdrawal history yet.</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
