'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ClipboardList, CheckCircle2, XCircle, Award } from 'lucide-react';

export default function QuizPage() {
  const [category, setCategory] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const categories = [
    "Investing",
    "Banking",
    "Budgeting",
    "Taxes",
    "Insurance",
    "Retirement",
    "Credit & Loans",
    "Crypto"
  ];

  const startQuiz = async (diff: string) => {
    setDifficulty(diff);
    setLoading(true);

    const res = await fetch("/api/generate-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ difficulty: diff, category }),
    });

    const data = await res.json();
    setQuestions(data.questions);
    setLoading(false);
  };

  // ------------------------------------
  // CATEGORY SELECTION
  // ------------------------------------
  if (!category) {
    return (
      <div className="min-h-screen p-10 flex justify-center bg-gradient-to-b from-emerald-50 to-white">
        <Card className="max-w-3xl w-full p-10 shadow-xl rounded-2xl bg-white border border-slate-100">
          <CardHeader className="text-center mb-6">
            <CardTitle className="text-4xl font-bold text-slate-900">
              Choose a Category
            </CardTitle>
            <CardDescription className="text-slate-600 text-lg">
              Select a topic to generate personalized quiz questions
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 gap-5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className="
                    bg-emerald-600 hover:bg-emerald-700
                    text-white py-4 rounded-xl text-lg font-semibold
                    shadow-sm hover:shadow-md transition-all
                  "
                >
                  {cat}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ------------------------------------
  // DIFFICULTY SELECTION
  // ------------------------------------
  if (!difficulty) {
    return (
      <div className="min-h-screen p-10 flex justify-center bg-gradient-to-b from-emerald-50 to-white">
        <Card className="max-w-xl w-full p-10 shadow-xl rounded-2xl bg-white border border-slate-100">
          <CardHeader className="text-center mb-6">
            <CardTitle className="text-3xl font-bold text-slate-900">
              Difficulty for {category}
            </CardTitle>
            <CardDescription className="text-slate-600 text-lg">
              Choose how challenging your quiz should be
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <button
              onClick={() => startQuiz("easy")}
              className="
                w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 
                text-white text-lg font-semibold transition-all shadow-sm hover:shadow
              "
            >
              Easy
            </button>

            <button
              onClick={() => startQuiz("medium")}
              className="
                w-full py-4 rounded-xl bg-blue-500 hover:bg-blue-600 
                text-white text-lg font-semibold transition-all shadow-sm hover:shadow
              "
            >
              Medium
            </button>

            <button
              onClick={() => startQuiz("hard")}
              className="
                w-full py-4 rounded-xl bg-red-500 hover:bg-red-600 
                text-white text-lg font-semibold transition-all shadow-sm hover:shadow
              "
            >
              Hard
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ------------------------------------
  // LOADING UI
  // ------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-semibold text-slate-700 bg-gradient-to-b from-emerald-50 to-white">
        Generating your quiz...
      </div>
    );
  }

  // ------------------------------------
  // QUIZ COMPLETE
  // ------------------------------------
  if (isQuizComplete) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen p-10 bg-gradient-to-b from-emerald-50 to-white">
        <Card className="max-w-2xl mx-auto shadow-xl rounded-2xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-emerald-600" />
            </div>
            <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
            <CardDescription className="text-lg text-slate-600">
              Your Results
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 text-center">
            <div className="text-6xl font-bold text-emerald-600">{percentage}%</div>
            <p className="text-xl text-slate-600">
              You scored {score} out of {questions.length}
            </p>

            <Button
              onClick={() => {
                setCategory(null);
                setDifficulty(null);
                setQuestions([]);
                setScore(0);
                setIsQuizComplete(false);
                setCurrentQuestion(0);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg"
            >
              Start New Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ------------------------------------
  // MAIN QUIZ UI
  // ------------------------------------
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    setShowFeedback(true);

    if (selectedAnswer === question.answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setIsQuizComplete(true);
    }
  };

  return (
    <div className="min-h-screen p-10 bg-gradient-to-b from-emerald-50 to-white">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-600 p-3 rounded-lg">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{category} Quiz</h1>
            <p className="text-slate-600">Difficulty: {difficulty}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-600">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span>Score: {score}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <Card className="max-w-3xl mx-auto shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">{question.question}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            {question.options.map((option: string, index: number) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === question.answer;
              const showCorrect = showFeedback && isCorrect;
              const showIncorrect = showFeedback && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    showCorrect
                      ? 'border-emerald-500 bg-emerald-50'
                      : showIncorrect
                      ? 'border-red-500 bg-red-50'
                      : isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    {showIncorrect && <XCircle className="w-5 h-5 text-red-600" />}
                  </div>
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div
              className={`p-4 rounded-lg ${
                selectedAnswer === question.answer
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold mb-1">
                {selectedAnswer === question.answer ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Correct!
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    Incorrect
                  </>
                )}
              </div>

              {selectedAnswer !== question.answer && (
                <p className="text-sm">Correct answer: {question.answer}</p>
              )}
            </div>
          )}

          <div className="flex gap-3">
            {!showFeedback ? (
              <Button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                {currentQuestion < questions.length - 1
                  ? 'Next Question'
                  : 'View Results'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
