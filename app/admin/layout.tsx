"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (loading) return;
    if (isLoginPage) {
      if (isAdmin) router.replace("/admin");
      return;
    }
    if (!user) {
      router.replace("/admin/login");
      return;
    }
    if (!isAdmin) {
      router.replace("/admin/login");
    }
  }, [loading, user, isAdmin, isLoginPage, router]);

  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-disco-black">
        <p className="font-body text-disco-silver">Cargando...</p>
      </div>
    );
  }

  if (!isLoginPage && !user) {
    return null;
  }

  if (!isLoginPage && user && !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
