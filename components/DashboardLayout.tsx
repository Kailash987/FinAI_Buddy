'use client';

import { usePathname } from 'next/navigation';
import AppSidebar from './AppSidebar';
import ProfileMenu from "@/components/ProfileMenu";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = pathname !== '/dashboard';

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar />

      <div className="flex-1 flex flex-col bg-slate-50">
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b flex items-center justify-end px-6">
          <ProfileMenu />
        </header>
      <main className="flex-1 bg-slate-50 overflow-auto">
        {children}
      </main>
    </div>
  </div>
  );
}
