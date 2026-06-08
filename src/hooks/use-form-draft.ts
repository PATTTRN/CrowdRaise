'use client';

import { useEffect, useCallback } from 'react';
import { useForm, type UseFormWatch } from 'react-hook-form';

const DRAFT_PREFIX = 'crowdraise_draft_';

export function useFormDraft(formKey: string, watch: UseFormWatch<Record<string, unknown>>, isDirty: boolean) {
  const storageKey = `${DRAFT_PREFIX}${formKey}`;

  useEffect(() => {
    if (!isDirty) return;
    const subscription = watch((values) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(values));
      } catch { /* quota exceeded */ }
    });
    return () => subscription.unsubscribe();
  }, [watch, isDirty, storageKey]);

  const loadDraft = useCallback(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [storageKey]);

  const clearDraft = useCallback(() => {
    try { localStorage.removeItem(storageKey); } catch { /* noop */ }
  }, [storageKey]);

  return { loadDraft, clearDraft };
}
