'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BookOpen, ClipboardCheck, Award } from 'lucide-react';

const QuizScoresChart = dynamic(
  () => import('@/components/ProgressChart').then((mod) => mod.QuizScoresChart),
  { ssr: false }
);

const LessonProgressChart = dynamic(
  () => import('@/components/ProgressChart').then((mod) => mod.LessonProgressChart),
  { ssr: false }
);

export default function ProgressPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-orange-500 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Your Progress</h1>
            <p className="text-slate-600">Track your learning journey and achievements</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Lessons Completed</CardTitle>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">3</div>
            <p className="text-xs text-slate-600 mt-1">out of 6 total</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Quizzes Taken</CardTitle>
            <ClipboardCheck className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">5</div>
            <p className="text-xs text-slate-600 mt-1">87% average score</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Learning Streak</CardTitle>
            <Award className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">7</div>
            <p className="text-xs text-slate-600 mt-1">days in a row</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total XP</CardTitle>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">1,240</div>
            <p className="text-xs text-slate-600 mt-1">Level 8</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <QuizScoresChart />
        <LessonProgressChart />
      </div>
    </div>
  );
}
