'use client';

import { useState, useEffect, useRef } from 'react';

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
    accentColor: '#8b5cf6',
    accentGradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
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
  time: string;
  avatar: string;
  message?: string;
}

// ─── Sample data ────────────────────────────────────────────────────────────
// In real usage you'd pull this from your DB/API. The `type` field drives UI.
const SAMPLE_CAMPAIGNS: Record<string, {
  type: CollectionType;
  title: string;
  category: string;
  creator: string;
  location: string;
  createdDate: string;
  goal: number;
  raised: number;
  supporters: number;
  daysLeft: number;
  images: string[];
  story: string[];
  fundUsage?: { description: string; amount: number }[];
  occasionDate?: string;
  occasionType?: string;
  tipSuggestions?: number[];
}> = {
  '1': {
    type: 'fundraiser',
    title: 'Help Sarah Complete Her Medical School Journey',
    category: 'Medical & Healthcare',
    creator: 'Sarah Johnson',
    location: 'Lagos, Nigeria',
    createdDate: '5 days ago',
    goal: 650000,
    raised: 485000,
    supporters: 142,
    daysLeft: 28,
    images: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&q=80',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&q=80',
    ],
    story: [
      "Hi, I'm Sarah Johnson — a 4th-year medical student at the University of Lagos. I've worked incredibly hard to get here, maintaining top grades while supporting myself through part-time work.",
      "Unexpected family financial difficulties have put my final year at risk. I need help covering tuition, medical equipment, and examination costs. I'm just one year away from becoming a doctor.",
      "Every contribution brings me closer to serving my community. I promise to pay this kindness forward by providing affordable healthcare to underserved communities once I graduate.",
    ],
    fundUsage: [
      { description: 'Final year tuition fees', amount: 350000 },
      { description: 'Medical equipment & textbooks', amount: 180000 },
      { description: 'Professional examination fees', amount: 120000 },
    ],
  },
  '2': {
    type: 'occasion',
    title: "Tobi & Chisom's Wedding Gift Collection 💍",
    category: 'Wedding',
    creator: 'Tobi Adeyemi',
    location: 'Lagos, Nigeria',
    createdDate: '2 weeks ago',
    goal: 500000,
    raised: 320000,
    supporters: 67,
    daysLeft: 14,
    occasionDate: '15 March 2025',
    occasionType: 'Wedding',
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=200&q=80',
    ],
    story: [
      "We're so excited to be starting this new chapter together! After years of building our love story, our big day is finally here.",
      "Rather than a traditional gift registry, we've set up this page for friends and family who'd like to contribute to our honeymoon, home setup, or simply send their love.",
      "Whether it's ₦5,000 or ₦500,000, every gift carries your blessing for our new journey together. We are deeply grateful. 🙏❤️",
    ],
  },
  '3': {
    type: 'tips',
    title: 'Support DJ Kemi – Show Love 🎶',
    category: 'Music & Entertainment',
    creator: 'Kemi Obi',
    location: 'Abuja, Nigeria',
    createdDate: '1 month ago',
    goal: 200000,
    raised: 95000,
    supporters: 89,
    daysLeft: 60,
    tipSuggestions: [1000, 2500, 5000, 10000],
    images: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&q=80',
      'https://images.unsplash.com/photo-1571266028243-d220c6a9570a?w=200&q=80',
    ],
    story: [
      "Hey! I'm DJ Kemi — Abuja's favourite party DJ 🎧 I've been spinning at events across Nigeria for 5 years, bringing energy to every room I enter.",
      "I run free weekly sets on Instagram every Friday night, and my mixes are free for everyone to download. If my music has ever made your day better, this is your chance to say thank you!",
      "Your support helps me invest in better equipment, keep the free content going, and book more gigs. Every tip, big or small, makes a real difference. Thank you for the love! 🙏",
    ],
  },
};

const RECENT_DONATIONS: DonationItem[] = [
  { id: '1', name: 'Anonymous', amount: 15000, time: '2 hours ago', avatar: 'AO', message: 'Keep going! 💪' },
  { id: '2', name: 'Michael Johnson', amount: 25000, time: '5 hours ago', avatar: 'MJ' },
  { id: '3', name: 'Sarah Williams', amount: 10000, time: '1 day ago', avatar: 'SW', message: 'Rooting for you!' },
  { id: '4', name: 'David Brown', amount: 50000, time: '2 days ago', avatar: 'DB' },
];

