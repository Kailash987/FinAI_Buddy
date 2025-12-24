import DashboardLayout from '@/components/DashboardLayout';
import { RequireAuth } from '@/components/auth';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <DashboardLayout>{children}</DashboardLayout>
    </RequireAuth>
  );
}

