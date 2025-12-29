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
