import { Card } from "@/components/ui/card";
import { Session } from "@/hooks/use-session";
import { AppSessionHistory, db } from "@/lib/db";
import { format, formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

interface SessionInfoProps {
  session: Session;
}

export function SessionInfo({ session }: SessionInfoProps) {
  const [showVerbose, setShowVerbose] = useState(false);
  const [appOpensCount, setAppOpensCount] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<AppSessionHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const history = await db.getAppSessionHistory(30);
        setSessionHistory(history);
        setAppOpensCount(history.length);
      } catch (error) {
        console.error("Failed to fetch session data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, []);

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Session Information</h2>
        <button
          onClick={() => setShowVerbose(!showVerbose)}
          className="rounded bg-gray-100 px-2 py-1 text-xs transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          {showVerbose ? "Hide Details" : "Show Details"}
        </button>
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
          <p className="font-medium">{appOpensCount}</p>
        </div>
      </div>

      {showVerbose && (
        <div className="mt-6">
          <h3 className="text-md mb-3 font-semibold">App Session History</h3>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            Records of when you&apos;ve opened the app (5-minute cooldown between records)
          </p>

          {loading ? (
            <p className="text-sm">Loading session history...</p>
          ) : sessionHistory.length === 0 ? (
            <p className="text-sm text-gray-500">No app sessions recorded yet.</p>
          ) : (
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {sessionHistory.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col rounded-md border p-3 text-xs sm:flex-row sm:justify-between"
                >
                  <div className="font-medium">{format(new Date(session.startTime), "PPP p")}</div>
                  <div className="text-muted-foreground">
                    {formatDistanceToNow(new Date(session.startTime), { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
