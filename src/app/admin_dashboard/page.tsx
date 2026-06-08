'use client';

import { useState, useEffect } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { collectionService, contributionService, withdrawalService } from '@/services';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { StatCard } from '@/components/shared';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmModal } from '@/components/ConfirmModal';
import { statusStyle, statusLabel } from '@/lib/status';
import type { Collection, Contribution, Withdrawal, PlatformStats, User } from '@/lib/api-types';
import { LayoutDashboard, Clock, CheckCircle, XCircle, Users, Wallet, TrendingUp, DollarSign, Landmark, History, Search, Trash2, Check, X, Loader2, Inbox, Shield } from 'lucide-react';

type TabType = 'overview' | 'pending' | 'approved' | 'rejected' | 'withdrawals' | 'users';

function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  useEffect(() => { document.title = 'Admin Dashboard - CrowdRaise'; }, []);

  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [allDonations, setAllDonations] = useState<Contribution[]>([]);
  const [stats, setStats] = useState<PlatformStats>({
    totalCollections: 0, pendingCollections: 0, approvedCollections: 0,
    rejectedCollections: 0, totalRaised: 0, platformRevenue: 0, totalContributions: 0,
  });
  const [selectedTab, setSelectedTab] = useState<TabType>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [deleteCollectionConfirm, setDeleteCollectionConfirm] = useState<string | null>(null);
  const [deleteUserConfirm, setDeleteUserConfirm] = useState<string | null>(null);

  const fetchData = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      const [colsRes, revRes, withRes] = await Promise.all([
        collectionService.getAllCollections(),
        contributionService.getRevenueSummary(),
        withdrawalService.adminGetAll(),
      ]);
      setCollections(colsRes.data);
      setFilteredCollections(colsRes.data);
      setWithdrawals(withRes.data);
      setStats({
        totalCollections: colsRes.data.length,
        pendingCollections: colsRes.data.filter((c) => c.status === 'pending').length,
        approvedCollections: colsRes.data.filter((c) => c.status === 'active').length,
        rejectedCollections: colsRes.data.filter((c) => c.status === 'rejected').length,
        totalRaised: revRes.summary.totalGrossDonated,
        platformRevenue: revRes.summary.totalPlatformRevenue,
        totalContributions: revRes.summary.totalContributions,
      });
      try {
        const [usersRes, donationsRes] = await Promise.all([
          api.get<{ data: User[] }>('/auth/users'),
          api.get<Contribution[]>('/contributions/admin/all'),
        ]);
        setUsers(usersRes.data.data);
        setAllDonations(donationsRes.data);
      } catch { /* non-critical */ }
    } catch { toast.error('Failed to load dashboard data'); }
    finally { if (!silent) setIsLoading(false); }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      toast.error('Unauthorized access');
      router.push('/');
      return;
    }
    if (isAuthenticated) fetchData();
  }, [isAuthenticated, user]);

  useEffect(() => {
    let filtered = collections;
    if (searchTerm) {
      filtered = filtered.filter((col) =>
        col.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        col.creator?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        col.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedStatus && selectedStatus !== 'all') {
      filtered = filtered.filter((col) => col.status === (selectedStatus === 'approved' ? 'active' : selectedStatus));
    }
    setFilteredCollections(filtered);
  }, [collections, searchTerm, selectedStatus]);

  const handleApprove = async (id: string) => {
    try { setIsProcessing(id); await collectionService.updateCollection(id, { status: 'active' }); toast.success('Collection approved!'); fetchData(true); }
    catch { toast.error('Failed to approve collection'); } finally { setIsProcessing(null); }
  };

  const handleReject = async (id: string) => {
    try { setIsProcessing(id); await collectionService.updateCollection(id, { status: 'rejected', rejectionReason: 'Insufficient documentation' }); toast.success('Collection rejected'); fetchData(true); }
    catch { toast.error('Failed to reject collection'); } finally { setIsProcessing(null); }
  };

  const handleDeleteCollection = async (id: string) => {
    try { setIsProcessing(id); await collectionService.deleteCollection(id); toast.success('Collection deleted'); fetchData(true); }
    catch { toast.error('Failed to delete collection'); } finally { setIsProcessing(null); }
  };

  const handleApproveWithdrawal = async (id: string) => {
    try { setIsProcessing(id); await withdrawalService.adminApprove(id); toast.success('Withdrawal approved!'); fetchData(true); }
    catch { toast.error('Failed to approve withdrawal'); } finally { setIsProcessing(null); }
  };

  const handleRejectWithdrawal = async (id: string) => {
    const reason = window.prompt('Enter rejection reason:');
    if (reason === null) return;
    try { setIsProcessing(id); await withdrawalService.adminReject(id, reason); toast.success('Withdrawal rejected'); fetchData(true); }
    catch { toast.error('Failed to reject withdrawal'); } finally { setIsProcessing(null); }
  };

  const handleCompleteWithdrawal = async (id: string) => {
    try { setIsProcessing(id); await withdrawalService.adminComplete(id); toast.success('Withdrawal completed'); fetchData(true); }
    catch { toast.error('Failed to complete withdrawal'); } finally { setIsProcessing(null); }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try { setIsProcessing(userId); await api.patch(`/auth/user/${userId}/role`, { role: newRole }); toast.success(`User role updated to ${newRole}`); fetchData(true); }
    catch { toast.error('Failed to update role'); } finally { setIsProcessing(null); }
  };

  const handleDeleteUser = async (userId: string) => {
    try { setIsProcessing(userId); await api.delete(`/auth/user/${userId}`); toast.success('User deleted'); fetchData(true); }
    catch { toast.error('Failed to delete user'); } finally { setIsProcessing(null); }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div><Skeleton className="h-10 w-56 mb-2" /><Skeleton className="h-5 w-40" /></div>
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="p-10 max-w-md text-center shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="size-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Admin Access</h2>
          <p className="text-muted-foreground mb-8">This area is restricted to administrators.</p>
          <Button size="lg" className="w-full" onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal'))}>
            <Shield className="size-4" /> Login to Admin
          </Button>
        </Card>
      </div>
    );
  }

  const TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'pending', label: 'Pending', icon: Clock, count: stats.pendingCollections },
    { id: 'approved', label: 'Approved', icon: CheckCircle, count: stats.approvedCollections },
    { id: 'rejected', label: 'Rejected', icon: XCircle, count: stats.rejectedCollections },
    { id: 'withdrawals', label: 'Withdrawals', icon: Wallet, count: withdrawals.filter(w => w.status === 'pending').length },
    { id: 'users', label: 'Users', icon: Users, count: users.length },
  ];

  return (
    <div className="pb-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground text-base">Manage collections, monitor platform performance, and ensure quality control.</p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setSelectedTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${selectedTab === tab.id ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}>
                <Icon className="size-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (<span className="bg-foreground/10 text-foreground text-xs px-2 py-0.5 rounded-full">{tab.count}</span>)}
              </button>
            );
          })}
        </div>

        {selectedTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: 'Total Collections', value: stats.totalCollections, icon: LayoutDashboard },
                { label: 'Pending Review', value: stats.pendingCollections, icon: Clock },
                { label: 'Total Raised (Gross)', value: `₦${stats.totalRaised.toLocaleString()}`, icon: DollarSign },
                { label: 'Platform Revenue', value: `₦${stats.platformRevenue.toLocaleString()}`, icon: Landmark },
              ].map((stat, i) => (
                <StatCard key={i} icon={<stat.icon className="size-5" />} label={stat.label} value={stat.value} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-3"><TrendingUp className="size-5 text-primary" /> Platform Activity</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Total Contributions', value: stats.totalContributions.toLocaleString() },
                    { label: 'Pending Withdrawals', value: withdrawals.filter(w => w.status === 'pending').length },
                    { label: 'Avg Contribution', value: `₦${(stats.totalRaised / (stats.totalContributions || 1)).toFixed(0).toLocaleString()}`, accent: true },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center p-3 bg-muted rounded-xl">
                      <span className="text-muted-foreground text-sm">{item.label}</span>
                      <span className={`font-semibold ${item.accent ? 'text-primary' : 'text-foreground'}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-3"><History className="size-5 text-primary" /> Recent Global Contributions</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border"><th className="pb-3 text-left text-muted-foreground font-medium">Supporter</th><th className="pb-3 text-left text-muted-foreground font-medium">Amount</th><th className="pb-3 text-right text-muted-foreground font-medium">Date</th></tr></thead>
                    <tbody className="divide-y divide-border">
                      {(allDonations || []).slice(0, 5).map((d) => (
                        <tr key={d._id} className="hover:bg-muted/50">
                          <td className="py-3"><div className="text-foreground font-medium">{d.supporterName || 'Anonymous'}</div><div className="text-muted-foreground text-xs">{d.collectionTitle}</div></td>
                          <td className="py-3 text-primary font-semibold">₦{d.amount.toLocaleString()}</td>
                          <td className="py-3 text-right text-muted-foreground text-xs">{new Date(d.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {(!allDonations || allDonations.length === 0) && (<tr><td colSpan={3} className="py-8 text-center text-muted-foreground">No donations yet.</td></tr>)}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        )}

        {selectedTab === 'withdrawals' && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted"><tr>{['Creator', 'Amount', 'Bank Details', 'Status', 'Date', 'Actions'].map(h => (<th key={h} className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>))}</tr></thead>
                <tbody className="divide-y divide-border">
                  {withdrawals.map((w) => (
                    <tr key={w._id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4"><div className="text-foreground font-medium">{w.creator?.name || 'Unknown'}</div><div className="text-muted-foreground text-xs">{w.creator?.email}</div></td>
                      <td className="px-6 py-4 text-primary font-bold">₦{w.amount.toLocaleString()}</td>
                      <td className="px-6 py-4"><div className="text-foreground text-sm">{w.bankDetails.bankName}</div><div className="text-muted-foreground text-xs">{w.bankDetails.accountNumber} • {w.bankDetails.accountName}</div></td>
                      <td className="px-6 py-4"><Badge className={statusStyle(w.status)}>{w.status}</Badge></td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">{new Date(w.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                          {w.status === 'pending' && (
                            <><Button variant="ghost" size="sm" onClick={() => handleApproveWithdrawal(w._id)} className="text-green-600"><Check className="size-4" /></Button><Button variant="ghost" size="sm" onClick={() => handleRejectWithdrawal(w._id)} className="text-red-600"><X className="size-4" /></Button></>
                          )}
                          {w.status === 'processing' && (
                            <Button variant="outline" size="sm" onClick={() => handleCompleteWithdrawal(w._id)} disabled={isProcessing === w._id}>{isProcessing === w._id ? <Loader2 className="size-4 animate-spin" /> : null}Complete</Button>
                          )}
                          {w.status === 'pending' && (
                            <Button variant="ghost" size="sm" onClick={() => handleCompleteWithdrawal(w._id)} disabled={isProcessing === w._id}>{isProcessing === w._id ? <Loader2 className="size-4 animate-spin" /> : null}Mark Paid</Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {selectedTab === 'users' && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted"><tr>{['User', 'Role', 'Verified', 'Actions'].map(h => (<th key={h} className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>))}</tr></thead>
                <tbody className="divide-y divide-border">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4"><div className="text-foreground font-medium">{u.name}</div><div className="text-muted-foreground text-xs">{u.email}</div></td>
                      <td className="px-6 py-4 text-sm capitalize">{u.role}</td>
                      <td className="px-6 py-4">{u.emailVerified ? <CheckCircle className="size-5 text-green-500" /> : <XCircle className="size-5 text-red-500" />}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <select value={u.role} onChange={(e) => handleUpdateUserRole(u._id, e.target.value)} disabled={isProcessing === u._id || u._id === user?._id}
                            className="h-9 rounded-lg border border-input bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring">
                            <option value="user">User</option><option value="admin">Admin</option>
                          </select>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteUserConfirm(u._id)} disabled={isProcessing === u._id || u._id === user?._id} className="text-red-500">
                            {isProcessing === u._id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {['pending', 'approved', 'rejected'].includes(selectedTab) && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input type="text" placeholder="Search collections..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-12" />
              </div>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-12 px-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="all">All Statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredCollections.filter(c => selectedTab === 'overview' || c.status === (selectedTab === 'approved' ? 'active' : selectedTab)).map((collection) => (
                <Card key={collection._id} className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                    <img src={collection.primaryImage?.url || collection.images?.[0]?.url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80'}
                      alt={collection.title} className="w-full lg:w-48 h-32 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                        <div className="flex-1">
                          <h3 className="text-foreground font-bold text-lg mb-2">{collection.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className={statusStyle(collection.status)}>{statusLabel(collection.status)}</Badge>
                            <Badge variant="secondary">{collection.category}</Badge>
                            <Badge variant="secondary" className="capitalize">{collection.type}</Badge>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground whitespace-nowrap">Submitted: {new Date(collection.createdAt).toLocaleDateString()}</div>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{collection.description}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-sm">
                        {[
                          { label: 'Creator', value: collection.creator?.name || 'Unknown' },
                          { label: 'Email', value: collection.creator?.email || '-' },
                          { label: 'Raised', value: `₦${collection.raised?.toLocaleString() || 0}` },
                          { label: 'Goal', value: `₦${collection.goal?.toLocaleString()}` },
                        ].map((item) => (
                          <div key={item.label}><div className="text-muted-foreground text-xs">{item.label}</div><div className="text-foreground font-medium truncate">{item.value}</div></div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {collection.status === 'pending' && (
                          <>
                            <Button size="sm" onClick={() => handleApprove(collection._id)} disabled={isProcessing === collection._id} className="bg-green-600 hover:bg-green-700">
                              {isProcessing === collection._id ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(collection._id)} disabled={isProcessing === collection._id}>
                              {isProcessing === collection._id ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />} Reject
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline" onClick={() => setDeleteCollectionConfirm(collection._id)} disabled={isProcessing === collection._id} className="text-red-500">
                          <Trash2 className="size-4" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredCollections.filter(c => selectedTab === 'overview' || c.status === (selectedTab === 'approved' ? 'active' : selectedTab)).length === 0 && (
              <div className="text-center py-16">
                <Inbox className="size-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">No collections found</h3>
                <p className="text-muted-foreground">
                  {selectedTab === 'pending' && 'No collections are currently pending review.'}
                  {selectedTab === 'approved' && 'No collections have been approved yet.'}
                  {selectedTab === 'rejected' && 'No collections have been rejected.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <ConfirmModal open={deleteCollectionConfirm !== null} title="Delete Collection" message="Are you sure you want to delete this collection? This action is permanent."
        confirmLabel="Delete" onConfirm={() => { if (deleteCollectionConfirm) handleDeleteCollection(deleteCollectionConfirm); setDeleteCollectionConfirm(null); }}
        onCancel={() => setDeleteCollectionConfirm(null)} />
      <ConfirmModal open={deleteUserConfirm !== null} title="Delete User" message="Are you sure? This will permanently delete the user."
        confirmLabel="Delete" onConfirm={() => { if (deleteUserConfirm) handleDeleteUser(deleteUserConfirm); setDeleteUserConfirm(null); }}
        onCancel={() => setDeleteUserConfirm(null)} />
    </div>
  );
}

export default function AdminDashboardPageWrapper() {
  return (
    <ErrorBoundary>
      <AdminDashboardPage />
    </ErrorBoundary>
  );
}
