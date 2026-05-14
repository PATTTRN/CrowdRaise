'use client';

import { useState, useEffect, useRef, use } from 'react';
import { collectionService, contributionService } from '@/services';
import { toast } from 'sonner';
import PaystackPop from '@paystack/inline-js'

// ─── Type configuration ────────────────────────────────────────────────────
const TYPE_CONFIG = {
  fundraiser: {
    accentColor: '#f43f5e',
    accentGradient: 'linear-gradient(135deg, #f43f5e, #fb923c)',
    bgAccent: 'rgba(244,63,94,0.12)',
    borderAccent: 'rgba(244,63,94,0.3)',
    label: 'Fundraiser',
    supportLabel: 'Donate Now',
    supportIcon: '🌟',
    amountLabel: 'Donate',
    raisedLabel: 'raised',
    goalLabel: 'goal',
    supportersLabel: 'Donors',
    actionVerb: 'Donating',
    successMsg: 'Thank you for your donation! Every contribution brings us closer to the goal.',
    securityMsg: '100% secure donation',
    shareMsg: 'Help us reach more donors!',
  },
  occasion: {
    accentColor: '#180a3aff',
    accentGradient: 'linear-gradient(135deg, #180a3aff, #ec4899)',
    bgAccent: 'rgba(139,92,246,0.12)',
    borderAccent: 'rgba(139,92,246,0.3)',
    label: 'Occasion Gift',
    supportLabel: 'Send a Gift 🎁',
    supportIcon: '🎉',
    amountLabel: 'Gift',
    raisedLabel: 'gifted',
    goalLabel: 'goal',
    supportersLabel: 'Gift Givers',
    actionVerb: 'Sending gift',
    successMsg: "Your gift has been sent with love! 🎉 Wishing them a wonderful celebration.",
    securityMsg: 'Gifts sent securely with love',
    shareMsg: 'Spread the celebration!',
  },
  tips: {
    accentColor: '#06b6d4',
    accentGradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    bgAccent: 'rgba(6,182,212,0.12)',
    borderAccent: 'rgba(6,182,212,0.3)',
    label: 'Tips',
    supportLabel: 'Show Some Love 💸',
    supportIcon: '💸',
    amountLabel: 'Tip',
    raisedLabel: 'received',
    goalLabel: 'target',
    supportersLabel: 'Supporters',
    actionVerb: 'Sending tip',
    successMsg: "You're amazing! 💸 Your tip means the world to them. Thank you for showing love.",
    securityMsg: 'Tips sent instantly & securely',
    shareMsg: 'Share the love!',
  },
} as const;

type CollectionType = keyof typeof TYPE_CONFIG;

interface DonationItem {
  id: string;
  name: string;
  amount: number;
  message?: string;
  createdAt: string;
}

interface CollectionDetail {
  _id: string;
  type: CollectionType;
  title: string;
  category: string;
  creator: { name: string; _id: string };
  location: string;
  createdAt: string;
  goal: number;
  raised: number;
  supporters: number;
  daysLeft: number;
  images: { url: string }[];
  fullStory: string;
  fundUsage?: { description: string; amount: number }[];
  eventDate?: string;
  suggestedAmounts?: number[];
}

// Correct Contribution Type Definition
interface Contribution {
  _id: string;
  supporterName?: string;
  supporterEmail?: string;
  amount: number;
  message?: string;
  createdAt: string;
}

