# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server (next dev)
npm run build    # production build — also typechecks; the main correctness gate
npm run lint     # eslint (flat config: next/core-web-vitals + next/typescript)
npm start        # serve the production build
```

**Don't run `npm run build` after every edit.** Batch the changes for a task and verify once at the end; skip it entirely for copy tweaks or deletions. If the dev server was started before a route was added or moved, it keeps regenerating a stale `.next/dev/types/validator.ts` that fails the build — `rm -rf .next/dev/types` first, or restart the dev server.

**Use npm.** `package-lock.json` is the only committed lockfile — do not introduce pnpm or yarn. There is no test setup in this project, so `npm run build` plus `npm run lint` are the only correctness gates.

`npm run lint` currently reports exactly one warning, at [components/dashboard/projects-table.tsx:223](components/dashboard/projects-table.tsx#L223): `react-hooks/incompatible-library`, because TanStack Table's `useReactTable()` returns non-memoizable functions. It is inherent to the library — leave it rather than suppressing it, and treat "1 warning, 0 errors" as a clean run.

## What this is

A reusable dashboard **starter shell** (Next.js 16 App Router + React 19), based on the Square UI "Taskplus" template. The layout, primitives, and theming are the deliverable; the task/project content is placeholder demo data meant to be replaced per project.

There is no backend, no API routes, and no data fetching; `proxy.ts` is the only server code. Every rendered value comes from `mock-data/dashboard.ts` at module scope. The only outbound request is the DiceBear avatar image in `projects-table.tsx`. If real data is ever introduced, wire it in properly rather than bolting it onto the module-scope imports.

## Architecture

**Naming is centralised — never hardcode a product name.** [lib/config.ts](lib/config.ts) holds `appConfig` (`name`, `logoMark`, `description`, `tagline`, `domain`, `legalName`) plus `OTP_LENGTH` and `MIN_PASSWORD_LENGTH`. Every user-visible mention of the app reads from it: the root layout's metadata (a `title.template` of `%s · {name}`, so pages set only their own short `title`), the auth layout's tagline and copyright, the mock user's email domain, and [components/brand-mark.tsx](components/brand-mark.tsx) — the single logo lockup used by the sidebar and the auth screens. Renaming the product should be a one-file edit; if you find yourself typing a brand string into a component, put it in `appConfig` instead. The earlier "Taskplus" placeholder was removed for exactly this reason.

**Auth gate** — [proxy.ts](proxy.ts) is the only server code in the project (Next.js 16 renamed the `middleware` file convention to `proxy`; the exported function is `proxy`). It reads an `auth_session` cookie and redirects signed-out traffic to `/login`, and signed-in traffic away from the auth routes. The cookie name, max-age, route constants, and the client-side `signIn(remember)` / `signOut()` helpers all live in [lib/auth.ts](lib/auth.ts) — add new auth pages to `AUTH_ROUTES` there so the gate keeps working, rather than hardcoding paths in the proxy. `signIn(false)` writes a session cookie instead of a 7-day one, which is what the login form's "Keep me signed in" toggles. **This is a mock session, not authentication**: `signIn()` writes a client-readable cookie with no credential check, so anyone can set it by hand. It exists to make the template's navigation flow real; wire it to a genuine session before shipping anything sensitive.

Auth screens live in the `app/(auth)/` route group, whose [layout.tsx](app/(auth)/layout.tsx) is a split shell (brand panel + form column, panel hidden below `lg`) with its own theme toggle — no sidebar or dashboard header. The five routes are `/login`, `/register`, `/forgot-password`, `/verify-otp`, `/reset-password`; the recovery chain passes the address along as `?email=`, so `/verify-otp` reads it via `useSearchParams()` and its page wraps the form in `<Suspense>` (required, or the static build fails). Each form is a client component in [components/auth/](components/auth/) sharing `AuthHeading`. There are deliberately no social-login buttons and no on-screen demo disclaimer — the mock-session caveat above is the record of it, so don't reintroduce either without being asked. The OTP screen uses Base UI's `otp-field` via [components/ui/otp-input.tsx](components/ui/otp-input.tsx); note its `Input` parts take no `index` prop (index is component *state*) — they self-register in DOM order.

**Page layout convention — apply this to every new section.** Page content is **full width** with a top margin; do not centre it in a `max-w-*` column. The shape is an outer `<div className="w-full overflow-y-auto overflow-x-hidden p-4 h-full">` wrapping `<div className="w-full space-y-6 mt-4">`, as in [components/faq/faq-content.tsx](components/faq/faq-content.tsx). (`/profile` predates this rule and still uses a centred `max-w-3xl`; bring it in line if you touch it.)

**Page composition** — dashboard routes live in the `app/(dashboard)/` route group; the group name is not in the URL. [app/(dashboard)/layout.tsx](app/(dashboard)/layout.tsx) owns the app shell — `SidebarProvider` + sidebar + a bordered card holding the header and a scrolling `<main>` — so pages supply content only. Current routes are `/` ([page.tsx](app/(dashboard)/page.tsx) → `DashboardContent`), `/profile`, and `/faq`. All pages stay server components. Adding a route means three touches: the page file, a `navItems` entry with an `href` in [components/dashboard/sidebar.tsx](components/dashboard/sidebar.tsx) (items without an `href` are inert placeholders), and a `sectionTitles` entry in [components/dashboard/header.tsx](components/dashboard/header.tsx) for the breadcrumb. `components/dashboard/content.tsx` composes the dashboard sections: `WelcomeSection`, `StatsCards`, `TodaysTasks`, `PerformanceChart`, the five chart cards, and `ProjectsTable`.

**Data flow** — [mock-data/dashboard.ts](mock-data/dashboard.ts) exports plain consts plus the `Project` / `TodayTask` / `ProjectStatus` / `UserProfile` types. Components import those consts directly and filter them client-side in `useMemo`. Chart series that are *derived* rather than filtered live in [lib/dashboard-metrics.ts](lib/dashboard-metrics.ts) as pure functions of `projects` (status breakdown, team workload, progress buckets, deadlines by week) — keep chart components presentational and add new derivations there, so swapping the mock source for an API touches one import. The zustand store in [store/dashboard-store.ts](store/dashboard-store.ts) holds **only UI filter state** (search strings, project filter, status filter) — never the data. To add a filter: add the state + setter to the store, then apply it in the consuming component's `useMemo`.

Subscribe with one selector per value (`useDashboardStore((s) => s.projectStatusFilter)`), never by destructuring `useDashboardStore()` — the latter re-renders on every unrelated store change.

**FAQ module** — [components/faq/](components/faq/) with data in [mock-data/faqs.ts](mock-data/faqs.ts). It is the one module whose records are *mutable* (add / edit / delete), and that state deliberately lives in `useState` inside `FaqContent`, seeded from the mock export — not in the zustand store, which stays filter-only per the rule above. Nothing persists across a refresh; wire it to an API before treating it as real. `FaqDialog` serves both add and edit: it takes `faq: Faq | null` and initialises its inner `FaqForm` straight from props, keyed on `faq?.id ?? "new"` — do not reintroduce a `useEffect` that copies props into state, as `react-hooks/set-state-in-effect` fails the lint. Deletes go through a confirm dialog. [components/faq/category-styles.ts](components/faq/category-styles.ts) is the single source for category colour — one `--chart-*` slot per category in fixed order — shared by the card badges and the tab counts so the two can never drift; `All` takes a neutral chip. The whole FAQ card toggles on click, so the action buttons sit in a wrapper that calls `stopPropagation()`, and the chevron stays a real `CollapsibleTrigger` (it also carries the accessible name and keyboard access, since the card itself is a plain `div`). Keep that arrangement if you add another row action, or the click will both fire the action and toggle the panel. Answers expand through [components/ui/collapsible.tsx](components/ui/collapsible.tsx) — Base UI's Collapsible animating `height` from `--collapsible-panel-height` with `data-starting-style:h-0` / `data-ending-style:h-0`. Never expand a panel by conditionally rendering it; that jumps open with no transition. `DialogFooter` carries no top border — actions sit on open space in both the form and confirm dialogs.

**Base UI, not Radix** — the most important thing to know. `components.json` sets `"style": "base-vega"`, and every primitive in [components/ui/](components/ui/) is built on `@base-ui/react` (`import { Select as SelectPrimitive } from "@base-ui/react/select"`), not `@radix-ui/*`. Base UI uses a `render={<Element />}` prop where Radix uses `asChild`. [components/ui/sidebar.tsx](components/ui/sidebar.tsx) is the shadcn sidebar re-implemented with Base UI's `useRender` + `mergeProps` in place of Radix `Slot`. Adding components via the shadcn CLI must use the same style so it pulls the Base UI variant; hand-written primitives should follow existing files (`data-slot` attributes, `cn()` from `@/lib/utils`, cva for variants).

**Styling** — Tailwind v4, CSS-first. There is no `tailwind.config.*`. Tokens live in [app/globals.css](app/globals.css) as oklch CSS variables under `:root` / `.dark`, exposed as utilities via `@theme inline`, with dark mode as a `@custom-variant` on the `.dark` class. Style with semantic tokens (`bg-card`, `text-muted-foreground`, `border-border`) rather than raw colors — the deliberate exceptions are the emerald/amber status accents in `projects-table.tsx`. Theming is `next-themes` with `attribute="class"`, `defaultTheme="dark"`, `enableSystem`.

**Icons** — HugeIcons, not lucide (`"iconLibrary": "hugeicons"`). Always `<HugeiconsIcon icon={SomeIcon} className="size-4" />`, with the icon imported from `@hugeicons/core-free-icons`.

**Sidebar** — collapsible, toggled by `Cmd/Ctrl + B`, persisting its open state in a `sidebar_state` cookie; below the `useIsMobile()` breakpoint it renders as a Sheet instead.

**Tables and charts** — `ProjectsTable` uses TanStack Table (core + filtered + pagination row models) with `ColumnDef`s defined inline in the component. Charts use recharts through the [components/ui/chart.tsx](components/ui/chart.tsx) wrapper, which injects per-theme CSS variables from a `ChartConfig`; pass series colors as `var(--color-<key>)`. `ChartCard` in [components/dashboard/chart-card.tsx](components/dashboard/chart-card.tsx) supplies the shared card chrome.

**Chart color is a validated system, not taste.** `globals.css` carries three separate token families, and which one a chart uses is determined by the job its color does:

- `--chart-1..5` — **categorical**, for series *identity*. Assign in fixed order, never cycle or re-order (the order is what makes it colorblind-safe).
- `--status-good/warning/serious/critical` — **status**, reserved meaning, identical in both modes, never reused as a series color, and always shipped with an icon or label so hue is never the sole carrier.
- `--ramp-1..5` — a single-hue **ordinal** ramp for ordered buckets, where lightness carries the order.

A single series takes slot 1 for every mark and gets no legend; never color nominal bars by their own value. These values were produced by the `dataviz` skill's validator (`scripts/validate_palette.js`) — the stock shadcn `--chart-*` tokens were replaced because they failed it outright (light-mode slots 4 and 5 were ΔE 7.4 apart, indistinguishable even with normal color vision). **If you change a chart color, re-run that validator for both modes rather than eyeballing it.** Other standing rules already applied here: solid hairline gridlines (never dashed), bars capped at 24px with 4px rounded data-ends, 2px lines, area fills at ~10% opacity, selective direct labels instead of a number on every point, and chart container heights that include the x-axis band.

## Conventions

- Path alias `@/*` maps to the repo root (`@/components`, `@/lib/utils`, `@/hooks`, `@/mock-data`, `@/store`).
- Everything under `components/dashboard/`, `components/profile/`, and `components/auth/` is `"use client"` (zustand, hooks, form state). The `app/` files stay server components.
- Forms are plain controlled React state — no form library is installed. There is no backend, so "Save changes", "Update password", and the social sign-in buttons validate (or do nothing) and update local state only.
- `PasswordInput` ([components/ui/password-input.tsx](components/ui/password-input.tsx)) is the shared password field with the show/hide toggle — used by the login, register, and reset-password forms and the profile password tab. Its optional `labelAction` slot holds the "Forgot password?" link.
- **Write no comments.** The codebase is deliberately comment-free outside the vendored shadcn primitives in `components/ui/` (`sidebar.tsx`, `chart.tsx`), whose upstream comments are left intact so future shadcn diffs stay clean. Let naming carry the explanation.
- Project owner avatars come from `https://api.dicebear.com/9.x/glass/svg?seed=...` via the `ownerAvatarSeed` field.
- Deploys to Vercel; `vercel.json` skips the build when the last commit touched nothing in the project (`git diff --quiet HEAD^ HEAD .`).
