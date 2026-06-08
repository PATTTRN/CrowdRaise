'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { collectionService, contributionService } from '@/services';
import { toast } from 'sonner';
import PaystackPop from '@paystack/inline-js'
import { ShareModal } from '@/components/ShareModal';
import confetti from 'canvas-confetti';

const TYPE_CONFIG = {
  fundraiser: {
    accentColor: '#635bff',
    accentGradient: 'linear-gradient(135deg, #635bff, #3b82f6)',
    bgAccent: 'rgba(99,91,255,0.06)',
    borderAccent: 'rgba(99,91,255,0.2)',
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
    accentColor: '#a855f7',
    accentGradient: 'linear-gradient(135deg, #a855f7, #ec4899)',
    bgAccent: 'rgba(168,85,247,0.06)',
    borderAccent: 'rgba(168,85,247,0.2)',
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
    bgAccent: 'rgba(6,182,212,0.06)',
    borderAccent: 'rgba(6,182,212,0.2)',
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

interface Contribution {
  _id: string;
  supporterName?: string;
  supporterEmail?: string;
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
  const [contributionId, setContributionId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (window.location.search.includes('share=true')) {
      setShowShareModal(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const fetchDetails = async () => {
    setIsLoading(true);
    try {
      const [details, contribs] = await Promise.all([
        collectionService.getCollectionById(id),
        contributionService.getCollectionContributions(id)
      ]);
      setCampaign(details.data || details);
      setContributions(contribs.data);
      const data = details.data || details;
      const pct = data.goal ? Math.min((data.raised / data.goal) * 100, 100) : 100;
      setTimeout(() => setProgressWidth(pct), 500);
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { status?: number } }).response?.status === "number"
      ) {
        if ((error as { response: { status: number } }).response.status !== 401) {
          toast.error('Failed to load collection details');
        }
      } else {
        toast.error('Failed to load collection details');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (isLoading || !campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary/30 border-t-primary"></div>
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

      const cId: string = init.data._id;
      const accessCode: string = init.access_code;

      const popup = new PaystackPop();
      popup.resumeTransaction(accessCode, {
        onSuccess: async () => {
          try {
            toast.info('Verifying payment...');
            await contributionService.confirmContribution(cId);
            setContributionId(cId);
            setShowSuccess(true);
            confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 },
              colors: [config.accentColor, '#ffd700', '#ff6b6b'],
            });
            setTimeout(() => confetti({ particleCount: 80, spread: 100, origin: { y: 0.4 }, angle: 60 }), 250);
            setTimeout(() => confetti({ particleCount: 80, spread: 100, origin: { y: 0.4 }, angle: 120 }), 400);
            fetchDetails();
            setSelectedAmount(null);
            setCustomAmount('');
            setSupportMessage('');
            setSupporterName('');
            setSupporterEmail('');
          } catch {
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
    } catch {
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
    <div className="min-h-screen bg-secondary/30">
      <div className="bg-white border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
          <div className="max-w-7xl mx-auto">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 border"
              style={{ color: config.accentColor, background: config.bgAccent, borderColor: config.borderAccent }}
            >
              <span>{config.supportIcon}</span>
              {config.label}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start">
              <div className="space-y-8 min-w-0">
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight tracking-tight">
                    {campaign.title}
                  </h1>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
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
                      Created {new Date(campaign.createdAt).toLocaleDateString()}
                    </span>
                    {campaign.eventDate && (
                      <span className="flex items-center gap-1.5 font-semibold" style={{ color: config.accentColor }}>
                        🗓 {new Date(campaign.eventDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="relative rounded-2xl overflow-hidden border border-border">
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
                  {(Array.isArray(campaign.images) ? campaign.images : []).length > 1 && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
                      {(Array.isArray(campaign.images) ? campaign.images : []).map((img, i) => (
                        <img
                          key={i}
                          src={img.url}
                          alt=""
                          onClick={() => setCurrentImageIndex(i)}
                          className={`w-full h-16 sm:h-20 rounded-xl object-cover cursor-pointer transition-all duration-300 border-2 ${i === currentImageIndex ? 'ring-2 ring-primary scale-105 border-primary' : 'border-transparent opacity-60 hover:opacity-90'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                    <span style={{ color: config.accentColor }}>
                      {campaign.type === 'fundraiser' ? '🌟' : campaign.type === 'occasion' ? '💌' : '🎙'}
                    </span>
                    {campaign.type === 'fundraiser' ? 'The Story' : campaign.type === 'occasion' ? "A Message from the Celebrant" : 'About'}
                  </h3>
                  <div className="text-muted-foreground text-base leading-relaxed whitespace-pre-wrap">
                    {campaign.fullStory}
                  </div>
                </div>

                {campaign.type === 'fundraiser' && campaign.fundUsage && campaign.fundUsage.length > 0 && (
                  <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
                    <h4 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                      <span style={{ color: config.accentColor }}>📊</span>
                      How Funds Will Be Used
                    </h4>
                    <div className="space-y-3">
                      {campaign.fundUsage.map((item, i) => {
                        const pct = campaign.goal ? Math.round((item.amount / campaign.goal) * 100) : 0;
                        return (
                          <div key={i} className="p-4 bg-secondary rounded-xl border-l-4" style={{ borderLeftColor: config.accentColor }}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-foreground text-sm font-medium">{item.description}</span>
                              <span className="font-bold text-sm" style={{ color: config.accentColor }}>₦{item.amount.toLocaleString()}</span>
                            </div>
                            <div className="h-1.5 bg-border rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: config.accentGradient }} />
                            </div>
                            <div className="text-muted-foreground text-xs mt-1">{pct}% of goal</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
                  <h4 className="text-foreground font-bold mb-6 flex items-center gap-2 text-lg">
                    <span style={{ color: config.accentColor }}>❤</span>
                    Recent {config.supportersLabel}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {contributions.length > 0 ? contributions.map((d) => (
                      <div key={d._id} className="flex items-start gap-4 p-4 rounded-xl bg-secondary hover:bg-accent transition-colors border border-border/50">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: config.accentGradient }}
                        >
                          {d.supporterName?.substring(0, 2).toUpperCase() || 'AN'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-foreground text-sm font-semibold">{d.supporterName || 'Anonymous'}</span>
                            <span className="text-sm font-bold flex-shrink-0" style={{ color: config.accentColor }}>
                              ₦{d.amount.toLocaleString()}
                            </span>
                          </div>
                          {d.message && <div className="text-muted-foreground text-xs mt-1.5 leading-relaxed italic">&ldquo;{d.message}&rdquo;</div>}
                          <div className="text-muted-foreground text-[10px] mt-2 uppercase font-medium tracking-wider">{new Date(d.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    )) : (
                      <div className="col-span-full text-center py-10 text-muted-foreground text-sm border-2 border-dashed border-border rounded-2xl">
                        No contributions yet. Be the first to support this campaign!
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-2 space-y-5">
                <div className="rounded-2xl border border-border bg-white p-6 hero-card-shadow">
                  <div className="mb-6">
                    <div className="text-3xl font-bold mb-1" style={{ color: config.accentColor }}>
                      ₦{campaign.raised.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground text-sm mb-4">
                      {config.raisedLabel} of <span className="text-foreground">₦{campaign.goal.toLocaleString()}</span> {config.goalLabel}
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full rounded-full transition-all duration-2000 ease-out relative overflow-hidden"
                        style={{ width: `${progressWidth}%`, background: config.accentGradient }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-secondary rounded-xl">
                        <div className="text-xl font-bold text-foreground">{campaign.supporters}</div>
                        <div className="text-muted-foreground text-xs mt-0.5">{config.supportersLabel}</div>
                      </div>
                      <div className="text-center p-3 bg-secondary rounded-xl">
                        <div className="text-xl font-bold text-foreground">{campaign.daysLeft || 0}</div>
                        <div className="text-muted-foreground text-xs mt-0.5">
                          {campaign.type === 'occasion' ? 'Days until event' : 'Days left'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-4">
                    <div>
                      <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-3">
                        {campaign.type === 'tips' ? 'Choose a tip amount' : campaign.type === 'occasion' ? 'Gift amount (₦)' : 'Donation amount (₦)'}
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {donationAmounts.map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                            className="p-3 rounded-xl font-bold text-sm transition-all duration-200 border-2 cursor-pointer"
                            style={selectedAmount === amount ? { background: config.bgAccent, borderColor: config.accentColor, color: config.accentColor } : { background: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
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
                        placeholder="Custom amount"
                        className="w-full px-4 py-3 rounded-xl border-2 bg-background text-foreground text-base text-center font-semibold focus:outline-none placeholder:text-muted-foreground mb-3"
                        style={{ borderColor: customAmount ? config.accentColor : 'var(--border)' }}
                      />
                    </div>

                    <div className="space-y-3">
                      <input type="email" required autoComplete="email" value={supporterEmail} onChange={(e) => setSupporterEmail(e.target.value)} placeholder="Email for receipt" className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground" />
                      <input type="text" autoComplete="name" value={supporterName} onChange={(e) => setSupporterName(e.target.value)} placeholder="Display Name (optional)" className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground" />
                      <textarea value={supportMessage} onChange={(e) => setSupportMessage(e.target.value)} placeholder="Leave a message (optional)" rows={2} className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-none" />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDonate}
                    disabled={isDonating || (!selectedAmount && (!customAmount || parseInt(customAmount, 10) <= 0)) || !supporterEmail}
                    className="w-full py-4 rounded-xl font-bold text-lg text-white border-none transition-all duration-300 mb-4 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                    style={{ background: config.accentGradient }}
                  >
                    {isDonating ? <>{config.actionVerb}…</> : <>{config.supportIcon} {config.supportLabel}</>}
                  </button>

                  <div className="text-center text-muted-foreground text-xs mb-5">🔒 {config.securityMsg}</div>

                  <div>
                    <div className="text-muted-foreground text-xs text-center mb-3">{config.shareMsg}</div>
                    <div className="flex justify-center gap-2">
                      {[{ key: 'twitter', icon: 'X' }, { key: 'facebook', icon: 'f' }, { key: 'whatsapp', icon: 'W' }, { key: 'copy', icon: '🔗' }].map((s) => (
                        <button key={s.key} type="button" onClick={() => share(s.key)} className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground text-sm transition-all duration-200 border border-border hover:border-foreground/30 hover:bg-muted hover:-translate-y-0.5 cursor-pointer">
                          {s.icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-md mx-4 text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="text-6xl mb-6">{config.supportIcon}</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Thank You!</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">{config.successMsg}</p>
            <div className="flex flex-col gap-3">
              <Link
                href={`/dashboard${contributionId ? '/donations' : ''}`}
                className="w-full py-3 px-6 rounded-xl text-white font-semibold text-center transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: config.accentGradient }}
                onClick={() => setShowSuccess(false)}
              >
                View My Contributions
              </Link>
              <button
                onClick={() => { setShowShareModal(true); setShowSuccess(false); }}
                className="w-full py-3 px-6 rounded-xl font-semibold border border-border text-foreground hover:bg-secondary transition-all"
              >
                Share This Campaign
              </button>
              <button
                onClick={() => { setShowSuccess(false); fetchDetails(); }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}

      <ShareModal open={showShareModal} onClose={() => setShowShareModal(false)} url={typeof window !== 'undefined' ? window.location.href : ''} title={campaign?.title || ''} />
    </div>
  );
}
