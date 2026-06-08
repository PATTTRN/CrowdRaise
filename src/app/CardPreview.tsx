'use client';

import { useState } from 'react';

const COLLECTION_TYPES = [
  { id: 'fundraiser', label: 'Fundraiser', tagline: 'Rally support for a cause', gradient: 'from-indigo-500 to-blue-500', emoji: '\u{1F31F}' },
  { id: 'occasion', label: 'Occasion Gift', tagline: 'Make celebrations unforgettable', gradient: 'from-purple-500 to-pink-500', emoji: '\u{1F389}' },
  { id: 'tips', label: 'Tips', tagline: 'Let fans support your work', gradient: 'from-cyan-500 to-teal-500', emoji: '\u{1F4B8}' },
];

export function CardPreview() {
  const [activeCard, setActiveCard] = useState(0);
  const card = COLLECTION_TYPES[activeCard];
  const pcts = [74, 64, 47];

  return (
    <div className="flex-1 w-full max-w-md lg:max-w-none">
      <div className="mockup-card bg-white rounded-2xl shadow-xl border border-white/10 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white text-lg`}>
                {card.emoji}
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{card.label}</div>
                <div className="text-xs text-muted-foreground">{card.tagline}</div>
              </div>
            </div>
            <div className="flex gap-1.5">
              {COLLECTION_TYPES.map((_, i) => (
                <button key={i} onClick={() => setActiveCard(i)}
                  className="h-2 rounded-full transition-all duration-300 cursor-pointer"
                  style={{ width: i === activeCard ? 24 : 6, backgroundColor: i === activeCard ? '#635bff' : 'rgba(255,255,255,0.2)' }}
                  aria-label={`Switch to ${COLLECTION_TYPES[i].label}`} />
              ))}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="h-3 bg-white/10 rounded w-3/4" />
            <div className="h-3 bg-white/10 rounded w-1/2" />
            <div className="h-3 bg-white/10 rounded w-5/6" />
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-foreground">&#x20A6;485,000 raised</span>
              <span className="text-muted-foreground">{pcts[activeCard]}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full rounded-full bg-gradient-to-r ${card.gradient} transition-all duration-700`}
                style={{ width: `${pcts[activeCard]}%` }} />
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-green-400" /> 67 supporters
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-[#635bff]" /> 28 days left
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
