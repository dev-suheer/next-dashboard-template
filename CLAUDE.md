# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server (next dev)
npm run build    # production build — also typechecks; the main correctness gate
npm run lint     # eslint (flat config: next/core-web-vitals + next/typescript)
npm start        # serve the production build
```

**Use npm.** `package-lock.json` is the only committed lockfile — do not introduce pnpm or yarn. There is no test setup in this project, so `npm run build` plus `npm run lint` are the only correctness gates.

`npm run lint` currently reports exactly one warning, at [components/dashboard/projects-table.tsx:223](components/dashboard/projects-table.tsx#L223): `react-hooks/incompatible-library`, because TanStack Table's `useReactTable()` returns non-memoizable functions. It is inherent to the library — leave it rather than suppressing it, and treat "1 warning, 0 errors" as a clean run.

## What this is

A reusable dashboard **starter shell** (Next.js 16 App Router + React 19), based on the Square UI "Taskplus" template. The layout, primitives, and theming are the deliverable; the task/project content is placeholder demo data meant to be replaced per project.

There is no backend, no API routes, no server code, and no data fetching. Every rendered value comes from `mock-data/dashboard.ts` at module scope. The only outbound request is the DiceBear avatar image in `projects-table.tsx`. If real data is ever introduced, wire it in properly rather than bolting it onto the module-scope imports.

## Architecture

**Page composition** — [app/page.tsx](app/page.tsx) is the only route and stays a server component. It wraps everything in `SidebarProvider` and lays out a fixed shell: sidebar + a bordered card holding the header and a scrolling `<main>`. All content lives under [components/dashboard/](components/dashboard/), where `content.tsx` composes `WelcomeSection`, `StatsCards`, `TodaysTasks`, `PerformanceChart`, and `ProjectsTable`.

**Data flow** — [mock-data/dashboard.ts](mock-data/dashboard.ts) exports plain consts plus the `Project` / `TodayTask` / `ProjectStatus` types. Components import those consts directly and filter them client-side in `useMemo`. The zustand store in [store/dashboard-store.ts](store/dashboard-store.ts) holds **only UI filter state** (search strings, project filter, status filter) — never the data. To add a filter: add the state + setter to the store, then apply it in the consuming component's `useMemo`.

Subscribe with one selector per value (`useDashboardStore((s) => s.projectStatusFilter)`), never by destructuring `useDashboardStore()` — the latter re-renders on every unrelated store change.

**Base UI, not Radix** — the most important thing to know. `components.json` sets `"style": "base-vega"`, and every primitive in [components/ui/](components/ui/) is built on `@base-ui/react` (`import { Select as SelectPrimitive } from "@base-ui/react/select"`), not `@radix-ui/*`. Base UI uses a `render={<Element />}` prop where Radix uses `asChild`. [components/ui/sidebar.tsx](components/ui/sidebar.tsx) is the shadcn sidebar re-implemented with Base UI's `useRender` + `mergeProps` in place of Radix `Slot`. Adding components via the shadcn CLI must use the same style so it pulls the Base UI variant; hand-written primitives should follow existing files (`data-slot` attributes, `cn()` from `@/lib/utils`, cva for variants).

**Styling** — Tailwind v4, CSS-first. There is no `tailwind.config.*`. Tokens live in [app/globals.css](app/globals.css) as oklch CSS variables under `:root` / `.dark`, exposed as utilities via `@theme inline`, with dark mode as a `@custom-variant` on the `.dark` class. Style with semantic tokens (`bg-card`, `text-muted-foreground`, `border-border`) rather than raw colors — the deliberate exceptions are the emerald/amber status accents in `projects-table.tsx`. Theming is `next-themes` with `attribute="class"`, `defaultTheme="dark"`, `enableSystem`.

**Icons** — HugeIcons, not lucide (`"iconLibrary": "hugeicons"`). Always `<HugeiconsIcon icon={SomeIcon} className="size-4" />`, with the icon imported from `@hugeicons/core-free-icons`.

**Sidebar** — collapsible, toggled by `Cmd/Ctrl + B`, persisting its open state in a `sidebar_state` cookie; below the `useIsMobile()` breakpoint it renders as a Sheet instead.

**Tables and charts** — `ProjectsTable` uses TanStack Table (core + filtered + pagination row models) with `ColumnDef`s defined inline in the component. Charts use recharts through the [components/ui/chart.tsx](components/ui/chart.tsx) wrapper, which injects per-theme CSS variables from a `ChartConfig`; pass series colors as `var(--color-<key>)`.

## Conventions

- Path alias `@/*` maps to the repo root (`@/components`, `@/lib/utils`, `@/hooks`, `@/mock-data`, `@/store`).
- Everything under `components/dashboard/` is `"use client"` (zustand + hooks). `app/page.tsx` and `app/layout.tsx` stay server components.
- Project owner avatars come from `https://api.dicebear.com/9.x/glass/svg?seed=...` via the `ownerAvatarSeed` field.
- Deploys to Vercel; `vercel.json` skips the build when the last commit touched nothing in the project (`git diff --quiet HEAD^ HEAD .`).
