"use client";

import { Button } from "@/components/ui/button";
import { Sidebar, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { Bell, HelpCircle, Settings } from "lucide-react";
import Link from "next/link";
import * as React from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 px-4 py-2">
          <span className="text-xl font-bold">Dashboard</span>
        </Link>
      </SidebarHeader>
      <SidebarFooter>
        <div className="flex flex-col gap-2 p-4">
          <Button variant="ghost" size="icon" className="w-full justify-start">
            <Bell className="size-4" />
            <span className="ml-2">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon" className="w-full justify-start">
            <HelpCircle className="size-4" />
            <span className="ml-2">Help & Support</span>
          </Button>
          <Button variant="ghost" size="icon" className="w-full justify-start">
            <Settings className="size-4" />
            <span className="ml-2">Settings</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
