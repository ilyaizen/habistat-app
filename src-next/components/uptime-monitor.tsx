"use client";

import { db, getSessionCreatedAt } from "@/lib/db";
import { useCallback, useEffect, useState } from "react";

import { Card } from "./ui/card";

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

/**
 * UptimeMonitor Component
 * Displays a 90-day activity heatmap showing system uptime/activity status
 * Uses a color-coded visualization where:
 * - Green: Days with activity
 * - Red: Days without activity
 * - Gray: Days before tracking began
 */
export function UptimeMonitor() {
  // Track the status of each day in the 90-day window
  const [days, setDays] = useState<DayStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Store the calculated uptime percentage
  const [uptimePercentage, setUptimePercentage] = useState<number>(0);

  /**
   * Loads and processes the last 90 days of activity logs
   * Calculates uptime percentage and generates daily status data
   */
  const loadLogs = useCallback(async () => {
    try {
      // Fetch logs and get the tracking start date
      const logs = await db.getLast90DaysLogs();
      const sessionStart = getSessionCreatedAt();

      // Calculate date range for the 90-day window
      const today = new Date();
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(today.getDate() - 90);

      const dailyStatus: DayStatus[] = [];
      const currentDate = new Date(ninetyDaysAgo);

      // Counters for calculating uptime percentage
      let activeDays = 0;
      let totalDaysAfterStart = 0;

      // Process each day in the 90-day window
      while (currentDate <= today) {
        const currentDateStr = currentDate.toISOString().split("T")[0];
        const dayLog = logs.find((log) => log.date === currentDateStr);
        const isAfterSessionStart = sessionStart && currentDate >= sessionStart;

        // Only count days after tracking began for uptime calculation
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

      // Calculate and round the uptime percentage
      const percentage = totalDaysAfterStart > 0 ? (activeDays / totalDaysAfterStart) * 100 : 0;
      setUptimePercentage(Number(percentage.toFixed(2)));
      setDays(dailyStatus);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading logs:", error);
      setIsLoading(false);
    }
  }, []);

  /**
   * Initializes tracking if it hasn't started yet
   * Creates first log entry and loads existing logs
   */
  const initializeTracking = useCallback(async () => {
    try {
      const sessionStart = getSessionCreatedAt();
      const hasStarted = !!sessionStart;

      // Create first log entry if tracking hasn't started
      if (!hasStarted) {
        await db.addLog();
      }

      await loadLogs();
    } catch (error) {
      console.error("Error initializing tracking:", error);
      setIsLoading(false);
    }
  }, [loadLogs]);

  // Initialize tracking on component mount and refresh data periodically
  useEffect(() => {
    initializeTracking();

    // Refresh data every minute to catch new activity
    const interval = setInterval(loadLogs, 60000);
    return () => clearInterval(interval);
  }, [initializeTracking, loadLogs]);

  return (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Uptime Monitor</h2>
        </div>

        {isLoading ? (
          // Show loading spinner while data is being fetched
          <div className="flex h-24 items-center justify-center">
            <div className="border-primary h-6 w-6 animate-spin rounded-full border-b-2"></div>
          </div>
        ) : (
          <>
            {/* Activity heatmap visualization */}
            <div className="relative h-16">
              <div className="absolute inset-0 flex items-stretch gap-px">
                {days.map((day) => (
                  <div
                    key={day.date.toISOString()}
                    className={`relative flex-1 ${
                      day.isPreTracking
                        ? "bg-gray-100 dark:bg-gray-800" // Gray for pre-tracking days
                        : day.hasActivity
                          ? "bg-emerald-600" // Green for active days
                          : "bg-red-500" // Red for inactive days
                    }`}
                    title={`${day.date.toLocaleDateString()}: ${
                      day.isPreTracking ? "Pre-tracking" : day.hasActivity ? "Active" : "Inactive"
                    }`}
                  />
                ))}
              </div>
            </div>
            {/* Timeline labels and uptime percentage */}
            <div className="flex justify-between pt-1 text-sm text-gray-600 dark:text-gray-400">
              <span>90 days ago</span>
              <span>{uptimePercentage}% uptime</span>
              <span>Today</span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
