'use client';

import { useEffect, useCallback } from 'react';
import { TYPE_CONFIG, type CollectionType } from '@/lib/type-config';

export function FullHeroCarousel({
  selectedType,
  setSelectedType,
  COLLECTION_TYPES,
}: {
  selectedType: CollectionType;
  setSelectedType: (type: CollectionType) => void;
  COLLECTION_TYPES: { id: CollectionType; desc: string }[];
}) {
  const navigate = (direction: 1 | -1) => {
    const idx = COLLECTION_TYPES.findIndex((t) => t.id === selectedType);
    const next = (idx + direction + COLLECTION_TYPES.length) % COLLECTION_TYPES.length;
    setSelectedType(COLLECTION_TYPES[next].id);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigate(-1);
      else if (e.key === 'ArrowRight') navigate(1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedType]);

  return (
    <div className="relative h-[48vh] min-h-[340px] md:min-h-[430px] lg:min-h-[525px] w-full overflow-hidden flex items-stretch justify-stretch" style={{ zIndex: 0 }}>
      {COLLECTION_TYPES.map((t) => {
        const config = TYPE_CONFIG[t.id];
        const isActive = selectedType === t.id;
        return (
          <div
            key={t.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-30' : 'opacity-0 z-10 pointer-events-none'}`}
            style={{
              backgroundImage: `url('${config.heroImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
            aria-hidden={!isActive}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/10" />
            <div className="relative h-full flex flex-col justify-center px-7 md:px-14 lg:px-20 w-auto">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5 border mt-9 w-max"
                style={{
                  color: config.color,
                  background: config.bgAccent,
                  borderColor: config.borderAccent,
                }}
              >
                {config.emoji} {config.tagline}
              </div>
              <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white drop-shadow-xl mb-2">
                Create a {config.label}
              </h1>
              <p className="text-white/80 text-lg leading-relaxed font-medium max-w-xl drop-shadow-lg mb-5">
                {t.desc}
              </p>
            </div>
          </div>
        );
      })}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-6 flex gap-3 z-40">
        {COLLECTION_TYPES.map((t) => (
          <button
            type="button"
            key={t.id}
            className={`w-3 h-3 rounded-full transition-all duration-200 border-2 shadow cursor-pointer ${
              selectedType === t.id ? 'bg-white border-white scale-125' : 'bg-white/50 border-white/40'
            }`}
            aria-label={`Show ${TYPE_CONFIG[t.id].label} banner`}
            onClick={() => setSelectedType(t.id)}
          />
        ))}
      </div>
      <button
        type="button"
        aria-label="Previous"
        className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-black/40 text-white hover:bg-black/70 items-center justify-center transition cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <svg width={26} height={26} viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <button
        type="button"
        aria-label="Next"
        className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-black/40 text-white hover:bg-black/70 items-center justify-center transition cursor-pointer"
        onClick={() => navigate(1)}
      >
        <svg width={26} height={26} viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
      </button>
    </div>
  );
}
