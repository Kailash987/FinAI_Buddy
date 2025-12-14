import LessonCard from '@/components/LessonCard';
import { BookOpen } from 'lucide-react';
import lessonsData from '@/data/lessons.json';

export default function LessonsPage() {
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessonsData.map((lesson) => (
          <LessonCard
            key={lesson.id}
            slug={lesson.slug}
            title={lesson.title}
            difficulty={lesson.level}
            progress={lesson.progress}
            description={lesson.description}
          />
        ))}
      </div>
    </div>
  );
}