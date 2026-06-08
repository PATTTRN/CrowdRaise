'use client';

import { useEffect } from 'react';
import { syncAuthCookie } from '@/lib/auth-cookie';

export function AuthCookieSync() {
  useEffect(() => {
    syncAuthCookie();
  }, []);

  return null;
}
