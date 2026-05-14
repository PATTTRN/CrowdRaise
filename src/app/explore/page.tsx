'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { collectionService } from '@/services';
import { toast } from 'sonner';

// ─── Type meta ──────────────────────────────────────────────────────────────
const TYPE_META = {
  fundraiser: {
    label: 'Fundraiser',
    emoji: '🌟',
    color: '#f43f5e',
    gradient: 'linear-gradient(135deg, #f43f5e, #720d40ff)',
    bg: 'rgba(244,63,94,0.12)',
    border: 'rgba(244,63,94,0.28)',
    ctaText: 'Donate Now',
  },
  occasion: {
    label: 'Occasion Gift',
    emoji: '🎉',
    color: '#311d60ff',
    gradient: 'linear-gradient(135deg, #311d60ff, #ec4899)',
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

interface Collection {
  _id: string;
  type: CollectionType;
  title: string;
  category: string;
  creator: { name: string };
  location: string;
  goal: number;
  raised: number;
  supporters: number;
  daysLeft: number;
  primaryImage?: { url: string };
  images: { url: string }[];
  description: string;
  status: 'active' | 'completed';
  eventDate?: string;
  featured?: boolean;
}

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

type SortByType = 'newest' | 'popular' | 'ending' | 'goal';

interface FetchCollectionsParams {
  status: string;
  limit: number;
  type?: string;
  category?: string;
  search?: string;
  sort?: string;
}

export default function ExplorePage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortByType>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false); // Track if initial load has happened
  const particlesRef = useRef<HTMLDivElement>(null);

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const params: FetchCollectionsParams = {
        status: 'active',
        limit: 50,
      };

      if (typeFilter !== 'all') params.type = typeFilter;
      if (categoryFilter !== 'All Categories') params.category = categoryFilter;
      if (searchTerm) params.search = searchTerm;

      // Map frontend sorts to backend sorts
      const sortMap: Record<SortByType, string> = {
        newest: '-createdAt',
        popular: '-supporters',
        ending: 'deadline',
        goal: '-goal'
      };
      params.sort = sortMap[sortBy];

      const response = await collectionService.getAllCollections(params);
      setCollections(response.data);
    } catch (error: unknown) {
      toast.error('Failed to load collections');
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setIsLoading(false);
      setInitialLoaded(true);
    }
  };

  useEffect(() => {
    // Particle effect
    if (particlesRef.current) {
      const container = particlesRef.current;
      container.innerHTML = '';
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 100}%`;
        p.style.animationDelay = `${Math.random() * 6}s`;
        p.style.animationDuration = `${Math.random() * 4 + 4}s`;
        container.appendChild(p);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCollections();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [typeFilter, categoryFilter, searchTerm, sortBy]);


  // Only show full-screen loader during the initial load, after that only show a partial loader
  if (isLoading && !initialLoaded) {
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
              `linear-gradient(rgba(20, 20, 30, 0.82), rgba(30,20,60, 0.78)), url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=1200&q=80)`,
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
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer"
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
              onChange={e => setSortBy(e.target.value as SortByType)}
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
            Showing <span className="text-white font-semibold">{collections.length}</span> of {collections.length} collections
          </div>

          {/* ── Cards grid ── */}
          <div className="relative min-h-[300px]">
            {isLoading && initialLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20 rounded-2xl">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/20 border-t-cyan-400 mb-3"></div>
                  <p className="text-white/60 text-sm">Discovering collections…</p>
                </div>
              </div>
            )}

            {collections.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {collections.map((c) => {
                  const meta = TYPE_META[c.type];
                  const pct = c.goal ? Math.min(Math.round((c.raised / c.goal) * 100), 100) : 0;
                  const imageUrl = c.primaryImage?.url || c.images?.[0]?.url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80';
                  
                  return (
                    <div
                      key={c._id}
                      className="group bg-white/5 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-white/20"
                    >
                      {/* Image */}
                      <div className="relative overflow-hidden h-48">
                        <img
                          src={imageUrl}
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
                          {c.type === 'occasion' && c.eventDate ? `📅 ${new Date(c.eventDate).toLocaleDateString()}` : `${c.daysLeft || 0}d left`}
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
                          {c.creator?.name || 'Anonymous'} &middot; {c.location}
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
                          {c.goal > 0 && <span>Goal: ₦{c.goal.toLocaleString()}</span>}
                        </div>

                        {/* CTA */}
                        <Link
                          href={`/collection_detail/${c._id}`}
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
              !isLoading && (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">No collections found</h3>
                <p className="text-white/50 mb-6">Try different search terms or filters</p>
                <button
                  onClick={() => { setSearchTerm(''); setTypeFilter('all'); setCategoryFilter('All Categories'); }}
                  className="px-6 py-3 rounded-full font-semibold text-white text-sm border border-white/20 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            )
            )}
          </div>

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
                Whether it&apos;s a fundraiser, a gift collection, or a tip page — you&apos;re 3 minutes from going live.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {(['fundraiser', 'occasion', 'tips'] as CollectionType[]).map(type => {
                  const m = TYPE_META[type];
                  return (
                    <Link
                      key={type}
                      href={`/create_collection?type=${type}`}
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