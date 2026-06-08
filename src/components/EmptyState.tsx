'use client';

import { Button } from '@/components/ui/button';
import { Inbox, Plus, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  onRetry?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction, onRetry }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-5xl mb-4 opacity-30">
        {icon || <Inbox className="size-12 mx-auto text-muted-foreground/30" />}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      {description && <p className="text-muted-foreground text-sm mb-6 max-w-sm text-center">{description}</p>}
      <div className="flex items-center gap-3">
        {actionLabel && onAction && (
          <Button onClick={onAction} size="sm">
            <Plus className="size-4 mr-1" /> {actionLabel}
          </Button>
        )}
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="size-4 mr-1" /> Retry
          </Button>
        )}
      </div>
    </div>
  );
}
