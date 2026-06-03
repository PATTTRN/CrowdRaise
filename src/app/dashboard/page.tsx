'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collectionService, contributionService } from '@/services';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { ParticleBackground } from '@/components/ParticleBackground';
import { StatCard, CollectionCard } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmModal } from '@/components/ConfirmModal';
import { statusStyle, statusLabel } from '@/lib/status';
import type { Collection, Contribution, DashboardStats } from '@/lib/api-types';
import { LayoutDashboard, Megaphone, Heart, Wallet, Plus, Shield, Play, DollarSign, Users, BarChart3, Percent, LogIn } from 'lucide-react';
import { WithdrawTab } from './WithdrawTab';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'collections', label: 'Collections', icon: Megaphone },
  { id: 'donations', label: 'Contributions', icon: Heart },
  { id: 'withdraw', label: 'Withdraw', icon: Wallet },
] as const;

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  useEffect(() => { document.title = 'Dashboard - CrowdRaise'; }, []);

  const [collections, setCollections] = useState<Collection[]>([]);
  const [recentDonations, setRecentDonations] = useState<Contribution[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCollections: 0, activeCollections: 0, totalRaised: 0,
    totalSupporters: 0, averageDonation: 0, completionRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'collections' | 'donations' | 'withdraw'>('overview');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      const myCollections = await collectionService.getAllCollections({ creator: user._id });
      setCollections(myCollections.data);
      const allDonations: Contribution[] = [];
      let totalRaised = 0, totalSupporters = 0, activeCount = 0;
      for (const col of myCollections.data) {
        totalRaised += col.raised;
        totalSupporters += col.supporters;
        if (col.status === 'active') activeCount++;
        try {
          const res = await contributionService.getCollectionContributions(col._id);
          allDonations.push(...res.data);
        } catch { /* skip individual collection failures */ }
      }
      allDonations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRecentDonations(allDonations);
      setStats({
        totalCollections: myCollections.data.length,
        activeCollections: activeCount, totalRaised, totalSupporters,
        averageDonation: totalSupporters > 0 ? Math.round(totalRaised / totalSupporters) : 0,
        completionRate: myCollections.data.length > 0
          ? Math.round(myCollections.data.filter((c) => c.status === 'completed').length / myCollections.data.length * 100) : 0,
      });
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCollection = async (id: string) => {
    try {
      setIsProcessing(id);
      await collectionService.deleteCollection(id);
      toast.success('Collection deleted');
      fetchDashboardData();
    } catch {
      toast.error('Failed to delete collection');
    } finally {
      setIsProcessing(null);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchDashboardData();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="p-10 max-w-md text-center shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <LayoutDashboard className="size-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Your Dashboard</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">Please log in to view your collections, track contributions, and manage your account.</p>
          <Button size="lg" className="w-full" onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal'))}>
            <LogIn className="size-4" /> Access Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <>
        <ParticleBackground />
        <div className="pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Skeleton className="h-12 w-48 mb-4" />
            <Skeleton className="h-6 w-96 mb-8" />
            <div className="flex gap-2 mb-8">
              {[1, 2, 3, 4].map((i) => (<Skeleton key={i} className="h-10 w-28 rounded-full" />))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-xl border border-border p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ParticleBackground />
      <div className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-2">Dashboard</h1>
                <p className="text-muted-foreground text-base sm:text-lg">Welcome back! Here&apos;s an overview of your collections and supporter activity.</p>
              </div>
              {user?.role === 'admin' && (
                <Link href="/admin_dashboard"><Button variant="outline"><Shield className="size-4 text-cyan-500" /> Admin Panel</Button></Link>
              )}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${selectedTab === tab.id ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}>
                    <Icon className="size-4" /> {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedTab === 'overview' && (
            <div className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                  { label: 'Total Collections', value: stats.totalCollections, icon: Megaphone },
                  { label: 'Active Collections', value: stats.activeCollections, icon: Play },
                  { label: 'Total Raised', value: `₦${stats.totalRaised.toLocaleString()}`, icon: DollarSign },
                  { label: 'Total Supporters', value: stats.totalSupporters, icon: Users },
                  { label: 'Avg. Contribution', value: `₦${stats.averageDonation.toLocaleString()}`, icon: BarChart3 },
                  { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: Percent },
                ].map((stat, i) => (
                  <StatCard key={i} icon={<stat.icon className="size-5" />} label={stat.label} value={stat.value} />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3"><Megaphone className="size-5 text-primary" /> Recent Collections</h3>
                  <div className="space-y-3">
                    {collections.slice(0, 3).map((col) => {
                      const imgUrl = col.primaryImage?.url || col.images?.[0]?.url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80';
                      return (
                        <div key={col._id} className="flex items-center gap-3 p-3 bg-muted rounded-xl hover:bg-accent transition-colors">
                          <img src={imgUrl} alt={col.title} className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-foreground font-medium text-sm sm:text-base truncate">{col.title}</h4>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle(col.status)}`}>{statusLabel(col.status)}</span>
                              <span>₦{col.raised.toLocaleString()} raised</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 text-center">
                    <Link href="/create_collection"><Button><Plus className="size-4" /> Create New Collection</Button></Link>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3"><Heart className="size-5 text-primary" /> Recent Contributions</h3>
                  <div className="space-y-3">
                    {recentDonations.slice(0, 4).map((d) => (
                      <div key={d._id} className="flex items-center gap-3 p-3 bg-muted rounded-xl hover:bg-accent transition-colors">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                          {(d.supporterName || 'A').charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-foreground font-medium text-sm">{d.supporterName || 'Anonymous'}</div>
                          <div className="text-muted-foreground text-xs truncate">{d.collectionTitle}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-primary font-semibold text-sm">₦{d.amount.toLocaleString()}</div>
                          <div className="text-muted-foreground text-xs">{new Date(d.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {selectedTab === 'collections' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Your Collections</h2>
                <Link href="/create_collection"><Button><Plus className="size-4" /> <span className="hidden sm:inline">Create Collection</span></Button></Link>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {collections.map((col) => (
                  <CollectionCard key={col._id} _id={col._id} type={col.type} title={col.title} goal={col.goal}
                    raised={col.raised} supporters={col.supporters} daysLeft={col.daysLeft}
                    primaryImage={col.primaryImage} images={col.images} status={col.status}
                    showActions onDelete={(id) => setDeleteConfirm(id)} isProcessing={isProcessing} />
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'donations' && (
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Recent Contributions</h2>
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        {['Supporter', 'Collection', 'Amount', 'Date', 'Message'].map((h) => (
                          <th key={h} className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recentDonations.map((d) => (
                        <tr key={d._id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">{(d.supporterName || 'A').charAt(0)}</div>
                              <span className="text-sm font-medium text-foreground">{d.supporterName || 'Anonymous'}</span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">{d.collectionTitle}</td>
                          <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-primary">₦{d.amount.toLocaleString()}</td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-muted-foreground">{new Date(d.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 sm:px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">{d.message || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {selectedTab === 'withdraw' && <WithdrawTab />}
        </div>
      </div>
      <ConfirmModal
        open={deleteConfirm !== null}
        title="Delete Collection"
        message="Are you sure you want to delete this collection? This action is permanent."
        confirmLabel="Delete"
        onConfirm={() => { if (deleteConfirm) handleDeleteCollection(deleteConfirm); setDeleteConfirm(null); }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </>
  );
}
