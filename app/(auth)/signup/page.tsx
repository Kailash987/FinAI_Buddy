'use client';

import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="bg-white rounded-2xl shadow-xl flex max-w-4xl w-full overflow-hidden">



      {/* Left Image */}
      <div className="hidden md:block w-1/2 relative bg-emerald-100 overflow-hidden">

        <img
          src="/finai-signup.png"
          alt="Finance learning"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Form */}
      <div className="w-full md:w-1/2 p-10">

        <SignupForm />
      </div>

    </div>
  );
}
