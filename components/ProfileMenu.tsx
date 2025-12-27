"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ChevronDown } from "lucide-react";

interface User {
  name?: string;
  email: string;
}

export default function ProfileMenu() {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  /* Fetch logged-in user */
  useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
    credentials: "include",
  })
    .then((res) => res.ok && res.json())
    .then((data) => data && setUser(data))
    .catch(() => {});
}, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const logout = async () => {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  router.replace("/login");
};

  if (!user) return null;

  const initial = user.email.charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      {/* Avatar */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2"
      >
        <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-semibold">
          {initial}
        </div>
        <ChevronDown className="w-4 h-4 text-slate-500" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-64 rounded-xl bg-white shadow-lg border border-slate-200 z-50">
          <div className="p-4 border-b">
            <p className="font-medium text-slate-900">
              {user.name ?? "User"}
            </p>
            <p className="text-sm text-slate-500 truncate">
              {user.email}
            </p>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-xl"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
