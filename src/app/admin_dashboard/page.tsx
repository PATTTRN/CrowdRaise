'use client';

import { useState, useEffect, useRef } from 'react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const particlesRef = useRef<HTMLDivElement>(null);

  // Sample data
  const sampleCampaigns: Campaign[] = [
    {
      id: '1',
      type: 'fundraiser',
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
      type: 'fundraiser',
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
      type: 'fundraiser',
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
      type: 'tips',
      title: "Startup Funding for Tech Innovation",
      category: "Personal Tips",
      creator: "TechVision Labs",
      creatorEmail: "contact@techvisionlabs.com",
      location: "Abuja, Nigeria",
      goal: 5000000,
      description: "Revolutionary AI-powered healthcare platform to improve medical diagnosis in Africa.",
      status: 'rejected',
      submittedAt: "2024-01-17",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      reason: "Insufficient documentation and unclear business model"
    },
    {
      id: '5',
      type: 'occasion',
      title: "Local Artisan Support",
      category: "Occasion Gifts",
      creator: "Artisan Empowerment Network",
      creatorEmail: "info@artisanempowerment.org",
      location: "Ibadan, Nigeria",
      goal: 800000,
      description: "Help local artisans preserve traditional crafts and create sustainable livelihoods.",
      status: 'approved',
      submittedAt: "2024-01-16",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
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
      setFilteredCampaigns(sampleCampaigns);
      setStats({
        totalCampaigns: sampleCampaigns.length,
        pendingCampaigns: sampleCampaigns.filter(c => c.status === 'pending').length,
        approvedCampaigns: sampleCampaigns.filter(c => c.status === 'approved').length,
        rejectedCampaigns: sampleCampaigns.filter(c => c.status === 'rejected').length,
        totalRaised: 8500000,
        totalUsers: 1250,
        activeUsers: 890,
        platformFee: 170000
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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

  const handleApprove = (campaignId: string) => {
    setCampaigns(prev => prev.map(c => 
      c.id === campaignId ? { ...c, status: 'approved' as const } : c
    ));
  };

  const handleReject = (campaignId: string, reason: string) => {
    setCampaigns(prev => prev.map(c => 
      c.id === campaignId ? { ...c, status: 'rejected' as const, reason } : c
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'approved': return 'text-green-400 bg-green-400/10';
      case 'rejected': return 'text-red-400 bg-red-400/10';
      default: return 'text-white/60 bg-white/5';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'approved': return 'Approved';
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
            <p className="text-white text-lg">Loading admin dashboard...</p>
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
                { id: 'pending', label: 'Pending Review', icon: 'fas fa-clock', count: stats.pendingCampaigns },
                { id: 'approved', label: 'Approved', icon: 'fas fa-check-circle', count: stats.approvedCampaigns },
                { id: 'rejected', label: 'Rejected', icon: 'fas fa-times-circle', count: stats.rejectedCampaigns }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as "overview" | "pending" | "approved" | "rejected")}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                    selectedTab === tab.id
                      ? 'bg-gradient-to-r from-red-400 to-cyan-400 text-white shadow-lg'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <i className={tab.icon}></i>
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.count !== undefined && (
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
                  { label: 'Total Collections', value: stats.totalCampaigns, icon: 'fas fa-bullhorn', color: 'from-blue-400 to-cyan-400' },
                  { label: 'Pending Review', value: stats.pendingCampaigns, icon: 'fas fa-clock', color: 'from-yellow-400 to-orange-400' },
                  { label: 'Total Raised', value: `₦${stats.totalRaised.toLocaleString()}`, icon: 'fas fa-money-bill-wave', color: 'from-green-400 to-emerald-400' },
                  { label: 'Platform Fee', value: `₦${stats.platformFee.toLocaleString()}`, icon: 'fas fa-percentage', color: 'from-purple-400 to-pink-400' }
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
                    <i className="fas fa-users text-cyan-400"></i>
                    User Statistics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                      <span className="text-white/70">Total Users</span>
                      <span className="text-white font-semibold">{stats.totalUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                      <span className="text-white/70">Active Users</span>
                      <span className="text-white font-semibold">{stats.activeUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                      <span className="text-white/70">Engagement Rate</span>
                      <span className="text-cyan-400 font-semibold">
                        {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-4 sm:p-6 shadow-xl">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
                    <i className="fas fa-chart-pie text-cyan-400"></i>
                    Collection Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-yellow-400/10 rounded-xl border border-yellow-400/20">
                      <span className="text-yellow-400">Pending</span>
                      <span className="text-yellow-400 font-semibold">{stats.pendingCampaigns}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-400/10 rounded-xl border border-green-400/20">
                      <span className="text-green-400">Approved</span>
                      <span className="text-green-400 font-semibold">{stats.approvedCampaigns}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-400/10 rounded-xl border border-red-400/20">
                      <span className="text-red-400">Rejected</span>
                      <span className="text-red-400 font-semibold">{stats.rejectedCampaigns}</span>
                    </div>
                  </div>
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
                {filteredCampaigns
                  .filter(campaign => selectedTab === 'overview' || campaign.status === selectedTab)
                  .map((campaign) => (
                    <div key={campaign.id} className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 p-4 sm:p-6 shadow-xl">
                      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                        {/* Campaign Image */}
                        <div className="flex-shrink-0">
                          <img 
                            src={campaign.image} 
                            alt={campaign.title} 
                            className="w-full lg:w-48 h-32 lg:h-32 rounded-xl object-cover"
                          />
                        </div>

                        {/* Campaign Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                            <div className="flex-1">
                              <h3 className="text-white font-bold text-lg sm:text-xl mb-2 line-clamp-2">
                                {campaign.title}
                              </h3>
                              <div className="flex flex-wrap gap-2 mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                                  {getStatusText(campaign.status)}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/70">
                                  {campaign.category}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-400/15 text-cyan-300 capitalize">
                                  {campaign.type}
                                </span>
                              </div>
                            </div>
                            <div className="text-right text-sm text-white/60">
                              Submitted: {new Date(campaign.submittedAt).toLocaleDateString()}
                            </div>
                          </div>

                          <p className="text-white/70 text-sm sm:text-base mb-4 line-clamp-2">
                            {campaign.description}
                          </p>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-sm mb-4">
                            <div>
                              <div className="text-white/60">Creator</div>
                              <div className="text-white font-medium">{campaign.creator}</div>
                            </div>
                            <div>
                              <div className="text-white/60">Email</div>
                              <div className="text-white font-medium truncate">{campaign.creatorEmail}</div>
                            </div>
                            <div>
                              <div className="text-white/60">Location</div>
                              <div className="text-white font-medium">{campaign.location}</div>
                            </div>
                            <div>
                              <div className="text-white/60">Goal</div>
                              <div className="text-white font-medium">₦{campaign.goal.toLocaleString()}</div>
                            </div>
                          </div>

                          {/* Rejection Reason */}
                          {campaign.status === 'rejected' && campaign.reason && (
                            <div className="mb-4 p-3 bg-red-400/10 border border-red-400/20 rounded-lg">
                              <div className="text-red-400 font-medium text-sm mb-1">Rejection Reason:</div>
                              <div className="text-red-400/80 text-sm">{campaign.reason}</div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          {campaign.status === 'pending' && (
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                              <button
                                onClick={() => handleApprove(campaign.id)}
                                className="px-4 sm:px-6 py-2 sm:py-3 bg-green-500/20 text-green-400 rounded-lg font-medium border border-green-400/30 hover:bg-green-500/30 transition-colors"
                              >
                                <i className="fas fa-check mr-2"></i>
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(campaign.id, 'Insufficient documentation')}
                                className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500/20 text-red-400 rounded-lg font-medium border border-red-400/30 hover:bg-red-500/30 transition-colors"
                              >
                                <i className="fas fa-times mr-2"></i>
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Empty State */}
              {filteredCampaigns.filter(c => selectedTab === 'overview' || c.status === selectedTab).length === 0 && (
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
