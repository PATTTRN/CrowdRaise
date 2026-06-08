'use client';

import { useState, useEffect } from 'react';
import { walletService } from '@/services';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { WalletData, WalletTransaction } from '@/lib/api-types';
import {
  PiggyBank, Plus, ArrowUpRight, ArrowDownLeft, Copy,
  ExternalLink, Loader2, Clock, CheckCircle, XCircle
} from 'lucide-react';

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fundAmount, setFundAmount] = useState('');
  const [isFunding, setIsFunding] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [walletRes, txRes] = await Promise.all([
          walletService.getWallet(),
          walletService.getTransactions({ limit: 20 }),
        ]);
        setWallet(walletRes.data);
        setTransactions(txRes.transactions);
      } catch {
        toast.error('Failed to load wallet');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  const handleFund = async () => {
    const amount = parseInt(fundAmount, 10);
    if (!amount || amount < 100) {
      toast.error('Minimum funding is ₦100');
      return;
    }
    setIsFunding(true);
    try {
      const res = await walletService.fundWallet(amount);
      if (res.authorization_url) {
        window.open(res.authorization_url, '_blank');
        toast.success('Redirecting to payment...');
      }
      setFundAmount('');
    } catch {
      toast.error('Funding failed');
    } finally {
      setIsFunding(false);
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="size-4 text-green-600" />;
      case 'pending': return <Clock className="size-4 text-amber-500" />;
      case 'failed': return <XCircle className="size-4 text-red-500" />;
      default: return <Clock className="size-4 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground mt-1">Deposit funds and make instant contributions.</p>
      </div>

      {/* Balance card */}
      <Card className="p-6 bg-gradient-to-br from-emerald-500/10 via-emerald-500/[0.02] to-background ring-emerald-500/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
              <PiggyBank className="size-4 text-emerald-600" /> Wallet Balance
            </p>
            <p className="text-4xl sm:text-5xl font-bold tracking-tight">
              ₦{wallet?.balance.toLocaleString() || '0'}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {wallet?.currency || 'NGN'} &middot; Instant payments
            </p>
          </div>
        </div>
      </Card>

      {/* Fund wallet */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Plus className="size-5 text-emerald-600" /> Fund Wallet
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            placeholder="Enter amount (₦)"
            value={fundAmount}
            onChange={(e) => setFundAmount(e.target.value)}
            className="flex-1 h-12 px-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            min="100"
          />
          <div className="flex gap-2">
            {[1000, 5000, 10000].map((amt) => (
              <button
                key={amt}
                onClick={() => setFundAmount(String(amt))}
                className="px-4 h-12 rounded-xl border border-input bg-muted text-sm font-medium hover:bg-accent transition-colors cursor-pointer"
              >
                ₦{amt.toLocaleString()}
              </button>
            ))}
            <Button
              onClick={handleFund}
              disabled={isFunding || !fundAmount}
              className="h-12"
            >
              {isFunding ? <Loader2 className="size-4 animate-spin" /> : <ExternalLink className="size-4" />}
              Pay
            </Button>
          </div>
        </div>
      </Card>

      {/* Transaction history */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Transaction History</h3>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No transactions yet. Fund your wallet to get started.</p>
        ) : (
          <div className="space-y-2">
            {transactions.slice(0, 20).map((tx) => (
              <div key={tx._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {tx.type === 'credit' ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                      {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                      {statusIcon(tx.status)}
                      <span className="capitalize">{tx.status}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
