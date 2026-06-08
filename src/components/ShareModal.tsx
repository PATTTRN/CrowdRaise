'use client';

import { useState } from 'react';
import { X, Check, Copy, Globe, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export function ShareModal({ open, onClose, url, title }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const shareLinks = [
    { name: 'X', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, icon: Globe, color: 'bg-black' },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, icon: MessageCircle, color: 'bg-blue-600' },
    { name: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, icon: Send, color: 'bg-green-500' },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Share Campaign</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">Share this campaign with your network to raise more funds.</p>

        {/* Copy link */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-muted mb-6">
          <input type="text" value={url} readOnly className="flex-1 bg-transparent text-sm truncate focus:outline-none" />
          <button onClick={handleCopy} className="shrink-0 p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all">
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </button>
        </div>

        {/* Social buttons */}
        <div className="flex gap-3">
          {shareLinks.map((link) => (
            <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:-translate-y-0.5 ${link.color}`}>
              <link.icon className="size-4" /> {link.name}
            </a>
          ))}
        </div>

        <Button onClick={onClose} variant="outline" className="w-full mt-6">Done</Button>
      </div>
    </div>
  );
}
