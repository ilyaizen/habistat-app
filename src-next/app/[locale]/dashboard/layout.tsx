"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="h-svh w-full overflow-hidden lg:p-2">
        <div className="bg-container flex h-full w-full flex-col items-center justify-start overflow-hidden lg:rounded-md lg:border">
          {/* Content */}
          <div className="h-[calc(100svh-80px)] w-full overflow-auto lg:h-[calc(100svh-96px)]">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
