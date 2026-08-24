"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ChartCard } from "./chart-card";
import { getTeamWorkload } from "@/lib/dashboard-metrics";

const workload = getTeamWorkload(undefined, 8);

// One series, so every bar takes slot 1 — colouring nominal bars by their own
// value would re-encode bar length as hue and spend the identity channel on
// nothing. A single series also needs no legend; the title names it.
const chartConfig = {
  openTasks: { label: "Open tasks", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function TeamWorkloadChart() {
  return (
    <ChartCard
      title="Team Workload"
      description="Open tasks per project owner"
    >
      <ChartContainer config={chartConfig} className="h-[260px] w-full">
        <BarChart
          data={workload}
          layout="vertical"
          margin={{ top: 4, right: 32, left: 4, bottom: 4 }}
          barCategoryGap="22%"
          accessibilityLayer
        >
          <XAxis type="number" dataKey="openTasks" hide />
          <YAxis
            type="category"
            dataKey="owner"
            tickLine={false}
            axisLine={false}
            width={82}
            tick={{ fontSize: 11 }}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel={false} />}
          />
          <Bar
            dataKey="openTasks"
            fill="var(--color-openTasks)"
            radius={[0, 4, 4, 0]}
            maxBarSize={24}
          >
            {/* Value at the tip, so the chart reads without an x-axis. */}
            <LabelList
              dataKey="openTasks"
              position="right"
              offset={8}
              className="fill-muted-foreground"
              fontSize={11}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
