'use client';

import { useState, useEffect, useRef } from 'react';

interface Campaign {
  id: string;
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

interface PlatformStats {
  totalCampaigns: number;
  pendingCampaigns: number;
  approvedCampaigns: number;
  rejectedCampaigns: number;
  totalRaised: number;
  totalUsers: number;
  activeUsers: number;
  platformFee: number;
}

export default function AdminDashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<PlatformStats>({
    totalCampaigns: 0,
    pendingCampaigns: 0,
    approvedCampaigns: 0,
    rejectedCampaigns: 0,
    totalRaised: 0,
    totalUsers: 0,
    activeUsers: 0,
    platformFee: 0
  });
  const [selectedTab, setSelectedTab] = useState<'overview' | 'pending' | 'approved' | 'rejected'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const particlesRef = useRef<HTMLDivElement>(null);

  // Sample data
  const sampleCampaigns: Campaign[] = [
    {
      id: '1',
      title: "Help Sarah Complete Her Medical School Journey",
      category: "Medical & Healthcare",
      creator: "Sarah Johnson",
      creatorEmail: "sarah.johnson@email.com",
      location: "Lagos, Nigeria",
      goal: 650000,
      description: "Support Sarah's final year of medical school to become a doctor and serve her community.",
      status: 'pending',
      submittedAt: "2024-01-20",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: '2',
      title: "Community Library Project",
      category: "Education",
      creator: "Community Development Initiative",
      creatorEmail: "info@communitydev.org",
      location: "Kano, Nigeria",
      goal: 1200000,
      description: "Help us build a library to provide educational resources for children in rural communities.",
      status: 'pending',
      submittedAt: "2024-01-19",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: '3',
      title: "Emergency Relief for Flood Victims",
      category: "Emergency & Crisis",
      creator: "Disaster Relief Foundation",
      creatorEmail: "help@disasterrelief.org",
      location: "Port Harcourt, Nigeria",
      goal: 2500000,
      description: "Urgent support needed for families affected by recent flooding in the region.",
      status: 'approved',
      submittedAt: "2024-01-18",
      image: "https://images.unsplash.com/photo-1574263867127-a8bdc5c3e3e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: '4',
      title: "Startup Funding for Tech Innovation",
      category: "Business & Startup",
      creator: "TechVision Labs",
      creatorEmail: "contact@techvisionlabs.com",
      location: "Abuja, Nigeria",
      goal: 5000000,
      description: "Revolutionary AI-powered healthcare platform to improve medical diagnosis in Africa.",
      status: 'rejected',
      submittedAt: "2024-01-17",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      reason: "Business campaigns are not currently supported on this platform."
    },
    {
      id: '5',
      title: "Support Local Artisan Cooperative",
      category: "Community & Social",
      creator: "Artisan Empowerment Network",
      creatorEmail: "hello@artisanempowerment.org",
      location: "Ibadan, Nigeria",
      goal: 800000,
      description: "Help local artisans preserve traditional crafts and create sustainable livelihoods.",
      status: 'approved',
      submittedAt: "2024-01-16",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: '6',
      title: "Clean Water Project for Rural Village",
      category: "Charity & Nonprofit",
      creator: "Water for Life Foundation",
      creatorEmail: "info@waterforlife.org",
      location: "Kaduna, Nigeria",
      goal: 1800000,
      description: "Provide clean drinking water to 500 families in rural communities.",
      status: 'pending',
      submittedAt: "2024-01-15",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  // Create floating particles
  useEffect(() => {
    if (particlesRef.current) {
      const container = particlesRef.current;
      const particleCount = 15;
      
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
      setFilteredCampaigns(sampleCampaigns);
      
      // Calculate stats
      const pendingCampaigns = sampleCampaigns.filter(campaign => campaign.status === 'pending').length;
      const approvedCampaigns = sampleCampaigns.filter(campaign => campaign.status === 'approved').length;
      const rejectedCampaigns = sampleCampaigns.filter(campaign => campaign.status === 'rejected').length;
      const totalRaised = 3200000; // Sample data
      const totalUsers = 1250;
      const activeUsers = 890;
      const platformFee = totalRaised * 0.05; // 5% platform fee

      setStats({
        totalCampaigns: sampleCampaigns.length,
        pendingCampaigns,
        approvedCampaigns,
        rejectedCampaigns,
        totalRaised,
        totalUsers,
        activeUsers,
        platformFee
      });
      
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter campaigns
  useEffect(() => {
    let filtered = campaigns;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus && selectedStatus !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === selectedStatus);
    }

    setFilteredCampaigns(filtered);
  }, [campaigns, searchTerm, selectedStatus]);

  // Handle campaign approval/rejection
  const handleCampaignAction = (campaignId: string, action: 'approve' | 'reject', reason?: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: action === 'approve' ? 'approved' : 'rejected', reason }
        : campaign
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'approved': return 'Approved';
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
          <p className="text-white text-lg">Loading admin dashboard...</p>
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
          <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-red-400 to-cyan-400 bg-clip-text">
            DonateFlow Admin
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-white/70 text-sm">Admin Panel</span>
            <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-all duration-300">
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-16 px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-white/70">Manage campaigns, monitor platform performance, and ensure quality control</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8">
            {[
              { id: 'overview', label: 'Overview', icon: 'fas fa-chart-line' },
              { id: 'pending', label: 'Pending Review', icon: 'fas fa-clock', count: stats.pendingCampaigns },
              { id: 'approved', label: 'Approved', icon: 'fas fa-check-circle', count: stats.approvedCampaigns },
              { id: 'rejected', label: 'Rejected', icon: 'fas fa-times-circle', count: stats.rejectedCampaigns }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 relative ${
                  selectedTab === tab.id
                    ? 'bg-cyan-400 text-white shadow-lg shadow-cyan-400/30'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <i className={tab.icon}></i>
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-8">
              {/* Platform Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-6 text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">{stats.totalCampaigns}</div>
                  <div className="text-white/70 text-sm">Total Campaigns</div>
                </div>
                <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-6 text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{stats.totalUsers}</div>
                  <div className="text-white/70 text-sm">Total Users</div>
                </div>
                <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-6 text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">{formatCurrency(stats.totalRaised)}</div>
                  <div className="text-white/70 text-sm">Total Raised</div>
                </div>
                <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-6 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">{formatCurrency(stats.platformFee)}</div>
                  <div className="text-white/70 text-sm">Platform Fees</div>
                </div>
              </div>

              {/* Campaign Status Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <i className="fas fa-clock text-yellow-400"></i>
                    Pending Review
                  </h3>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.pendingCampaigns}</div>
                  <div className="text-white/70 text-sm">Campaigns awaiting approval</div>
                </div>
                <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-400"></i>
                    Approved
                  </h3>
                  <div className="text-3xl font-bold text-green-400 mb-2">{stats.approvedCampaigns}</div>
                  <div className="text-white/70 text-sm">Live campaigns</div>
                </div>
                <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <i className="fas fa-times-circle text-red-400"></i>
                    Rejected
                  </h3>
                  <div className="text-3xl font-bold text-red-400 mb-2">{stats.rejectedCampaigns}</div>
                  <div className="text-white/70 text-sm">Rejected campaigns</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="px-6 py-4 bg-yellow-500/20 text-yellow-400 rounded-xl border border-yellow-500/30 hover:bg-yellow-500/30 transition-all duration-300">
                    <i className="fas fa-clock mr-2"></i>
                    Review Pending Campaigns
                  </button>
                  <button className="px-6 py-4 bg-green-500/20 text-green-400 rounded-xl border border-green-500/30 hover:bg-green-500/30 transition-all duration-300">
                    <i className="fas fa-download mr-2"></i>
                    Export Platform Report
                  </button>
                  <button className="px-6 py-4 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-300">
                    <i className="fas fa-cog mr-2"></i>
                    Platform Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Campaign Management Tabs */}
          {['pending', 'approved', 'rejected'].includes(selectedTab) && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search campaigns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-6 py-4 pl-12 rounded-xl border-2 border-white/20 bg-white/10 text-white text-base backdrop-blur-md transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 placeholder:text-white/60"
                    />
                    <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60"></i>
                  </div>
                  <div>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl border-2 border-white/20 bg-white/10 text-white text-base backdrop-blur-md transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Campaigns List */}
              <div className="space-y-4">
                {filteredCampaigns
                  .filter(campaign => selectedTab === 'all' || campaign.status === selectedTab)
                  .map((campaign) => (
                    <div key={campaign.id} className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Campaign Image */}
                        <div className="lg:w-48 lg:h-32 w-full h-48">
                          <img
                            src={campaign.image}
                            alt={campaign.title}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        </div>

                        {/* Campaign Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-white mb-2">{campaign.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-white/60 mb-2">
                                <span><i className="fas fa-user text-cyan-400 mr-2"></i>{campaign.creator}</span>
                                <span><i className="fas fa-tag text-cyan-400 mr-2"></i>{campaign.category}</span>
                                <span><i className="fas fa-map-marker-alt text-cyan-400 mr-2"></i>{campaign.location}</span>
                              </div>
                              <p className="text-white/80 text-sm line-clamp-2">{campaign.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(campaign.status)}`}>
                                {getStatusText(campaign.status)}
                              </span>
                            </div>
                          </div>

                          {/* Campaign Info */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <div className="text-sm text-white/60">Goal</div>
                              <div className="text-white font-semibold">{formatCurrency(campaign.goal)}</div>
                            </div>
                            <div>
                              <div className="text-sm text-white/60">Submitted</div>
                              <div className="text-white font-semibold">{campaign.submittedAt}</div>
                            </div>
                            <div>
                              <div className="text-sm text-white/60">Creator Email</div>
                              <div className="text-white font-semibold text-sm">{campaign.creatorEmail}</div>
                            </div>
                            <div>
                              <div className="text-sm text-white/60">ID</div>
                              <div className="text-white font-semibold text-sm">#{campaign.id}</div>
                            </div>
                          </div>

                          {/* Actions */}
                          {campaign.status === 'pending' && (
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleCampaignAction(campaign.id, 'approve')}
                                className="px-6 py-3 bg-green-500/20 text-green-400 rounded-xl border border-green-500/30 hover:bg-green-500/30 transition-all duration-300"
                              >
                                <i className="fas fa-check mr-2"></i>
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt('Please provide a reason for rejection:');
                                  if (reason) {
                                    handleCampaignAction(campaign.id, 'reject', reason);
                                  }
                                }}
                                className="px-6 py-3 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 hover:bg-red-500/30 transition-all duration-300"
                              >
                                <i className="fas fa-times mr-2"></i>
                                Reject
                              </button>
                              <button className="px-6 py-3 bg-white/10 text-white rounded-xl border border-white/30 hover:bg-white/20 transition-all duration-300">
                                <i className="fas fa-eye mr-2"></i>
                                View Details
                              </button>
                            </div>
                          )}

                          {campaign.status === 'rejected' && campaign.reason && (
                            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                              <div className="text-sm text-red-400 font-medium mb-1">Rejection Reason:</div>
                              <div className="text-white/80 text-sm">{campaign.reason}</div>
                            </div>
                          )}

                          {campaign.status === 'approved' && (
                            <div className="flex gap-3">
                              <button className="px-6 py-3 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-300">
                                <i className="fas fa-eye mr-2"></i>
                                View Campaign
                              </button>
                              <button className="px-6 py-3 bg-yellow-500/20 text-yellow-400 rounded-xl border border-yellow-500/30 hover:bg-yellow-500/30 transition-all duration-300">
                                <i className="fas fa-pause mr-2"></i>
                                Suspend
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* No Results */}
              {filteredCampaigns.filter(campaign => selectedTab === 'all' || campaign.status === selectedTab).length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-2xl font-semibold text-white mb-2">No campaigns found</h3>
                  <p className="text-white/70">No campaigns match your current filters</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
