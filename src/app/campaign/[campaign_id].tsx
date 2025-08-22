'use client';

import { useState, useEffect, useRef } from 'react';

interface DonationItem {
  id: string;
  name: string;
  amount: number;
  time: string;
  avatar: string;
}

interface FundUsageItem {
  description: string;
  amount: number;
}

export default function CampaignsPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isDonating, setIsDonating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const particlesRef = useRef<HTMLDivElement>(null);

  // Campaign data
  const campaignData = {
    title: "Help Sarah Complete Her Medical School Journey",
    category: "Medical & Healthcare",
    creator: "Sarah Johnson",
    location: "Lagos, Nigeria",
    createdDate: "5 days ago",
    goal: 650000,
    raised: 485000,
    supporters: 142,
    daysLeft: 28,
    mainImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    ],
    story: [
      "Hi, my name is Sarah Johnson, and I'm a 4th-year medical student at the University of Lagos. I've worked incredibly hard to get where I am today, maintaining top grades while supporting myself through part-time work.",
      "Unfortunately, due to unexpected family financial difficulties, I'm now struggling to pay for my final year tuition fees, medical equipment, and examination costs. I'm just one year away from achieving my dream of becoming a doctor and serving my community.",
      "Every donation, no matter how small, brings me closer to completing my medical education and making a difference in people's lives. I promise to pay this kindness forward by providing affordable healthcare to underserved communities once I graduate."
    ],
    fundUsage: [
      { description: "Final year tuition fees", amount: 350000 },
      { description: "Medical equipment & textbooks", amount: 180000 },
      { description: "Professional examination fees", amount: 120000 }
    ]
  };

  const donationAmounts = [5000, 10000, 25000, 50000];

  const recentDonations: DonationItem[] = [
    {
      id: '1',
      name: 'Anonymous Donor',
      amount: 15000,
      time: '2 hours ago',
      avatar: 'AO'
    },
    {
      id: '2',
      name: 'Michael Johnson',
      amount: 25000,
      time: '5 hours ago',
      avatar: 'MJ'
    },
    {
      id: '3',
      name: 'Sarah Williams',
      amount: 10000,
      time: '1 day ago',
      avatar: 'SW'
    },
    {
      id: '4',
      name: 'David Brown',
      amount: 50000,
      time: '2 days ago',
      avatar: 'DB'
    }
  ];

  // Create floating particles
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
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        container.appendChild(particle);
      }
    }
  }, []);

  // Animate progress bar
  useEffect(() => {
    const percentage = (campaignData.raised / campaignData.goal) * 100;
    setProgressWidth(percentage);
  }, []);

  // Handle amount selection
  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  // Handle custom amount input
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  // Handle donation
  const handleDonate = async () => {
    const amount = selectedAmount || parseInt(customAmount);
    if (!amount || amount < 100) return;

    setIsDonating(true);
    
    // Simulate donation process
    setTimeout(() => {
      setIsDonating(false);
      setShowSuccess(true);
      setSelectedAmount(null);
      setCustomAmount('');
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 2000);
  };

  // Handle image selection
  const handleImageSelect = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Share functions
  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Help Sarah complete her medical school journey! ${campaignData.title}`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Help Sarah complete her medical school journey! ${campaignData.title}`);
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const getDonationAmount = () => {
    return selectedAmount || parseInt(customAmount) || 0;
  };

  const isDonateDisabled = () => {
    const amount = getDonationAmount();
    return amount < 100 || isDonating;
  };

  return (
    <>
      <div className="bg-particles" ref={particlesRef}></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full px-8 py-4 bg-white/10 backdrop-blur-md border-b border-white/20 z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="#" className="text-3xl font-bold text-transparent bg-gradient-to-r from-red-400 to-cyan-400 bg-clip-text">
            DonateFlow
          </a>
          <div className="flex gap-4 items-center">
            <a href="/create_campaign" className="text-white/90 no-underline font-medium px-6 py-2 rounded-full transition-all duration-300 border border-white/30 backdrop-blur-md hover:bg-white/10 hover:-translate-y-0.5">
              Create Campaign
            </a>
            <a href="#dashboard" className="text-white/90 no-underline font-medium px-6 py-2 rounded-full transition-all duration-300 border border-white/30 backdrop-blur-md hover:bg-white/10 hover:-translate-y-0.5">
              Dashboard
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-16 px-8 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          
          {/* Campaign Content */}
          <div className="bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20 p-10 shadow-2xl">
            
            {/* Campaign Header */}
            <div className="mb-8">
              <div className="inline-block bg-gradient-to-r from-red-400 to-cyan-400 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                {campaignData.category}
              </div>
              <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">
                {campaignData.title}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-white/70 text-base mb-8">
                <div className="flex items-center gap-2">
                  <i className="fas fa-user text-cyan-400"></i>
                  <span>By {campaignData.creator}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-cyan-400"></i>
                  <span>{campaignData.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-calendar text-cyan-400"></i>
                  <span>Created {campaignData.createdDate}</span>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="mb-10">
              <img 
                src={campaignData.images[currentImageIndex]} 
                alt="Campaign main image" 
                className="w-full h-96 rounded-2xl object-cover mb-4"
              />
              <div className="grid grid-cols-3 gap-3">
                {campaignData.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Campaign image ${index + 1}`}
                    className={`w-full h-20 rounded-lg object-cover cursor-pointer transition-all duration-300 border-2 ${
                      index === currentImageIndex 
                        ? 'border-cyan-400 scale-105' 
                        : 'border-transparent hover:border-cyan-400 hover:scale-105'
                    }`}
                    onClick={() => handleImageSelect(index)}
                  />
                ))}
              </div>
            </div>

            {/* Campaign Story */}
            <div className="mb-10">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <i className="fas fa-heart text-transparent bg-gradient-to-r from-red-400 to-cyan-400 bg-clip-text"></i>
                Sarah's Story
              </h3>
              {campaignData.story.map((paragraph, index) => (
                <p key={index} className="text-white/80 text-lg leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Fund Usage */}
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <i className="fas fa-chart-pie text-cyan-400"></i>
                How Your Donations Will Be Used
              </h4>
              <div className="space-y-4">
                {campaignData.fundUsage.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border-l-4 border-cyan-400">
                    <div className="text-white/90 font-medium">{item.description}</div>
                    <div className="text-cyan-400 font-semibold text-lg">₦{item.amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Donation Sidebar */}
          <div className="lg:sticky lg:top-32 h-fit space-y-6">
            
            {/* Donation Card */}
            <div className="bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20 p-8 shadow-2xl">
              
              {/* Progress Section */}
              <div className="mb-8">
                <div className="text-4xl font-extrabold text-cyan-400 text-center mb-2">
                  ₦{campaignData.raised.toLocaleString()}
                </div>
                <div className="text-center text-white/70 text-lg mb-6">
                  raised of ₦{campaignData.goal.toLocaleString()} goal
                </div>
                <div className="bg-white/10 rounded-full h-3 mb-6 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-400 to-cyan-400 rounded-full transition-all duration-2000 ease-out relative overflow-hidden"
                    style={{ width: `${progressWidth}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>

              {/* Campaign Stats */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-2xl font-bold text-white mb-1">{campaignData.supporters}</div>
                  <div className="text-white/70 text-sm">Supporters</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-2xl font-bold text-white mb-1">{campaignData.daysLeft}</div>
                  <div className="text-white/70 text-sm">Days Left</div>
                </div>
              </div>

              {/* Donation Amounts */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {donationAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`p-4 border-2 rounded-xl font-semibold text-center transition-all duration-300 ${
                        selectedAmount === amount
                          ? 'border-cyan-400 bg-cyan-400/20 text-white'
                          : 'border-white/20 bg-white/5 text-white hover:border-cyan-400 hover:bg-cyan-400/10 hover:-translate-y-0.5'
                      }`}
                    >
                      ₦{amount.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <input
                    type="number"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Enter custom amount"
                    min="100"
                    className="w-full px-4 py-4 rounded-xl border-2 border-white/20 bg-white/10 text-white text-lg font-semibold text-center backdrop-blur-md transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 placeholder:text-white/60"
                  />
                </div>
              </div>

              {/* Donate Button */}
              <button
                onClick={handleDonate}
                disabled={isDonateDisabled()}
                className="w-full py-4 bg-gradient-to-r from-red-400 to-cyan-400 text-white border-none rounded-full text-xl font-bold cursor-pointer transition-all duration-300 mb-6 flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-400/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isDonating ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-heart"></i>
                    Donate Now
                  </>
                )}
              </button>

              {/* Security Notice */}
              <div className="text-center text-white/70 text-sm mb-6">
                <i className="fas fa-shield-alt text-cyan-400 mr-2"></i>
                100% secure donation
              </div>

              {/* Share Options */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={shareOnTwitter}
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-300 border-2 border-white/20 backdrop-blur-md hover:border-cyan-400 hover:bg-cyan-400/20 hover:-translate-y-1 hover:scale-110"
                  title="Share on Twitter"
                >
                  <i className="fab fa-twitter"></i>
                </button>
                <button
                  onClick={shareOnFacebook}
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-300 border-2 border-white/20 backdrop-blur-md hover:border-cyan-400 hover:bg-cyan-400/20 hover:-translate-y-1 hover:scale-110"
                  title="Share on Facebook"
                >
                  <i className="fab fa-facebook"></i>
                </button>
                <button
                  onClick={shareOnWhatsApp}
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-300 border-2 border-white/20 backdrop-blur-md hover:border-cyan-400 hover:bg-cyan-400/20 hover:-translate-y-1 hover:scale-110"
                  title="Share on WhatsApp"
                >
                  <i className="fab fa-whatsapp"></i>
                </button>
                <button
                  onClick={copyLink}
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-300 border-2 border-white/20 backdrop-blur-md hover:border-cyan-400 hover:bg-cyan-400/20 hover:-translate-y-1 hover:scale-110"
                  title="Copy Link"
                >
                  <i className="fas fa-link"></i>
                </button>
              </div>
            </div>

            {/* Recent Donations */}
            <div className="bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20 p-6 shadow-2xl">
              <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <i className="fas fa-users text-cyan-400"></i>
                Recent Supporters
              </h4>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recentDonations.map((donation) => (
                  <div key={donation.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl transition-all duration-300 hover:bg-white/10 hover:translate-x-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-400 to-cyan-400 flex items-center justify-center text-white font-semibold text-sm">
                      {donation.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium mb-1">{donation.name}</div>
                      <div className="text-white/60 text-sm">{donation.time}</div>
                    </div>
                    <div className="text-cyan-400 font-semibold text-lg">
                      ₦{donation.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-20 right-8 bg-green-500/90 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-slideIn">
          <i className="fas fa-check-circle mr-3"></i>
          Thank you for your donation! Your support means the world to Sarah.
        </div>
      )}
    </>
  );
}