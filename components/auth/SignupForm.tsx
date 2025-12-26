"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, Mail, Lock, User } from "lucide-react";

export const SignupForm = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.replace("/dashboard");
      } else {
        const data = await res.json();
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-emerald-100 p-3 rounded-lg">
          <Brain className="w-6 h-6 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          FinAI Buddy
        </h1>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Create an account</h2>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Name</label>
          <div className="mt-1 flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
            <User className="w-4 text-slate-400" />
            <input
              name="name"
              required
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full outline-none text-sm bg-transparent"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <div className="mt-1 flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
            <Mail className="w-4 text-slate-400" />
            <input
              name="email"
              type="email"
              required
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full outline-none text-sm bg-transparent"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Password</label>
          <div className="mt-1 flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
            <Lock className="w-4 text-slate-400" />
            <input
              name="password"
              type="password"
              required
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full outline-none text-sm bg-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-sm text-center text-slate-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-emerald-600 font-semibold hover:underline"
        >
          Back to Login
        </Link>
      </p>
    </div>
  );
};
