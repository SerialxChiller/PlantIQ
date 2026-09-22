# PlantIQ — Design System

> Actual implemented design (post-redesign). Black-first, premium-minimal SaaS dashboard
> inspired by NOOR principles: slim sidebar, thin borders, flat surfaces, calm density.

## Tokens

| Token | Dark (default) | Light | Usage |
|---|---|---|---|
| `--bg` | `#000000` | `#fafafa` | App background |
| `--bg2` | `#0a0a0a` | `#ffffff` | Header / sidebar / input wells |
| `--panel` | `#111111` | `#ffffff` | Cards, panels |
| `--elev` | `#151515` | `#f4f4f5` | Hovers, tiles, wells |
| `--border` | `#222222` | `#e4e4e7` | Thin default borders |
| `--border-strong` | `#303030` | `#d4d4d8` | Emphasis / dashed states |
| `--text` | `#ffffff` | `#09090b` | Primary text |
| `--text2` | `#a1a1aa` | `#52525b` | Secondary text |
| `--muted` | `#71717a` | `#71717a` | Metadata, hints |
| `--accent` | `#22c55e` | `#22c55e` | Primary actions, healthy state |

Status colors are used only when meaningful: green healthy/success, amber warning/moderate,
red critical/danger, blue information (watering, info alerts, light-adjacent telemetry uses amber/blue per chart legend).

## Rules enforced

- Radius: `rounded-md` (6px) controls/tiles, `rounded-lg` (8px) panels/modals. Pills only for numeric badges.
- No gradients, no neon, no glassmorphism (solid `bg2` header/sidebar), no card shadows — hover is border-color only.
- Borders are 1px `var(--border)` everywhere; `border-strong` on hover/dashed empty states.
- Density: stats are compact (`p-4`, 26px values); sections spaced `space-y-4`; grids use `gap-2.5/3/4`.
- Motion: page rise (280ms), modal pop (180ms), health-bar grow, live-dot pulse only. All disabled under `prefers-reduced-motion`.

## What was built

- `AppShell`: fixed sidebar + fixed header + centered `max-w-[1200px]` content with route-keyed entrance.
- Dashboard: greeting header, 4 stat cards (Total / Healthy / Needs attention / Active alerts),
  plant-health list (worst-first bars), live-sensor 2×2 tiles with deltas, trend preview,
  recent alerts, activity feed, quick-action grid.
- Plants: search + 5-way health filter + avatar cards with moisture/temp summaries.
- Detail: identity header, health breakdown bars with threshold context, live readings,
  threshold grid, history chart, care facts, watering log.
- Sensors: disclaimer banner, controls (+reset), per-plant reading panels.
- Analytics: 24H/7D/30D session windows (20/50/100 readings), avg/min/max + delta summaries,
  4 hover-tooltip charts, CSV export.
- Alerts: severity × status filters, active/resolved counts.
- Settings: segmented theme control, thresholds + reset, watering log, storage stats,
  export/clear/reset-data with confirmations, app-info + disclaimer.
