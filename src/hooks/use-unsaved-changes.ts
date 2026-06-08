'use client';

import { useEffect, useCallback } from 'react';

export function useUnsavedChanges(isDirty: boolean) {
  const beforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  }, [isDirty]);

  useEffect(() => {
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [beforeUnload]);
}
