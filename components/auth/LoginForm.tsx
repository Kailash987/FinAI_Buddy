"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brain, Mail, Lock } from "lucide-react";

export const LoginForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ✅ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ IMPORTANT
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid email or password");
        return;
      }

      // ✅ Redirect to dashboard
      router.replace("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* LOGO */}
      <div className="flex items-center gap-3">
        <div className="bg-emerald-100 p-3 rounded-lg">
          <Brain className="w-6 h-6 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          FinAI Buddy
        </h1>
      </div>

      {/* TITLE */}
      <div>
        <h2 className="text-xl font-semibold">Login to your account</h2>
      
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* EMAIL */}
        <div>
          <label className="text-sm font-medium text-slate-700">
            Email
          </label>
          <div className="mt-1 flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
            <Mail className="w-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full outline-none text-sm bg-transparent"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-sm font-medium text-slate-700">
            Password
          </label>
          <div className="mt-1 flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
            <Lock className="w-4 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full outline-none text-sm bg-transparent"
            />
          </div>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* SIGNUP LINK */}
      <p className="text-sm text-center text-slate-600">
        Don’t have an account?{" "}
        <Link
          href="/signup"
          className="text-emerald-600 font-semibold hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};
