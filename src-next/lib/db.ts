import Dexie, { Table } from "dexie";

// Define types for our database tables
export interface DailyActivity {
  id?: number; // Primary key, auto-incremented
  userId: string; // The anonymous user ID
  date: string; // ISO string YYYY-MM-DD
  isActive: boolean;
  syncedAt?: number; // Timestamp for when this was last synced to the cloud
}

// Define app session tracking type
export interface AppSessionHistory {
  id?: number; // Primary key, auto-incremented
  userId: string; // The anonymous user ID
  startTime: number; // Timestamp when session started
  endTime?: number; // Optional timestamp when session ended
}

export class HabistatDB extends Dexie {
  dailyActivity!: Table<DailyActivity>;
  appSessions!: Table<AppSessionHistory>;

  constructor() {
    super("HabistatDB");

    // Define tables and indexes
    this.version(1).stores({
      dailyActivity: "++id, userId, date, [userId+date]", // Compound index for userId+date
    });

    // Add app session tracking in version 2
    this.version(2).stores({
      dailyActivity: "++id, userId, date, [userId+date]", // Keep the same
      appSessions: "++id, userId, startTime", // Index for looking up by user and time
    });
  }

  // Get last 90 days of activity logs
  async getLast90DaysLogs(): Promise<DailyActivity[]> {
    const userId = await getAnonymousUserId();
    const today = new Date();
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(today.getDate() - 90);

    return await this.dailyActivity
      .where("userId")
      .equals(userId)
      .and((item: DailyActivity) => {
        const itemDate = new Date(item.date);
        return itemDate >= ninetyDaysAgo && itemDate <= today;
      })
      .toArray();
  }

  // Add a log entry for the current day
  async addLog(): Promise<void> {
    await recordDailyActivity();
  }

  // Record app open with 5-minute TTL to avoid counting refreshes as new sessions
  async recordAppOpen(): Promise<void> {
    const userId = await getAnonymousUserId();
    const now = Date.now();

    try {
      // Check for any session in the last 5 minutes (300000ms)
      const recentSession = await this.appSessions
        .where("userId")
        .equals(userId)
        .and((session) => session.startTime > now - 300000)
        .first();

      if (!recentSession) {
        // No recent session found, create a new one
        await this.appSessions.add({
          userId,
          startTime: now,
        });

        // Also ensure we record daily activity
        await this.addLog();
      }
    } catch (error) {
      console.error("Error recording app session:", error);
    }
  }

  // Get app session history
  async getAppSessionHistory(days: number = 30): Promise<AppSessionHistory[]> {
    const userId = await getAnonymousUserId();
    const now = Date.now();
    const pastDate = now - days * 24 * 60 * 60 * 1000; // Convert days to milliseconds

    return await this.appSessions
      .where("userId")
      .equals(userId)
      .and((session) => session.startTime >= pastDate)
      .toArray();
  }
}

// Create a single instance to be used throughout the app
export const db = new HabistatDB();

// Get or create anonymous user ID
export async function getAnonymousUserId(): Promise<string> {
  const storedId = localStorage.getItem("anonymousUserId");
  if (storedId) {
    return storedId;
  }

  const newId = crypto.randomUUID();
  localStorage.setItem("anonymousUserId", newId);
  localStorage.setItem("sessionCreatedAt", new Date().toISOString());
  return newId;
}

// Get session creation date
export function getSessionCreatedAt(): Date | null {
  const date = localStorage.getItem("sessionCreatedAt");
  return date ? new Date(date) : null;
}

// Helper function to record daily activity
export async function recordDailyActivity() {
  const anonymousUserId = await getAnonymousUserId(); // Get the persistent anonymous ID
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  try {
    // Check if we already have a record for today
    const existing = await db.dailyActivity.where(["userId", "date"]).equals([anonymousUserId, today]).first();

    if (!existing) {
      // Only create a new record if one doesn't exist
      await db.dailyActivity.add({
        userId: anonymousUserId,
        date: today,
        isActive: true,
      });
    }
  } catch (error) {
    console.error("Error recording daily activity:", error);
  }
}
