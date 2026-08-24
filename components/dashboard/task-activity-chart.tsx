"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ChartCard } from "./chart-card";
import { taskActivityTrend } from "@/mock-data/dashboard";

const chartConfig = {
  created: { label: "Created", color: "var(--chart-1)" },
  completed: { label: "Completed", color: "var(--chart-2)" },
} satisfies ChartConfig;

const latest = taskActivityTrend[taskActivityTrend.length - 1];
const net = latest.completed - latest.created;

export function TaskActivityChart() {
  return (
    <ChartCard
      title="Task Activity"
      description="Tasks created vs. completed, last 8 weeks"
    >
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-semibold">{latest.completed}</span>
        <span className="text-sm text-muted-foreground">
          completed this week ({net >= 0 ? "+" : ""}
          {net} vs. created)
        </span>
      </div>
      <ChartContainer config={chartConfig} className="h-[240px] w-full">
        <LineChart
          data={taskActivityTrend}
          margin={{ top: 8, right: 12, left: 4, bottom: 0 }}
          accessibilityLayer
        >
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="week"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={28}
            tick={{ fontSize: 11 }}
            allowDecimals={false}
          />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            dataKey="created"
            stroke="var(--color-created)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={false}
            activeDot={{
              r: 4,
              fill: "var(--color-created)",
              stroke: "var(--card)",
              strokeWidth: 2,
            }}
          />
          <Line
            dataKey="completed"
            stroke="var(--color-completed)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={false}
            activeDot={{
              r: 4,
              fill: "var(--color-completed)",
              stroke: "var(--card)",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  );
}
