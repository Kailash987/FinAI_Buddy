'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface QuizScoresChartProps {
  quizData: Array<{
    quiz_subject: string;
    score: number;
    taken_at: string;
  }>;
}

export function QuizScoresChart({ quizData }: QuizScoresChartProps) {
  // Calculate correct vs wrong percentages from quiz scores
  const safeQuizData = Array.isArray(quizData) ? quizData : [];
  
  let correctPercentage = 0;
  let wrongPercentage = 0;
  
  if (safeQuizData.length > 0) {
    // Calculate average score across all quizzes
    const totalScore = safeQuizData.reduce((sum, quiz) => sum + (Number(quiz.score) || 0), 0);
    const averageScore = totalScore / safeQuizData.length;
    correctPercentage = Math.round(averageScore);
    wrongPercentage = 100 - correctPercentage;
  }

  const chartData = [
    { name: 'Correct', value: correctPercentage, color: '#10b981' },
    { name: 'Wrong', value: wrongPercentage, color: '#ef4444' },
  ].filter(item => item.value > 0);

  const hasData = safeQuizData.length > 0;

  return (
    <Card className="border border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quiz Performance</CardTitle>
        <CardDescription className="text-sm text-slate-600">Your recent quiz scores</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex items-center justify-center h-[300px] text-slate-500 text-sm">
            No quiz attempts yet. Complete lessons and take quizzes to see your performance here.
          </div>
        ) : (
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => {
                    if (percent < 0.01) return '';
                    return `${(percent * 100).toFixed(0)}%`;
                  }}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '8px 12px',
                  }}
                  formatter={(value: any) => [`${value}%`, '']}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  formatter={(value) => value}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface LessonProgressChartProps {
  completed: number;
  inProgress: number;
  notStarted: number;
}

export function LessonProgressChart({
  completed,
  inProgress,
  notStarted,
}: LessonProgressChartProps) {
  // Convert to numbers and ensure they're valid
  const completedNum = Math.max(0, Number(completed) || 0);
  const inProgressNum = Math.max(0, Number(inProgress) || 0);
  const notStartedNum = Math.max(0, Number(notStarted) || 0);
  
  const chartData = [
    { name: 'Completed', value: completedNum, color: '#3b82f6' },
    { name: 'In Progress', value: inProgressNum, color: '#f97316' },
    { name: 'Not Started', value: notStartedNum, color: '#ef4444' },
  ];

  const maxValue = Math.max(completedNum, inProgressNum, notStartedNum, 1);
  // Ensure Y-axis goes up to at least 30, rounded to nearest 5
  const yAxisMax = Math.max(30, Math.ceil(maxValue / 5) * 5);

  return (
    <Card className="border border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Lesson Overview</CardTitle>
        <CardDescription className="text-sm text-slate-600">Your learning progress distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                stroke="#64748b"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="#64748b"
                domain={[0, yAxisMax]}
                tick={{ fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
                formatter={(value: any) => [`${value}`, '']}
              />
              <Bar 
                dataKey="value" 
                radius={[8, 8, 0, 0]}
                label={{ 
                  position: 'top', 
                  formatter: (value: any) => value > 0 ? value : '',
                  style: { fontSize: '14px', fontWeight: '600', fill: '#1e293b' }
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
