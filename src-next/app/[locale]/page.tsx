"use client";

import { useSession } from "@/hooks/use-session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Home component - Session-based router
 * Handles routing logic based on session state:
 * - Redirects to dashboard if a session exists
 * - Redirects to start page for new users
 * - Shows loading state while checking session
 */
export default function HomePage() {
  const router = useRouter();
  const { session, isInitialized } = useSession();

  useEffect(() => {
    if (isInitialized) {
      router.push(session ? "/dashboard" : "/start");
    }
  }, [session, router, isInitialized]);

  // Show minimal loading state while checking session
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
  );
}
