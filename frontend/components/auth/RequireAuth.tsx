"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const RequireAuth = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Prevent multiple auth checks
    if (checked) return;
    
    const checkAuth = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          credentials: "include",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.status === 401) {
          router.replace("/login");
          return;
        }

        if (!res.ok) {
          router.replace("/login");
        } else {
          setLoading(false);
          setChecked(true);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error("Auth check failed:", error);
          router.replace("/login");
        }
      }
    };

    checkAuth();
  }, [router, checked]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};
