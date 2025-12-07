'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

interface LessonCardProps {
  id: number;
  title: string;
  difficulty: string;
  progress: number;
  description?: string;
}

export default function LessonCard({ id, title, difficulty, progress, description }: LessonCardProps) {
  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-emerald-500';
      case 'intermediate':
        return 'bg-blue-500';
      case 'advanced':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Link href={`/lessons/${id}`}>
      <Card className="hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-emerald-400 cursor-pointer group">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-3 rounded-lg group-hover:bg-emerald-500 transition-colors">
                <BookOpen className="w-6 h-6 text-emerald-600 group-hover:text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription className="mt-1">{description}</CardDescription>
              </div>
            </div>
            <Badge className={getDifficultyColor(difficulty)}>{difficulty}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Progress</span>
              <span className="font-semibold text-slate-900">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
