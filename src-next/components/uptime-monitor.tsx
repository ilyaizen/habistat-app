"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Session } from "@/hooks/use-session";
import type { AppSessionHistory } from "@/lib/db";
import { db, getSessionCreatedAt } from "@/lib/db";
import { format, formatDistanceToNow } from "date-fns";
import { useCallback, useEffect, useState } from "react";

/**
 * Represents the status of a single day in the uptime monitoring system
 * @interface DayStatus
 * @property {Date} date - The date being tracked
 * @property {boolean} hasActivity - Whether there was any activity recorded on this date
 * @property {boolean} isPreTracking - Whether this date was before tracking began
 */
interface DayStatus {
  date: Date;
  hasActivity: boolean;
  isPreTracking: boolean;
}

interface UptimeMonitorProps {
  session?: Session;
  showSessionInfo?: boolean;
}

/**
 * Unified UptimeMonitor Component
 * Combines uptime tracking, session history, and session information display
 * Features:
 * - 90-day activity heatmap
 * - Session tracking
 * - Session history display
 * - Detailed session information (optional)
 */
export function UptimeMonitor({ session, showSessionInfo = false }: UptimeMonitorProps) {
  // State for uptime heatmap
  const [days, setDays] = useState<DayStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uptimePercentage, setUptimePercentage] = useState<number>(0);

  // State for session history
  const [sessions, setSessions] = useState<AppSessionHistory[]>([]);
  const [showVerbose, setShowVerbose] = useState(false);

  /**
   * Records app session when component mounts
   */
  useEffect(() => {
    const recordSession = async () => {
      try {
        await db.recordAppOpen();
      } catch (error) {
        console.error("Failed to record app session:", error);
      }
    };

    recordSession();
  }, []);

  /**
   * Loads and processes the last 90 days of activity logs
   * Calculates uptime percentage and generates daily status data
   */
  const loadLogs = useCallback(async () => {
    try {
      const logs = await db.getLast90DaysLogs();
      const sessionStart = getSessionCreatedAt();

      const today = new Date();
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(today.getDate() - 90);

      const dailyStatus: DayStatus[] = [];
      const currentDate = new Date(ninetyDaysAgo);

      let activeDays = 0;
      let totalDaysAfterStart = 0;

      while (currentDate <= today) {
        const currentDateStr = currentDate.toISOString().split("T")[0];
        const dayLog = logs.find((log) => log.date === currentDateStr);
        const isAfterSessionStart = sessionStart && currentDate >= sessionStart;

        if (isAfterSessionStart) {
          if (dayLog?.isActive) activeDays++;
          totalDaysAfterStart++;
        }

        dailyStatus.push({
          date: new Date(currentDate),
          hasActivity: dayLog?.isActive || false,
          isPreTracking: !isAfterSessionStart,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      const percentage = totalDaysAfterStart > 0 ? (activeDays / totalDaysAfterStart) * 100 : 0;
      setUptimePercentage(Number(percentage.toFixed(2)));
      setDays(dailyStatus);

      // Load session history
      const sessionHistory = await db.getAppSessionHistory(30);
      sessionHistory.sort((a, b) => b.startTime - a.startTime);
      setSessions(sessionHistory);

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading logs:", error);
      setIsLoading(false);
    }
  }, []);

  /**
   * Initialize tracking and load data
   */
  const initializeTracking = useCallback(async () => {
    try {
      const sessionStart = getSessionCreatedAt();
      if (!sessionStart) {
        await db.addLog();
      }
      await loadLogs();
    } catch (error) {
      console.error("Error initializing tracking:", error);
      setIsLoading(false);
    }
  }, [loadLogs]);

  useEffect(() => {
    initializeTracking();
    const interval = setInterval(loadLogs, 60000);
    return () => clearInterval(interval);
  }, [initializeTracking, loadLogs]);

  if (isLoading) {
    return (
      <div className="flex h-24 items-center justify-center">
        <div className="border-primary h-6 w-6 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Uptime Heatmap */}
      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Uptime Monitor</h2>
          </div>

          <div className="relative h-16">
            <div className="absolute inset-0 flex items-stretch gap-px">
              {days.map((day) => (
                <div
                  key={day.date.toISOString()}
                  className={`relative flex-1 ${
                    day.isPreTracking
                      ? "bg-gray-100 dark:bg-gray-800"
                      : day.hasActivity
                        ? "bg-emerald-600"
                        : "bg-red-500"
                  }`}
                  title={`${day.date.toLocaleDateString()}: ${
                    day.isPreTracking ? "Pre-tracking" : day.hasActivity ? "Active" : "Inactive"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-1 text-sm text-gray-600 dark:text-gray-400">
            <span>90 days ago</span>
            <span>{uptimePercentage}% uptime</span>
            <span>Today</span>
          </div>
        </div>
      </Card>

      {/* Session History */}
      <Card>
        <CardHeader>
          <CardTitle>App Session History</CardTitle>
          <CardDescription>
            Records of when you&apos;ve opened the app (5-minute cooldown between records)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-muted-foreground py-4 text-center">No app sessions recorded yet.</div>
          ) : (
            <div className="space-y-2">
              {sessions.slice(0, showVerbose ? undefined : 5).map((session) => (
                <div key={session.id} className="flex flex-col rounded-md border p-3 sm:flex-row sm:justify-between">
                  <div className="font-medium">{format(new Date(session.startTime), "PPP p")}</div>
                  <div className="text-muted-foreground">
                    {formatDistanceToNow(new Date(session.startTime), { addSuffix: true })}
                  </div>
                </div>
              ))}
              {sessions.length > 5 && !showVerbose && (
                <button
                  onClick={() => setShowVerbose(true)}
                  className="text-muted-foreground hover:bg-accent w-full rounded-md border p-2 text-sm"
                >
                  Show {sessions.length - 5} more sessions...
                </button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Info */}
      {showSessionInfo && session && (
        <Card className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Session Information</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Session ID</p>
              <p className="font-medium">{session.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">{formatDistanceToNow(session.createdAt)} ago</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Active</p>
              <p className="font-medium">{formatDistanceToNow(session.lastActive)} ago</p>
            </div>
            <div>
              <p className="text-muted-foreground">Session Type</p>
              <p className="font-medium">Anonymous</p>
            </div>
            <div>
              <p className="text-muted-foreground">App Opens</p>
              <p className="font-medium">{sessions.length}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
