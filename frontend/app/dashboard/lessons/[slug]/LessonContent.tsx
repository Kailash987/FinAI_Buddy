"use client";

import { useState, useEffect, useMemo } from "react";
import LessonsSidebar from "@/components/LessonsSidebar";
import rawSubtopicDetails from "@/data/subtopicDetails.json";
import lessonsData from "@/data/lessons.json";

interface SubtopicDetail {
  modules: Record<string, string[]>;
  quiz: {
    question: string;
    options: string[];
    answer: string;
  };
}

const subtopicDetails = rawSubtopicDetails as Record<string, SubtopicDetail>;

interface LessonContentProps {
  title: string;
  description: string;
  subtopics: { id: string; title: string }[];
  quiz?: {
    question: string;
    options: string[];
    answer: string;
  };
  level: string;
  slug: string;
}

export default function LessonContent({
  title,
  description,
  subtopics,
  quiz,
  level,
  slug,
}: LessonContentProps) {
  /* =======================
     SUBTOPIC STATE
  ======================= */
  const [activeSubtopicTitle, setActiveSubtopicTitle] = useState<string>(
    subtopics[0]?.title || ""
  );
  const [activeLessonSlug, setActiveLessonSlug] = useState<string>(slug);

  useEffect(() => {
    // Set initial subtopic when component mounts
    if (subtopics.length > 0 && !activeSubtopicTitle) {
      setActiveSubtopicTitle(subtopics[0].title);
    }
  }, [subtopics, activeSubtopicTitle]);

  const handleSubtopicClick = (lessonSlug: string, subtopicTitle: string) => {
    setActiveLessonSlug(lessonSlug);
    setActiveSubtopicTitle(subtopicTitle);
    // Reset quiz state when switching subtopics
    setSelectedAnswer(null);
    setSubmitted(false);
  };

  // Get the active lesson data based on activeLessonSlug
  const activeLesson = useMemo(() => {
    return lessonsData.find((lesson) => lesson.slug === activeLessonSlug);
  }, [activeLessonSlug]);

  const activeLessonTitle = activeLesson?.title || title;
  const activeLessonLevel = activeLesson?.level || level;

  const currentSubtopicDetail = subtopicDetails[activeSubtopicTitle];
  const currentQuiz = currentSubtopicDetail?.quiz || quiz || {
    question: "Select a subtopic to view its quiz.",
    options: [],
    answer: "",
  };

  /* =======================
     QUIZ STATE
  ======================= */
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(
    null
  );
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selectedAnswer === currentQuiz.answer;

  /* =======================
     PROGRESS STATE
  ======================= */
  const [completedSubtopics, setCompletedSubtopics] = useState<Set<string>>(
    new Set()
  );
  const [isCompleting, setIsCompleting] = useState(false);

  // Fetch completed subtopics on mount
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/progress/lesson-progress`,
          {
            credentials: "include",
            signal: controller.signal,
          }
        );
        
        clearTimeout(timeoutId);
        
        if (res.status === 401) {
          // Token expired or invalid - redirect to login
          window.location.href = '/login';
          return;
        }
        
        if (res.ok) {
          const data = await res.json();
          const mapped = data.progress.map(
            (p: { lesson_slug: string; subtopic_title: string }) => `${p.lesson_slug}:${p.subtopic_title}`
          );
          const completed = new Set<string>(mapped);
          setCompletedSubtopics(completed);
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error("Failed to fetch progress:", err);
        }
        // Don't automatically redirect on network errors, just log them
      }
    };
    fetchProgress();
  }, []);

  const handleComplete = async () => {
    const key = `${activeLessonSlug}:${activeSubtopicTitle}`;
    if (completedSubtopics.has(key)) {
      return; // Already completed
    }

    setIsCompleting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/progress/complete-subtopic`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            lessonSlug: activeLessonSlug,
            subtopicTitle: activeSubtopicTitle,
          }),
        }
      );

      if (res.status === 401) {
        // Token expired or invalid - redirect to login
        window.location.href = '/login';
        return;
      }

      if (res.ok) {
        setCompletedSubtopics((prev) => {
          const arr = Array.from(prev);
          arr.push(key);
          return new Set<string>(arr);
        });
      } else {
        console.error("Failed to mark as complete");
      }
    } catch (err) {
      console.error("Error completing subtopic:", err);
    } finally {
      setIsCompleting(false);
    }
  };

  const isCompleted = completedSubtopics.has(
    `${activeLessonSlug}:${activeSubtopicTitle}`
  );

  return (
    <div className="flex h-screen bg-emerald-50/50 overflow-hidden">
      {/* =======================
          LEFT: LESSONS SIDEBAR
      ======================= */}
      <LessonsSidebar
        onSubtopicClick={handleSubtopicClick}
        activeLessonSlug={activeLessonSlug}
        activeSubtopicTitle={activeSubtopicTitle}
      />

      {/* =======================
          RIGHT: CONTENT AREA
      ======================= */}
      <main className="flex-1 h-full overflow-y-auto px-14 py-10">
        <div className="max-w-3xl space-y-8">
          {/* HEADER */}
          <header>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-md text-sm font-medium">
                {activeLessonLevel}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900">
              {activeSubtopicTitle || activeLessonTitle}
            </h1>
            {activeSubtopicTitle && (
              <p className="mt-2 text-slate-600 text-sm">
                From: {activeLessonTitle}
              </p>
            )}
          </header>

          {/* SUBTOPIC CONTENT */}
          {currentSubtopicDetail ? (
            <>
              {/* MODULES CONTENT */}
              {Object.entries(currentSubtopicDetail.modules).map(([moduleName, content], idx) => (
                <section
                  key={idx}
                  className="rounded-xl bg-white p-6 shadow-sm border"
                >
                  <h2 className="text-xl font-semibold mb-4 text-slate-900">
                    {moduleName}
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-slate-700">
                    {content.map((point, pointIdx) => (
                      <li key={pointIdx} className="leading-relaxed">
                        {point}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}

              {/* =======================
                  TEST YOUR KNOWLEDGE
              ======================= */}
              {currentQuiz.options.length > 0 && (
                <section
                  id="quiz"
                  className="rounded-xl bg-white p-6 shadow-sm border"
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Test Your Knowledge
                  </h2>

                  <p className="mb-6 text-slate-800 font-medium">
                    {currentQuiz.question}
                  </p>

                  <div className="space-y-4">
                    {currentQuiz.options.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 cursor-pointer text-slate-700"
                      >
                        <input
                          type="radio"
                          name="quiz"
                          value={option}
                          checked={selectedAnswer === option}
                          onChange={() => {
                            setSelectedAnswer(option);
                            setSubmitted(false);
                          }}
                          className="accent-emerald-500"
                        />
                        {option}
                      </label>
                    ))}
                  </div>

                  {/* CHECK ANSWER BUTTON */}
                  <button
                    onClick={() => setSubmitted(true)}
                    disabled={!selectedAnswer}
                    className="mt-6 rounded-lg bg-emerald-600 px-4 py-2 text-white text-sm font-medium disabled:opacity-50 hover:bg-emerald-700 transition-colors"
                  >
                    Check Answer
                  </button>

                  {/* FEEDBACK */}
                  {submitted && (
                    <div className="mt-4">
                      {isCorrect ? (
                        <p className="text-emerald-600 font-medium">
                          ✅ Correct! Well done.
                        </p>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-red-600 font-medium">
                            ❌ Incorrect.
                          </p>
                          <p className="text-sm text-slate-700">
                            Correct answer:{" "}
                            <span className="font-semibold">
                              {currentQuiz.answer}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              )}

              {/* COMPLETE BUTTON */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleComplete}
                  disabled={isCompleted || isCompleting}
                  className={`
                    px-6 py-3 rounded-lg font-medium transition-all duration-200
                    ${
                      isCompleted
                        ? "bg-emerald-500 text-white cursor-default"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg"
                    }
                    ${isCompleting ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {isCompleted ? (
                    <span className="flex items-center gap-2">
                      ✓ Completed
                    </span>
                  ) : isCompleting ? (
                    "Completing..."
                  ) : (
                    "Mark as Complete"
                  )}
                </button>
              </div>
            </>
          ) : (
            <section className="rounded-xl bg-white p-6 shadow-sm border">
              <p className="text-slate-600">
                Select a subtopic from the sidebar to view its content.
              </p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}