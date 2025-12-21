'use client';

import { usePathname } from 'next/navigation';
import AppSidebar from './AppSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = pathname !== '/';

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 bg-slate-50 overflow-auto">
        {children}
      </main>
    </div>
  );
}
