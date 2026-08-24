import { projects, type Project, type ProjectStatus } from "@/mock-data/dashboard";

/**
 * Derived series for the dashboard charts. Everything here is a pure function
 * of `mock-data/dashboard.ts`, so swapping the mock source for a real API means
 * changing the import above and nothing in the chart components.
 */

/* ---------------------------------------------------------------- status --- */

/**
 * Single source of truth for how a project status is presented. Status colors
 * are reserved — they never double as a series color, and they always ship
 * alongside a label so hue is never the only carrier of meaning.
 */
export const statusMeta: Record<
  ProjectStatus,
  { label: string; color: string }
> = {
  in_progress: { label: "In Progress", color: "var(--chart-1)" },
  completed: { label: "Completed", color: "var(--status-good)" },
  on_hold: { label: "On Hold", color: "var(--status-warning)" },
};

const statusOrder: ProjectStatus[] = ["in_progress", "completed", "on_hold"];

export interface StatusSlice {
  status: ProjectStatus;
  label: string;
  count: number;
  share: number;
  fill: string;
}

export function getStatusBreakdown(source: Project[] = projects): StatusSlice[] {
  const total = source.length;

  return statusOrder.map((status) => {
    const count = source.filter((p) => p.status === status).length;
    return {
      status,
      label: statusMeta[status].label,
      count,
      share: total === 0 ? 0 : Math.round((count / total) * 100),
      fill: statusMeta[status].color,
    };
  });
}

/* -------------------------------------------------------------- workload --- */

export interface WorkloadEntry {
  owner: string;
  openTasks: number;
  totalTasks: number;
}

/** Owners ranked by open (unfinished) task count, highest first. */
export function getTeamWorkload(
  source: Project[] = projects,
  limit = 8
): WorkloadEntry[] {
  const byOwner = new Map<string, WorkloadEntry>();

  for (const p of source) {
    const entry = byOwner.get(p.ownerName) ?? {
      owner: p.ownerName,
      openTasks: 0,
      totalTasks: 0,
    };
    entry.openTasks += p.totalTasks - p.completedTasks;
    entry.totalTasks += p.totalTasks;
    byOwner.set(p.ownerName, entry);
  }

  return [...byOwner.values()]
    .sort((a, b) => b.openTasks - a.openTasks)
    .slice(0, limit);
}

/* -------------------------------------------------------------- progress --- */

export interface ProgressBucket {
  label: string;
  count: number;
  fill: string;
}

/**
 * Completion buckets. These are *ordinal* — reordering them would change the
 * meaning — so they take a single-hue ramp whose lightness carries the order,
 * not a categorical palette.
 */
const progressBuckets: {
  label: string;
  fill: string;
  match: (progress: number) => boolean;
}[] = [
  { label: "0–25%", fill: "var(--ramp-1)", match: (v) => v <= 25 },
  { label: "26–50%", fill: "var(--ramp-2)", match: (v) => v > 25 && v <= 50 },
  { label: "51–75%", fill: "var(--ramp-3)", match: (v) => v > 50 && v <= 75 },
  { label: "76–99%", fill: "var(--ramp-4)", match: (v) => v > 75 && v < 100 },
  { label: "100%", fill: "var(--ramp-5)", match: (v) => v >= 100 },
];

export function getProgressDistribution(
  source: Project[] = projects
): ProgressBucket[] {
  return progressBuckets.map(({ label, fill, match }) => ({
    label,
    fill,
    count: source.filter((p) => match(p.progress)).length,
  }));
}

/* ------------------------------------------------------------- deadlines --- */

export interface DeadlineWeek {
  week: string;
  due: number;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Monday 00:00 of the week containing `date`. */
function startOfWeek(date: Date): Date {
  const start = new Date(date);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  start.setHours(0, 0, 0, 0);
  return start;
}

function formatWeek(date: Date): string {
  return `${String(date.getDate()).padStart(2, "0")} ${MONTHS[date.getMonth()]}`;
}

/** Project deadlines grouped into week-commencing buckets, oldest first. */
export function getDeadlinesByWeek(source: Project[] = projects): DeadlineWeek[] {
  const byWeek = new Map<number, number>();

  for (const p of source) {
    const due = new Date(p.dueDate);
    if (Number.isNaN(due.getTime())) continue;
    const key = startOfWeek(due).getTime();
    byWeek.set(key, (byWeek.get(key) ?? 0) + 1);
  }

  return [...byWeek.entries()]
    .sort(([a], [b]) => a - b)
    .map(([time, due]) => ({ week: formatWeek(new Date(time)), due }));
}
