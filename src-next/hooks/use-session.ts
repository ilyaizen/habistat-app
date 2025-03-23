"use client";

import { recordDailyActivity } from "@/lib/db";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export interface Session {
  id: string;
  createdAt: number;
  lastActive: number;
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only run once on client-side
    if (isInitialized) return;

    // Mark as initialized immediately
    setIsInitialized(true);

    try {
      // Try to load existing session from localStorage
      const storedSession = localStorage.getItem("habistat_session");
      if (storedSession) {
        const parsedSession = JSON.parse(storedSession);
        // Check if session is expired (30 days)
        const now = Date.now();
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        if (now - parsedSession.lastActive < thirtyDays) {
          setSession(parsedSession);
          // Record daily activity when session is loaded
          recordDailyActivity();
          return;
        }
      }

      // Don't automatically create a new session
    } catch (error) {
      // Handle localStorage errors (e.g., if localStorage is disabled)
      console.error("Error accessing localStorage:", error);
    }
  }, [isInitialized]);

  const updateLastActive = () => {
    if (!session || !isInitialized) return;

    try {
      const now = Date.now();
      // Only update if more than 1 minute has passed
      if (now - session.lastActive < 60000) return;

      const updatedSession = {
        ...session,
        lastActive: now,
      };
      localStorage.setItem("habistat_session", JSON.stringify(updatedSession));
      setSession(updatedSession);
    } catch (error) {
      console.error("Error updating session:", error);
    }
  };

  const endSession = () => {
    if (!isInitialized) return;

    try {
      localStorage.removeItem("habistat_session");
      setSession(null);
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  // Update createSession to record initial activity
  const createSession = () => {
    if (!isInitialized) return;

    try {
      const newSession = {
        id: uuidv4(),
        createdAt: Date.now(),
        lastActive: Date.now(),
      };
      localStorage.setItem("habistat_session", JSON.stringify(newSession));
      setSession(newSession);
      // Record initial daily activity
      recordDailyActivity();
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  // Add effect to record daily activity when app is opened
  useEffect(() => {
    if (session?.id) {
      recordDailyActivity();
    }
  }, [session?.id]); // Only run once when component mounts

  return { session, updateLastActive, endSession, createSession, isInitialized };
}
