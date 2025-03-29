"use client";

import { UptimeMonitor } from "@/components/uptime-monitor";
import { useSession } from "@/hooks/use-session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { session, updateLastActive, isInitialized } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we have confirmed no session exists after initialization
    if (isInitialized && !session) {
      router.push("/");
      return;
    }

    // Only set up interval if we have a session and are initialized
    if (isInitialized && session) {
      // Set up periodic updates
      const interval = setInterval(updateLastActive, 60000);
      return () => clearInterval(interval);
    }
  }, [session, router, updateLastActive, isInitialized]);

  // Show a loading state or nothing until we know our session state
  if (!isInitialized || !session) {
    return null;
  }

  return (
    <main className="container mx-auto max-w-4xl space-y-6 p-4">
      <UptimeMonitor />
    </main>
  );
}
