import { ThemeToggle } from "@/components/theme-toggle";
import { BrandMark } from "@/components/brand-mark";
import { appConfig } from "@/lib/config";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChartLineData01Icon,
  Task01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

const highlights = [
  {
    icon: Task01Icon,
    title: "Everything in one place",
    body: "Projects, tasks and deadlines tracked across every team.",
  },
  {
    icon: ChartLineData01Icon,
    title: "Insight at a glance",
    body: "Live charts for workload, progress and upcoming deadlines.",
  },
  {
    icon: UserGroupIcon,
    title: "Built for the whole team",
    body: "Shared context so nothing slips between hand-offs.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh w-full bg-sidebar lg:p-2">
      <div className="flex min-h-svh lg:min-h-[calc(100svh-1rem)] w-full overflow-hidden bg-background lg:rounded-md lg:border">
        <aside className="relative hidden w-1/2 flex-col justify-between bg-sidebar p-10 lg:flex">
          <BrandMark />

          <div className="max-w-md">
            <h2 className="text-2xl font-semibold tracking-tight text-balance">
              {appConfig.tagline}
            </h2>
            <ul className="mt-8 space-y-5">
              {highlights.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                    <HugeiconsIcon icon={item.icon} className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {appConfig.legalName} All rights
            reserved.
          </p>
        </aside>

        <main className="relative flex w-full flex-col justify-center px-5 py-10 sm:px-10 lg:w-1/2">
          <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
            <ThemeToggle />
          </div>
          <div className="mx-auto w-full max-w-sm">{children}</div>
        </main>
      </div>
    </div>
  );
}
