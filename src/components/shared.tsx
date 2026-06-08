import { cn } from '@/lib/utils';
import type { CollectionType } from '@/lib/type-config';
import { TYPE_CONFIG } from '@/lib/type-config';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  className?: string;
}

export function StatCard({ icon, label, value, className }: StatCardProps) {
  return (
    <Card className={cn('p-4 sm:p-6', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div className="text-right">
          <div className="text-2xl sm:text-3xl font-bold text-foreground">{value}</div>
          <div className="text-muted-foreground text-sm">{label}</div>
        </div>
      </div>
    </Card>
  );
}

interface CollectionCardProps {
  _id: string;
  type: CollectionType;
  title: string;
  description?: string;
  goal: number;
  raised: number;
  supporters: number;
  daysLeft?: number;
  primaryImage?: { url: string };
  images?: { url: string }[];
  creator?: { name: string };
  location?: string;
  featured?: boolean;
  eventDate?: string;
  status?: string;
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isProcessing?: string | null;
}

export function CollectionCard({
  _id,
  type,
  title,
  description,
  goal,
  raised,
  supporters,
  daysLeft,
  primaryImage,
  images,
  creator,
  location,
  featured,
  eventDate,
  showActions,
  onDelete,
  isProcessing,
}: CollectionCardProps) {
  const meta = TYPE_CONFIG[type];
  const pct = goal ? Math.min(Math.round((raised / goal) * 100), 100) : 0;
  const imageUrl =
    primaryImage?.url ||
    images?.[0]?.url ||
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80';

  return (
    <Card className="group overflow-hidden">
      <div className="relative overflow-hidden h-48">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <Badge
          className="absolute top-3 left-3"
          style={{ background: meta.bgAccent, color: meta.accentColor, border: `1px solid ${meta.borderAccent}` }}
        >
          {meta.emoji} {meta.label}
        </Badge>
        <div className="absolute top-3 right-3 text-xs text-white bg-black/40 rounded-full px-2.5 py-1 backdrop-blur-sm">
          {type === 'occasion' && eventDate
            ? `\u{1F4C5} ${new Date(eventDate).toLocaleDateString()}`
            : `${daysLeft || 0}d left`}
        </div>
        {featured && (
          <Badge
            className="absolute bottom-3 left-3"
            style={{ background: meta.accentGradient, color: '#fff' }}
          >
            Featured
          </Badge>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-foreground font-bold text-base leading-snug mb-1.5 line-clamp-2">
          {title}
        </h3>
        {description && (
          <p className="text-muted-foreground text-xs leading-relaxed mb-4 line-clamp-2">
            {description}
          </p>
        )}
        {creator && (
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-4">
            <span style={{ color: meta.accentColor }}>▸</span>
            {creator.name || 'Anonymous'} {location ? `· ${location}` : ''}
          </div>
        )}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-bold" style={{ color: meta.accentColor }}>
              ₦{raised.toLocaleString()} {type === 'fundraiser' ? 'raised' : type === 'occasion' ? 'gifted' : 'received'}
            </span>
            <span className="text-muted-foreground">{pct}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: meta.accentGradient }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <span>
            <span className="text-foreground font-semibold">{supporters}</span>{' '}
            {type === 'fundraiser' ? 'donors' : type === 'occasion' ? 'gift givers' : 'supporters'}
          </span>
          {goal > 0 && <span>Goal: ₦{goal.toLocaleString()}</span>}
        </div>
        {showActions ? (
          <div className="flex gap-2">
            <Link href={`/collection_detail/${_id}`} className="flex-1 inline-flex items-center justify-center h-9 px-3 rounded-lg text-xs font-semibold bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 transition-colors">
              View
            </Link>
            <Link href={`/edit_collection/${_id}`} className="inline-flex items-center justify-center h-9 px-3 rounded-lg text-xs font-semibold bg-background shadow-sm ring-1 ring-inset ring-input hover:bg-accent transition-colors">
              Edit
            </Link>
            {onDelete && (
              <button
                onClick={() => onDelete(_id)}
                disabled={isProcessing === _id}
                className="inline-flex items-center justify-center h-9 px-3 rounded-lg text-xs font-semibold bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 transition-colors disabled:opacity-50"
              >
                {isProcessing === _id ? <Loader2 className="size-4 animate-spin" /> : 'Delete'}
              </button>
            )}
          </div>
        ) : (
          <Link
            href={`/collection_detail/${_id}`}
            className="block w-full py-3 rounded-xl font-bold text-sm text-white text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            style={{ background: meta.accentGradient }}
          >
            {meta.ctaText} {meta.emoji}
          </Link>
        )}
      </div>
    </Card>
  );
}
