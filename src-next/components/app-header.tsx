"use client";

import { useOnlineStatus } from "@/hooks/use-online-status";
import { useSession } from "@/hooks/use-session";
import { Link } from "@/i18n/routing";
import { Bell, Menu, Search, Settings, Wifi, WifiOff, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ThemeToggle } from "./theme-toggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

/**
 * AppHeader Component
 *
 * A responsive navigation header component that includes:
 * - Logo and brand name
 * - Navigation links (desktop)
 * - Mobile menu toggle
 * - Theme toggle
 * - Authentication-based actions (Sign in/User button)
 */

export function AppHeader() {
  const isOnline = useOnlineStatus();
  const { session, endSession } = useSession();
  const router = useRouter();

  const t = useTranslations("nav");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showEndSessionAlert, setShowEndSessionAlert] = useState(false);

  const handleEndSession = () => {
    endSession();
    router.push("/");
  };

  return (
    <header className="border-opacity-20 bg-opacity-70 supports-[backdrop-filter]:bg-opacity-70 border-b border-[--border] bg-[--background] supports-[backdrop-filter]:backdrop-blur">
      <div className="container mx-auto px-3 md:px-4">
        <div className="relative flex h-14 items-center justify-between md:h-16">
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <Link href="/" className="flex items-center gap-1.5 text-lg font-bold md:gap-2 md:text-xl">
              <Image src="/logo.png" alt="Logo" width={24} height={24} className="h-6 w-6 md:h-7 md:w-7" />
              <span className="text-primary whitespace-nowrap drop-shadow-lg">{t("app.name")}</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex">
            <Link href="/" className="hover:text-muted-foreground text-xs font-medium md:text-sm">
              {t("home")}
            </Link>
            <Link href="/about" className="hover:text-muted-foreground text-xs font-medium md:text-sm">
              {t("about")}
            </Link>
            <Link href="/contact" className="hover:text-muted-foreground text-xs font-medium md:text-sm">
              {t("contact")}
            </Link>
          </nav>

          {/* Header */}
          <div className="flex h-10 w-full items-center justify-between px-6 py-1.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Dashboard</span>
                {isOnline ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-yellow-500" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost">
                <Search className="size-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <Bell className="size-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm leading-none font-medium">Anonymous User</p>
                      <p className="text-muted-foreground text-xs leading-none">
                        Session ID: {session?.id.slice(0, 8)}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setShowEndSessionAlert(true);
                    }}
                  >
                    <span>End Session</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="bg-background md:hidden">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="hover:text-muted-foreground font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("home")}
              </Link>
              <Link
                href="/about"
                className="hover:text-muted-foreground font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("about")}
              </Link>
              <Link
                href="/contact"
                className="hover:text-muted-foreground pb-4 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("contact")}
              </Link>
            </div>
          </div>
        )}

        <AlertDialog open={showEndSessionAlert} onOpenChange={setShowEndSessionAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>End Session</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to end your current session? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleEndSession}>End Session</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
}
