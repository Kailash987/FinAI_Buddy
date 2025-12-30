'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BookOpen, ClipboardCheck, Award, Check, Circle, AlertCircle } from 'lucide-react';

interface UserStats {
  streak: number;
  total_xp: number;
  level: number;
  topics_completed: number;
  quizzes_taken: number;
  recentQuizzes: Array<{
    quiz_subject: string;
    score: number;
    taken_at: string;
  }>;
  lessonProgress: Array<{
    lesson_slug: string;
    completed_subtopics: number;
  }>;
}

export default function ProgressPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/progress/stats`,
          {
            credentials: 'include',
          }
        );
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Calculate average quiz score
  const averageScore =
    stats?.recentQuizzes && stats.recentQuizzes.length > 0
      ? Math.round(
          stats.recentQuizzes.reduce((sum, q) => sum + q.score, 0) /
            stats.recentQuizzes.length
        )
      : 0;

  // Calculate lesson progress distribution
  const totalSubtopics = 24; // Total subtopics across all lessons
  const completedSubtopics = stats?.topics_completed || 0;
  const notStartedSubtopics = totalSubtopics - completedSubtopics;
  
  // For chart: show completed vs not started (no "in progress" for subtopics)
  const chartCompleted = completedSubtopics;
  const chartNotStarted = notStartedSubtopics;

  // Quiz Performance Data
  const safeQuizData = Array.isArray(stats?.recentQuizzes) ? stats.recentQuizzes : [];
  let correctPercentage = 0;
  let wrongPercentage = 0;
  
  if (safeQuizData.length > 0) {
    const totalScore = safeQuizData.reduce((sum, quiz) => sum + (Number(quiz.score) || 0), 0);
    const averageScore = totalScore / safeQuizData.length;
    correctPercentage = Math.round(averageScore);
    wrongPercentage = 100 - correctPercentage;
  }

  const hasQuizData = safeQuizData.length > 0;

  // Lesson Overview Data
  const completedNum = Math.max(0, Number(chartCompleted) || 0);
  const inProgressNum = 0; // No in progress for subtopics
  const notStartedNum = Math.max(0, Number(chartNotStarted) || 0);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12 text-slate-600">Loading...</div>
      </div>
    );
  }

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
            <CardTitle className="text-sm font-medium text-slate-700">Topics Completed</CardTitle>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {stats?.topics_completed || 0}
            </div>
            <p className="text-xs text-slate-600 mt-1">out of 24 total</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Quizzes Taken</CardTitle>
            <ClipboardCheck className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {stats?.quizzes_taken || 0}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {averageScore > 0 ? `${averageScore}% average score` : 'No quizzes yet'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Learning Streak</CardTitle>
            <Award className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {stats?.streak || 0}
            </div>
            <p className="text-xs text-slate-600 mt-1">days in a row</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total XP</CardTitle>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {stats?.total_xp?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-slate-600 mt-1">Level {stats?.level || 1}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quiz Performance */}
        <Card className="border border-slate-200 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold text-slate-800">Quiz Performance</CardTitle>
            <CardDescription className="text-sm text-slate-600">Your recent quiz scores</CardDescription>
          </CardHeader>
          <CardContent>
            {!hasQuizData ? (
              <div className="flex items-center justify-center h-[300px] text-slate-500 text-sm text-center">
                No quiz attempts yet. Complete lessons and take quizzes to see your performance here.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Two gradient cards side by side */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Correct Answers Card */}
                  <div className="relative rounded-xl p-5 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 overflow-hidden">
                    {/* Sparkle effects */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-4 left-4 w-1 h-1 bg-white rounded-full" />
                      <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-white rounded-full" />
                      <div className="absolute bottom-6 left-8 w-1 h-1 bg-white rounded-full" />
                      <div className="absolute bottom-8 right-4 w-1.5 h-1.5 bg-white rounded-full" />
                      <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-white rounded-full" />
                      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[160px]">
                      <div className="text-4xl font-bold text-white mb-2">{correctPercentage}%</div>
                      <div className="text-white text-sm font-medium">Correct Answers</div>
                    </div>
                  </div>

                  {/* Wrong Answers Card */}
                  <div className="relative rounded-xl p-5 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 overflow-hidden">
                    {/* Sparkle effects */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-4 left-4 w-1 h-1 bg-white rounded-full" />
                      <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-white rounded-full" />
                      <div className="absolute bottom-6 left-8 w-1 h-1 bg-white rounded-full" />
                      <div className="absolute bottom-8 right-4 w-1.5 h-1.5 bg-white rounded-full" />
                      <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-white rounded-full" />
                      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[160px]">
                      <div className="text-4xl font-bold text-white mb-2">{wrongPercentage}%</div>
                      <div className="text-white text-sm font-medium">Wrong Answers</div>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 pt-2 text-sm text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-600" />
                    Correct
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    Wrong
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lesson Overview */}
        <Card className="border border-slate-200 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold text-slate-800">Lesson Overview</CardTitle>
            <CardDescription className="text-sm text-slate-600">Your learning progress distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {/* Lessons Completed Card */}
              <div className="relative rounded-xl p-3 bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 overflow-hidden">
                {/* Sparkle effects */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-3 left-6 w-1 h-1 bg-white rounded-full" />
                  <div className="absolute top-6 right-8 w-1.5 h-1.5 bg-white rounded-full" />
                  <div className="absolute bottom-4 left-10 w-1 h-1 bg-white rounded-full" />
                  <div className="absolute bottom-6 right-6 w-1.5 h-1.5 bg-white rounded-full" />
                  <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-white rounded-full" />
                  <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full" />
                </div>
                <div className="relative z-10 flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-white mb-1">{completedNum}</div>
                    <div className="text-white text-sm font-semibold">Lessons Completed</div>
                  </div>
                </div>
              </div>

              {/* Currently In Progress Card */}
              <div className="relative rounded-xl p-3 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 overflow-hidden">
                {/* Sparkle effects */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-3 left-6 w-1 h-1 bg-white rounded-full" />
                  <div className="absolute top-6 right-8 w-1.5 h-1.5 bg-white rounded-full" />
                  <div className="absolute bottom-4 left-10 w-1 h-1 bg-white rounded-full" />
                  <div className="absolute bottom-6 right-6 w-1.5 h-1.5 bg-white rounded-full" />
                  <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-white rounded-full" />
                  <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full" />
                </div>
                <div className="relative z-10 flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-white mb-1">{inProgressNum}</div>
                    <div className="text-white text-sm font-semibold">Currently In Progress</div>
                  </div>
                </div>
              </div>

              {/* Yet To Be Started Card */}
              <div className="relative rounded-xl p-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
                {/* Sparkle effects */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-3 left-6 w-1 h-1 bg-white rounded-full" />
                  <div className="absolute top-6 right-8 w-1.5 h-1.5 bg-white rounded-full" />
                  <div className="absolute bottom-4 left-10 w-1 h-1 bg-white rounded-full" />
                  <div className="absolute bottom-6 right-6 w-1.5 h-1.5 bg-white rounded-full" />
                  <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-white rounded-full" />
                  <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full" />
                </div>
                <div className="relative z-10 flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-white mb-1">{notStartedNum}</div>
                    <div className="text-white text-sm font-semibold">Yet To Be Started</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
