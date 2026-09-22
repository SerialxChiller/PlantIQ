# PlantIQ — Typography

> Implemented final polish: Lexend-first UI, Josefin Sans brand-only, one global scale.

## Font system

| Role | Font | Weights loaded | Source |
|---|---|---|---|
| UI — everything (nav, titles, cards, sensors, charts, forms, badges, tooltips) | **Lexend** | 400, 500, 600, 700 | Google Fonts, `display=swap` |
| Brand wordmark — "PlantIQ" only | **Josefin Sans** | 600, 700 | Google Fonts, `display=swap` |

Single request: `family=Lexend:wght@400;500;600;700&family=Josefin+Sans:wght@600;700&display=swap`
(preconnect to `fonts.googleapis.com` / `fonts.gstatic.com`).

Fallbacks (no layout breakage if webfonts fail):

```css
--font-ui: "Lexend", Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-brand: "Josefin Sans", "Lexend", Inter, system-ui, sans-serif;
```

Inter is fallback-only, never the primary face. Buttons/inputs/selects inherit via Tailwind
preflight; SVG chart `<text>` is bound explicitly (`svg text { font-family: var(--font-ui) }`).

## Scale (single source: `src/style.css`)

| Token | Desktop | ≈360px mobile | Weight / leading |
|---|---|---|---|
| `.type-page-title` | 30px | 22px | 600 / 1.2, tracking −0.015em |
| `.type-section-title` | 18px | 15px | 600 / 1.25, tracking −0.005em |
| `.type-card-title` | 15px | 14px | 600 / 1.3 |
| `.type-stat-value` | 26px | 22px | 600 / 1.15, tracking −0.01em, tabular |
| `.type-sensor-value` | 23px | 19px | 600 / 1.2, tracking −0.005em, tabular |
| `.brand-wordmark` | 19px | 19px | Josefin Sans 700 / 1.05, tracking +0.005em |

All fluid via `clamp()` — no breakpoint overrides, no per-page sizes. Supporting text:
body 13–14px/400, secondary 12–13px/400, nav 13px/500 (600 + brighter when active),
buttons 13px/500–600, badges 11–12px/500–600 with `tracking-wide`, timestamps 11–12px muted.

## Hierarchy rules

Highest: plant name, page title, stat, sensor value. Medium: section/card title, nav,
buttons. Low: sensor labels, descriptions, status text. Lowest: timestamps, metadata.
Status never rests on weight alone — color + label + icon travel together.

## Numbers

`.tnum` (`tabular-nums` + `"tnum"` feature) on all telemetry: sensor values, deltas,
health %, stats, chart tooltips/axes, min/max, badge counts. Values read like
`29.0°C · 52.5% · 392 lux` with stable alignment while streaming.
