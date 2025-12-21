import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, TrendingUp, MessageSquare, Award, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            Welcome to FinAI Buddy
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Learn Finance the <span className="text-emerald-600">Smart Way</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Master personal finance, investing, and money management with AI-powered lessons and personalized guidance
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/lessons">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8">
                Start Learning
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button size="lg" variant="outline" className="text-lg px-8 border-slate-300">
                Chat with AI
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Link href="/lessons">
            <Card className="hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-emerald-400 cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors">
                  <BookOpen className="w-6 h-6 text-emerald-600 group-hover:text-white" />
                </div>
                <CardTitle>Lessons</CardTitle>
                <CardDescription>Interactive finance courses</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/quiz">
            <Card className="hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-blue-400 cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                  <Award className="w-6 h-6 text-blue-600 group-hover:text-white" />
                </div>
                <CardTitle>Quizzes</CardTitle>
                <CardDescription>Test your knowledge</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/progress">
            <Card className="hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-orange-400 cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors">
                  <TrendingUp className="w-6 h-6 text-orange-600 group-hover:text-white" />
                </div>
                <CardTitle>Progress</CardTitle>
                <CardDescription>Track your growth</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/chat">
            <Card className="hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-purple-400 cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
                  <MessageSquare className="w-6 h-6 text-purple-600 group-hover:text-white" />
                </div>
                <CardTitle>AI Chat</CardTitle>
                <CardDescription>Get instant answers</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-0">
          <CardContent className="p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to take control of your finances?</h2>
              <p className="text-slate-300 mb-6 text-lg">
                Join thousands of learners mastering personal finance with personalized AI guidance
              </p>
              <Link href="/lessons">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8">
                  Get Started Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
