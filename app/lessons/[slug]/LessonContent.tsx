"use client";

import { useState } from "react";
import clsx from "clsx";
import rawSubtopicDetails from "@/data/subtopicDetails.json";
const subtopicDetails = rawSubtopicDetails as Record<string, string[]>;

interface Subtopic {
  id: string;
  title: string;
}

interface Quiz {
  question: string;
  options: string[];
  answer: string;
}

interface LessonContentProps {
  title: string;
  description: string;
  subtopics: Subtopic[];
  quiz: Quiz;
  level: string;
}

export default function LessonContent({
  title,
  description,
  subtopics,
  quiz,
  level,
}: LessonContentProps) {
  /* =======================
     SUBTOPIC STATE
  ======================= */
  const [activeSubtopic, setActiveSubtopic] = useState(
    subtopics[0]?.id
  );

  const scrollTo = (id: string) => {
    setActiveSubtopic(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  

  /* =======================
     QUIZ STATE
  ======================= */
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(
    null
  );
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selectedAnswer === quiz.answer;

  return (
    <div className="flex h-screen bg-emerald-50/50">
      {/* =======================
          LEFT: SUBTOPIC SIDEBAR
      ======================= */}
      <aside className="w-80 border-r bg-white px-8 py-8">
        <p className="text-emerald-600 font-semibold mb-6">
          {level}
        </p>

        <h3 className="text-sm font-semibold text-slate-600 mb-4">
          Subtopics
        </h3>

        <ul className="space-y-4">
          {subtopics.map((sub) => {
            const isActive = activeSubtopic === sub.id;

            return (
              <li key={sub.id}>
                <button
                  onClick={() => scrollTo(sub.id)}
                  className="flex items-start gap-3 text-left w-full"
                >
                  {/* RADIO INDICATOR */}
                  <span
                    className={clsx(
                      "mt-1 h-3 w-3 rounded-full border transition",
                      isActive
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-slate-400"
                    )}
                  />

                  <span
                    className={clsx(
                      "text-sm leading-snug",
                      isActive
                        ? "text-emerald-600 font-medium"
                        : "text-slate-700"
                    )}
                  >
                    {sub.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* =======================
          RIGHT: CONTENT AREA
      ======================= */}
      <main className="flex-1 overflow-y-auto px-14 py-10">
        <div className="max-w-3xl space-y-14">
          {/* HEADER */}
          <header>
            <h1 className="text-4xl font-bold text-slate-900">
              {title}
            </h1>
            <p className="mt-3 text-slate-600">
              {description}
            </p>
          </header>

          {/* CORE CONCEPTS */}
          <section className="rounded-xl bg-white p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">
              Core Concepts
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-700">
              {subtopics.map((sub) => (
                <li key={sub.id}>{sub.title}</li>
              ))}
            </ul>
          </section>

          {/* SUBTOPIC SECTIONS */}
          {subtopics.map((sub) => (
            <section
              key={sub.id}
              id={sub.id}
              className="rounded-xl bg-white p-6 shadow-sm border"
            >
              <h2 className="text-xl font-semibold mb-2">
                {sub.title}
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                {(subtopicDetails[sub.title] ?? [
                "This topic is important for building financial literacy.",
                "Understanding it helps in making better decisions."
                ]).map((point, idx) => (
                <li key={idx}>{point}</li>
                ))}
              </ul>
            </section>
          ))}

          {/* =======================
              TEST YOUR KNOWLEDGE
          ======================= */}
          <section
            id="quiz"
            className="rounded-xl bg-white p-6 shadow-sm border"
          >
            <h2 className="text-xl font-semibold mb-4">
              Test Your Knowledge
            </h2>

            <p className="mb-6 text-slate-800 font-medium">
              {quiz.question}
            </p>

            <div className="space-y-4">
              {quiz.options.map((option) => (
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
              className="mt-6 rounded-lg bg-emerald-600 px-4 py-2 text-white text-sm font-medium disabled:opacity-50"
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
                        {quiz.answer}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
