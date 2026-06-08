'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { dashboardService, collectionService, contributionService } from '@/services';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { StatCard } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { statusStyle, statusLabel } from '@/lib/status';
import type { Collection, Contribution, DashboardSummary } from '@/lib/api-types';
import {
  Megaphone, Heart, DollarSign, Users, BarChart3, Percent,
  Play, Plus, Wallet, ArrowUpRight, TrendingUp
} from 'lucide-react';

export default function DashboardOverview() {
  const { user } = useAuthStore();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await dashboardService.getSummary();
        setSummary(res.data);
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </div>
    );
  }

  const stats = summary?.stats;
  const balance = summary?.balance;
  const recentCollections = summary?.recentCollections || [];
  const recentContributions = summary?.recentContributions || [];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
        </div>
        <div className="flex items-center gap-3">
          {user?.role === 'admin' && (
            <Link href="/admin_dashboard">
              <Button variant="outline" size="sm">Admin Panel</Button>
            </Link>
          )}
          <Link href="/create_collection">
            <Button size="sm"><Plus className="size-4" /> Create Campaign</Button>
          </Link>
        </div>
      </div>

      {/* Balance card */}
      {balance && (
        <Card className="p-6 bg-gradient-to-br from-primary/5 via-primary/[0.02] to-background ring-primary/10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                <Wallet className="size-4 text-primary" /> Available Balance
              </p>
              <p className="text-3xl sm:text-4xl font-bold tracking-tight">
                ₦{balance.available.toLocaleString()}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm text-muted-foreground">
                <span>Gross: ₦{balance.totalGross.toLocaleString()}</span>
                <span>Fees: -₦{balance.totalFees.toLocaleString()}</span>
                <span>Withdrawn: -₦{balance.totalWithdrawn.toLocaleString()}</span>
                <span>Pending: ₦{balance.pendingWithdrawals.toLocaleString()}</span>
              </div>
            </div>
            <Link href="/dashboard/finance">
              <Button variant="outline" size="sm" className="shrink-0">
                View Finance <ArrowUpRight className="size-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Stat cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <StatCard icon={<Megaphone className="size-5" />} label="Total Campaigns" value={String(stats.totalCollections)} />
          <StatCard icon={<Play className="size-5" />} label="Active Campaigns" value={String(stats.activeCollections)} />
          <StatCard icon={<DollarSign className="size-5" />} label="Total Raised" value={`₦${stats.totalRaised.toLocaleString()}`} />
          <StatCard icon={<Users className="size-5" />} label="Supporters" value={String(stats.totalSupporters)} />
          <StatCard icon={<BarChart3 className="size-5" />} label="Avg. Contribution" value={`₦${stats.averageDonation.toLocaleString()}`} />
          <StatCard icon={<Percent className="size-5" />} label="Completion Rate" value={`${stats.completionRate}%`} />
        </div>
      )}

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
            <Megaphone className="size-5 text-primary" /> Recent Campaigns
          </h3>
          <div className="space-y-3">
            {recentCollections.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No campaigns yet.</p>
            )}
            {recentCollections.slice(0, 3).map((col: Collection) => {
              const imgUrl = (col as any).primaryImage?.url || (col as any).images?.[0]?.url ||
                'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80';
              return (
                <Link key={col._id} href={`/collection_detail/${col._id}`}
                  className="flex items-center gap-3 p-3 bg-muted rounded-xl hover:bg-accent transition-colors">
                  <img src={imgUrl} alt={col.title} className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{col.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle(col.status)}`}>{statusLabel(col.status)}</span>
                      <span className="text-xs text-muted-foreground">₦{(col as any).raised?.toLocaleString() || 0} raised</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <Link href="/dashboard/campaigns">
              <Button variant="outline" size="sm">View All Campaigns</Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
            <Heart className="size-5 text-primary" /> Recent Contributions
          </h3>
          <div className="space-y-3">
            {recentContributions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No contributions yet.</p>
            )}
            {recentContributions.slice(0, 4).map((d, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-xl hover:bg-accent transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                  {(d.supporterName || 'A').charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{d.supporterName || 'Anonymous'}</div>
                  <div className="text-muted-foreground text-xs truncate">{d.collectionTitle}</div>
                </div>
                <div className="text-right">
                  <div className="text-primary font-semibold text-sm">₦{d.amount.toLocaleString()}</div>
                  <div className="text-muted-foreground text-xs">{new Date(d.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/dashboard/donations">
              <Button variant="outline" size="sm">View All Donations</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
