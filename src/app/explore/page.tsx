'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Campaign {
  id: string;
  title: string;
  category: string;
  creator: string;
  location: string;
  goal: number;
  raised: number;
  supporters: number;
  daysLeft: number;
  image: string;
  description: string;
  status: 'active' | 'completed' | 'pending';
}

export default function ExplorePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'ending' | 'goal'>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const particlesRef = useRef<HTMLDivElement>(null);

  // Sample campaign data
  const sampleCampaigns: Campaign[] = [
    {
      id: '1',
      title: "Help Sarah Complete Her Medical School Journey",
      category: "Medical & Healthcare",
      creator: "Sarah Johnson",
      location: "Lagos, Nigeria",
      goal: 650000,
      raised: 485000,
      supporters: 142,
      daysLeft: 28,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Support Sarah's final year of medical school to become a doctor and serve her community.",
      status: 'active'
    },
    {
      id: '2',
      title: "Build a Community Library for Rural Children",
      category: "Education",
      creator: "Community Development Initiative",
      location: "Kano, Nigeria",
      goal: 1200000,
      raised: 890000,
      supporters: 89,
      daysLeft: 45,
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Help us build a library to provide educational resources for children in rural communities.",
      status: 'active'
    },
    {
      id: '3',
      title: "Emergency Relief for Flood Victims",
      category: "Emergency & Crisis",
      creator: "Disaster Relief Foundation",
      location: "Port Harcourt, Nigeria",
      goal: 2500000,
      raised: 1800000,
      supporters: 234,
      daysLeft: 12,
      image: "https://images.unsplash.com/photo-1574263867127-a8bdc5c3e3e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Urgent support needed for families affected by recent flooding in the region.",
      status: 'active'
    },
    {
      id: '4',
      title: "Startup Funding for Tech Innovation",
      category: "Business & Startup",
      creator: "TechVision Labs",
      location: "Abuja, Nigeria",
      goal: 5000000,
      raised: 3200000,
      supporters: 156,
      daysLeft: 60,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Revolutionary AI-powered healthcare platform to improve medical diagnosis in Africa.",
      status: 'active'
    },
    {
      id: '5',
      title: "Support Local Artisan Cooperative",
      category: "Community & Social",
      creator: "Artisan Empowerment Network",
      location: "Ibadan, Nigeria",
      goal: 800000,
      raised: 650000,
      supporters: 78,
      daysLeft: 35,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Help local artisans preserve traditional crafts and create sustainable livelihoods.",
      status: 'active'
    },
    {
      id: '6',
      title: "Clean Water Project for Rural Village",
      category: "Charity & Nonprofit",
      creator: "Water for Life Foundation",
      location: "Kaduna, Nigeria",
      goal: 1800000,
      raised: 1450000,
      supporters: 203,
      daysLeft: 22,
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Provide clean drinking water to 500 families in rural communities.",
      status: 'active'
    }
  ];

  const categories = [
    "All Categories",
    "Medical & Healthcare",
    "Education",
    "Emergency & Crisis",
    "Community & Social",
    "Charity & Nonprofit",
    "Business & Startup"
  ];

  // Create floating particles
  useEffect(() => {
    if (particlesRef.current) {
      const container = particlesRef.current;
      const particleCount = 25;
      
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

  // Load campaigns
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCampaigns(sampleCampaigns);
      setFilteredCampaigns(sampleCampaigns);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter and sort campaigns
  useEffect(() => {
    let filtered = campaigns;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.creator.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All Categories') {
      filtered = filtered.filter(campaign => campaign.category === selectedCategory);
    }

    // Sort campaigns
    switch (sortBy) {
      case 'newest':
        filtered = [...filtered].sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'popular':
        filtered = [...filtered].sort((a, b) => b.supporters - a.supporters);
        break;
      case 'ending':
        filtered = [...filtered].sort((a, b) => a.daysLeft - b.daysLeft);
        break;
      case 'goal':
        filtered = [...filtered].sort((a, b) => b.goal - a.goal);
        break;
    }

    setFilteredCampaigns(filtered);
  }, [campaigns, searchTerm, selectedCategory, sortBy]);

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading campaigns...</p>
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
            <Link href="/create_campaign" className="text-white/90 no-underline font-medium px-6 py-2 rounded-full transition-all duration-300 border border-white/30 backdrop-blur-md hover:bg-white/10 hover:-translate-y-0.5">
              Create Campaign
            </Link>
            <Link href="/dashboard" className="text-white/90 no-underline font-medium px-6 py-2 rounded-full transition-all duration-300 border border-white/30 backdrop-blur-md hover:bg-white/10 hover:-translate-y-0.5">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-16 px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">
              Explore <span className="text-transparent bg-gradient-to-r from-red-400 to-cyan-400 bg-clip-text">Campaigns</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              Discover amazing causes and support campaigns that matter to you. Every donation makes a difference.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20 p-8 mb-12 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Search */}
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

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-6 py-4 rounded-xl border-2 border-white/20 bg-white/10 text-white text-base backdrop-blur-md transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-6 py-4 rounded-xl border-2 border-white/20 bg-white/10 text-white text-base backdrop-blur-md transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="ending">Ending Soon</option>
                  <option value="goal">Highest Goal</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-6 text-center">
              <p className="text-white/70">
                Showing <span className="text-cyan-400 font-semibold">{filteredCampaigns.length}</span> of{' '}
                <span className="text-cyan-400 font-semibold">{campaigns.length}</span> campaigns
              </p>
            </div>
          </div>

          {/* Campaigns Grid */}
          {filteredCampaigns.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-white mb-2">No campaigns found</h3>
              <p className="text-white/70">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCampaigns.map((campaign) => (
                <Link
                  key={campaign.id}
                  href={`/campaign/${campaign.id}`}
                  className="group block"
                >
                  <div className="bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20 overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-cyan-400/20 hover:-translate-y-2 group-hover:border-cyan-400/50">
                    
                    {/* Campaign Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={campaign.image}
                        alt={campaign.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(campaign.status)}`}>
                          {getStatusText(campaign.status)}
                        </span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium text-white bg-black/50 backdrop-blur-md">
                          {campaign.category}
                        </span>
                      </div>
                    </div>

                    {/* Campaign Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300">
                        {campaign.title}
                      </h3>
                      
                      <p className="text-white/70 text-sm mb-4 line-clamp-2">
                        {campaign.description}
                      </p>

                      {/* Creator Info */}
                      <div className="flex items-center gap-2 mb-4 text-sm text-white/60">
                        <i className="fas fa-user text-cyan-400"></i>
                        <span>{campaign.creator}</span>
                        <span className="mx-2">•</span>
                        <i className="fas fa-map-marker-alt text-cyan-400"></i>
                        <span>{campaign.location}</span>
                      </div>

                      {/* Progress Bar */}
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

                      {/* Campaign Stats */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-cyan-400">₦{campaign.raised.toLocaleString()}</div>
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

                      {/* Goal */}
                      <div className="mt-4 text-center">
                        <div className="text-sm text-white/60">Goal: ₦{campaign.goal.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {filteredCampaigns.length > 0 && (
            <div className="text-center mt-12">
              <button className="px-8 py-4 bg-white/10 text-white font-semibold rounded-full border-2 border-white/30 backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:-translate-y-1">
                <i className="fas fa-plus mr-2"></i>
                Load More Campaigns
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
