'use client';

import { usePathname } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  const isAuth = pathname?.startsWith('/auth');
  const isMinimal = isDashboard || isAuth;

  return (
    <>
      {!isMinimal && <Header />}
      <main className={!isMinimal ? 'pt-[var(--header-height)]' : ''}>
        {children}
      </main>
      {!isMinimal && <Footer />}
    </>
  );
}
