"use client";

import { Cell, Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CircleIcon,
  Tick01Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { ChartCard } from "./chart-card";
import { getStatusBreakdown } from "@/lib/dashboard-metrics";
import type { ProjectStatus } from "@/mock-data/dashboard";

const breakdown = getStatusBreakdown();
const totalProjects = breakdown.reduce((sum, s) => sum + s.count, 0);

// Status colours are reserved and always ship with an icon + label, so hue is
// never the only thing distinguishing one state from another.
const statusIcons: Record<ProjectStatus, typeof CircleIcon> = {
  in_progress: CircleIcon,
  completed: Tick01Icon,
  on_hold: Clock01Icon,
};

const chartConfig = Object.fromEntries(
  breakdown.map((s) => [s.label, { label: s.label, color: s.fill }])
) satisfies ChartConfig;

export function ProjectStatusChart() {
  return (
    <ChartCard
      title="Project Status"
      description={`${totalProjects} projects by current state`}
    >
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <PieChart>
          <ChartTooltip
            content={<ChartTooltipContent nameKey="label" hideLabel />}
          />
          <Pie
            data={breakdown}
            dataKey="count"
            nameKey="label"
            innerRadius={58}
            outerRadius={84}
            paddingAngle={2}
            stroke="none"
          >
            {breakdown.map((slice) => (
              <Cell key={slice.status} fill={slice.fill} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox)) return null;
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-semibold"
                    >
                      {totalProjects}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) + 20}
                      className="fill-muted-foreground text-xs"
                    >
                      Projects
                    </tspan>
                  </text>
                );
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      {/* Legend doubles as the table view: every value is readable without
          hovering, so the tooltip only ever enhances. */}
      <ul className="mt-4 space-y-2">
        {breakdown.map((slice) => (
          <li key={slice.status} className="flex items-center gap-2 text-sm">
            <HugeiconsIcon
              icon={statusIcons[slice.status]}
              className="size-3.5 shrink-0"
              style={{ color: slice.fill }}
            />
            <span className="text-muted-foreground">{slice.label}</span>
            <span className="ml-auto font-medium tabular-nums">
              {slice.count}
            </span>
            <span className="text-muted-foreground tabular-nums w-10 text-right">
              {slice.share}%
            </span>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
