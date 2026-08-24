# Dashboard Starter

A reusable dashboard shell to drop into future projects — Next.js 16, React 19, Tailwind CSS v4, and [Base UI](https://base-ui.com/) primitives. Based on the Square UI "Taskplus" template.

The layout, components, and theming are the point. The task/project content filling it is placeholder demo data, meant to be replaced with whatever the real project needs — there is no backend to configure.

## Getting started

Requires Node 20 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

This project uses **npm** — `package-lock.json` is the committed lockfile. Stick to it so everyone resolves the same tree.

## What's included

Reusable pieces:

- **App shell** — collapsible sidebar that persists its state in a cookie (`Cmd/Ctrl + B`), sticky header, scrolling content area
- **Light and dark themes** — via `next-themes`, with a toggle in the header
- **Component library** — Base UI primitives in [components/ui/](components/ui/): button, input, select, checkbox, table, dropdown, sheet, tooltip, avatar, progress, card, chart

Demo sections showing the patterns (swap the content, keep the structure):

- **Stat cards** — a four-up metric row with change indicators
- **Searchable list** — text search plus multi-select filtering, wired through the store
- **Chart card** — recharts through the themed `ChartContainer` wrapper
- **Data table** — TanStack Table with search, status filter, and pagination

## Stack

| | |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS v4 (CSS-first, oklch tokens) |
| Components | shadcn/ui `base-vega` style on Base UI |
| Icons | HugeIcons |
| Table | TanStack Table |
| Charts | recharts |
| State | zustand |

## Project structure

```
app/                 Root layout, the dashboard page, global styles and theme tokens
components/dashboard Page sections — header, sidebar, stats, list, chart, table
components/ui        Base UI primitives (button, select, table, sidebar, chart, …)
mock-data/           Placeholder content — replace this
store/               zustand store for search and filter state
lib/, hooks/         cn() helper and the mobile breakpoint hook
```
