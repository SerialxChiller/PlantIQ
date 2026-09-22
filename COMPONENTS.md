# PlantIQ - Components Document

## Planned Reusable Components

### Sidebar
- **Responsibility**: Collapsible navigation menu (NOOR-inspired design).
- **Behavior**: Expands/collapses on click. State persisted in LocalStorage. Contains navigation links to all routes. Height: 100vh in expanded mode, 64px in collapsed mode.
- **Sub-items**: Logo at top, navigation links, theme toggle.

### Header
- **Responsibility**: Top app bar. Contains project logo, theme toggle, user menu (placeholder for future auth).
- **Behavior**: Fixed position, height 56px. Contains logo on left, theme toggle on right. Responsive: collapses to hamburger on mobile.

### StatCard
- **Responsibility**: Displays a statistic value with optional icon and trend indicator.
- **Props**: `value`, `label`, `icon`, `trend` (up/down), `trendColor`.
- **Behavior**: Hover lifts slightly, number animates on mount. Used for: plant count, avg health, active sensors, today's waterings.

### PlantCard
- **Responsibility**: Displays a single plant with its status and health score.
- **Props**: `plant` object, `onSelect` callback.
- **Behavior**: Click navigates to plant detail. Hover lifts and shows subtle shadow. Color-coded border based on health score. Shows plant name, type, current health %.

### PlantHealthCard
- **Responsibility**: Visual representation of plant health score.
- **Props**: `score` (number 0-100), `size` (small/large).
- **Behavior**: Circular or bar indicator. Color gradient from red (0) to green (100). Shows text percentage inside.

### SensorCard
- **Responsibility**: Displays a single sensor reading with label and value.
- **Props**: `reading` object (type, value, unit), `threshold` optional.
- **Behavior**: Value turns red if outside optimal range, green if within range. Small component, used in dashboard and sensor page.

### SensorChart
- **Responsibility**: Line chart showing historical sensor data.
- **Library**: Recharts.
- **Props**: `data` array of timestamp/value pairs, `sensorType` (temperature/humidity/moisture/light).
- **Behavior**: Auto-scales axes, shows tooltip on hover, responsive width.

### AlertItem
- **Responsibility**: Single alert display with dismiss action.
- **Props**: `alert` object, `onDismiss` callback.
- **Behavior**: Shows icon based on type, message, severity color badge. Dismiss removes from state and LocalStorage.

### Modal
- **Responsibility**: Generic modal dialog.
- **Props**: `isOpen`, `onClose`, `title`, `children`, `size` (sm/md/lg).
- **Behavior**: Centered overlay, focus trap, escape key to close, click-outside to close. Accessible ARIA roles.

### Toast
- **Responsibility**: Transient notification message.
- **Props**: `message`, `type` (success/error/warning), `duration` (optional).
- **Behavior**: Auto-dismiss after duration, bottom-right position, auto-hiding stack. Uses useToast custom hook.

### ThemeToggle
- **Responsibility**: Switch between dark and light themes.
- **Behavior**: Toggles ThemeContext. Persists preference in LocalStorage. Icon changes based on theme (Sun/Moon). Accessible button with aria-label.

### SimulationControls
- **Responsibility**: Start/stop sensor simulation controls.
- **Props**: `isRunning`, `onStart`, `onStop`.
- **Behavior**: Buttons to start/stop the sensor simulation interval. Shows refresh rate selector. Disables when simulation already running.