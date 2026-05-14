'use client';

import { useState, useEffect, useRef } from 'react';
import { collectionService, contributionService, withdrawalService } from '@/services';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { toast } from 'sonner';

interface Campaign {
  id: string;
  type: 'fundraiser' | 'occasion' | 'tips';
  title: string;
  category: string;
  creator: string;
  creatorEmail: string;
  location: string;
  goal: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  image: string;
  reason?: string;
}

interface Withdrawal {
  _id: string;
  creator: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  bankDetails: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected';
  createdAt: string;
  adminNote?: string;
}

interface PlatformStats {
  totalCollections: number;
  pendingCollections: number;
  approvedCollections: number;
  rejectedCollections: number;
  totalRaised: number;
  platformRevenue: number;
  totalContributions: number;
}

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [collections, setCollections] = useState<any[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [stats, setStats] = useState<PlatformStats>({
    totalCollections: 0,
    pendingCollections: 0,
    approvedCollections: 0,
    rejectedCollections: 0,
    totalRaised: 0,
    platformRevenue: 0,
    totalContributions: 0
  });
  const [selectedTab, setSelectedTab] = useState<'overview' | 'pending' | 'approved' | 'rejected' | 'withdrawals' | 'users'>('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [allDonations, setAllDonations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const particlesRef = useRef<HTMLDivElement>(null);

  const fetchData = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      // 1. Get all collections
      const colsRes = await collectionService.getAllCollections();
      setCollections(colsRes.data);
      setFilteredCollections(colsRes.data);

      // 2. Get revenue summary
      const revRes = await contributionService.getRevenueSummary();
      
      // 3. Get withdrawals
      const withRes = await withdrawalService.adminGetAll();
      setWithdrawals(withRes.data);

      setStats({
        totalCollections: colsRes.data.length,
        pendingCollections: colsRes.data.filter((c: any) => c.status === 'pending').length,
        approvedCollections: colsRes.data.filter((c: any) => c.status === 'active').length,
        rejectedCollections: colsRes.data.filter((c: any) => c.status === 'rejected').length,
        totalRaised: revRes.summary.totalGrossDonated,
        platformRevenue: revRes.summary.totalPlatformRevenue,
        totalContributions: revRes.summary.totalContributions
      });

      // 4. Get All Users
      try {
        const usersRes = await api.get('/auth/users');
        setUsers(usersRes.data.data);
      } catch (e) {
        console.warn('Admin users endpoint failed', e);
      }

      // 5. Get recent global donations (could add a global endpoint in backend)
      // For now, we can fetch all contributions if the admin has access
      try {
        const donationsRes = await api.get('/contributions/admin/all'); // Assuming we add this or similar
        setAllDonations(donationsRes.data);
      } catch (e) {
        console.warn('Global donations fetch failed');
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      toast.error('Unauthorized access');
      router.push('/');
      return;
    }
    if (isAuthenticated) {
      fetchData();
    }
    // Create floating particles
    if (particlesRef.current) {
      const container = particlesRef.current;
      const particleCount = 30;
      // Clear any existing particles to avoid duplicates
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        container.appendChild(particle);
      }
    }
  // Only run this effect on mount and on auth/user change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  useEffect(() => {
    let filtered = collections;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((col: any) =>
        col.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        col.creator?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        col.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus && selectedStatus !== 'all') {
      const targetStatus = selectedStatus === 'approved' ? 'active' : selectedStatus;
      filtered = filtered.filter((col: any) => col.status === targetStatus);
    }

    setFilteredCollections(filtered);
  }, [collections, searchTerm, selectedStatus]);

  const handleApprove = async (id: string) => {
    try {
      setIsProcessing(id);
      await collectionService.updateCollection(id, { status: 'active' });
      toast.success('Collection approved!');
      fetchData(true);
    } catch (error) {
      toast.error('Failed to approve collection');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      setIsProcessing(id);
      await collectionService.updateCollection(id, { status: 'rejected' });
      toast.success('Collection rejected');
      fetchData(true);
    } catch (error) {
      toast.error('Failed to reject collection');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDeleteCollection = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this collection? This action is permanent.')) return;
    try {
      setIsProcessing(id);
      await collectionService.deleteCollection(id);
      toast.success('Collection deleted');
      fetchData(true);
    } catch (error) {
      toast.error('Failed to delete collection');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleApproveWithdrawal = async (id: string) => {
    try {
      setIsProcessing(id);
      await withdrawalService.adminApprove(id);
      toast.success('Withdrawal approved and transfer initiated!');
      fetchData(true);
    } catch (error: any) {
      // Type guard for error shape
      const errMsg =
        (error && typeof error === 'object' && 'response' in error && (error as any).response?.data?.error) ||
        'Failed to approve withdrawal';
      toast.error(errMsg);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRejectWithdrawal = async (id: string) => {
    const reason = window.prompt('Enter rejection reason:');
    if (reason === null) return;
    try {
      setIsProcessing(id);
      await withdrawalService.adminReject(id, reason);
      toast.success('Withdrawal rejected');
      fetchData(true);
    } catch (error) {
      toast.error('Failed to reject withdrawal');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleCompleteWithdrawal = async (id: string) => {
    try {
      setIsProcessing(id);
      await withdrawalService.adminComplete(id);
      toast.success('Withdrawal marked as completed');
      fetchData(true);
    } catch (error) {
      toast.error('Failed to complete withdrawal');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      setIsProcessing(userId);
      await api.patch(`/auth/user/${userId}/role`, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      fetchData(true);
    } catch (error) {
      toast.error('Failed to update user role');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure? This will permanently delete the user.')) return;
    try {
      setIsProcessing(userId);
      await api.delete(`/auth/user/${userId}`);
      toast.success('User deleted');
      fetchData(true);
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setIsProcessing(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'approved':
      case 'active': // Also include 'active' as approved status
        return 'text-green-400 bg-green-400/10';
      case 'rejected': return 'text-red-400 bg-red-400/10';
      default: return 'text-white/60 bg-white/5';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'approved':
      case 'active': // Also consider 'active' as Approved
        return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  // const toggleMobileMenu = () => {
  //   setIsMobileMenuOpen(!isMobileMenuOpen);
  // };

  if (isLoading) {
    return (
      <>
        <div className="bg-particles" id="particles" ref={particlesRef}></div>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Loading admin dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4 pt-20">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 max-w-md text-center shadow-2xl relative z-10">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-3xl font-bold text-white mb-4">Admin Access</h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            This area is restricted to administrators. Please log in with an authorized account to continue.
          </p>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal'))}
            className="w-full py-4 rounded-full font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #f43f5e, #fb923c)' }}
          >
            Login to Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-particles" id="particles" ref={particlesRef}></div>

      {/* Main Content */}
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Admin Dashboard
            </h1>
            <p className="text-white/80 text-base sm:text-lg">
              Manage collections, monitor platform performance, and ensure quality control.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {[
                { id: 'overview', label: 'Overview', icon: 'fas fa-chart-line' },
                { id: 'pending', label: 'Pending Collections', icon: 'fas fa-clock', count: stats.pendingCollections },
                { id: 'withdrawals', label: 'Withdrawal Requests', icon: 'fas fa-money-check-alt', count: withdrawals.filter(w => w.status === 'pending').length },
                { id: 'users', label: 'Users', icon: 'fas fa-users', count: users.length },
                { id: 'approved', label: 'Approved Collections', icon: 'fas fa-check-circle', count: stats.approvedCollections },
                { id: 'rejected', label: 'Rejected Collections', icon: 'fas fa-times-circle', count: stats.rejectedCollections }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 cursor-pointer ${
                    selectedTab === tab.id
                      ? 'bg-gradient-to-r from-red-400 to-cyan-400 text-white shadow-lg'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <i className={tab.icon}></i>
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-6 sm:space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { label: 'Total Collections', value: stats.totalCollections, icon: 'fas fa-bullhorn', color: 'from-blue-400 to-cyan-400' },
                  { label: 'Pending Review', value: stats.pendingCollections, icon: 'fas fa-clock', color: 'from-yellow-400 to-orange-400' },
                  { label: 'Total Raised (Gross)', value: `₦${stats.totalRaised.toLocaleString()}`, icon: 'fas fa-money-bill-wave', color: 'from-green-400 to-emerald-400' },
                  { label: 'Platform Revenue', value: `₦${stats.platformRevenue.toLocaleString()}`, icon: 'fas fa-university', color: 'from-purple-400 to-pink-400' }
                ].map((stat, index) => (
                  <div key={index} className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-4 sm:p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                        <i className={`${stat.icon} text-white text-lg`}></i>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                        <div className="text-white/60 text-sm">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* User Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-4 sm:p-6 shadow-xl">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
                    <i className="fas fa-hand-holding-usd text-cyan-400"></i>
                    Platform Activity
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                      <span className="text-white/70">Total Contributions</span>
                      <span className="text-white font-semibold">{stats.totalContributions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                      <span className="text-white/70">Pending Withdrawals</span>
                      <span className="text-white font-semibold">{withdrawals.filter(w => w.status === 'pending').length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                      <span className="text-white/70">Avg Contribution</span>
                      <span className="text-cyan-400 font-semibold">
                        ₦{(stats.totalRaised / (stats.totalContributions || 1)).toFixed(0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                  {/* </div>
                </div> */}
              </div>

              {/* Recent Donations Table */}
              <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 overflow-hidden shadow-xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <i className="fas fa-history text-cyan-400"></i>
                    Recent Global Contributions
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="px-6 py-4 text-white/60 font-semibold text-sm">Supporter</th>
                        <th className="px-6 py-4 text-white/60 font-semibold text-sm">Collection</th>
                        <th className="px-6 py-4 text-white/60 font-semibold text-sm">Amount</th>
                        <th className="px-6 py-4 text-white/60 font-semibold text-sm">Status</th>
                        <th className="px-6 py-4 text-white/60 font-semibold text-sm text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {(allDonations || []).slice(0, 10).map((donation: any) => (
                        <tr key={donation._id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-white font-medium">{donation.supporterName || 'Anonymous'}</div>
                            <div className="text-white/40 text-xs">{donation.supporterEmail}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-white/70 text-sm truncate max-w-xs">{donation.collectionTitle || 'Unknown Project'}</div>
                          </td>
                          <td className="px-6 py-4 font-bold text-cyan-400">
                            ₦{donation.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              donation.status === 'completed' ? 'bg-green-400/20 text-green-400' : 'bg-yellow-400/20 text-yellow-400'
                            }`}>
                              {donation.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-white/40 text-sm">
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                      {(!allDonations || allDonations.length === 0) && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-white/30 italic">
                            No donation activity recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Withdrawals Management Tab */}
          {selectedTab === 'withdrawals' && (
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="px-6 py-4 text-white/60 font-semibold text-sm">Creator</th>
                        <th className="px-6 py-4 text-white/60 font-semibold text-sm">Amount</th>
                        <th className="px-6 py-4 text-white/60 font-semibold text-sm">Bank Details</th>
                        <th className="px-6 py-4 text-white/60 font-semibold text-sm">Status</th>
                        <th className="px-6 py-4 text-white/60 font-semibold text-sm">Date</th>
                        <th className="px-6 py-4 text-white/60 font-semibold text-sm text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {withdrawals.map((withdrawal) => (
                        <tr key={withdrawal._id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-white font-medium">{withdrawal.creator?.name || 'Unknown'}</div>
                            <div className="text-white/40 text-xs">{withdrawal.creator?.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-cyan-400 font-bold">₦{withdrawal.amount.toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-white text-sm">{withdrawal.bankDetails.bankName}</div>
                            <div className="text-white/40 text-xs">{withdrawal.bankDetails.accountNumber} • {withdrawal.bankDetails.accountName}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              withdrawal.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400' :
                              withdrawal.status === 'processing' ? 'bg-blue-400/10 text-blue-400' :
                              withdrawal.status === 'completed' ? 'bg-green-400/10 text-green-400' :
                              'bg-red-400/10 text-red-400'
                            }`}>
                              {withdrawal.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-white/40 text-sm">
                            {new Date(withdrawal.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              {withdrawal.status === 'pending' && (
                                <>
                                  <button 
                                    onClick={() => handleApproveWithdrawal(withdrawal._id)}
                                    className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                                    title="Approve & Transfer"
                                  >
                                    <i className="fas fa-check"></i>
                                  </button>
                                  <button 
                                    onClick={() => handleRejectWithdrawal(withdrawal._id)}
                                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                                    title="Reject"
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </>
                              )}
                              {withdrawal.status === 'processing' && (
                                <button 
                                  onClick={() => handleCompleteWithdrawal(withdrawal._id)}
                                  disabled={isProcessing === withdrawal._id}
                                  className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-500/30 transition-all disabled:opacity-50"
                                >
                                  {isProcessing === withdrawal._id ? <i className="fas fa-spinner fa-spin"></i> : 'Complete Transfer'}
                                </button>
                              )}
                              {withdrawal.status === 'pending' && (
                                <button 
                                  onClick={() => handleCompleteWithdrawal(withdrawal._id)}
                                  disabled={isProcessing === withdrawal._id}
                                  className="px-3 py-1 bg-white/10 text-white/70 rounded-lg text-xs font-bold hover:bg-white/20 transition-all disabled:opacity-50"
                                  title="Skip automated payout and mark as paid"
                                >
                                  {isProcessing === withdrawal._id ? <i className="fas fa-spinner fa-spin"></i> : 'Mark Paid Manually'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {selectedTab === 'users' && (
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="px-6 py-4 text-white/60 font-semibold text-sm">User</th>
                        <th className="px-6 py-4 text-white/60 font-semibold text-sm">Role</th>
                        <th className="px-6 py-4 text-white/60 font-semibold text-sm">Verified</th>
                        <th className="px-6 py-4 text-white/60 font-semibold text-sm">Joined</th>
                        <th className="px-6 py-4 text-white/60 font-semibold text-sm text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-white font-medium">{u.name}</div>
                            <div className="text-white/40 text-xs">{u.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-white/70 text-sm capitalize">{u.role}</span>
                          </td>
                          <td className="px-6 py-4">
                            {u.isEmailVerified ? 
                              <i className="fas fa-check-circle text-green-400"></i> : 
                              <i className="fas fa-times-circle text-red-400"></i>
                            }
                          </td>
                          <td className="px-6 py-4 text-right flex justify-end gap-2">
                            <select 
                              value={u.role}
                              onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                              disabled={isProcessing === u._id || u._id === user?._id}
                              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                            >
                              <option value="user" className="bg-gray-800">User</option>
                              <option value="admin" className="bg-gray-800">Admin</option>
                            </select>
                            <button 
                              onClick={() => handleDeleteUser(u._id)}
                              disabled={isProcessing === u._id || u._id === user?._id}
                              className="p-1.5 text-red-400/50 hover:text-red-400 transition-colors disabled:opacity-50"
                              title="Delete User"
                            >
                              {isProcessing === u._id ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-trash-alt"></i>}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Campaign Management Tabs */}
          {['pending', 'approved', 'rejected'].includes(selectedTab) && (
            <div className="space-y-6 sm:space-y-8">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search collections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder:text-white/50 backdrop-blur-md transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20"
                  />
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 sm:px-6 py-3 sm:py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white backdrop-blur-md transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20"
                >
                  <option value="all" className="bg-gray-800 text-white">All Statuses</option>
                  <option value="pending" className="bg-gray-800 text-white">Pending</option>
                  <option value="approved" className="bg-gray-800 text-white">Approved</option>
                  <option value="rejected" className="bg-gray-800 text-white">Rejected</option>
                </select>
              </div>

              {/* Collections List */}
              <div className="space-y-4 sm:space-y-6">
                {filteredCollections
                  .filter(collection => {
                    if (selectedTab === 'overview') return true;
                    if (selectedTab === 'approved') return collection.status === 'active';
                    return collection.status === selectedTab;
                  })
                  .map((collection) => (
                    <div key={collection._id} className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-4 sm:p-6 shadow-xl">
                      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                        {/* Campaign Image */}
                        <div className="flex-shrink-0">
                          <img 
                            src={collection.primaryImage?.url || collection.images?.[0]?.url || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                            alt={collection.title} 
                            className="w-full lg:w-48 h-32 lg:h-32 rounded-xl object-cover"
                          />
                        </div>

                        {/* Campaign Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                            <div className="flex-1">
                              <h3 className="text-white font-bold text-lg sm:text-xl mb-2 line-clamp-2">
                                {collection.title}
                              </h3>
                              <div className="flex flex-wrap gap-2 mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(collection.status)}`}>
                                  {getStatusText(collection.status)}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/70">
                                  {collection.category}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-400/15 text-cyan-300 capitalize">
                                  {collection.type}
                                </span>
                              </div>
                            </div>
                            <div className="text-right text-sm text-white/60">
                              Submitted: {new Date(collection.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          <p className="text-white/70 text-sm sm:text-base mb-4 line-clamp-2">
                            {collection.description}
                          </p>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-sm mb-4">
                            <div>
                              <div className="text-white/60">Creator</div>
                              <div className="text-white font-medium">{collection.creator?.name || 'Unknown'}</div>
                            </div>
                            <div>
                              <div className="text-white/60">Email</div>
                              <div className="text-white font-medium truncate">{collection.creator?.email || '-'}</div>
                            </div>
                            <div>
                              <div className="text-white/60">Raised</div>
                              <div className="text-white font-medium">₦{collection.raised?.toLocaleString() || 0}</div>
                            </div>
                            <div>
                              <div className="text-white/60">Goal</div>
                              <div className="text-white font-medium">₦{collection.goal?.toLocaleString()}</div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2 sm:gap-3">
                            {collection.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(collection._id)}
                                  disabled={isProcessing === collection._id}
                                  className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-medium border border-green-400/30 hover:bg-green-500/30 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  {isProcessing === collection._id ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-check mr-2"></i>}
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(collection._id, 'Insufficient documentation')}
                                  disabled={isProcessing === collection._id}
                                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-medium border border-red-400/30 hover:bg-red-500/30 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  <i className="fas fa-times mr-2"></i>
                                  Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteCollection(collection._id)}
                              disabled={isProcessing === collection._id}
                              className="px-4 py-2 bg-white/5 text-white/40 rounded-lg font-medium border border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-400/30 transition-all cursor-pointer disabled:opacity-50"
                            >
                              <i className="fas fa-trash-alt mr-2"></i>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Empty State */}
              {filteredCollections.filter(c => selectedTab === 'overview' || c.status === selectedTab).length === 0 && (
                <div className="text-center py-12 sm:py-16">
                  <i className="fas fa-inbox text-6xl text-white/30 mb-6"></i>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">No collections found</h3>
                  <p className="text-white/70 text-base sm:text-lg">
                    {selectedTab === 'pending' && 'No collections are currently pending review.'}
                    {selectedTab === 'approved' && 'No collections have been approved yet.'}
                    {selectedTab === 'rejected' && 'No collections have been rejected.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
