'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Campaign {
  id: string;
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
  donorName: string;
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
  const particlesRef = useRef<HTMLDivElement>(null);

  // Sample data
  const sampleCampaigns: Campaign[] = [
    {
      id: '1',
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
      donorName: "Anonymous Donor",
      amount: 15000,
      date: "2 hours ago",
      message: "Keep going Sarah! You're almost there!"
    },
    {
      id: '2',
      campaignId: '1',
      campaignTitle: "Help Sarah Complete Her Medical School Journey",
      donorName: "Michael Johnson",
      amount: 25000,
      date: "5 hours ago"
    },
    {
      id: '3',
      campaignId: '2',
      campaignTitle: "Community Library Project",
      donorName: "Sarah Williams",
      amount: 10000,
      date: "1 day ago",
      message: "Education is the key to success!"
    },
    {
      id: '4',
      campaignId: '3',
      campaignTitle: "Local Artisan Support",
      donorName: "David Brown",
      amount: 50000,
      date: "2 days ago"
    }
  ];

  // Create floating particles
  useEffect(() => {
    if (particlesRef.current) {
      const container = particlesRef.current;
      const particleCount = 20;
      
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
  }, []);

  // Load data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCampaigns(sampleCampaigns);
      setRecentDonations(sampleDonations);
      
      // Calculate stats
      const totalRaised = sampleCampaigns.reduce((sum, campaign) => sum + campaign.raised, 0);
      const totalSupporters = sampleCampaigns.reduce((sum, campaign) => sum + campaign.supporters, 0);
      const activeCampaigns = sampleCampaigns.filter(campaign => campaign.status === 'active').length;
      const averageDonation = totalSupporters > 0 ? totalRaised / totalSupporters : 0;
      const completionRate = sampleCampaigns.length > 0 ? (activeCampaigns / sampleCampaigns.length) * 100 : 0;

      setStats({
        totalCampaigns: sampleCampaigns.length,
        activeCampaigns,
        totalRaised,
        totalSupporters,
        averageDonation,
        completionRate
      });
      
      setIsLoading(false);
    }, 1000);
  }, []);

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
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

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-particles" ref={particlesRef}></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full px-8 py-4 bg-white/10 backdrop-blur-md border-b border-white/20 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-transparent bg-gradient-to-r from-red-400 to-cyan-400 bg-clip-text">
            DonateFlow
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/explore" className="text-white/90 no-underline font-medium px-6 py-2 rounded-full transition-all duration-300 border border-white/30 backdrop-blur-md hover:bg-white/10 hover:-translate-y-0.5">
              Explore
            </Link>
            <Link href="/create_campaign" className="text-white/90 no-underline font-medium px-6 py-2 rounded-full transition-all duration-300 border border-white/30 backdrop-blur-md hover:bg-white/10 hover:-translate-y-0.5">
              Create Campaign
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-16 px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-white/70">Track your campaigns and monitor your fundraising progress</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8">
            {[
              { id: 'overview', label: 'Overview', icon: 'fas fa-chart-line' },
              { id: 'campaigns', label: 'My Campaigns', icon: 'fas fa-bullhorn' },
              { id: 'donations', label: 'Donations', icon: 'fas fa-heart' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedTab === tab.id
                    ? 'bg-cyan-400 text-white shadow-lg shadow-cyan-400/30'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <i className={tab.icon}></i>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-6 text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">{stats.totalCampaigns}</div>
                  <div className="text-white/70 text-sm">Total Campaigns</div>
                </div>
                <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-6 text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{stats.activeCampaigns}</div>
                  <div className="text-white/70 text-sm">Active Campaigns</div>
                </div>
                <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-6 text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">{formatCurrency(stats.totalRaised)}</div>
                  <div className="text-white/70 text-sm">Total Raised</div>
                </div>
                <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-6 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">{stats.totalSupporters}</div>
                  <div className="text-white/70 text-sm">Total Supporters</div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Average Donation</span>
                      <span className="text-white font-semibold">{formatCurrency(Math.round(stats.averageDonation))}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Completion Rate</span>
                      <span className="text-white font-semibold">{stats.completionRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link href="/create_campaign" className="block w-full px-4 py-3 bg-gradient-to-r from-red-400 to-cyan-400 text-white text-center rounded-xl font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-400/30">
                      <i className="fas fa-plus mr-2"></i>
                      Create New Campaign
                    </Link>
                    <button className="w-full px-4 py-3 bg-white/10 text-white text-center rounded-xl font-medium border border-white/30 transition-all duration-300 hover:bg-white/20">
                      <i className="fas fa-download mr-2"></i>
                      Export Report
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentDonations.slice(0, 5).map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-400 to-cyan-400 flex items-center justify-center text-white font-semibold text-sm">
                          {donation.donorName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-medium">{donation.donorName}</div>
                          <div className="text-white/60 text-sm">{donation.campaignTitle}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-cyan-400 font-semibold">{formatCurrency(donation.amount)}</div>
                        <div className="text-white/60 text-sm">{donation.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Campaigns Tab */}
          {selectedTab === 'campaigns' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">My Campaigns</h2>
                <Link href="/create_campaign" className="px-6 py-3 bg-gradient-to-r from-red-400 to-cyan-400 text-white rounded-xl font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-400/30">
                  <i className="fas fa-plus mr-2"></i>
                  New Campaign
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={campaign.image}
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(campaign.status)}`}>
                          {getStatusText(campaign.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3">{campaign.title}</h3>
                      <div className="flex items-center gap-2 mb-4 text-sm text-white/60">
                        <i className="fas fa-tag text-cyan-400"></i>
                        <span>{campaign.category}</span>
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/70">Progress</span>
                          <span className="text-cyan-400 font-semibold">
                            {getProgressPercentage(campaign.raised, campaign.goal).toFixed(1)}%
                          </span>
                        </div>
                        <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-red-400 to-cyan-400 rounded-full transition-all duration-1000"
                            style={{ width: `${getProgressPercentage(campaign.raised, campaign.goal)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 text-center mb-4">
                        <div>
                          <div className="text-lg font-bold text-cyan-400">{formatCurrency(campaign.raised)}</div>
                          <div className="text-xs text-white/60">Raised</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">{campaign.supporters}</div>
                          <div className="text-xs text-white/60">Supporters</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">{campaign.daysLeft}</div>
                          <div className="text-xs text-white/60">Days Left</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Link href={`/campaign/${campaign.id}`} className="flex-1 px-4 py-2 bg-white/10 text-white text-center rounded-xl font-medium border border-white/30 transition-all duration-300 hover:bg-white/20">
                          View
                        </Link>
                        <button className="flex-1 px-4 py-2 bg-white/10 text-white text-center rounded-xl font-medium border border-white/30 transition-all duration-300 hover:bg-white/20">
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
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Recent Donations</h2>
              
              <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-4 text-left text-white/70 font-medium">Donor</th>
                        <th className="px-6 py-4 text-left text-white/70 font-medium">Campaign</th>
                        <th className="px-6 py-4 text-left text-white/70 font-medium">Amount</th>
                        <th className="px-6 py-4 text-left text-white/70 font-medium">Date</th>
                        <th className="px-6 py-4 text-left text-white/70 font-medium">Message</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {recentDonations.map((donation) => (
                        <tr key={donation.id} className="hover:bg-white/5 transition-colors duration-200">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-400 to-cyan-400 flex items-center justify-center text-white font-semibold text-sm">
                                {donation.donorName.charAt(0)}
                              </div>
                              <span className="text-white font-medium">{donation.donorName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-white/80">{donation.campaignTitle}</td>
                          <td className="px-6 py-4 text-cyan-400 font-semibold">{formatCurrency(donation.amount)}</td>
                          <td className="px-6 py-4 text-white/60">{donation.date}</td>
                          <td className="px-6 py-4 text-white/60 max-w-xs truncate">
                            {donation.message || 'No message'}
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
