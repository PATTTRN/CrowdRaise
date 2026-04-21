'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ─── Type meta ──────────────────────────────────────────────────────────────
const TYPE_META = {
  fundraiser: {
    label: 'Fundraiser',
    emoji: '🌟',
    color: '#f43f5e',
    gradient: 'linear-gradient(135deg, #f43f5e, #fb923c)',
    bg: 'rgba(244,63,94,0.12)',
    border: 'rgba(244,63,94,0.28)',
    ctaText: 'Donate Now',
  },
  occasion: {
    label: 'Occasion Gift',
    emoji: '🎉',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    bg: 'rgba(139,92,246,0.12)',
    border: 'rgba(139,92,246,0.28)',
    ctaText: 'Send a Gift',
  },
  tips: {
    label: 'Tips',
    emoji: '💸',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    bg: 'rgba(6,182,212,0.12)',
    border: 'rgba(6,182,212,0.28)',
    ctaText: 'Show Love',
  },
} as const;

type CollectionType = keyof typeof TYPE_META;

interface Campaign {
  id: string;
  type: CollectionType;
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
  status: 'active';
  occasionDate?: string;
  featured?: boolean;
}

const SAMPLE_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    type: 'fundraiser',
    title: 'Help Sarah Complete Her Medical School Journey',
    category: 'Medical & Healthcare',
    creator: 'Sarah Johnson',
    location: 'Lagos',
    goal: 650000,
    raised: 485000,
    supporters: 142,
    daysLeft: 28,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80',
    description: "Support Sarah's final year of medical school so she can serve her community as a doctor.",
    status: 'active',
    featured: true,
  },
  {
    id: '2',
    type: 'occasion',
    title: "Tobi & Chisom's Wedding Gift Collection 💍",
    category: 'Wedding',
    creator: 'Tobi Adeyemi',
    location: 'Lagos',
    goal: 500000,
    raised: 320000,
    supporters: 67,
    daysLeft: 14,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
    description: 'Send Tobi and Chisom your love as they begin their beautiful journey together.',
    status: 'active',
    occasionDate: 'March 15, 2025',
    featured: true,
  },
  {
    id: '3',
    type: 'tips',
    title: 'Support DJ Kemi – Show Love 🎶',
    category: 'Music & Entertainment',
    creator: 'Kemi Obi',
    location: 'Abuja',
    goal: 200000,
    raised: 95000,
    supporters: 89,
    daysLeft: 60,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80',
    description: 'DJ Kemi drops free sets every Friday. If her music hits different, tip her!',
    status: 'active',
    featured: true,
  },
  {
    id: '4',
    type: 'fundraiser',
    title: 'Build a Community Library for Rural Children',
    category: 'Education',
    creator: 'Community Dev Initiative',
    location: 'Kano',
    goal: 1200000,
    raised: 890000,
    supporters: 89,
    daysLeft: 45,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80',
    description: 'Help us build a library to give rural children access to educational resources.',
    status: 'active',
  },
  {
    id: '5',
    type: 'fundraiser',
    title: 'Emergency Relief for Flood Victims',
    category: 'Emergency & Crisis',
    creator: 'Disaster Relief Foundation',
    location: 'Port Harcourt',
    goal: 2500000,
    raised: 1800000,
    supporters: 234,
    daysLeft: 12,
    image: 'https://images.unsplash.com/photo-1574263867127-a8bdc5c3e3e7?w=600&q=80',
    description: 'Urgent: families displaced by severe flooding need your support right now.',
    status: 'active',
  },
  {
    id: '6',
    type: 'occasion',
    title: "Amaka's 30th Birthday Celebration 🎂",
    category: 'Birthday',
    creator: 'Friends of Amaka',
    location: 'Enugu',
    goal: 300000,
    raised: 195000,
    supporters: 43,
    daysLeft: 7,
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80',
    description: 'Celebrate with Amaka as she turns 30! Chip in to make her day unforgettable.',
    status: 'active',
    occasionDate: 'Feb 14, 2025',
  },
  {
    id: '7',
    type: 'tips',
    title: 'Tip Chef Emeka – Abuja Street Food King 🍲',
    category: 'Food & Hospitality',
    creator: 'Chef Emeka',
    location: 'Abuja',
    goal: 150000,
    raised: 62000,
    supporters: 54,
    daysLeft: 90,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
    description: 'Chef Emeka feeds Abuja with joy daily. Show him love and keep the flavours coming.',
    status: 'active',
  },
  {
    id: '8',
    type: 'occasion',
    title: "Ada & Kelechi's Baby Shower 👶",
    category: 'Baby Shower',
    creator: 'Ada Okonkwo',
    location: 'Onitsha',
    goal: 200000,
    raised: 130000,
    supporters: 31,
    daysLeft: 20,
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=80',
    description: 'The Okonkwos are expecting! Help welcome their little one into the world.',
    status: 'active',
    occasionDate: 'March 2, 2025',
  },
  {
    id: '9',
    type: 'tips',
    title: 'Support Tunde the Poet 🖊',
    category: 'Performer / Artist',
    creator: 'Tunde Bakare',
    location: 'Ibadan',
    goal: 100000,
    raised: 38000,
    supporters: 29,
    daysLeft: 120,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80',
    description: 'Tunde performs spoken word for free at community events. Help him keep going.',
    status: 'active',
  },
];

