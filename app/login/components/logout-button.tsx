"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";

import { useAuth } from "@/app/login/hooks/use-auth";

export function LogoutButton({
  className,
  variant = "ghost",
}: {
  className?: string;
  variant?: "ghost" | "outline" | "primary" | "secondary" | "tertiary";
}) {
  const router = useRouter();
  const { logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = async () => {
    setIsSubmitting(true);

    try {
      await logout();
      router.replace("/login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      className={className}
      isDisabled={isSubmitting}
      variant={variant}
      onPress={handleLogout}
    >
      <span className="inline-flex items-center gap-2">
        {isSubmitting ? "Saindo..." : "Sair"}
        {!isSubmitting ? <FiLogOut /> : null}
      </span>
    </Button>
  );
}
