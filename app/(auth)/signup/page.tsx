'use client';

import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">
        <div className="hidden md:flex items-center justify-center bg-emerald-100 p-10">
          <img
            src="/auth-finance.svg"
            alt="Finance Learning"
            className="max-w-sm"
          />
        </div>
        <div className="p-10">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
