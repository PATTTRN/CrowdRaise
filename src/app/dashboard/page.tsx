'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Campaign {
  id: string;
  type: 'fundraiser' | 'occasion' | 'tips';
  title: string;
  category: string;
  goal: number;
  raised: number;
  supporters: number;
  daysLeft: number;
  status: 'active' | 'completed' | 'pending' | 'rejected';
  image: string;
  createdAt: string;
}

interface Donation {
  id: string;
  campaignId: string;
  campaignTitle: string;
  supporterName: string;
  amount: number;
  date: string;
  message?: string;
}

interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalRaised: number;
  totalSupporters: number;
  averageDonation: number;
  completionRate: number;
}

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalRaised: 0,
    totalSupporters: 0,
    averageDonation: 0,
    completionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'campaigns' | 'donations'>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const particlesRef = useRef<HTMLDivElement>(null);

  // Sample data
  const sampleCampaigns: Campaign[] = [
    {
      id: '1',
      type: 'fundraiser',
      title: "Help Sarah Complete Her Medical School Journey",
      category: "Medical & Healthcare",
      goal: 650000,
      raised: 485000,
      supporters: 142,
      daysLeft: 28,
      status: 'active',
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      createdAt: "2024-01-15"
    },
    {
      id: '2',
      type: 'fundraiser',
      title: "Community Library Project",
      category: "Education",
      goal: 1200000,
      raised: 890000,
      supporters: 89,
      daysLeft: 45,
      status: 'active',
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      createdAt: "2024-01-10"
    },
    {
      id: '3',
      type: 'occasion',
      title: "Local Artisan Support",
      category: "Community & Social",
      goal: 800000,
      raised: 650000,
      supporters: 78,
      daysLeft: 35,
      status: 'active',
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      createdAt: "2024-01-05"
    }
  ];

  const sampleDonations: Donation[] = [
    {
      id: '1',
      campaignId: '1',
      campaignTitle: "Help Sarah Complete Her Medical School Journey",
      supporterName: "Anonymous Supporter",
      amount: 15000,
      date: "2 hours ago",
      message: "Keep going Sarah! You're almost there!"
    },
    {
      id: '2',
      campaignId: '2',
      campaignTitle: "Community Library Project",
      supporterName: "Michael Johnson",
      amount: 25000,
      date: "5 hours ago",
      message: "Education is the key to success"
    },
    {
      id: '3',
      campaignId: '1',
      campaignTitle: "Help Sarah Complete Her Medical School Journey",
      supporterName: "Sarah Williams",
      amount: 10000,
      date: "1 day ago"
    },
    {
      id: '4',
      campaignId: '3',
      campaignTitle: "Local Artisan Support",
      supporterName: "David Brown",
      amount: 50000,
      date: "2 days ago",
      message: "Supporting local businesses is important"
    }
  ];

  useEffect(() => {
    // Create floating particles
    if (particlesRef.current) {
      const container = particlesRef.current;
      const particleCount = 30;
      
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

    // Simulate loading
    const timer = setTimeout(() => {
      setCampaigns(sampleCampaigns);
      setRecentDonations(sampleDonations);
      setStats({
        totalCampaigns: sampleCampaigns.length,
        activeCampaigns: sampleCampaigns.filter(c => c.status === 'active').length,
        totalRaised: sampleCampaigns.reduce((sum, c) => sum + c.raised, 0),
        totalSupporters: sampleCampaigns.reduce((sum, c) => sum + c.supporters, 0),
        averageDonation: 25000,
        completionRate: 85
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'completed': return 'text-blue-400 bg-blue-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'rejected': return 'text-red-400 bg-red-400/10';
      default: return 'text-white/60 bg-white/5';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Dashboard
            </h1>
            <p className="text-white/80 text-base sm:text-lg">
              Welcome back! Here&apos;s an overview of your collections and supporter activity.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {[
                { id: 'overview', label: 'Overview', icon: 'fas fa-chart-line' },
                { id: 'campaigns', label: 'Collections', icon: 'fas fa-bullhorn' },
                { id: 'donations', label: 'Contributions', icon: 'fas fa-heart' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as "overview" | "campaigns" | "donations")}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
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
                  { label: 'Total Collections', value: stats.totalCampaigns, icon: 'fas fa-bullhorn', color: 'from-blue-400 to-cyan-400' },
                  { label: 'Active Collections', value: stats.activeCampaigns, icon: 'fas fa-play-circle', color: 'from-green-400 to-emerald-400' },
                  { label: 'Total Raised', value: `₦${stats.totalRaised.toLocaleString()}`, icon: 'fas fa-money-bill-wave', color: 'from-yellow-400 to-orange-400' },
                  { label: 'Total Supporters', value: stats.totalSupporters, icon: 'fas fa-users', color: 'from-purple-400 to-pink-400' },
                  { label: 'Avg. Contribution', value: `₦${stats.averageDonation.toLocaleString()}`, icon: 'fas fa-chart-bar', color: 'from-indigo-400 to-blue-400' },
                  { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: 'fas fa-percentage', color: 'from-red-400 to-pink-400' }
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

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Recent Campaigns */}
                <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-4 sm:p-6 shadow-xl">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
                    <i className="fas fa-bullhorn text-cyan-400"></i>
                    Recent Collections
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {campaigns.slice(0, 3).map((campaign) => (
                      <div key={campaign.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                        <img src={campaign.image} alt={campaign.title} className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm sm:text-base truncate">{campaign.title}</h4>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60">
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(campaign.status)}`}>
                              {getStatusText(campaign.status)}
                            </span>
                            <span>₦{campaign.raised.toLocaleString()} raised</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 sm:mt-6 text-center">
                    <Link href="/create_campaign" className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-400 to-cyan-400 text-white rounded-full text-sm sm:text-base font-medium hover:-translate-y-1 transition-all duration-300">
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
                      <div key={donation.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-red-400 to-cyan-400 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                          {donation.supporterName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium text-sm sm:text-base">{donation.supporterName}</div>
                          <div className="text-white/60 text-xs sm:text-sm truncate">{donation.campaignTitle}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-cyan-400 font-semibold text-sm sm:text-base">₦{donation.amount.toLocaleString()}</div>
                          <div className="text-white/50 text-xs">{donation.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Campaigns Tab */}
          {selectedTab === 'campaigns' && (
            <div className="space-y-6 sm:space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Your Collections</h2>
                <Link href="/create_campaign" className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-400 to-cyan-400 text-white rounded-full text-sm sm:text-base font-medium hover:-translate-y-1 transition-all duration-300">
                  <i className="fas fa-plus"></i>
                  <span className="hidden sm:inline">Create Collection</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 overflow-hidden shadow-xl">
                    <img src={campaign.image} alt={campaign.title} className="w-full h-32 sm:h-40 object-cover" />
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(campaign.status)}`}>
                          {getStatusText(campaign.status)}
                        </span>
                        <span className="text-white/60 text-xs">{campaign.daysLeft} days left</span>
                      </div>
                      <h3 className="text-white font-semibold text-base sm:text-lg mb-2 line-clamp-2">{campaign.title}</h3>
                      <p className="text-white/60 text-sm mb-4">{campaign.category}</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Goal:</span>
                          <span className="text-white font-medium">₦{campaign.goal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Raised:</span>
                          <span className="text-cyan-400 font-semibold">₦{campaign.raised.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Supporters:</span>
                          <span className="text-white font-medium">{campaign.supporters}</span>
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-6 flex gap-2">
                        <Link href={`/campaign/${campaign.id}`} className="flex-1 px-4 py-2 bg-white/10 text-white text-center rounded-lg text-sm hover:bg-white/20 transition-colors">
                          View
                        </Link>
                        <button className="px-4 py-2 bg-cyan-400/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-400/30 transition-colors">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-white/70 uppercase tracking-wider">Supporter</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-white/70 uppercase tracking-wider">Campaign</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-white/70 uppercase tracking-wider">Amount</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-white/70 uppercase tracking-wider">Date</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-white/70 uppercase tracking-wider">Message</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {recentDonations.map((donation) => (
                        <tr key={donation.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-red-400 to-cyan-400 flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                                {donation.supporterName.charAt(0)}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm sm:text-base font-medium text-white">{donation.supporterName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="text-sm sm:text-base text-white/80 max-w-xs truncate">{donation.campaignTitle}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="text-sm sm:text-base font-semibold text-cyan-400">₦{donation.amount.toLocaleString()}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="text-sm text-white/60">{donation.date}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <div className="text-sm text-white/70 max-w-xs truncate">{donation.message || '-'}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
