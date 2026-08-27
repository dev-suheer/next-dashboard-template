"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Folder01Icon,
  UserIcon,
  Settings01Icon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import { userProfile } from "@/mock-data/dashboard";
import { LOGIN_ROUTE, signOut } from "@/lib/auth";

export function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const section = pathname === "/profile" ? "Profile" : "Dashboard";

  function handleSignOut() {
    signOut();
    router.replace(LOGIN_ROUTE);
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 border-b bg-card sticky top-0 z-10 w-full shrink-0">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-2 cursor-pointer" />
        <div className="flex items-center gap-2 text-muted-foreground">
          <HugeiconsIcon icon={Folder01Icon} className="size-4" />
          <span className="text-sm font-medium">{section}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                aria-label="Open user menu"
                className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                <Avatar className="size-8 border-2 border-card shrink-0">
                  <AvatarImage src={userProfile.avatarUrl} alt="" />
                  <AvatarFallback>{userProfile.initials}</AvatarFallback>
                </Avatar>
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{userProfile.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {userProfile.email}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/profile" />}>
              <HugeiconsIcon icon={UserIcon} className="size-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/profile" />}>
              <HugeiconsIcon icon={Settings01Icon} className="size-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <HugeiconsIcon icon={Logout01Icon} className="size-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
