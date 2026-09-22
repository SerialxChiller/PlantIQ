# PlantIQ - Routes Document

## Planned Routes

### /dashboard
- **Page Purpose**: Main overview dashboard. Shows summary stat cards, current plant health scores, quick actions.
- **Navigation**: Default landing route after authentication (none in Phase 1). Accessible from sidebar.
- **Route Parameters**: None.
- **Empty States**: No plants added yet - display welcome message and CTA to add first plant.

### /plants
- **Page Purpose**: Plant management listing. Shows all plants in the collection with their current status.
- **Navigation**: Accessible from sidebar. Can navigate to /plants/:id for plant detail.
- **Route Parameters**: None.
- **Empty States**: No plants in collection - display empty state with add plant CTA.

### /plants/:id
- **Page Purpose**: Plant detail view. Shows detailed information for a specific plant including sensor readings, health score, care history.
- **Navigation**: Accessible from /plants list by clicking on a plant card. Back button returns to plants list.
- **Route Parameters**: `id` (string, plant identifier).
- **Empty States**: Plant ID not found - show 404 or redirect to /plants.

### /analytics
- **Page Purpose**: Historical sensor analytics. Shows charts and trends over time.
- **Navigation**: Accessible from sidebar. May require a plant to be selected first.
- **Route Parameters**: None (displays analytics for current/selected plant).
- **Empty States**: No sensor data available - display message stating simulation has not been started.

### /sensors
- **Page Purpose**: Sensor simulation controls and live readings. Shows real-time sensor data stream.
- **Navigation**: Accessible from sidebar. Contains simulation start/stop controls.
- **Route Parameters**: None.
- **Empty States**: Simulation not running - display controls to start simulation.

### /alerts
- **Page Purpose**: Alert management. Shows all active plant-care alerts.
- **Navigation**: Accessible from sidebar. Lists alerts with severity indicators.
- **Route Parameters**: None.
- **Empty States**: No active alerts - display "All clear!" message.

### /settings
- **Page Purpose**: Application settings. Theme toggle, sensor configuration, simulation preferences.
- **Navigation**: Accessible from sidebar.
- **Route Parameters**: None.
- **Empty States**: N/A (always has content).