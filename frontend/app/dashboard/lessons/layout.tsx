import DashboardLayout from '@/components/DashboardLayout';
import { RequireAuth } from '@/components/auth';

export default function LessonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      {children}
    </RequireAuth>
  );
}
