# PlantIQ — Layout

## Shell

```
┌────────┬───────────────────────────────────┐
│Sidebar │ Header (title, status, actions)   │
│ 232/68 │───────────────────────────────────│
│        │ Main · max-w-[1200px] · px-4/6    │
│        │  Welcome / stats / grids          │
└────────┴───────────────────────────────────┘
```

- Sidebar: `fixed top-0 bottom-0 left-0`, `w-[232px]` expanded, `lg:w-[68px]` collapsed,
  `translate-x` drawer below `lg` with `bg-black/60` scrim. Sections: brand (`h-14`),
  scrollable nav, Settings group under a divider, status + collapse footer.
- Header: `fixed h-14`, `left-0 lg:left-[232px|68px]` synced to sidebar, `bg2` + bottom border.
  Left: hamburger (mobile) + breadcrumb + 15px title. Right: simulated badge (≥md),
  alerts bell, theme toggle, settings shortcut (≥sm).
- Content: `pt-14` below header, `lg:ml-[68|232px]` beside sidebar, inner
  `max-w-[1200px] px-4 sm:px-6 py-5`, `space-y-4` between sections.

## Page grids

- Dashboard: 4 stats (`grid-cols-2 xl:grid-cols-4`); health (2col) + live sensors (3col)
  in `xl:grid-cols-5`; trends (3col) + alerts (2col); activity (3col) + actions (2col).
- Plants: toolbar stacks on mobile (`flex-col sm:flex-row`); cards `1 / sm:2 / xl:3`.
- Detail: identity + readings `xl:grid-cols-5` (2/3 split); care + watering `lg:2-col`.
- Sensors: controls panel + stacked per-plant panels (each: header row + 4-up sensor grid
  collapsing to 2-up on mobile).
- Analytics: summary `2 / xl:4`; charts `lg:2-col`.
- Alerts/Settings: single column flows (`max-w-3xl` for settings).

## Spacing rhythm

Base 4px scale; panels `p-4` (cards `p-3.5` for tiles); section gaps `space-y-4`;
inner grid gaps `2.5–4`. Page titles have 4px description offset and 8px meta offset.

## Responsive / a11y

- No horizontal overflow: grids collapse to 1–2 cols, toolbars wrap, tables avoided
  (definition rows use `flex justify-between`).
- Mobile sidebar is a proper drawer (open via header, close via scrim/X/nav click).
- Keyboard: links/buttons throughout, `aria-current` on nav, `aria-pressed` on filter
  segments, labelled icon-only buttons, visible accent focus ring, `prefers-reduced-motion`
  disables all keyframe motion.
