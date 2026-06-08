'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { exploreService, type ExploreCollection } from '@/services';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const TYPE_META = {
  fundraiser: { label: 'Fundraiser', emoji: '🌟', color: '#635bff', gradient: 'linear-gradient(135deg, #635bff, #3b82f6)', bg: 'rgba(99,91,255,0.08)', border: 'rgba(99,91,255,0.2)', ctaText: 'Donate Now' },
  occasion: { label: 'Occasion Gift', emoji: '🎉', color: '#a855f7', gradient: 'linear-gradient(135deg, #a855f7, #ec4899)', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.2)', ctaText: 'Send a Gift' },
  tips: { label: 'Tips', emoji: '💸', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.2)', ctaText: 'Show Love' },
} as const;

type CollectionType = keyof typeof TYPE_META;

const TYPE_FILTERS = [
  { key: 'all', label: 'All', emoji: '✦' },
  { key: 'fundraiser', label: 'Fundraiser', emoji: '🌟' },
  { key: 'occasion', label: 'Occasion', emoji: '🎉' },
  { key: 'tips', label: 'Tips', emoji: '💸' },
];

const CATEGORIES = [
  'Medical & Healthcare', 'Education', 'Emergency & Crisis', 'Community Development',
  'Wedding', 'Birthday', 'Baby Shower', 'Anniversary',
  'Music & Entertainment', 'Food & Hospitality', 'Performer / Artist', 'Animal Welfare', 'Arts & Culture', 'Other',
];

