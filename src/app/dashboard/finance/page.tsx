'use client';

import { useState, useEffect } from 'react';
import { dashboardService } from '@/services';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { WithdrawTab } from '@/app/dashboard/WithdrawTab';
import type { DashboardBalance, Transaction } from '@/lib/api-types';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';

export default function FinancePage() {
  const [balance, setBalance] = useState<DashboardBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'withdraw'>('overview');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [summaryRes, txRes] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getTransactions({ limit: 50 }),
        ]);
        setBalance(summaryRes.data.balance);
        setTransactions(txRes.data);
      } catch {
        toast.error('Failed to load finance data');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
        <p className="text-muted-foreground mt-1">Track your earnings, fees, and withdrawals.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['overview', 'withdraw'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
              tab === t ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            {t === 'overview' ? 'Overview' : 'Withdraw Funds'}
          </button>
        ))}
      </div>

      {tab === 'overview' && balance && (
        <>
          {/* Balance summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Earned', value: `₦${balance.totalEarned.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600' },
              { label: 'Total Fees', value: `-₦${balance.totalFees.toLocaleString()}`, icon: ArrowDownLeft, color: 'text-red-500' },
              { label: 'Withdrawn', value: `₦${balance.totalWithdrawn.toLocaleString()}`, icon: ArrowUpRight, color: 'text-blue-600' },
              { label: 'Available', value: `₦${balance.available.toLocaleString()}`, icon: Wallet, color: 'text-primary' },
            ].map((stat) => (
              <Card key={stat.label} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className={`size-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </Card>
            ))}
          </div>

          {/* Pending withdrawals */}
          {balance.pendingWithdrawals > 0 && (
            <Card className="p-4 bg-amber-50 border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>₦{balance.pendingWithdrawals.toLocaleString()}</strong> in pending withdrawals.
              </p>
            </Card>
          )}

          {/* Transaction history */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Transaction History</h3>
            {transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No transactions yet.</p>
            ) : (
              <div className="space-y-2">
                {transactions.slice(0, 20).map((tx) => (
                  <div key={tx._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        tx.type === 'contribution' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {tx.type === 'contribution' ? <TrendingUp className="size-4" /> : <ArrowUpRight className="size-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${tx.netAmount >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {tx.netAmount >= 0 ? '+' : ''}{tx.netAmount.toLocaleString()} NGN
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{tx.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      {tab === 'withdraw' && <WithdrawTab />}
    </div>
  );
}
