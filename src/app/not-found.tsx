import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-primary/10 mb-4 tracking-tight">404</div>
        <h1 className="text-3xl font-bold text-foreground mb-3 tracking-tight">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-10 px-5 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
