import DashboardSidebar from './DashboardSidebar';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <DashboardSidebar>{children}</DashboardSidebar>
    </ErrorBoundary>
  );
}
