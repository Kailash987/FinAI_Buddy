'use client';

import { Brain } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {

  return (
    <div className="bg-white rounded-2xl shadow-xl flex max-w-4xl w-full overflow-hidden">
      
      {/* Left Image */}
      <div className="hidden md:block w-1/2 relative bg-emerald-100 overflow-hidden">
  <img
    src="/finai-hero.png"
    alt="Finance learning"
    className="absolute inset-0 w-full h-full object-cover"
  />
</div>


      {/* Form */}
      <div className="w-full md:w-1/2 p-10">
        <LoginForm />

      </div>
    </div>
  );
}
