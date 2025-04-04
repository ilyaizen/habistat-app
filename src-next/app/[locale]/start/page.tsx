"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { MoveRight, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function StartPage() {
  const t = useTranslations("home");
  const router = useRouter();
  const { createSession } = useSession();

  // Create a new session when the start button is clicked
  const handleStart = () => {
    createSession();
    router.push("/dashboard");
  };

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-8 py-20 lg:py-40">
          <div>
            <Button variant="secondary" size="sm" className="gap-4">
              {t("learnMore")} <MoveRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="font-regular max-w-2xl text-center text-5xl tracking-tighter md:text-7xl">
              {t("hero.title")}
            </h1>
            <p className="text-muted-foreground max-w-2xl text-center text-lg leading-relaxed tracking-tight md:text-xl">
              {t("hero.subtitle")}
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button size="lg" className="gap-4" onClick={handleStart}>
              {t("goToStart")} <Sparkles className="h-4 w-4" />
            </Button>
            <Button size="lg" className="gap-4" variant="outline">
              {t("learnMore")} <MoveRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
