# PlantIQ — Components

All components are React + TypeScript + Tailwind + Lucide. Business logic lives in
`src/context/AppContext.tsx`; components below are presentational except where noted.

## Shell

- `components/layout/AppShell.tsx` — route switch (hash routes), mobile drawer state,
  responsive content offset (`lg:ml-[68px]` / `lg:ml-[232px]`), `max-w-[1200px]` container,
  route-keyed `.noor-enter` animation.
- `components/layout/Sidebar.tsx` — props `{ route, mobileOpen, onCloseMobile }`.
  Fixed drawer, `232px` expanded / `68px` collapsed (desktop), full-width drawer on mobile
  with scrim. Brand block, main nav, separated Settings group, live/pause footer,
  collapse toggle (persisted `plantiq_sidebar`). Active link gets a 2px accent bar;
  collapsed labels use CSS `Tooltip`. Alerts badge from `activeAlerts`.
- `components/layout/Header.tsx` — props `{ route, onOpenMobile }`. Breadcrumb + page title
  derived per route (plant name resolved from store on detail pages), simulated-status
  `Badge`, alerts bell with count, compact `ThemeToggle`, settings shortcut.

## UI primitives (`components/ui/`)

- `primitives.tsx` — `Button` (`primary|secondary|ghost|danger`, `sm|md`), `Input`, `Select`,
  `Card`, `Panel`, `SectionHeader({title,hint,action})`, `Badge` (`neutral|success|warning|danger|info|accent`, `dot`),
  `Tooltip` (CSS group-hover, focus-visible aware), `EmptyState({icon,title,hint,action})`,
  `LoadingState`, `PageHeader({title,description,meta,actions})`.
- `StatCard.tsx` — `StatCard({label,value,icon,iconClass?,sub?})` compact stat;
  `PlantHealthBadge({score})`; `HealthRing({score,size})` thin SVG ring;
  `HealthBar({score})` 6px progress; helpers `toneFor/toneColor/toneLabel`.
- `ThemeToggle.tsx` — `{ compact }`, Sun/Moon swap, full a11y label.
- `ActivityItem.tsx` — `{ icon,title,meta?,time?,tone? }` single feed row.
- `Modal.tsx` — `{ open,onClose,title,children }`, overlay click + Escape to close,
  `.noor-overlay` / `.noor-modal` entrances, `role=dialog aria-modal`.

## Domain components

- `components/plants/PlantCard.tsx` — `{ plant, health, onWater, onEdit?, onDelete? }`.
  Reads live `readings[plant.id]` from the store itself for moisture/temp summaries.
  `PlantAvatar({plant,size?})` flat deterministic color tile with initials; `avatarColorFor(id)`.
- `components/sensors/SensorCards.tsx` — `SENSOR_META` (labels/icons/units, legacy `inRange`
  kept), `sensorOk(key, reading, settings?)` threshold-aware check, `SensorCard({reading,settings?})`
  4-up grid, `SensorTile({sensorKey,reading,prev?,updatedAt?,settings?})` with delta,
  `SimulationControls({running,refreshRate,onStart,onStop,onRateChange,onReset?})`.
- `components/analytics/SensorChart.tsx` — `{ data,dataKey,unit,height? }`, custom SVG line +
  area wash, axis min/max labels, time endpoints, nearest-point hover tooltip, `CHART_COLORS`.
- `components/alerts/AlertItem.tsx` — `{ alert,onResolve,onDismiss }`, severity tile + label,
  plant deep-link, relative time, Resolve/Dismiss (hidden when resolved).
- `pages/PlantsPage.tsx` — exports `PlantFormModal({open,onClose,editing?})` (add/edit with
  empty-name guard) and `PlantsPage` (search + 5-way filter + delete-confirm modal).

## What was NOT added

No toast system, no chart library (Recharts intentionally not installed — custom SVG chart
was kept and upgraded), no animation library (CSS keyframes only), no backend/auth/hardware.
