'use client';

import { useState, useEffect } from 'react';
import { collectionService, contributionService } from '@/services';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import type { Collection, Contribution } from '@/lib/api-types';

export default function DonationsPage() {
  const [donations, setDonations] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const colRes = await collectionService.getAllCollections({ limit: 100 });
        const all: Contribution[] = [];
        for (const col of colRes.data) {
          try {
            const res = await contributionService.getCollectionContributions(col._id);
            all.push(...res.data);
          } catch { /* skip */ }
        }
        all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setDonations(all);
      } catch {
        toast.error('Failed to load donations');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Donations</h1>
        <p className="text-muted-foreground mt-1">All contributions received across your campaigns.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : donations.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="size-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">No donations yet. Share your campaign to start receiving contributions.</p>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  {['Supporter', 'Collection', 'Amount', 'Date', 'Message'].map((h) => (
                    <th key={h} className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {donations.map((d) => (
                  <tr key={d._id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                          {(d.supporterName || 'A').charAt(0)}
                        </div>
                        <span className="text-sm font-medium">{d.supporterName || 'Anonymous'}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">{d.collectionTitle}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-primary">₦{d.amount.toLocaleString()}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-muted-foreground">{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">{d.message || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
