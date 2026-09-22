# PlantIQ - TODO.md

## Phased Development Roadmap

### Phase 1: Project Setup
- [x] Initialize Vite + React project.
- [x] Configure Tailwind CSS.
- [x] Create directory structure.
- [x] Create documentation files (PRD, DESIGN, TECH_STACK, ARCHITECTURE, DATABASE, ROUTES, COMPONENTS, TODO, TESTING, README, REPORT, PRESENTATION).
- [x] Install dependencies (Tailwind, Lucide React, Motion, Recharts).
- [x] Verify project runs locally.

### Phase 2: Design System
- [x] Implement color tokens in Tailwind config.
- [x] Create theme context (dark/light).
- [x] Build reusable UI components (Button, Input, StatCard).
- [x] Implement responsive design breakpoints.
- [x] Add accessibility features (focus visible, color contrast).

### Phase 3: Application Layout
- [x] Build Sidebar component (collapsible, NOOR-inspired).
- [x] Build Header component (fixed top, logo, theme toggle).
- [x] Set up main layout structure.
- [x] Implement route nesting.
- [x] Add breadcrumb navigation.

### Phase 4: Dashboard
- [x] Build dashboard page overview.
- [x] Implement StatCard components.
- [x] Create plant health score visualization.
- [x] Add sensor summary cards.
- [x] Implement quick actions panel.

### Phase 5: Plant Management
- [x] Build plant list page.
- [x] Create PlantCard component.
- [x] Implement add/edit plant form.
- [x] Navigate to plant detail route (/plants/:id).
- [x] LocalStorage plant persistence.

### Phase 6: Sensor Simulation
- [x] Implement useSensorSimulation hook.
- [x] Generate random sensor readings (temp, humidity, moisture, light).
- [x] Display SensorCard components.
- [x] Build SimulationControls component.
- [x] Add real-time value updates.

### Phase 7: Analytics
- [x] Build analytics page.
- [x] Implement SensorChart (Recharts) for historical data.
- [x] Add date range selector.
- [x] Display trend insights.
- [x] Export data as CSV (future).

### Phase 8: Alerts
- [x] Implement alert generation logic.
- [x] Build AlertItem component.
- [x] Display active alerts in sidebar badge and /alerts page.
- [x] Add dismiss/resolve functionality.
- [x] Threshold configuration in settings.

### Phase 9: Settings
- [x] Build settings page.
- [x] Theme toggle (dark/light).
- [x] Sensor configuration (refresh rate, thresholds).
- [x] Watering history display.
- [x] About section with project info.

### Phase 10: Testing
- [x] Test navigation routing.
- [x] Test sensor simulation logic.
- [x] Test health score calculation.
- [x] Test LocalStorage persistence.
- [x] Test theme toggling.
- [x] Test responsive layouts.
- [x] Test production build.

### Phase 11: Deployment
- [ ] Configure GitHub repository.
- [ ] Deploy to Vercel.
- [ ] Set up custom domain (optional).
- [ ] Final documentation review.
- [ ] Project handover/presentation prep.