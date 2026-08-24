import { GeneralTab } from "@/components/profile/general-tab";
import { PasswordTab } from "@/components/profile/password-tab";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userProfile } from "@/mock-data/dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile - Taskplus",
  description: "Manage your account details and password",
};

export default function ProfilePage() {
  return (
    <div className="w-full overflow-y-auto overflow-x-hidden p-4 h-full">
      <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3 sm:gap-4 mt-3">
          <Avatar className="size-10 sm:size-12 border border-border shrink-0">
            <AvatarImage src={userProfile.avatarUrl} alt="" />
            <AvatarFallback>{userProfile.initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-semibold tracking-tight truncate">
              {userProfile.name}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {userProfile.role} · {userProfile.email}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Tabs defaultValue="general" className="gap-0">
            <div className="px-3 sm:px-4 py-3 border-b">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="general" className="p-3 sm:p-4">
              <GeneralTab />
            </TabsContent>
            <TabsContent value="password" className="p-3 sm:p-4">
              <PasswordTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
