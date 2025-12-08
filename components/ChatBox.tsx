'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your FinAI Buddy. Ask me anything about finance, investing, or budgeting!",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage: Message = {
    id: messages.length + 1,
    text: input,
    sender: "user",
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  const userInput = input;
  setInput("");

  // Call your server API
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userInput }),
  });

  const data = await res.json();

  const aiMessage: Message = {
    id: messages.length + 2,
    text: data.response,
    sender: "ai",
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, aiMessage]);
};


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3 items-start',
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            )}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                message.sender === 'user' ? 'bg-emerald-500' : 'bg-slate-700'
              )}
            >
              {message.sender === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>
            <div
              className={cn(
                'max-w-[70%] rounded-2xl px-4 py-3 shadow-md',
                message.sender === 'user'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-slate-900 border border-slate-200'
              )}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p
                className={cn(
                  'text-xs mt-2',
                  message.sender === 'user' ? 'text-emerald-100' : 'text-slate-500'
                )}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t bg-white p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about finance..."
            className="flex-1"
          />
          <Button onClick={handleSend} className="bg-emerald-500 hover:bg-emerald-600">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
