# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server (next dev)
npm run build    # production build — the main correctness check
npm run lint     # eslint (flat config: next/core-web-vitals + next/typescript)
npm start        # serve the production build
```

**Use npm.** `package-lock.json` is the only committed lockfile — do not reintroduce pnpm or yarn. There is no test setup in this project, so `npm run build` (which also typechecks) plus `npm run lint` are the correctness gates.

`npm run lint` currently reports one warning from `react-hooks/incompatible-library`: TanStack Table's `useReactTable()` returns non-memoizable functions, so React Compiler skips optimizing `ProjectsTable`. It is inherent to the library, not a defect — leave it alone rather than suppressing it.

## What this is

A single-page dashboard template ("Taskplus", part of the Square UI theme set). Next.js 16 App Router + React 19. There is no backend, no API routes, and no data fetching: every value rendered comes from `mock-data/dashboard.ts`.

## Architecture

**Page composition** — [app/page.tsx](app/page.tsx) is the only route. It wraps everything in `SidebarProvider` and lays out a fixed shell (sidebar + bordered card containing header and scrolling main). All content lives in [components/dashboard/](components/dashboard/): `content.tsx` composes `StatsCards`, `TodaysTasks`, `PerformanceChart`, and `ProjectsTable`.

**Data flow** — `mock-data/dashboard.ts` exports plain consts and the `Project` / `TodayTask` / `ProjectStatus` types. Dashboard components import those consts directly at module scope and filter them client-side with `useMemo`. The zustand store in [store/dashboard-store.ts](store/dashboard-store.ts) holds **only UI filter state** (search strings, project filter, status filter) — never the data itself. When adding a filter, add the state to the store and apply it in the consuming component's `useMemo`.

Subscribe to the store with one selector per value (`useDashboardStore((s) => s.projectStatusFilter)`), not by destructuring `useDashboardStore()` — the latter re-renders the component on every unrelated store change.

There is deliberately **no data fetching, no API routes, and no server code**. The only outbound request in the app is the DiceBear avatar image. If real data is ever added, it should be introduced from the start rather than bolted onto these module-scope imports.

**Base UI, not Radix** — this is the critical thing to know. `components.json` sets `"style": "base-vega"` and every primitive in [components/ui/](components/ui/) is built on `@base-ui/react` (`Select as SelectPrimitive from "@base-ui/react/select"`, etc.), not `@radix-ui/*`. [components/ui/sidebar.tsx](components/ui/sidebar.tsx) is the shadcn sidebar re-implemented with Base UI's `useRender` + `mergeProps` instead of Radix `Slot`/`asChild`. Base UI uses a `render={<Element />}` prop where Radix uses `asChild`. Adding a component with the shadcn CLI must use the same style so it pulls the Base UI variant; hand-written primitives should follow the existing files' patterns (`data-slot` attributes, `cn()` from `@/lib/utils`, cva for variants).

**Icons** — HugeIcons, not lucide (`"iconLibrary": "hugeicons"`). Usage is always `<HugeiconsIcon icon={SomeIcon} className="size-4" />` with the icon imported from `@hugeicons/core-free-icons`.

**Styling** — Tailwind v4, CSS-first. There is no `tailwind.config.*`; the design tokens live in [app/globals.css](app/globals.css) as oklch CSS variables under `:root` / `.dark`, mapped to utilities via `@theme inline`. Dark mode is a `.dark` class variant driven by `next-themes` (`attribute="class"`, `defaultTheme="dark"`). Style with semantic tokens (`bg-card`, `text-muted-foreground`, `border-border`), not raw colors, except for the deliberate status accents in `projects-table.tsx`.

**Tables and charts** — `ProjectsTable` uses TanStack Table (`getCoreRowModel` + filtered + pagination row models) with `ColumnDef`s defined inline in the component. Charts use recharts through the [components/ui/chart.tsx](components/ui/chart.tsx) wrapper, which injects per-theme CSS variables from a `ChartConfig`; pass colors as `var(--color-<key>)`.

## Conventions

- Path alias `@/*` maps to the repo root (`@/components`, `@/lib/utils`, `@/hooks`, `@/mock-data`, `@/store`).
- Dashboard components are `"use client"` — they use zustand and hooks throughout. `app/page.tsx` and `app/layout.tsx` stay server components.
- Avatars come from `https://api.dicebear.com/9.x/glass/svg?seed=...` using the `ownerAvatarSeed` field.
