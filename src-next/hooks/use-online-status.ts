"use client";

import { useEffect, useState } from "react";

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Event handlers for browser's online/offline events
    const handleOnline = () => checkConnectivity();
    const handleOffline = () => setIsOnline(false);

    // Function to check actual connectivity by pinging an endpoint
    const checkConnectivity = async () => {
      try {
        // Try to fetch a small resource from a reliable endpoint
        await fetch("https://www.google.com/favicon.ico", {
          mode: "no-cors",
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };

    // Set up browser event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Set initial state based on navigator.onLine
    setIsOnline(navigator.onLine);

    // Also check actual connectivity on mount
    checkConnectivity();

    // Set up periodic connectivity check (every 30 seconds)
    const intervalId = setInterval(checkConnectivity, 30000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(intervalId);
    };
  }, []);

  return isOnline;
}
