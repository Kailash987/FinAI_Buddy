'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, ClipboardList, TrendingUp, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/lessons', label: 'Lessons', icon: BookOpen },
  { href: '/dashboard/quiz', label: 'Quizzes', icon: ClipboardList },
  { href: '/dashboard/progress', label: 'Progress', icon: TrendingUp },
  { href: '/dashboard/chat', label: 'Chat', icon: MessageSquare },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-emerald-400">FinAI Buddy</h1>
        <p className="text-sm text-slate-400 mt-1">Smart Finance Learning</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-700">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-sm font-medium text-emerald-400">Learning Level</p>
          <p className="text-lg font-bold mt-1">Intermediate</p>
          <div className="mt-3 bg-slate-600 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-500 h-full w-2/3 rounded-full"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
