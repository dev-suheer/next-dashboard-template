"use client";

import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon, Add01Icon } from "@hugeicons/core-free-icons";
import { welcomeSummary } from "@/mock-data/dashboard";
import { StatsCards } from "./stats-cards";
import { TodaysTasks } from "./todays-tasks";
import { PerformanceChart } from "./performance-chart";
import { ProjectsTable } from "./projects-table";
import { TaskActivityChart } from "./task-activity-chart";
import { ProjectStatusChart } from "./project-status-chart";
import { TeamWorkloadChart } from "./team-workload-chart";
import { ProgressDistributionChart } from "./progress-distribution-chart";
import { DeadlinesChart } from "./deadlines-chart";

function WelcomeSection() {
  const { userName, tasksDueToday, overdueTasks, upcomingDeadlines } =
    welcomeSummary;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Welcome Back, {userName}! 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {tasksDueToday} Tasks Due Today, {overdueTasks} Overdue Tasks,{" "}
          {upcomingDeadlines} Upcoming Deadlines (This Week)
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-9 gap-1.5">
          <HugeiconsIcon icon={Download01Icon} className="size-4" />
          Export
        </Button>
        <Button size="sm" className="h-9 gap-1.5 bg-primary hover:bg-primary/90">
          <HugeiconsIcon icon={Add01Icon} className="size-4" />
          New
        </Button>
      </div>
    </div>
  );
}

export function DashboardContent() {
  return (
    <div className="w-full overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-8 py-4 h-full">
      <div className="w-full space-y-6 mt-4">
        <WelcomeSection />
        <StatsCards />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <TodaysTasks />
          </div>
          <div>
            <PerformanceChart />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <TaskActivityChart />
          </div>
          <div>
            <ProjectStatusChart />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <TeamWorkloadChart />
          <ProgressDistributionChart />
        </div>
        <DeadlinesChart />
        <ProjectsTable />
      </div>
    </div>
  );
}
