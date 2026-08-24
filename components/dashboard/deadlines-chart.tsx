"use client";

import { Area, AreaChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ChartCard } from "./chart-card";
import { getDeadlinesByWeek } from "@/lib/dashboard-metrics";

const deadlines = getDeadlinesByWeek();
const busiest = deadlines.reduce(
  (max, week) => (week.due > max.due ? week : max),
  deadlines[0]
);
const peakIndex = deadlines.indexOf(busiest);

const chartConfig = {
  due: { label: "Deadlines", color: "var(--chart-1)" },
} satisfies ChartConfig;

type PeakLabelProps = {
  x?: number | string;
  y?: number | string;
  value?: number | string;
  index?: number;
};

function PeakLabel({ x, y, value, index }: PeakLabelProps) {
  if (index !== peakIndex) return null;
  return (
    <text
      x={Number(x)}
      y={Number(y) - 12}
      textAnchor="middle"
      fontSize={11}
      className="fill-foreground font-medium"
    >
      {value} due
    </text>
  );
}

export function DeadlinesChart() {
  return (
    <ChartCard
      title="Upcoming Deadlines"
      description={`Project due dates by week — busiest is w/c ${busiest.week}`}
    >
      <ChartContainer config={chartConfig} className="h-[220px] w-full">
        <AreaChart
          data={deadlines}
          margin={{ top: 24, right: 12, left: 4, bottom: 0 }}
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
          <ChartTooltip
            content={
              <ChartTooltipContent
                indicator="line"
                labelFormatter={(label) => `Week commencing ${label}`}
              />
            }
          />
          <Area
            dataKey="due"
            type="monotone"
            stroke="var(--color-due)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="var(--color-due)"
            fillOpacity={0.1}
            dot={false}
            activeDot={{
              r: 4,
              fill: "var(--color-due)",
              stroke: "var(--card)",
              strokeWidth: 2,
            }}
          >
            <LabelList dataKey="due" content={<PeakLabel />} />
          </Area>
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  );
}
