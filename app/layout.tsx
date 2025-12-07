import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import DashboardLayout from '@/components/DashboardLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FinAI Buddy - Learn Finance the Smart Way',
  description: 'Master personal finance, investing, and money management with AI-powered lessons',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
