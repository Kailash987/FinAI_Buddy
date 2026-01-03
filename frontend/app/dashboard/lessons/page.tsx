'use client';

import { useEffect, useState } from 'react';
import LessonCard from '@/components/LessonCard';
import { BookOpen } from 'lucide-react';
import lessonsData from '@/data/lessons.json';

interface ProgressItem {
  lesson_slug: string;
  subtopic_title: string;
}

export default function LessonsPage() {
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/progress/lesson-progress`,
          {
            credentials: 'include',
          }
        );
        if (res.ok) {
          const data = await res.json();
          setProgress(data.progress || []);
        }
      } catch (err) {
        console.error('Failed to fetch progress:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  // Calculate progress percentage for each lesson
  const getLessonProgress = (lessonSlug: string) => {
    const lesson = lessonsData.find((l) => l.slug === lessonSlug);
    if (!lesson) return 0;

    const totalSubtopics = lesson.coreConcepts.length;
    const completedSubtopics = progress.filter(
      (p) => p.lesson_slug === lessonSlug
    ).length;

    return totalSubtopics > 0
      ? Math.round((completedSubtopics / totalSubtopics) * 100)
      : 0;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-emerald-500 p-3 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Finance Lessons</h1>
            <p className="text-slate-600">Choose a lesson to continue your learning journey</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-600">Loading...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessonsData.map((lesson) => (
            <LessonCard
              key={lesson.id}
              slug={lesson.slug}
              title={lesson.title}
              difficulty={lesson.level}
              progress={getLessonProgress(lesson.slug)}
              description={lesson.description}
            />
          ))}
        </div>
      )}
    </div>
  );
}