export default function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [campaign, setCampaign] = useState<CollectionDetail | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isDonating, setIsDonating] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [supporterName, setSupporterName] = useState('');
  const [supporterEmail, setSupporterEmail] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const particlesRef = useRef<HTMLDivElement>(null);

  const fetchDetails = async () => {
    setIsLoading(true);
    try {
      const [details, contribs] = await Promise.all([
        collectionService.getCollectionById(id),
        contributionService.getCollectionContributions(id)
      ]);
      setCampaign(details);
      setContributions(contribs.data);
      const pct = details.goal ? Math.min((details.raised / details.goal) * 100, 100) : 100;
      setTimeout(() => setProgressWidth(pct), 500);
    } catch (error: any) {
      // Axios interceptor will handle 401s
      if (error.response?.status !== 401) {
        toast.error('Failed to load collection details');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (particlesRef.current) {
      while (particlesRef.current.firstChild) {
        particlesRef.current.removeChild(particlesRef.current.firstChild);
      }
    }
    fetchDetails();

    if (particlesRef.current) {
      const container = particlesRef.current;
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 6 + 's';
        p.style.animationDuration = (Math.random() * 4 + 4) + 's';
        container.appendChild(p);
      }
    }
  }, [id]);

  if (isLoading || !campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
      </div>
    );
  }

  const config = TYPE_CONFIG[campaign.type];
  const donationAmounts = campaign.suggestedAmounts && campaign.suggestedAmounts.length > 0
    ? campaign.suggestedAmounts
    : [1000, 2000, 5000, 10000];

  const handleDonate = async () => {
    const amount = selectedAmount ?? (customAmount ? parseInt(customAmount, 10) : null);

    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!supporterEmail || !/^\S+@\S+\.\S+$/.test(supporterEmail)) {
      toast.error('Email is required for receipt');
      return;
    }

    setIsDonating(true);

    try {
      toast.info('Initializing payment...');
      const init = await contributionService.initializeContribution({
        collectionId: campaign._id,
        amount,
        message: supportMessage,
        supporterName: supporterName || 'Anonymous',
        supporterEmail,
        currency: 'NGN',
      });

      const contributionId: string = init.data._id;
      const accessCode: string = init.access_code;

      const popup = new PaystackPop();
      popup.resumeTransaction(accessCode, {
        onSuccess: async (_transaction: any) => {
          try {
            toast.info('Verifying payment...');
            await contributionService.confirmContribution(contributionId);

            toast.success(config.successMsg);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3500);
            fetchDetails();
            setSelectedAmount(null);
            setCustomAmount('');
            setSupportMessage('');
            setSupporterName('');
            setSupporterEmail('');
          } catch (err) {
            toast.error('Payment received but confirmation failed. Please contact support.');
          } finally {
            setIsDonating(false);
          }
        },
        onCancel: () => {
          setIsDonating(false);
          toast.warning('Transaction cancelled');
        },
      });
    } catch (error) {
      toast.error('Could not initialize payment. Please try again.');
      setIsDonating(false);
    }
  };

  const share = (platform: string) => {
    if (typeof window === 'undefined') return;

    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${campaign.title} on CrowdRaise`);
    const links: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };
    if (links[platform]) window.open(links[platform], '_blank', 'noopener,noreferrer');
    else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <>
      <div className="bg-particles" ref={particlesRef}></div>

      <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* ── Type banner ── */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 border"
            style={{ color: config.accentColor, background: config.bgAccent, borderColor: config.borderAccent }}
          >
            <span>{config.supportIcon}</span>
            {config.label}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">

            {/* ── LEFT: Content ── */}
            <div className="space-y-8 min-w-0">

              {/* Header */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
                  {campaign.title}
                </h1>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/60 text-sm">
                  <span className="flex items-center gap-1.5">
                    <span style={{ color: config.accentColor }}>▸</span>
                    {campaign.category}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span style={{ color: config.accentColor }}>▸</span>
                    By {campaign.creator.name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span style={{ color: config.accentColor }}>▸</span>
                    {campaign.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span style={{ color: config.accentColor }}>▸</span>
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </span>
                  {campaign.eventDate && (
                    <span className="flex items-center gap-1.5 font-semibold" style={{ color: config.accentColor }}>
                      🗓 {new Date(campaign.eventDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Images */}
              <div>
                <div className="relative rounded-2xl overflow-hidden mb-3" style={{ borderColor: config.borderAccent, border: `1px solid ${config.borderAccent}` }}>
                  <img
                    src={
                      Array.isArray(campaign.images) && campaign.images.length > 0 && campaign.images[currentImageIndex]?.url
                        ? campaign.images[currentImageIndex].url
                        : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80'
                    }
                    alt="Campaign"
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                  />
                  <div
                    className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm"
                    style={{ background: config.bgAccent, color: config.accentColor, border: `1px solid ${config.borderAccent}` }}
                  >
                    {config.supportIcon} {config.label}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(Array.isArray(campaign.images) ? campaign.images : []).map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      alt=""
                      onClick={() => setCurrentImageIndex(i)}
                      className={`w-full h-16 sm:h-20 rounded-xl object-cover cursor-pointer transition-all duration-300 border-2 ${i === currentImageIndex ? 'scale-105' : 'border-transparent opacity-60 hover:opacity-90'}`}
                      style={i === currentImageIndex ? { borderColor: config.accentColor } : {}}
                    />
                  ))}
                </div>
              </div>

              {/* Story */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8 backdrop-blur-xl">
                <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                  <span style={{ color: config.accentColor }}>
                    {campaign.type === 'fundraiser' ? '🌟' : campaign.type === 'occasion' ? '💌' : '🎙'}
                  </span>
                  {campaign.type === 'fundraiser' ? 'The Story' : campaign.type === 'occasion' ? 'A Message from the Celebrant' : 'About'}
                </h3>
                <div className="text-white/75 text-base leading-relaxed whitespace-pre-wrap">
                  {campaign.fullStory}
                </div>
              </div>

              {/* Fund usage breakdown (fundraisers only) */}
              {campaign.type === 'fundraiser' && campaign.fundUsage && campaign.fundUsage.length > 0 && (
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8 backdrop-blur-xl">
                  <h4 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                    <span style={{ color: config.accentColor }}>📊</span>
                    How Funds Will Be Used
                  </h4>
                  <div className="space-y-3">
                    {campaign.fundUsage.map((item, i) => {
                      const pct = campaign.goal ? Math.round((item.amount / campaign.goal) * 100) : 0;
                      return (
                        <div key={i} className="p-4 bg-white/5 rounded-xl border-l-4" style={{ borderLeftColor: config.accentColor }}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white/85 text-sm font-medium">{item.description}</span>
                            <span className="font-bold text-sm" style={{ color: config.accentColor }}>₦{item.amount.toLocaleString()}</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: config.accentGradient }} />
                          </div>
                          <div className="text-white/40 text-xs mt-1">{pct}% of goal</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Recent supporters (MOVED HERE) ── */}
              <div className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl p-6 sm:p-8">
                <h4 className="text-white font-bold mb-6 flex items-center gap-2 text-lg">
                  <span style={{ color: config.accentColor }}>❤</span>
                  Recent {config.supportersLabel}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contributions.length > 0 ? contributions.map((d) => (
                    <div key={d._id} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: config.accentGradient }}
                      >
                        {d.supporterName?.substring(0, 2).toUpperCase() || 'AN'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-white text-sm font-semibold">{d.supporterName || 'Anonymous'}</span>
                          <span className="text-sm font-bold flex-shrink-0" style={{ color: config.accentColor }}>
                            ₦{d.amount.toLocaleString()}
                          </span>
                        </div>
                        {d.message && <div className="text-white/60 text-xs mt-1.5 leading-relaxed italic">"{d.message}"</div>}
                        <div className="text-white/40 text-[10px] mt-2 uppercase font-medium tracking-wider">{new Date(d.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full text-center py-10 text-white/40 text-sm border-2 border-dashed border-white/5 rounded-2xl">
                      No contributions yet. Be the first to support this campaign!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Support sidebar (Now independently scrollable) ── */}
            <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent space-y-5">
              
              {/* Main support card */}
              <div
                className="rounded-3xl border p-6 backdrop-blur-xl shadow-2xl"
                style={{ background: 'rgba(255,255,255,0.06)', borderColor: config.borderAccent }}
              >
                {/* Progress */}
                <div className="mb-6">
                  <div className="text-3xl font-extrabold mb-1" style={{ color: config.accentColor }}>
                    ₦{campaign.raised.toLocaleString()}
                  </div>
                  <div className="text-white/60 text-sm mb-4">
                    {config.raisedLabel} of <span className="text-white">₦{campaign.goal.toLocaleString()}</span> {config.goalLabel}
                  </div>
                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full rounded-full transition-all duration-2000 ease-out relative overflow-hidden"
                      style={{ width: `${progressWidth}%`, background: config.accentGradient }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-white/5 rounded-xl">
                      <div className="text-xl font-bold text-white">{campaign.supporters}</div>
                      <div className="text-white/55 text-xs mt-0.5">{config.supportersLabel}</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-xl">
                      <div className="text-xl font-bold text-white">{campaign.daysLeft || 0}</div>
                      <div className="text-white/55 text-xs mt-0.5">
                        {campaign.type === 'occasion' ? 'Days until event' : 'Days left'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Support Form */}
                <div className="space-y-4 mb-4">
                  <div>
                    <div className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3">
                      {campaign.type === 'tips' ? 'Choose a tip amount' : campaign.type === 'occasion' ? 'Gift amount (₦)' : 'Donation amount (₦)'}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {donationAmounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                          className="p-3 rounded-xl font-bold text-sm transition-all duration-200 border-2"
                          style={selectedAmount === amount ? { background: config.bgAccent, borderColor: config.accentColor, color: config.accentColor } : { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}
                        >
                          ₦{amount.toLocaleString()}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      value={customAmount}
                      min={1}
                      onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                      placeholder={`Custom amount`}
                      className="w-full px-4 py-3 rounded-xl border-2 bg-white/5 text-white text-base text-center font-semibold focus:outline-none placeholder:text-white/35 mb-3"
                      style={{ borderColor: customAmount ? config.accentColor : 'rgba(255,255,255,0.15)' }}
                    />
                  </div>

                  <div className="space-y-3">
                    <input type="email" required value={supporterEmail} onChange={(e) => setSupporterEmail(e.target.value)} placeholder="Email for receipt" className="w-full px-4 py-3 rounded-xl border-2 border-white/15 bg-white/5 text-white text-sm focus:outline-none focus:border-pink-500 placeholder:text-white/35" />
                    <input type="text" value={supporterName} onChange={(e) => setSupporterName(e.target.value)} placeholder="Display Name (optional)" className="w-full px-4 py-3 rounded-xl border-2 border-white/15 bg-white/5 text-white text-sm focus:outline-none focus:border-pink-500 placeholder:text-white/35" />
                    <textarea value={supportMessage} onChange={(e) => setSupportMessage(e.target.value)} placeholder="Leave a message (optional)" rows={2} className="w-full px-4 py-3 rounded-xl border-2 border-white/15 bg-white/5 text-white text-sm focus:outline-none focus:border-pink-500 placeholder:text-white/35 resize-none" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDonate}
                  disabled={isDonating || (!selectedAmount && (!customAmount || parseInt(customAmount) <= 0)) || !supporterEmail}
                  className="w-full py-4 rounded-full font-bold text-lg text-white border-none transition-all duration-300 mb-4 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50"
                  style={{ background: config.accentGradient }}
                >
                  {isDonating ? <><i className="fas fa-circle-notch fa-spin"></i> {config.actionVerb}…</> : <>{config.supportIcon} {config.supportLabel}</>}
                </button>

                <div className="text-center text-white/50 text-xs mb-5">🔒 {config.securityMsg}</div>

                {/* Share */}
                <div>
                  <div className="text-white/50 text-xs text-center mb-3">{config.shareMsg}</div>
                  <div className="flex justify-center gap-2">
                    {[{ key: 'twitter', icon: 'fab fa-x-twitter' }, { key: 'facebook', icon: 'fab fa-facebook-f' }, { key: 'whatsapp', icon: 'fab fa-whatsapp' }, { key: 'copy', icon: 'fas fa-link' }].map((s) => (
                      <button key={s.key} type="button" onClick={() => share(s.key)} className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 text-sm transition-all duration-200 border border-white/15 hover:border-white/40 hover:bg-white/10 hover:-translate-y-0.5">
                        <i className={s.icon}></i>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Success toast */}
      {showSuccess && (
        <div className="fixed bottom-6 right-4 sm:right-6 text-white px-5 py-4 rounded-2xl shadow-2xl z-50 max-w-xs text-sm font-medium border" style={{ background: 'rgba(0,0,0,0.85)', borderColor: config.borderAccent, backdropFilter: 'blur(16px)' }}>
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">{config.supportIcon}</span>
            <span>{config.successMsg}</span>
          </div>
        </div>
      )}
    </>
  );
}