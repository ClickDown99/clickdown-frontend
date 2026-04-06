"use client";

import { useEffect } from "react";
import { Spinner } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/app/login/hooks/use-auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <Spinner color="accent" />
        <p className="text-sm text-foreground/65">Verificando acesso...</p>
      </div>
    );
  }

  return <>{children}</>;
}
