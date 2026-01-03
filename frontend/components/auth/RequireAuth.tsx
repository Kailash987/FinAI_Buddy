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

  useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    } catch {
      router.replace("/login");
    }
  };

  checkAuth();
}, [router]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};