const TYPE_FILTERS: { key: string; label: string; emoji: string }[] = [
  { key: 'all', label: 'All Collections', emoji: '✦' },
  { key: 'fundraiser', label: 'Fundraisers', emoji: '🌟' },
  { key: 'occasion', label: 'Occasion Gifts', emoji: '🎉' },
  { key: 'tips', label: 'Tips Pages', emoji: '💸' },
];

const CATEGORIES = [
  'All Categories', 'Medical & Healthcare', 'Education', 'Emergency & Crisis',
  'Community Development', 'Wedding', 'Birthday', 'Baby Shower', 'Anniversary',
  'Music & Entertainment', 'Food & Hospitality', 'Performer / Artist',
];

export default function ExplorePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filtered, setFiltered] = useState<Campaign[]>([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'ending' | 'goal'>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const particlesRef = useRef<HTMLDivElement>(null);

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
    setTimeout(() => {
      setCampaigns(SAMPLE_CAMPAIGNS);
      setFiltered(SAMPLE_CAMPAIGNS);
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let result = [...campaigns];
    if (typeFilter !== 'all') result = result.filter(c => c.type === typeFilter);
    if (categoryFilter !== 'All Categories') result = result.filter(c => c.category === categoryFilter);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.creator.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case 'popular': result.sort((a, b) => b.supporters - a.supporters); break;
      case 'ending': result.sort((a, b) => a.daysLeft - b.daysLeft); break;
      case 'goal': result.sort((a, b) => b.goal - a.goal); break;
      default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    setFiltered(result);
  }, [campaigns, typeFilter, categoryFilter, searchTerm, sortBy]);

  if (isLoading) {
    return (
      <>
        <div className="bg-particles" ref={particlesRef}></div>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-2 border-white/20 border-t-cyan-400 mx-auto mb-4"></div>
            <p className="text-white/60">Discovering collections…</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-particles" ref={particlesRef}></div>

      {/* ── Hero with background image ── */}
      <div className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 z-10 mb-6">
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
          style={{
            zIndex: 0,
            backgroundImage:
              `linear-gradient(rgba(20, 20, 30, 0.82), rgba(30,20,60, 0.78)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=1200&q=80')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          {/* ── Header ── */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
              Discover Collections
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto drop-shadow">
              Fundraisers, gift collections, and tip pages — all making an impact across Nigeria.
            </p>
          </div>

          {/* ── Type filter tabs ── */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {TYPE_FILTERS.map((tf) => {
              const meta = tf.key !== 'all' ? TYPE_META[tf.key as CollectionType] : null;
              const isActive = typeFilter === tf.key;
              return (
                <button
                  key={tf.key}
                  onClick={() => setTypeFilter(tf.key)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
                  style={isActive && meta
                    ? { background: meta.gradient, color: '#fff' }
                    : isActive
                    ? { background: 'rgba(255,255,255,0.2)', color: '#fff' }
                    : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }
                  }
                >
                  <span>{tf.emoji}</span>
                  {tf.label}
                </button>
              );
            })}
          </div>

          {/* ── Search + additional filters ── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 10l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search collections…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/15 bg-white/5 text-white text-sm placeholder:text-white/35 focus:outline-none focus:border-white/30 backdrop-blur-md"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-white/15 bg-white/5 text-white/80 text-sm focus:outline-none backdrop-blur-md"
            >
              {CATEGORIES.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-3 rounded-xl border border-white/15 bg-white/5 text-white/80 text-sm focus:outline-none backdrop-blur-md"
            >
              <option value="newest" className="bg-gray-900">Featured First</option>
              <option value="popular" className="bg-gray-900">Most Supporters</option>
              <option value="ending" className="bg-gray-900">Ending Soon</option>
              <option value="goal" className="bg-gray-900">Highest Goal</option>
            </select>
          </div>
        </div>
      </div>
      {/* End of hero with background */}

      <div className="pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* ── Results count ── */}
          <div className="mb-6 text-white/45 text-sm text-center">
            Showing <span className="text-white font-semibold">{filtered.length}</span> of {campaigns.length} collections
          </div>

          {/* ── Cards grid ── */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((c) => {
                const meta = TYPE_META[c.type];
                const pct = Math.min(Math.round((c.raised / c.goal) * 100), 100);
                return (
                  <div
                    key={c.id}
                    className="group bg-white/5 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-white/20"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={c.image}
                        alt={c.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Type badge */}
                      <div
                        className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm"
                        style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}
                      >
                        {meta.emoji} {meta.label}
                      </div>

                      {/* Days left / occasion date */}
                      <div className="absolute top-3 right-3 text-xs text-white/85 bg-black/40 rounded-full px-2.5 py-1 backdrop-blur-sm">
                        {c.type === 'occasion' && c.occasionDate ? `📅 ${c.occasionDate}` : `${c.daysLeft}d left`}
                      </div>

                      {/* Featured badge */}
                      {c.featured && (
                        <div
                          className="absolute bottom-3 left-3 text-xs font-bold text-white px-2 py-0.5 rounded-full"
                          style={{ background: meta.gradient }}
                        >
                          ✦ Featured
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-white font-bold text-base leading-snug mb-1.5 line-clamp-2 group-hover:text-white transition-colors">
                        {c.title}
                      </h3>
                      <p className="text-white/50 text-xs leading-relaxed mb-4 line-clamp-2">
                        {c.description}
                      </p>

                      {/* Creator */}
                      <div className="flex items-center gap-1.5 text-white/40 text-xs mb-4">
                        <span style={{ color: meta.color }}>▸</span>
                        {c.creator} · {c.location}
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-bold" style={{ color: meta.color }}>
                            ₦{c.raised.toLocaleString()} {c.type === 'fundraiser' ? 'raised' : c.type === 'occasion' ? 'gifted' : 'received'}
                          </span>
                          <span className="text-white/45">{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${pct}%`, background: meta.gradient }}
                          />
                        </div>
                      </div>

                      {/* Stats row */}
                      <div className="flex items-center justify-between text-xs text-white/40 mb-4">
                        <span>
                          <span className="text-white font-semibold">{c.supporters}</span>{' '}
                          {c.type === 'fundraiser' ? 'donors' : c.type === 'occasion' ? 'gift givers' : 'supporters'}
                        </span>
                        <span>Goal: ₦{c.goal.toLocaleString()}</span>
                      </div>

                      {/* CTA */}
                      <Link
                        href={`/campaign/${c.id}`}
                        className="block w-full py-3 rounded-xl font-bold text-sm text-white text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                        style={{ background: meta.gradient }}
                      >
                        {meta.ctaText} {meta.emoji}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No collections found</h3>
              <p className="text-white/50 mb-6">Try different search terms or filters</p>
              <button
                onClick={() => { setSearchTerm(''); setTypeFilter('all'); setCategoryFilter('All Categories'); }}
                className="px-6 py-3 rounded-full font-semibold text-white text-sm border border-white/20 bg-white/5 hover:bg-white/10 transition-all"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* ── CTA bottom ── */}
          <div className="mt-16 text-center">
            <div
              className="rounded-3xl p-10 sm:p-14 border border-white/10 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.08), rgba(139,92,246,0.08), rgba(6,182,212,0.08))' }}
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Ready to start your own collection?
              </h2>
              <p className="text-white/60 mb-7 max-w-lg mx-auto">
                Whether it's a fundraiser, a gift collection, or a tip page — you're 3 minutes from going live.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {(['fundraiser', 'occasion', 'tips'] as CollectionType[]).map(type => {
                  const m = TYPE_META[type];
                  return (
                    <Link
                      key={type}
                      href={`/create_campaign?type=${type}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                      style={{ background: m.gradient }}
                    >
                      {m.emoji} {m.label === 'Tips' ? 'Tip Page' : m.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}