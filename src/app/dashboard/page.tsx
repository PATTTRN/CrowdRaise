'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { collectionService, contributionService, withdrawalService } from '@/services';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

interface CollectionDoc {
  _id: string;
  type: 'fundraiser' | 'occasion' | 'tips';
  title: string;
  category: string;
  goal: number;
  raised: number;
  supporters: number;
  daysLeft: number;
  status: 'active' | 'completed' | 'pending' | 'rejected';
  primaryImage?: {
    url: string;
  };
  images?: { url: string }[];
  createdAt: string;
}

interface DonationDoc {
  _id: string;
  collectionId: string;
  collectionTitle: string;
  supporterName: string;
  amount: number;
  message?: string;
  createdAt: string;
}

interface Bank {
  name: string;
  code: string;
}

interface Balance {
  totalGross: number;
  totalFees: number;
  totalEarned: number;
  totalPaid: number;
  pendingAmount: number;
  available: number;
}

interface WithdrawalHistoryItem {
  _id: string;
  createdAt: string;
  amount: number;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  status: string;
}

interface DashboardStats {
  totalCollections: number;
  activeCollections: number;
  totalRaised: number;
  totalSupporters: number;
  averageDonation: number;
  completionRate: number;
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [collections, setCollections] = useState<CollectionDoc[]>([]);
  const [recentDonations, setRecentDonations] = useState<DonationDoc[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCollections: 0,
    activeCollections: 0,
    totalRaised: 0,
    totalSupporters: 0,
    averageDonation: 0,
    completionRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'collections' | 'donations' | 'withdraw'>('overview');
  const particlesRef = useRef<HTMLDivElement>(null);

  // ── Withdraw tab state ──────────────────────────────────────────────────
  const [banks, setBanks] = useState<Bank[]>([]);
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBankCode, setSelectedBankCode] = useState('');
  const [selectedBankName, setSelectedBankName] = useState('');
  const [resolvedAccountName, setResolvedAccountName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSavingBank, setIsSavingBank] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [balance, setBalance] = useState<Balance>({
    totalGross: 0,
    totalFees: 0,
    totalEarned: 0,
    totalPaid: 0,
    pendingAmount: 0,
    available: 0,
  });
  const [withdrawHistory, setWithdrawHistory] = useState<WithdrawalHistoryItem[]>([]);

  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      // 1. Get my collections
      const myCollections = await collectionService.getAllCollections({ creator: user._id });
      setCollections(myCollections.data as CollectionDoc[]);

      // 2. Get contributions for all collections (per collection)
      const allDonations: DonationDoc[] = [];
      let totalRaised = 0;
      let totalSupporters = 0;
      let activeCount = 0;

      for (const col of myCollections.data as CollectionDoc[]) {
        totalRaised += col.raised;
        totalSupporters += col.supporters;
        if (col.status === 'active') activeCount++;

        try {
          const res = await contributionService.getCollectionContributions(col._id);
          allDonations.push(...(res.data as DonationDoc[]));
        } catch (e) {
          console.error('Failed to fetch contributions for', col._id);
        }
      }

      // Sort donations by date
      allDonations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRecentDonations(allDonations);

