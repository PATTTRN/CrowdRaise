'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { notificationService, type NotificationItem } from '@/services';
import {
  LayoutDashboard, Megaphone, Heart, Wallet, Settings,
  LogOut, Menu, X, ChevronRight, ArrowUpRight, Bell, BellDot
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, segment: null },
  { href: '/dashboard/campaigns', label: 'Campaigns', icon: Megaphone, segment: 'campaigns' },
  { href: '/dashboard/donations', label: 'Donations', icon: Heart, segment: 'donations' },
  { href: '/dashboard/finance', label: 'Finance', icon: Wallet, segment: 'finance' },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, segment: 'settings' },
];

export default function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetch = async () => {
      try {
        const res = await notificationService.getAll();
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount);
      } catch {}
    };
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleMarkRead = async (ids: string[]) => {
    try {
      await notificationService.markRead(ids);
      setNotifications((prev) => prev.map((n) => (ids.includes(n._id) ? { ...n, read: true } : n)));
      setUnreadCount((c) => Math.max(0, c - ids.length));
    } catch {}
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <LayoutDashboard className="size-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Your Dashboard</h2>
          <p className="text-muted-foreground mb-8">Please log in to view your dashboard.</p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal'))}
            className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-primary text-primary-foreground font-medium text-sm transition-all hover:opacity-90"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="flex">
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`fixed lg:sticky top-0 z-50 lg:z-0 h-screen w-64 bg-background border-r border-border flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="flex items-center justify-between px-6 h-16 border-b border-border">
            <span className="font-bold text-lg tracking-tight">Dashboard</span>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
              <X className="size-5" />
            </button>
          </div>

          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = item.segment === null ? segment === null : segment === item.segment;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="size-4.5 shrink-0" />
                  <span>{item.label}</span>
                  {active && <ChevronRight className="size-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <Link
              href="/dashboard/settings"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-accent transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                {(user.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-medium truncate">{user.name}</p>
                <p className="text-muted-foreground text-xs truncate">{user.email}</p>
              </div>
            </Link>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 max-w-7xl mx-auto">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-muted-foreground hover:text-foreground -ml-2 p-2"
              >
                <Menu className="size-5" />
              </button>
              <div className="flex items-center gap-3 ml-auto">
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen && unreadCount > 0) handleMarkRead(notifications.filter(n => !n.read).map(n => n._id)); }}
                    className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {unreadCount > 0 ? <BellDot className="size-5" /> : <Bell className="size-5" />}
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">
                      <div className="p-3 border-b border-border flex justify-between items-center">
                        <span className="text-sm font-bold">Notifications</span>
                        {unreadCount > 0 && (
                          <button onClick={() => handleMarkRead(notifications.filter(n => !n.read).map(n => n._id))} className="text-xs text-primary hover:underline">Mark all read</button>
                        )}
                      </div>
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-muted-foreground">No notifications yet.</div>
                      ) : (
                        notifications.slice(0, 20).map((n) => (
                          <div key={n._id} className={`p-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}>
                            <p className="text-sm font-medium">{n.title}</p>
                            {n.message && <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>}
                            <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                  View site <ArrowUpRight className="size-3.5" />
                </Link>
                <button onClick={() => { logout(); window.dispatchEvent(new CustomEvent('open-auth-modal')); }}
                  className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors">
                  <LogOut className="size-4" /> Sign out
                </button>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
