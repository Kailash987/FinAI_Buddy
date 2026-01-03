import ChatBox from '@/components/ChatBox';
import { MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function ChatPage() {
  return (
    <div className="p-8 h-screen flex flex-col">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500 p-3 rounded-lg">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">AI Finance Assistant</h1>
            <p className="text-slate-600">Ask me anything about personal finance</p>
          </div>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <ChatBox />
      </Card>
    </div>
  );
}
