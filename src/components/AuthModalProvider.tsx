'use client';

import { useState, useEffect } from 'react';
import AuthModal from '@/app/components/AuthModal';

export function AuthModalProvider() {
  const [isOpen, setIsOpen] = useState(false);
  const [initialMode, setInitialMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.mode) setInitialMode(detail.mode);
      setIsOpen(true);
    };
    window.addEventListener('open-auth-modal', handler);
    return () => window.removeEventListener('open-auth-modal', handler);
  }, []);

  return <AuthModal isOpen={isOpen} onClose={() => setIsOpen(false)} initialMode={initialMode} />;
}
