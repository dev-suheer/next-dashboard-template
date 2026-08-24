"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  // SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
// import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  // Search01Icon,
  // SparklesIcon,
  // Layers01Icon,
  // Notification01Icon,
  DashboardSquare01Icon,
  Mail01Icon,
  Task01Icon,
  // Calendar01Icon,
  // ChartLineData01Icon,
  // HelpCircleIcon,
  // Settings01Icon,
} from "@hugeicons/core-free-icons";

type NavItem = {
  title: string;
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"];
  isActive?: boolean;
  shortcut?: string;
  iconColor?: string;
};

const navItems: NavItem[] = [
  // { title: "Search", icon: Search01Icon, shortcut: "/", iconColor: "text-muted-foreground" },
  // { title: "Taskplus AI", icon: SparklesIcon, iconColor: "text-violet-500" },
  // { title: "Templates", icon: Layers01Icon, iconColor: "text-blue-500" },
  // { title: "Notification", icon: Notification01Icon, iconColor: "text-amber-500" },
  {
    title: "Dashboard",
    icon: DashboardSquare01Icon,
    isActive: true,
    iconColor: "text-primary",
  },
  { title: "Inbox", icon: Mail01Icon, iconColor: "text-cyan-500" },
  { title: "Project", icon: Task01Icon, iconColor: "text-emerald-500" },
  // { title: "Calendar", icon: Calendar01Icon, iconColor: "text-orange-500" },
  // { title: "Reports", icon: ChartLineData01Icon, iconColor: "text-rose-500" },
  // { title: "Help & Center", icon: HelpCircleIcon, iconColor: "text-sky-500" },
  // { title: "Settings", icon: Settings01Icon, iconColor: "text-muted-foreground" },
];

export function DashboardSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" className="lg:border-r-0!" {...props}>
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-2 w-full">
          <div className="size-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground shrink-0">
            <span className="text-sm font-bold">T+</span>
          </div>
          <span className="font-semibold text-base text-sidebar-foreground truncate">
            Dashboard
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={item.isActive}
                    className="h-9"
                    render={<Link href="#" />}
                  >
                    <HugeiconsIcon
                      icon={item.icon}
                      className={cn("size-4 shrink-0", item.iconColor)}
                    />
                    <span className="text-sm">{item.title}</span>
                    {item.shortcut && (
                      <span className="ml-auto flex size-5 items-center justify-center rounded bg-muted text-[10px] font-medium text-muted-foreground">
                        {item.shortcut}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* <SidebarFooter className="px-2 pb-3 group-data-[collapsible=icon]:hidden">
        <div className="group/sidebar relative flex flex-col gap-2 rounded-lg border p-4 text-sm w-full bg-background">
          <div className="text-balance text-lg font-semibold leading-tight group-hover/sidebar:underline">
            Open-source layouts by lndev-ui
          </div>
          <div className="text-muted-foreground">
            Collection of beautifully crafted open-source layouts UI built with
            shadcn/ui.
          </div>
          <Link
            target="_blank"
            rel="noreferrer"
            className="absolute inset-0"
            href="https://square.lndevui.com"
          >
            <span className="sr-only">Square by lndev-ui</span>
          </Link>
          <Link
            href="https://square.lndevui.com"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "sm" }), "w-full")}
          >
            square.lndevui.com
          </Link>
        </div>
      </SidebarFooter> */}
    </Sidebar>
  );
}
