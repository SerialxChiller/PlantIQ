# PlantIQ - Design Document

## UI/UX System

### Color Theme
- **Primary Accent**: Green (#22c55e, #10b981) - used for healthy states, accents.
- **Background**: Dark mode #0f0f23, Light mode #f8fafc.
- **Card Background**: Dark mode #1a1a2e, Light mode #ffffff.
- **Text Primary**: Dark mode #e8e8f0, Light mode #1e293b.
- **Text Secondary**: Dark mode #6b7280, Light mode #64748b.
- **Alert Colors**: Red #f87171 (critical), Orange #fbbf24 (warning), Green #34d399 (healthy).

### Typography
- **Font Family**: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto.
- **Heading Scale**: 
  - h1: 2xl (1.875rem, 30px)
  - h2: xl (1.5rem, 24px)
  - h3: lg (1.25rem, 20px)
  - h4: base (1rem, 16px)
- **Body**: 14px, 400 weight.
- **Monospace**: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono".

### Spacing System
- Base unit: 4px.
- Scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px.
- Used for: padding, margin, gap between elements.

### Border Radius
- Default: 6px (sm).
- Cards: 8px (md).
- Modals: 8px (md).
- Buttons: 6px (sm) - fully rounded for toggle buttons.

### Dark and Light Themes
- **Dark Theme** (default):
  - Background: #0f0f23
  - Surface: #1a1a2e
  - On Surface: #e8e8f0
  - Muted: #6b7280
- **Light Theme**:
  - Background: #f8fafc
  - Surface: #ffffff
  - On Surface: #1e293b
  - Muted: #64748b

### Responsive Strategy
- **Mobile** (max 640px): Single column layout, stacked sidebar, full-width cards.
- **Tablet** (641px - 1024px): Two-column layout, condensed sidebar.
- **Desktop** (min 1025px): Full dashboard layout, collapsible sidebar.

### Component Behavior
- **Sidebar**: Collapsible (NOOR-inspired). Collapsed width: 64px. Expanded width: 240px. State persisted in LocalStorage.
- **Header**: Fixed top, contains logo and theme toggle. Height: 56px.
- **StatCard**: Hover elevation, click interaction, animates on mount.
- **PlantCard**: Click navigates to plant detail. Hover lifts. Shows health status color.
- **ThemeToggle**: Persists theme in LocalStorage, remembers user preference.

### Accessibility Guidelines
- Color contrast: Minimum 4.5:1 for normal text, 3:1 for large text (WCAG AA).
- Focus visible: 2px outline on interactive elements.
- ARIA labels on interactive SVG icons.
- Keyboard navigation support (Tab order, Enter/Space activation).
- Reduced motion support: respect `prefers-reduced-motion` media query.
- Semantic HTML: header, nav, main, section, article, footer.

### Avoided Styles
- Excessive glassmorphism (only subtle backdrop-filter on active states).
- Neon glowing effects.
- Overly saturated gradients.
- Unnecessary animations that don't add value.