      setStats({
        totalCollections: myCollections.data.length,
        activeCollections: activeCount,
        totalRaised,
        totalSupporters,
        averageDonation: totalSupporters > 0 ? Math.round(totalRaised / totalSupporters) : 0,
        completionRate: myCollections.data.length > 0 ? Math.round((activeCount / myCollections.data.length) * 100) : 0,
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCollection = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this collection? This action is permanent.')) return;
    try {
      setIsProcessing(id);
      await collectionService.deleteCollection(id);
      toast.success('Collection deleted');
      fetchDashboardData(); // Refresh list
    } catch (error) {
      toast.error('Failed to delete collection');
    } finally {
      setIsProcessing(null);
    }
  };

  const loadWithdrawData = async () => {
    try {
      const [balanceData, historyData, banksData] = await Promise.all([
        withdrawalService.getBalance(),
        withdrawalService.getMyWithdrawals(),
        withdrawalService.getBanks(),
      ]);
      setBalance(balanceData as Balance);
      setWithdrawHistory((historyData.data as WithdrawalHistoryItem[]) ?? []);
      setBanks(
        (banksData.data as { name: string; code: string }[]).map((b) => ({ name: b.name, code: b.code }))
      );
    } catch {
      toast.error('Failed to load withdrawal data');
    }
  };

  const handleVerifyAccount = async () => {
    if (!accountNumber || !selectedBankCode) {
      toast.error('Enter account number and select a bank');
      return;
    }
    setIsVerifying(true);
    try {
      const result: { accountName: string } = await withdrawalService.verifyAccount(accountNumber, selectedBankCode);
      setResolvedAccountName(result.accountName);
      toast.success(`Verified: ${result.accountName}`);
    } catch {
      toast.error('Could not verify account. Check the number and bank.');
      setResolvedAccountName('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSaveBankDetails = async () => {
    if (!resolvedAccountName) {
      toast.error('Verify your account first');
      return;
    }
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

  const handleRequestWithdrawal = async () => {
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt < 1000) {
      toast.error('Minimum withdrawal is ₦1,000');
      return;
    }
    if (amt > balance.available) {
      toast.error(`Only ₦${balance.available.toLocaleString()} available`);
      return;
    }
    setIsRequesting(true);
    try {
      await withdrawalService.requestWithdrawal(amt);
      toast.success('Withdrawal request submitted! Processing in 1–3 business days.');
      setWithdrawAmount('');
      loadWithdrawData();
    } catch (err) {
      // err is likely `unknown`. Let's attempt to type narrow for TS.
      if (err && typeof err === 'object' && err !== null && 'response' in err) {
        const anyErr = err as {
          response?: { data?: { message?: string; error?: string } };
        };
        toast.error(
          anyErr.response?.data?.message || anyErr.response?.data?.error || 'Request failed'
        );
      } else {
        toast.error('Request failed');
      }
    } finally {
      setIsRequesting(false);
    }
  };

  const withdrawalStatusStyle = (s: string) =>
    ({
      pending: 'text-yellow-400 bg-yellow-400/10',
      approved: 'text-blue-400 bg-blue-400/10',
      processing: 'text-cyan-400 bg-cyan-400/10',
      completed: 'text-green-400 bg-green-400/10',
      rejected: 'text-red-400 bg-red-400/10',
    }[s] ?? 'text-white/60 bg-white/5');

  useEffect(() => {
    if (selectedTab === 'withdraw' && isAuthenticated) loadWithdrawData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
    return () => {
      window.removeEventListener('scroll', () => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    if (particlesRef.current) {
      const container = particlesRef.current;
      const particleCount = 30;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = Math.random() * 4 + 4 + 's';
        container.appendChild(particle);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4 pt-20">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 max-w-md text-center shadow-2xl">
          <div className="text-6xl mb-6">📊</div>
          <h2 className="text-3xl font-bold text-white mb-4">Your Dashboard</h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Please log in to view your collections, track contributions, and manage your account.
          </p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal'))}
            className="w-full py-4 rounded-full font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #f43f5e, #fb923c)' }}
          >
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-400/10';
      case 'completed':
        return 'text-blue-400 bg-blue-400/10';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'rejected':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-white/60 bg-white/5';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  // const toggleMobileMenu = () => {
  //   setIsMobileMenuOpen(!isMobileMenuOpen);
  // };

  if (isLoading) {
    return (
      <>
        <div className="bg-particles" id="particles" ref={particlesRef}></div>
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading your dashboard...</p>
          </div>
        </div>
      </>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
                  Dashboard
                </h1>
                <p className="text-white/80 text-base sm:text-lg">
                  Welcome back! Here&apos;s an overview of your collections and supporter activity.
                </p>
              </div>
              {user?.role === 'admin' && (
                <Link
                  href="/admin_dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-white font-bold transition-all shadow-xl hover:-translate-y-1"
                >
                  <i className="fas fa-shield-alt text-cyan-400"></i>
                  Admin Panel
                </Link>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {[
                { id: 'overview', label: 'Overview', icon: 'fas fa-chart-line' },
                { id: 'collections', label: 'Collections', icon: 'fas fa-bullhorn' },
                { id: 'donations', label: 'Contributions', icon: 'fas fa-heart' },
                { id: 'withdraw', label: 'Withdraw', icon: 'fas fa-wallet' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setSelectedTab(tab.id as 'overview' | 'collections' | 'donations')
                  }
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 cursor-pointer ${
                    selectedTab === tab.id
                      ? 'bg-gradient-to-r from-red-400 to-cyan-400 text-white shadow-lg'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <i className={tab.icon}></i>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-6 sm:space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                  {
                    label: 'Total Collections',
                    value: stats.totalCollections,
                    icon: 'fas fa-bullhorn',
                    color: 'from-blue-400 to-cyan-400',
                  },
                  {
                    label: 'Active Collections',
                    value: stats.activeCollections,
                    icon: 'fas fa-play-circle',
                    color: 'from-green-400 to-emerald-400',
                  },
                  {
                    label: 'Total Raised',
                    value: `₦${stats.totalRaised.toLocaleString()}`,
                    icon: 'fas fa-money-bill-wave',
                    color: 'from-yellow-400 to-orange-400',
                  },
                  {
                    label: 'Total Supporters',
                    value: stats.totalSupporters,
                    icon: 'fas fa-users',
                    color: 'from-purple-400 to-pink-400',
                  },
                  {
                    label: 'Avg. Contribution',
                    value: `₦${stats.averageDonation.toLocaleString()}`,
                    icon: 'fas fa-chart-bar',
                    color: 'from-indigo-400 to-blue-400',
                  },
                  {
                    label: 'Completion Rate',
                    value: `${stats.completionRate}%`,
                    icon: 'fas fa-percentage',
                    color: 'from-red-400 to-pink-400',
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-4 sm:p-6 shadow-xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                      >
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

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Recent Collections */}
                <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-4 sm:p-6 shadow-xl">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
                    <i className="fas fa-bullhorn text-cyan-400"></i>
                    Recent Collections
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {collections.slice(0, 3).map((collection) => {
                      const imageUrl =
                        collection.primaryImage?.url ||
                        collection.images?.[0]?.url ||
                        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80';
                      return (
                        <div
                          key={collection._id}
                          className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                        >
                          <img
                            src={imageUrl}
                            alt={collection.title}
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm sm:text-base truncate">
                              {collection.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60">
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(collection.status)}`}>
                                {getStatusText(collection.status)}
                              </span>
                              <span>₦{collection.raised.toLocaleString()} raised</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 sm:mt-6 text-center">
                    <Link
                      href="/create_collection"
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-400 to-cyan-400 text-white rounded-full text-sm sm:text-base font-medium hover:-translate-y-1 transition-all duration-300"
                    >
                      <i className="fas fa-plus"></i>
                      Create New Collection
                    </Link>
                  </div>
                </div>

                {/* Recent Donations */}
                <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-4 sm:p-6 shadow-xl">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
                    <i className="fas fa-heart text-cyan-400"></i>
                    Recent Contributions
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {recentDonations.slice(0, 4).map((donation) => (
                      <div
                        key={donation._id}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-red-400 to-cyan-400 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                          {(donation.supporterName || 'A').charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium text-sm sm:text-base">{donation.supporterName || 'Anonymous'}</div>
                          <div className="text-white/60 text-xs sm:text-sm truncate">{donation.collectionTitle}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-cyan-400 font-semibold text-sm sm:text-base">
                            ₦{donation.amount.toLocaleString()}
                          </div>
                          <div className="text-white/50 text-xs">
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Collections Tab */}
          {selectedTab === 'collections' && (
            <div className="space-y-6 sm:space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Your Collections</h2>
                <Link
                  href="/create_collection"
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-400 to-cyan-400 text-white rounded-full text-sm sm:text-base font-medium hover:-translate-y-1 transition-all duration-300"
                >
                  <i className="fas fa-plus"></i>
                  <span className="hidden sm:inline">Create Collection</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {collections.map((collection) => {
                  const imageUrl =
                    collection.primaryImage?.url ||
                    collection.images?.[0]?.url ||
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80';
                  return (
                    <div
                      key={collection._id}
                      className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 overflow-hidden shadow-xl"
                    >
                      <img
                        src={imageUrl}
                        alt={collection.title}
                        className="w-full h-32 sm:h-40 object-cover"
                      />
                      <div className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(collection.status)}`}>
                            {getStatusText(collection.status)}
                          </span>
                          <span className="text-white/60 text-xs">
                            {collection.daysLeft || 0} days left
                          </span>
                        </div>
                        <h3 className="text-white font-semibold text-base sm:text-lg mb-2 line-clamp-2">
                          {collection.title}
                        </h3>
                        <p className="text-white/60 text-sm mb-4">{collection.category}</p>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/70">Goal:</span>
                            <span className="text-white font-medium">
                              ₦{collection.goal.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/70">Raised:</span>
                            <span className="text-cyan-400 font-semibold">
                              ₦{collection.raised.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/70">Supporters:</span>
                            <span className="text-white font-medium">{collection.supporters}</span>
                          </div>
                        </div>

                        <div className="mt-4 sm:mt-6 flex gap-2">
                          <Link
                            href={`/collection_detail/${collection._id}`}
                            className="flex-1 px-4 py-2 bg-white/10 text-white text-center rounded-lg text-sm hover:bg-white/20 transition-colors"
                          >
                            View
                          </Link>
                          <Link
                            href={`/edit_collection/${collection._id}`}
                            className="px-4 py-2 bg-cyan-400/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-400/30 transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteCollection(collection._id)}
                            disabled={isProcessing === collection._id}
                            className="px-4 py-2 bg-red-400/10 text-red-400 rounded-lg text-sm hover:bg-red-400/20 transition-colors disabled:opacity-50"
                          >
                            {isProcessing === collection._id ? (
                              <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                              <i className="fas fa-trash-alt"></i>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Donations Tab */}
          {selectedTab === 'donations' && (
            <div className="space-y-6 sm:space-y-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Recent Contributions</h2>

              <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-white/70 uppercase tracking-wider">
                          Supporter
                        </th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-white/70 uppercase tracking-wider">
                          Collection
                        </th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-white/70 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-white/70 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-white/70 uppercase tracking-wider">
                          Message
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {recentDonations.map((donation) => (
                        <tr key={donation._id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-red-400 to-cyan-400 flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                                {(donation.supporterName || 'A').charAt(0)}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm sm:text-base font-medium text-white">
                                  {donation.supporterName || 'Anonymous'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="text-sm sm:text-base text-white/80 max-w-xs truncate">
                              {donation.collectionTitle}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="text-sm sm:text-base font-semibold text-cyan-400">
                              ₦{donation.amount.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="text-sm text-white/60">
                              {new Date(donation.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <div className="text-sm text-white/70 max-w-xs truncate">
                              {'message' in donation && donation.message ? donation.message : '-'}
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

          {/* Withdraw Tab */}
          {selectedTab === 'withdraw' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Withdraw Funds</h2>
                <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 text-white/60 text-sm">
                  <i className="fas fa-info-circle mr-2 text-cyan-400"></i>
                  Withdrawals are processed within 1-3 business days
                </div>
              </div>

              {/* Balance Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {[
                  {
                    label: 'Gross Revenue',
                    value: balance.totalGross,
                    icon: 'fas fa-chart-line',
                    color: 'from-blue-500/20 to-cyan-500/20',
                    textColor: 'text-blue-400',
                  },
                  {
                    label: 'Platform Fees',
                    value: balance.totalFees,
                    icon: 'fas fa-hand-holding-usd',
                    color: 'from-red-500/20 to-orange-500/20',
                    textColor: 'text-red-400',
                  },
                  {
                    label: 'Net Earnings',
                    value: balance.totalEarned,
                    icon: 'fas fa-coins',
                    color: 'from-indigo-500/20 to-purple-500/20',
                    textColor: 'text-indigo-400',
                  },
                  {
                    label: 'Total Paid',
                    value: balance.totalPaid,
                    icon: 'fas fa-check-circle',
                    color: 'from-green-500/20 to-emerald-500/20',
                    textColor: 'text-green-400',
                  },
                  {
                    label: 'Available Now',
                    value: balance.available,
                    icon: 'fas fa-wallet',
                    color: 'from-pink-500/20 to-rose-500/20',
                    textColor: 'text-pink-400',
                    highlight: true,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`p-6 rounded-3xl border transition-all duration-300 ${
                      item.highlight
                        ? 'border-pink-500/50 bg-pink-500/5 shadow-[0_0_20px_rgba(244,63,94,0.1)]'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${item.color}`}>
                        <i className={`${item.icon} ${item.textColor} text-xl`}></i>
                      </div>
                    </div>
                    <div className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">
                      {item.label}
                    </div>
                    <div className={`text-2xl font-bold ${item.textColor}`}>₦{item.value.toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Bank & Request Form */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Bank Details Card */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                      <i className="fas fa-university text-cyan-400"></i>
                      Payout Bank Account
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="text-white/60 text-xs font-medium mb-1.5 block px-1">
                          Select Bank
                        </label>
                        <select
                          value={selectedBankCode}
                          onChange={(e) => {
                            setSelectedBankCode(e.target.value);
                            const bank = banks.find((b) => b.code === e.target.value);
                            if (bank) setSelectedBankName(bank.name);
                            setResolvedAccountName(''); // Reset verification
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                        >
                          <option value="">Select a bank</option>
                          {banks.map((bank) => (
                            <option key={bank.code} value={bank.code}>
                              {bank.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-white/60 text-xs font-medium mb-1.5 block px-1">
                          Account Number
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={10}
                            value={accountNumber}
                            onChange={(e) => {
                              setAccountNumber(e.target.value.replace(/\D/g, ''));
                              setResolvedAccountName('');
                            }}
                            placeholder="0123456789"
                            className="flex-1 px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                          />
                          <button
                            onClick={handleVerifyAccount}
                            disabled={isVerifying || accountNumber.length !== 10 || !selectedBankCode}
                            className="px-4 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 disabled:opacity-50 transition-all"
                          >
                            {isVerifying ? <i className="fas fa-spinner fa-spin"></i> : 'Verify'}
                          </button>
                        </div>
                      </div>

                      {resolvedAccountName && (
                        <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20">
                          <div className="text-green-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                            Account Name Found
                          </div>
                          <div className="text-white text-sm font-bold">{resolvedAccountName}</div>
                        </div>
                      )}

                      <button
                        onClick={handleSaveBankDetails}
                        disabled={isSavingBank || !resolvedAccountName}
                        className="w-full py-3.5 rounded-xl bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
                      >
                        {isSavingBank ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
                        Save Bank Details
                      </button>
                    </div>
                  </div>

                  {/* Request Withdrawal Card */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                      <i className="fas fa-paper-plane text-pink-400"></i>
                      Request Payout
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="text-white/60 text-xs font-medium mb-1.5 block px-1">
                          Amount to Withdraw (₦)
                        </label>
                        <input
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          placeholder="e.g. 5000"
                          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-white text-sm focus:outline-none focus:border-pink-500/50 transition-colors"
                        />
                        <div className="flex justify-between mt-2 px-1">
                          <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">
                            Available: ₦{balance.available.toLocaleString()}
                          </span>
                          <button
                            onClick={() => setWithdrawAmount(balance.available.toString())}
                            className="text-[10px] text-pink-400 font-bold uppercase hover:underline"
                          >
                            Withdraw All
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handleRequestWithdrawal}
                        disabled={
                          isRequesting ||
                          !withdrawAmount ||
                          parseFloat(withdrawAmount) < 1000
                        }
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                      >
                        {isRequesting ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
                        Submit Request
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: History Table */}
                <div className="lg:col-span-2">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <i className="fas fa-history text-cyan-400"></i>
                        Withdrawal History
                      </h3>
                      <button
                        onClick={loadWithdrawData}
                        className="text-white/40 hover:text-white transition-colors"
                      >
                        <i className="fas fa-sync-alt"></i>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-white/5">
                          <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-white/40 uppercase tracking-widest">
                              Date
                            </th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-white/40 uppercase tracking-widest">
                              Amount
                            </th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-white/40 uppercase tracking-widest">
                              Bank Details
                            </th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-white/40 uppercase tracking-widest">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {withdrawHistory.length > 0 ? (
                            withdrawHistory.map((item) => (
                              <tr key={item._id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-white text-sm font-medium">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                  </div>
                                  <div className="text-white/30 text-[10px]">
                                    {new Date(item.createdAt).toLocaleTimeString()}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-white font-bold">
                                    ₦{item.amount.toLocaleString()}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-white/80 text-sm font-medium">
                                    {item.bankDetails.bankName}
                                  </div>
                                  <div className="text-white/40 text-[10px]">
                                    {item.bankDetails.accountNumber} • {item.bankDetails.accountName}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${withdrawalStatusStyle(
                                      item.status
                                    )}`}
                                  >
                                    {item.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="px-6 py-12 text-center">
                                <div className="text-4xl mb-4 opacity-20">💸</div>
                                <div className="text-white/30 text-sm">No withdrawal history yet.</div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
