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
      {/* Rectangular Card Container */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 bg-slate-700/50 hover:bg-slate-700 text-left"
      >
        {/* Rectangular Avatar */}
        <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-semibold flex-shrink-0">
          {initial}
        </div>
        
        {/* User Information */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-emerald-400 truncate">
            {user.name ?? "User"}
          </p>
          <p className="text-sm text-slate-300 truncate">
            {user.email}
          </p>
        </div>
        
        {/* Chevron Icon */}
        <ChevronDown className="w-4 h-4 text-slate-300 flex-shrink-0" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 bottom-full mb-2 w-64 rounded-xl bg-white shadow-lg border border-slate-200 z-50">
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
