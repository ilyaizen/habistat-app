"use client";

import { db } from "@/lib/db";
import { useEffect } from "react";

/**
 * Component that tracks app session usage with a 5-minute TTL
 * This prevents recording duplicate "App Opens" during refreshes or quick navigation
 */
export function AppSessionTracker() {
  useEffect(() => {
    // Record app open when component mounts
    const recordSession = async () => {
      try {
        await db.recordAppOpen();
      } catch (error) {
        console.error("Failed to record app session:", error);
      }
    };

    recordSession();

    // We don't need a cleanup function since we're just recording app opens
  }, []);

  // This is a utility component with no visual output
  return null;
}
