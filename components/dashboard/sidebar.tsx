"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { BrandMark } from "@/components/brand-mark";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  HelpCircleIcon,
} from "@hugeicons/core-free-icons";

type NavItem = {
  title: string;
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"];
  href?: string;
  shortcut?: string;
  iconColor?: string;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: DashboardSquare01Icon,
    href: "/",
    iconColor: "text-primary",
  },
  {
    title: "FAQ",
    icon: HelpCircleIcon,
    href: "/faq",
    iconColor: "text-sky-500",
  },
];

export function DashboardSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="offcanvas" className="lg:border-r-0!" {...props}>
      <SidebarHeader className="px-3 py-4">
        <BrandMark nameClassName="text-sidebar-foreground" />
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={item.href ? pathname === item.href : false}
                    className="h-9"
                    render={<Link href={item.href ?? "#"} />}
                    onClick={() => {
                      if (isMobile && item.href) setOpenMobile(false);
                    }}
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
    </Sidebar>
  );
}
