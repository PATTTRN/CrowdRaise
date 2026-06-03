'use client';
import { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  count?: number;
}

export function ParticleBackground({ count = 30 }: ParticleBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const container = ref.current;
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * 6}s`;
      p.style.animationDuration = `${Math.random() * 4 + 4}s`;
      container.appendChild(p);
    }
  }, [count]);

  return <div className="bg-particles" ref={ref} />;
}
