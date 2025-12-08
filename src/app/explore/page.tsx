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
  createdAt?: string;
}

export default function ExplorePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'ending' | 'goal'>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      title: "Clean Water Initiative for Rural Villages",
      category: "Community & Social",
      creator: "Water for Life Foundation",
      location: "Kaduna, Nigeria",
      goal: 3000000,
      raised: 2100000,
      supporters: 189,
      daysLeft: 22,
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Providing clean drinking water to 10 rural villages through sustainable water systems.",
      status: 'active'
    }
  ];

  const categories = [
    "All Categories",
    "Medical & Healthcare",
    "Education",
    "Emergency & Crisis",
    "Business & Startup",
    "Community & Social",
    "Animal Welfare",
    "Arts & Culture"
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
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All Categories') {
      filtered = filtered.filter(campaign => campaign.category === selectedCategory);
    }

    // Sort campaigns
    switch (sortBy) {
      case 'newest':
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt || '2024-01-01').getTime() - new Date(a.createdAt || '2024-01-01').getTime());
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
            <p className="text-white text-lg">Discovering amazing campaigns...</p>
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
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Discover Amazing Campaigns
            </h1>
            <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
              Explore and support meaningful causes that are making a difference in communities across Nigeria.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 sm:mb-12 space-y-4 sm:space-y-6">
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search campaigns, creators, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 pl-12 sm:pl-14 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder:text-white/50 backdrop-blur-md transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20"
              />
              <i className="fas fa-search absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-white/50 text-lg sm:text-xl"></i>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-white/10 border-2 border-white/20 rounded-full text-white text-sm sm:text-base backdrop-blur-md transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20"
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-gray-800 text-white">
                    {category}
                  </option>
                ))}
              </select>

              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "popular" | "ending" | "goal")}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-white/10 border-2 border-white/20 rounded-full text-white text-sm sm:text-base backdrop-blur-md transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20"
              >
                <option value="newest" className="bg-gray-800 text-white">Newest First</option>
                <option value="popular" className="bg-gray-800 text-white">Most Popular</option>
                <option value="ending" className="bg-gray-800 text-white">Ending Soon</option>
                <option value="goal" className="bg-gray-800 text-white">Highest Goal</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 sm:mb-8">
            <p className="text-white/70 text-sm sm:text-base text-center">
              Showing {filteredCampaigns.length} of {campaigns.length} campaigns
            </p>
          </div>

          {/* Campaigns Grid */}
          {filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredCampaigns.map((campaign) => (
                <div key={campaign.id} className="bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <img src={campaign.image} alt={campaign.title} className="w-full h-48 sm:h-56 object-cover" />
                  
                  <div className="p-4 sm:p-6">
                    {/* Category Badge */}
                    <div className="inline-block bg-gradient-to-r from-red-400 to-cyan-400 text-white px-3 py-1 rounded-full text-xs font-medium mb-3">
                      {campaign.category}
                    </div>

                    {/* Title */}
                    <h3 className="text-white font-bold text-lg sm:text-xl mb-2 line-clamp-2 leading-tight">
                      {campaign.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/70 text-sm sm:text-base mb-4 line-clamp-2 leading-relaxed">
                      {campaign.description}
                    </p>

                    {/* Creator and Location */}
                    <div className="flex items-center gap-2 text-white/60 text-xs sm:text-sm mb-4">
                      <i className="fas fa-user text-cyan-400"></i>
                      <span>{campaign.creator}</span>
                      <span className="mx-2">•</span>
                      <i className="fas fa-map-marker-alt text-cyan-400"></i>
                      <span>{campaign.location}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs sm:text-sm mb-2">
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
                    <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                      <div>
                        <div className="text-lg sm:text-xl font-bold text-cyan-400">₦{campaign.raised.toLocaleString()}</div>
                        <div className="text-xs text-white/60">Raised</div>
                      </div>
                      <div>
                        <div className="text-lg sm:text-xl font-bold text-white">{campaign.supporters}</div>
                        <div className="text-xs text-white/60">Supporters</div>
                      </div>
                      <div>
                        <div className="text-lg sm:text-xl font-bold text-white">{campaign.daysLeft}</div>
                        <div className="text-xs text-white/60">Days Left</div>
                      </div>
                    </div>

                    {/* Goal */}
                    <div className="text-center mb-4">
                      <div className="text-white/70 text-xs sm:text-sm">Goal: ₦{campaign.goal.toLocaleString()}</div>
                    </div>

                    {/* Action Button */}
                    <Link 
                      href={`/campaign/${campaign.id}`}
                      className="block w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-red-400 to-cyan-400 text-white text-center rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-400/30"
                    >
                      Support This Cause
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <i className="fas fa-search text-6xl text-white/30 mb-6"></i>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">No campaigns found</h3>
              <p className="text-white/70 text-base sm:text-lg mb-6">
                Try adjusting your search terms or filters to find what you&apos;re looking for.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSortBy('newest');
                }}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-400 to-cyan-400 text-white rounded-full font-semibold text-base sm:text-lg hover:-translate-y-1 transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Create Campaign CTA */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20 p-8 sm:p-12 shadow-2xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                Have a Cause to Support?
              </h2>
              <p className="text-white/80 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
                Start your own fundraising campaign and make a difference in your community. It only takes a few minutes to get started.
              </p>
              <Link 
                href="/create_campaign"
                className="inline-flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-red-400 to-cyan-400 text-white rounded-full text-lg sm:text-xl font-bold hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-400/30"
              >
                <i className="fas fa-rocket"></i>
                Start Your Campaign
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
