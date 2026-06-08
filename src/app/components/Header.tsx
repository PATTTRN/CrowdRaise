'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { notificationService, type NotificationItem } from '@/services/notification.service';
import { Button } from '@/components/ui/button';
import { Menu, X, Plus, Search, LayoutDashboard, User, Bell, Loader2 } from 'lucide-react';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await notificationService.getAll();
      setNotifications(res.notifications || []);
      setUnreadCount(res.unreadCount || 0);
    } catch { /* silent */ }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!showNotifications) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
    };
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowNotifications(false); };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [showNotifications]);

  const handleMarkRead = async () => {
    const unread = notifications.filter((n) => !n.read).map((n) => n._id);
    if (unread.length === 0) return;
    await notificationService.markRead(unread);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const navLinks = [
    { href: '/explore', label: 'Explore', icon: Search },
    { href: '/create_collection', label: 'Create', icon: Plus },
    ...(isAuthenticated ? [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] : []),
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-border/50 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[var(--header-height)]">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-foreground"
            >
              CrowdRaise
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <link.icon className="size-4" />
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="relative" ref={notifRef}>
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 transition-colors"
                      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
                    >
                      <Bell className="size-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>

                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-border/50 overflow-hidden z-50">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                          <span className="text-sm font-semibold text-foreground">Notifications</span>
                          {unreadCount > 0 && (
                            <button onClick={handleMarkRead} className="text-xs text-primary hover:underline">
                              Mark all read
                            </button>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-6 text-center text-sm text-muted-foreground">
                              <Bell className="size-8 mx-auto mb-2 opacity-30" />
                              No notifications yet
                            </div>
                          ) : (
                            notifications.slice(0, 20).map((n) => (
                              <button
                                key={n._id}
                                onClick={() => { if (!n.read) { notificationService.markRead([n._id]); setUnreadCount((c) => Math.max(0, c - 1)); setNotifications((prev) => prev.map((p) => p._id === n._id ? { ...p, read: true } : p)); } }}
                                className={`w-full text-left px-4 py-3 border-b border-border/30 hover:bg-secondary/50 transition-colors ${!n.read ? 'bg-primary/[0.02]' : ''}`}
                              >
                                <p className={`text-sm ${!n.read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{n.title}</p>
                                {n.message && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>}
                                <p className="text-[10px] text-muted-foreground/60 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                              </button>
                            ))
                          )}
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setShowNotifications(false)}
                          className="block px-4 py-2.5 text-center text-sm text-primary font-medium border-t border-border/50 hover:bg-secondary/50 transition-colors"
                        >
                          View all
                        </Link>
                      </div>
                    )}
                  </div>

                  <Link href="/dashboard/settings" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden lg:inline">{user?.name}</span>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal'))}
                  >
                    Sign in
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal'))}
                  >
                    Get started
                  </Button>
                </div>
              )}
            </div>

            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-border/50 shadow-lg p-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
                >
                  <link.icon className="size-4" />
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-border/50" />
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    {user?.name}
                  </div>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
                  >
                    <User className="size-4" /> Profile
                  </Link>
                  <button
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); window.dispatchEvent(new CustomEvent('open-auth-modal')); }}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-primary rounded-lg hover:bg-primary/5 transition-colors"
                >
                  Sign In
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
