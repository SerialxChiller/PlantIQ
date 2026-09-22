# PlantIQ — Theme

## Modes

- **Dark (default):** `--bg #000000`, `--bg2 #0a0a0a`, `--panel #111111`, `--elev #151515`,
  `--border #222222`, `--border-strong #303030`, `--text #ffffff`, `--text2 #a1a1aa`, `--muted #71717a`.
- **Light:** `--bg #fafafa`, `--bg2 #ffffff`, `--panel #ffffff`, `--elev #f4f4f5`,
  `--border #e4e4e7`, `--border-strong #d4d4d8`, `--text #09090b`, `--text2 #52525b`, `--muted #71717a`.
- Accent `--accent #22c55e` is identical in both modes. Primary buttons render black text on
  accent for contrast (≈8:1); status text uses 500-scale hues on tinted 10% fills.

## How switching works

1. `AppContext` persists `settings.theme` inside `plantiq_data` (and mirrors to `plantiq_theme`).
2. An effect toggles the `dark` class on `document.documentElement` (`src/context/AppContext.tsx`).
3. Tailwind v4 picks it up via `@custom-variant dark (&:where(.dark, .dark *))` (`src/style.css`).
4. First paint defaults to dark: `<html class="dark">` in `index.html` avoids a light flash.
5. Controls: header `ThemeToggle` (compact icon) and Settings segmented Dark/Light group — both call `toggleTheme()`.

## Authoring themed UI

- Use CSS-var utilities, never hardcoded slate surfaces:
  `bg-[var(--panel)]`, `bg-[var(--bg2)]`, `bg-[var(--elev)]`,
  `border-[var(--border)]`, `text-[var(--text)]`, `text-[var(--text2)]`, `text-[var(--muted)]`.
- Focus ring is the accent: global `:focus-visible { outline: 2px solid var(--accent) }`.
- Selection wash: `rgba(34,197,94,.25)`.
- Scrollbar thumb: `var(--border-strong)` on transparent track.
- Contrast: body text pairs (text/text2 on panel) clear 4.5:1 in both modes; muted is reserved
  for ≥11px metadata only.
