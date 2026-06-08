'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collectionService } from '@/services';
import { toast } from 'sonner';
import { CollectionCard } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import type { Collection } from '@/lib/api-types';

export default function CampaignsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await collectionService.getAllCollections({ limit: 100 });
        setCollections(res.data);
      } catch {
        toast.error('Failed to load campaigns');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = collections.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground mt-1">Manage your fundraising campaigns.</p>
        </div>
        <Link href="/create_collection">
          <Button><Plus className="size-4" /> Create Campaign</Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">{searchTerm ? 'No matching campaigns.' : 'No campaigns yet.'}</p>
          <Link href="/create_collection"><Button><Plus className="size-4" /> Create Your First Campaign</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((col) => (
            <CollectionCard
              key={col._id}
              _id={col._id}
              type={col.type}
              title={col.title}
              goal={col.goal}
              raised={col.raised}
              supporters={col.supporters}
              daysLeft={col.daysLeft}
              primaryImage={col.primaryImage}
              images={col.images}
              status={col.status}
            />
          ))}
        </div>
      )}
    </div>
  );
}
