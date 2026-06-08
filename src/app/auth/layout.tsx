import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/30">
      <div className="max-w-md w-full px-4 py-8">
        <Link href="/" className="text-lg font-bold tracking-tight text-foreground block text-center mb-8">
          CrowdRaise
        </Link>
        {children}
      </div>
    </div>
  );
}
