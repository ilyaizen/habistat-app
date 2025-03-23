"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Home component - Landing page of the application
 * Features:
 * - Responsive hero section with title and subtitle
 * - Feature grid showcasing key functionalities
 * - CTA buttons for getting started
 * - Responsive for desktop and mobile
 */
export default function HomePage() {
  const t = useTranslations("home");
  const router = useRouter();
  const { session, isInitialized, createSession } = useSession();

  useEffect(() => {
    // Only redirect if we have confirmed a session exists after initialization
    if (isInitialized && session) {
      router.push("/dashboard");
    }
  }, [session, router, isInitialized]);

  // Create a new session when the start button is clicked
  const handleStart = () => {
    createSession();
    router.push("/dashboard");
  };

  return (
    <main className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-bold">{t("title")}</h1>
        <Button size="lg" onClick={handleStart} className="bg-green-500 px-8 text-white hover:bg-green-600">
          {t("goToStart")}
        </Button>
      </div>
    </main>
  );
}