// ─── Component ──────────────────────────────────────────────────────────────
export default function CampaignPage({ params }: { params: { id: string } }) {
  // Default to campaign '1' for demo; in real app use params.id
  const campaignId = params?.id || '1';
  const campaign = SAMPLE_CAMPAIGNS[campaignId] || SAMPLE_CAMPAIGNS['1'];
  const config = TYPE_CONFIG[campaign.type];

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isDonating, setIsDonating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [tipperName, setTipperName] = useState('');
  const [tipMessage, setTipMessage] = useState('');
  const particlesRef = useRef<HTMLDivElement>(null);

  const donationAmounts = campaign.tipSuggestions || [5000, 10000, 25000, 50000];
  const progressPct = Math.min((campaign.raised / campaign.goal) * 100, 100);

  useEffect(() => {
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
    const timer = setTimeout(() => setProgressWidth(progressPct), 500);
    return () => clearTimeout(timer);
  }, [progressPct]);

  const isDonateDisabled = () => !selectedAmount && !customAmount.trim();

  const handleDonate = async () => {
    const amount = selectedAmount || parseInt(customAmount);
    if (!amount) return;
    setIsDonating(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsDonating(false);
    setShowSuccess(true);
    setSelectedAmount(null);
    setCustomAmount('');
    setTipperName('');
    setTipMessage('');
    setTimeout(() => setShowSuccess(false), 6000);
  };

  const share = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${campaign.title} on CrowdRaise`);
    const links: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };
    if (links[platform]) window.open(links[platform], '_blank');
    else navigator.clipboard.writeText(window.location.href);
  };

  // ── Occasion countdown ──
  const daysLabel = campaign.type === 'occasion'
    ? `${campaign.daysLeft} days to the celebration`
    : `${campaign.daysLeft} days left`;

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

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

            {/* ── LEFT: Content ── */}
            <div className="space-y-8">

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
                    By {campaign.creator}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span style={{ color: config.accentColor }}>▸</span>
                    {campaign.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span style={{ color: config.accentColor }}>▸</span>
                    {campaign.createdDate}
                  </span>
                  {campaign.occasionDate && (
                    <span className="flex items-center gap-1.5 font-semibold" style={{ color: config.accentColor }}>
                      🗓 {campaign.occasionDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Images */}
              <div>
                <div className="relative rounded-2xl overflow-hidden mb-3" style={{ borderColor: config.borderAccent, border: `1px solid ${config.borderAccent}` }}>
                  <img
                    src={campaign.images[currentImageIndex]}
                    alt="Campaign"
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                  />
                  {/* Type watermark */}
                  <div
                    className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm"
                    style={{ background: config.bgAccent, color: config.accentColor, border: `1px solid ${config.borderAccent}` }}
                  >
                    {config.supportIcon} {config.label}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {campaign.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
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
                {campaign.story.map((p, i) => (
                  <p key={i} className="text-white/75 text-base leading-relaxed mb-4 last:mb-0">{p}</p>
                ))}
              </div>

              {/* Occasion-specific: event details card */}
              {campaign.type === 'occasion' && campaign.occasionDate && (
                <div
                  className="rounded-2xl p-6 sm:p-8 border"
                  style={{ background: config.bgAccent, borderColor: config.borderAccent }}
                >
                  <h4 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: config.accentColor }}>
                    🎊 Celebration Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                      <div className="text-2xl font-black text-white">{campaign.daysLeft}</div>
                      <div className="text-white/60 text-xs mt-1">Days to the big day</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                      <div className="text-white font-semibold">{campaign.occasionDate}</div>
                      <div className="text-white/60 text-xs mt-1">{campaign.occasionType}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tips-specific: about the creator */}
              {campaign.type === 'tips' && (
                <div
                  className="rounded-2xl p-6 sm:p-8 border"
                  style={{ background: config.bgAccent, borderColor: config.borderAccent }}
                >
                  <h4 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: config.accentColor }}>
                    💡 Why your tip matters
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { icon: '🎧', label: 'Better Equipment', desc: 'Upgrade the tools that deliver great content' },
                      { icon: '🆓', label: 'Free Content', desc: 'Keep making free content for everyone' },
                      { icon: '🙏', label: 'Direct Support', desc: '100% goes directly to the creator' },
                    ].map((item) => (
                      <div key={item.label} className="bg-white/10 rounded-xl p-4 text-center">
                        <div className="text-2xl mb-2">{item.icon}</div>
                        <div className="text-white text-sm font-semibold mb-1">{item.label}</div>
                        <div className="text-white/55 text-xs">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fund usage breakdown (fundraisers only) */}
              {campaign.type === 'fundraiser' && campaign.fundUsage && (
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8 backdrop-blur-xl">
                  <h4 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                    <span style={{ color: config.accentColor }}>📊</span>
                    How Funds Will Be Used
                  </h4>
                  <div className="space-y-3">
                    {campaign.fundUsage.map((item, i) => {
                      const pct = Math.round((item.amount / campaign.goal) * 100);
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
            </div>

            {/* ── RIGHT: Support sidebar ── */}
            <div className="space-y-5">

              {/* ── Main support card ── */}
              <div
                className="rounded-3xl border p-6 backdrop-blur-xl shadow-2xl sticky top-24"
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
                      <div className="text-xl font-bold text-white">{campaign.daysLeft}</div>
                      <div className="text-white/55 text-xs mt-0.5">
                        {campaign.type === 'occasion' ? 'Days until event' : 'Days left'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amount selector */}
                <div className="mb-4">
                  <div className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3">
                    {campaign.type === 'tips' ? 'Choose a tip amount' : campaign.type === 'occasion' ? 'Gift amount (₦)' : 'Donation amount (₦)'}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {donationAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                        className="p-3 rounded-xl font-bold text-sm transition-all duration-200 border-2"
                        style={selectedAmount === amount
                          ? { background: config.bgAccent, borderColor: config.accentColor, color: config.accentColor }
                          : { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }
                        }
                      >
                        ₦{amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                    placeholder={`Enter custom ${config.amountLabel.toLowerCase()} amount`}
                    className="w-full px-4 py-3 rounded-xl border-2 bg-white/5 text-white text-base text-center font-semibold backdrop-blur-md transition-all duration-200 focus:outline-none placeholder:text-white/35"
                    style={{ borderColor: customAmount ? config.accentColor : 'rgba(255,255,255,0.15)' }}
                  />
                </div>

                {/* Occasion extra: sender name */}
                {campaign.type === 'occasion' && (
                  <input
                    type="text"
                    value={tipperName}
                    onChange={(e) => setTipperName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="w-full px-4 py-3 rounded-xl border-2 border-white/15 bg-white/5 text-white text-sm mb-3 focus:outline-none focus:border-violet-400 placeholder:text-white/35"
                  />
                )}

                {/* Tips extra: note */}
                {campaign.type === 'tips' && (
                  <textarea
                    value={tipMessage}
                    onChange={(e) => setTipMessage(e.target.value)}
                    placeholder="Leave a message (optional)"
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border-2 border-white/15 bg-white/5 text-white text-sm mb-3 focus:outline-none focus:border-cyan-400 placeholder:text-white/35 resize-none"
                  />
                )}

                {/* CTA Button */}
                <button
                  onClick={handleDonate}
                  disabled={isDonateDisabled()}
                  className="w-full py-4 rounded-full font-bold text-lg text-white border-none cursor-pointer transition-all duration-300 mb-4 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{ background: isDonateDisabled() ? 'rgba(255,255,255,0.1)' : config.accentGradient }}
                >
                  {isDonating ? (
                    <>
                      <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round"/>
                      </svg>
                      {config.actionVerb}…
                    </>
                  ) : (
                    <>{config.supportIcon} {config.supportLabel}</>
                  )}
                </button>

                <div className="text-center text-white/50 text-xs mb-5">
                  🔒 {config.securityMsg}
                </div>

                {/* Share */}
                <div>
                  <div className="text-white/50 text-xs text-center mb-3">{config.shareMsg}</div>
                  <div className="flex justify-center gap-2">
                    {[
                      { key: 'twitter', icon: 'X', title: 'Share on X/Twitter' },
                      { key: 'facebook', icon: 'f', title: 'Share on Facebook' },
                      { key: 'whatsapp', icon: '📲', title: 'Share on WhatsApp' },
                      { key: 'copy', icon: '🔗', title: 'Copy Link' },
                    ].map((s) => (
                      <button
                        key={s.key}
                        onClick={() => share(s.key)}
                        title={s.title}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 text-sm transition-all duration-200 border border-white/15 hover:border-white/40 hover:bg-white/10 hover:-translate-y-0.5"
                      >
                        {s.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Recent supporters ── */}
              <div className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl p-5">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <span style={{ color: config.accentColor }}>❤</span>
                  Recent {config.supportersLabel}
                </h4>
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {RECENT_DONATIONS.map((d) => (
                    <div key={d.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: config.accentGradient }}
                      >
                        {d.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-white text-sm font-medium">{d.name}</span>
                          <span className="text-sm font-bold flex-shrink-0" style={{ color: config.accentColor }}>
                            ₦{d.amount.toLocaleString()}
                          </span>
                        </div>
                        {d.message && <div className="text-white/50 text-xs mt-0.5 italic">"{d.message}"</div>}
                        <div className="text-white/40 text-xs mt-0.5">{d.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success toast */}
      {showSuccess && (
        <div
          className="fixed bottom-6 right-4 sm:right-6 text-white px-5 py-4 rounded-2xl shadow-2xl z-50 max-w-xs text-sm font-medium border"
          style={{ background: 'rgba(0,0,0,0.85)', borderColor: config.borderAccent, backdropFilter: 'blur(16px)' }}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">{config.supportIcon}</span>
            <span>{config.successMsg}</span>
          </div>
        </div>
      )}
    </>
  );
}