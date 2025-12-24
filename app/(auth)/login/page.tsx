'use client';

import { Brain } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {

  return (
    <div className="bg-white rounded-2xl shadow-xl flex max-w-4xl w-full overflow-hidden">
      
      {/* Left Image */}
      <div className="hidden md:flex w-1/2 bg-emerald-100 items-center justify-center">
        <img
          src="/auth-finance.svg"
          alt="Finance learning"
          className="w-3/4"
        />
      </div>

      {/* Form */}
      <div className="w-full md:w-1/2 p-10">
        
        

        

        <LoginForm />

      </div>
    </div>
  );
}