export default function ExplorePage() {
  const [collections, setCollections] = useState<ExploreCollection[]>([]);
  const [featured, setFeatured] = useState<ExploreCollection[]>([]);
  const [trending, setTrending] = useState<ExploreCollection[]>([]);
  const [almostFunded, setAlmostFunded] = useState<ExploreCollection[]>([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const fetchMainGrid = useCallback(async (pageNum: number, append: boolean) => {
    if (pageNum === 1 && !append) setIsLoading(true);
    else setIsLoadingMore(true);
    try {
      const params: Record<string, string | number | undefined> = {
        status: 'active', limit: 12, page: pageNum, sort: sortBy,
      };
      if (typeFilter !== 'all') params.type = typeFilter;
      if (categoryFilter) params.category = categoryFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await exploreService.getAll(params);
      if (append) {
        setCollections((prev) => [...prev, ...response.data]);
      } else {
        setCollections(response.data);
      }
      setTotalPages(response.totalPages);
    } catch { /* ignore */ }
    finally { setIsLoading(false); setIsLoadingMore(false); setInitialLoaded(true); }
  }, [typeFilter, categoryFilter, searchTerm, sortBy]);

  useEffect(() => {
    setPage(1);
    fetchMainGrid(1, false);
  }, [fetchMainGrid]);

  useEffect(() => {
    exploreService.getFeatured().then((r) => setFeatured(r.data)).catch(() => {});
    exploreService.getTrending().then((r) => setTrending(r.data)).catch(() => {});
    exploreService.getAlmostFunded().then((r) => setAlmostFunded(r.data)).catch(() => {});
  }, []);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchMainGrid(next, true);
  };

  const CampaignCard = ({ c }: { c: ExploreCollection }) => {
    const meta = TYPE_META[c.type as CollectionType];
    const pct = c.goal ? Math.min(Math.round((c.raised / c.goal) * 100), 100) : 0;
    const imageUrl = c.primaryImage?.url || c.images?.[0]?.url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80';

    return (
      <Link
        href={`/collection_detail/${c._id}`}
        className="group block"
        onMouseEnter={() => setHoveredId(c._id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        <div className="bg-white rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
          <div className="relative overflow-hidden h-48">
            <img src={imageUrl} alt={c.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
              {meta.emoji} {meta.label}
            </div>
            <div className="absolute top-3 right-3 text-xs text-white bg-black/40 rounded-full px-2.5 py-1 backdrop-blur-sm">
              {c.type === 'occasion' && c.eventDate ? `📅 ${new Date(c.eventDate).toLocaleDateString()}` : `${c.daysLeft || 0}d left`}
            </div>
            {c.featured && (
              <div className="absolute bottom-3 left-3 text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ background: meta.gradient }}>
                ✦ Featured
              </div>
            )}
          </div>

          <div className="p-5">
            <h3 className="font-bold text-base leading-snug mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">{c.title}</h3>
            <p className="text-muted-foreground text-xs leading-relaxed mb-4 line-clamp-2">{c.description}</p>

            <div className="flex items-center gap-1.5 text-xs mb-4">
              <span style={{ color: meta.color }}>▸</span>
              <span className="text-muted-foreground">{c.creator?.name || 'Anonymous'}</span>
              {c.creatorTrust?.isVerified && (
                <span className="text-blue-500 flex items-center gap-0.5" title="Verified creator">
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                </span>
              )}
              {c.location && <span className="text-muted-foreground">· {c.location}</span>}
            </div>

            {/* Hover preview */}
            {hoveredId === c._id && (
              <div className="mb-3 p-3 rounded-xl bg-muted/50 text-xs text-muted-foreground space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {c.creatorTrust && (
                  <div className="flex gap-3">
                    <span>{c.creatorTrust.completedCampaigns} campaigns</span>
                    <span>₦{c.creatorTrust.totalRaised.toLocaleString()} raised</span>
                  </div>
                )}
              </div>
            )}

            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-bold" style={{ color: meta.color }}>
                  ₦{c.raised.toLocaleString()} {c.type === 'fundraiser' ? 'raised' : c.type === 'occasion' ? 'gifted' : 'received'}
                </span>
                {c.goal > 0 && <span className="text-muted-foreground">{pct}%</span>}
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: meta.gradient }} />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
              <span><span className="text-foreground font-semibold">{c.supporters}</span> {c.type === 'fundraiser' ? 'donors' : c.type === 'occasion' ? 'gift givers' : 'supporters'}</span>
              {c.goal > 0 && <span>Goal: ₦{c.goal.toLocaleString()}</span>}
            </div>

            <div className="block w-full py-3 rounded-xl font-bold text-sm text-white text-center transition-all duration-200 group-hover:shadow-md" style={{ background: meta.gradient }}>
              {meta.ctaText} {meta.emoji}
            </div>
          </div>
        </div>
      </Link>
    );
  };

  if (isLoading && !initialLoaded) {
    return (
      <div className="min-h-screen bg-secondary/30 pt-[var(--header-height)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <Skeleton className="h-12 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-64 mx-auto mb-8" />
          <div className="flex gap-2 justify-center mb-8">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-10 w-24 rounded-full" />)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-96 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Hero section */}
      <div className="bg-white border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Discover Collections</h1>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Fundraisers, gift collections, and tip pages making an impact across Nigeria.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-6">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 10l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text" placeholder="Search campaigns…"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-border bg-background text-sm focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {TYPE_FILTERS.map((tf) => {
              const meta = tf.key !== 'all' ? TYPE_META[tf.key as CollectionType] : null;
              const isActive = typeFilter === tf.key;
              return (
                <button
                  key={tf.key}
                  onClick={() => { setTypeFilter(tf.key); setPage(1); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
                  style={isActive && meta ? { background: meta.gradient, color: '#fff' } : isActive ? { background: '#000', color: '#fff' } : { background: 'var(--muted)', color: 'var(--muted-foreground)' }}
                >
                  <span>{tf.emoji}</span> {tf.label}
                </button>
              );
            })}
          </div>

          {/* Category scrollable row */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide max-w-3xl mx-auto justify-center flex-wrap">
            <button
              onClick={() => { setCategoryFilter(''); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${!categoryFilter ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50'}`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategoryFilter(cat); setPage(1); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${categoryFilter === cat ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* Featured row */}
          {featured.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-lg">🏆</span>
                <h2 className="text-xl font-bold">Featured Collections</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {featured.map((c) => <CampaignCard key={c._id} c={c} />)}
              </div>
            </section>
          )}

          {/* Trending row */}
          {trending.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-lg">🔥</span>
                <h2 className="text-xl font-bold">Trending Now</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {trending.slice(0, 6).map((c) => <CampaignCard key={c._id} c={c} />)}
              </div>
            </section>
          )}

          {/* Almost funded */}
          {almostFunded.length > 0 && (
            <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-8 border border-amber-200/50">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-lg">🚀</span>
                <h2 className="text-xl font-bold">Almost Funded</h2>
                <span className="text-sm text-muted-foreground ml-auto">Within 10% of their goal</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {almostFunded.slice(0, 3).map((c) => <CampaignCard key={c._id} c={c} />)}
              </div>
            </section>
          )}

          {/* Main grid */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">All Campaigns</h2>
                <span className="text-sm text-muted-foreground">({collections.length})</span>
              </div>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="-createdAt">Newest</option>
                <option value="-supporters">Most Popular</option>
                <option value="deadline">Ending Soon</option>
                <option value="-goal">Highest Goal</option>
              </select>
            </div>

            <div className="relative min-h-[300px]">
              {collections.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {collections.map((c) => <CampaignCard key={c._id} c={c} />)}
                </div>
              ) : (
                !isLoading && (
                  <div className="text-center py-20">
                    <div className="text-5xl mb-4 opacity-30">🔍</div>
                    <h3 className="text-2xl font-bold mb-2">No collections found</h3>
                    <p className="text-muted-foreground mb-6">Try different search terms or filters</p>
                    <button onClick={() => { setSearchTerm(''); setTypeFilter('all'); setCategoryFilter(''); setSortBy('-createdAt'); }}
                      className="px-6 py-3 rounded-full font-semibold text-sm border border-border bg-background hover:bg-muted transition-all cursor-pointer">
                      Clear all filters
                    </button>
                  </div>
                )
              )}

              {isLoadingMore && (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/30 border-t-primary" />
                </div>
              )}
            </div>

            {/* Load More */}
            {page < totalPages && !isLoading && (
              <div className="text-center mt-8">
                <button onClick={loadMore} disabled={isLoadingMore}
                  className="px-8 py-3 rounded-full font-semibold text-sm border-2 border-border bg-background hover:bg-muted hover:border-primary/30 transition-all cursor-pointer disabled:opacity-50">
                  {isLoadingMore ? 'Loading…' : 'Load More Campaigns'}
                </button>
              </div>
            )}
          </section>

          {/* CTA */}
          <section className="rounded-3xl p-10 sm:p-14 border border-border bg-gradient-to-br from-primary/[0.03] via-purple-50 to-cyan-50 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to start your own collection?</h2>
            <p className="text-muted-foreground mb-7 max-w-lg mx-auto">
              Whether it&apos;s a fundraiser, a gift collection, or a tip page — you&apos;re 3 minutes from going live.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {(['fundraiser', 'occasion', 'tips'] as CollectionType[]).map((type) => {
                const m = TYPE_META[type];
                return (
                  <Link key={type} href={`/create_collection?type=${type}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ background: m.gradient }}>
                    {m.emoji} {m.label === 'Tips' ? 'Tip Page' : m.label}
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
