"use client";

import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ChartCard } from "./chart-card";
import { getProgressDistribution } from "@/lib/dashboard-metrics";

const distribution = getProgressDistribution();

// Completion buckets are ordinal — reordering them would change the meaning —
// so they take a single-hue ramp with monotone lightness rather than
// categorical hues. The colour carries the order; it does not claim identity.
const chartConfig = {
  count: { label: "Projects" },
} satisfies ChartConfig;

export function ProgressDistributionChart() {
  return (
    <ChartCard
      title="Progress Distribution"
      description="Projects grouped by completion"
    >
      <ChartContainer config={chartConfig} className="h-[260px] w-full">
        <BarChart
          data={distribution}
          margin={{ top: 24, right: 8, left: 8, bottom: 0 }}
          barCategoryGap="22%"
          accessibilityLayer
        >
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 11 }}
          />
          <YAxis hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="count" />}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={24}>
            {distribution.map((bucket) => (
              <Cell key={bucket.label} fill={bucket.fill} />
            ))}
            {/* Value on the cap, so the y-axis can stay hidden. */}
            <LabelList
              dataKey="count"
              position="top"
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
