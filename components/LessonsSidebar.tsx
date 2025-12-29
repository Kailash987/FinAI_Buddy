'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import lessonsData from '@/data/lessons.json';

interface LessonsSidebarProps {
  onSubtopicClick: (lessonSlug: string, subtopicTitle: string) => void;
  activeLessonSlug?: string;
  activeSubtopicTitle?: string;
}

export default function LessonsSidebar({
  onSubtopicClick,
  activeLessonSlug,
  activeSubtopicTitle,
}: LessonsSidebarProps) {
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(
    new Set([activeLessonSlug || ''])
  );

  const toggleLesson = (slug: string) => {
    setExpandedLessons((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(slug)) {
        newSet.delete(slug);
      } else {
        newSet.add(slug);
      }
      return newSet;
    });
  };

  return (
    <aside className="w-80 h-full border-r bg-white flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <h2 className="text-lg font-semibold text-slate-900">Lessons</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <ul className="space-y-1">
        {lessonsData.map((lesson) => {
          const isExpanded = expandedLessons.has(lesson.slug);
          const isActive = activeLessonSlug === lesson.slug;

          return (
            <li key={lesson.id}>
              {/* Lesson Header */}
              <button
                onClick={() => toggleLesson(lesson.slug)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-left',
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                )}
                <span className="font-medium text-sm">{lesson.title}</span>
              </button>

              {/* Subtopics */}
              {isExpanded && (
                <ul className="ml-6 mt-1 space-y-1">
                  {lesson.coreConcepts.map((subtopic, index) => {
                    const isSubtopicActive =
                      activeLessonSlug === lesson.slug &&
                      activeSubtopicTitle === subtopic;

                    return (
                      <li key={index}>
                        <button
                          onClick={() => onSubtopicClick(lesson.slug, subtopic)}
                          className={cn(
                            'w-full flex items-start gap-2 px-3 py-2 rounded-md transition-colors text-left',
                            isSubtopicActive
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'text-slate-600 hover:bg-slate-50'
                          )}
                        >
                          <span
                            className={cn(
                              'mt-1 h-2 w-2 rounded-full flex-shrink-0',
                              isSubtopicActive
                                ? 'bg-emerald-500'
                                : 'bg-slate-300'
                            )}
                          />
                          <span className="text-sm leading-relaxed">
                            {subtopic}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
        </ul>
      </div>
    </aside>
  );
}

