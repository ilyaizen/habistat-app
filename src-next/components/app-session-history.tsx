"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSessionHistory, db } from "@/lib/db";
import { format, formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

interface AppSessionHistoryProps {
  days?: number; // Number of days to show history for
}

export function AppSessionHistoryDisplay({ days = 30 }: AppSessionHistoryProps) {
  const [sessions, setSessions] = useState<AppSessionHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      try {
        setLoading(true);
        const sessionHistory = await db.getAppSessionHistory(days);
        // Sort by startTime descending (newest first)
        sessionHistory.sort((a, b) => b.startTime - a.startTime);
        setSessions(sessionHistory);
      } catch (error) {
        console.error("Failed to load app session history:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSessions();
  }, [days]);

  if (loading) {
    return <div>Loading session history...</div>;
  }

  return (
    <Card className="w-full">
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
            {sessions.map((session) => (
              <div key={session.id} className="flex flex-col rounded-md border p-3 sm:flex-row sm:justify-between">
                <div className="font-medium">{format(new Date(session.startTime), "PPP p")}</div>
                <div className="text-muted-foreground">
                  {formatDistanceToNow(new Date(session.startTime), { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
