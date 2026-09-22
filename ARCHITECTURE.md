# PlantIQ - Architecture Document

## Frontend-Only Architecture
PlantIQ is a frontend-only application. No backend server, no API layer, no database server. All data is simulated and persisted in the client's LocalStorage.

## Component Organization
```
src/
├── components/
│   ├── layout/       # Sidebar, Header
│   ├── dashboard/    # Dashboard overview
│   ├── plants/       # Plant management components
│   ├── sensors/      # Sensor display and simulation
│   ├── analytics/    # Charts and historical data
│   ├── alerts/       # Alert items and notifications
│   └── ui/           # Reusable UI components (StatCard, Button, etc.)
├── pages/            # Page components routed via file-based routing
├── data/             # Mock data and simulation utilities
├── hooks/            # Custom React hooks (useLocalStorage, useSensorSimulation, etc.)
├── context/          # React Context (ThemeContext, PlantContext)
├── lib/              # Utility functions (health score calculation, formatting)
└── assets/           # Static images, SVGs
```

## Data Flow
1. Sensor simulation generates random readings every 3 seconds.
2. Readings are stored in React state.
3. State is persisted to LocalStorage via custom hook.
4. Health score calculated from sensor readings.
5. Alerts generated when thresholds are violated.
6. UI re-renders with updated data.

## State Management Approach
- **React Context** for global state: Theme, current plant, application settings.
- **React State** (`useState`) for component-local state: sensor readings, input values, modal open/close.
- **Custom Hooks** for encapsulated logic: useLocalStorage (persistence), useSensorSimulation (simulation loop).
- No Redux or Zustand needed for Phase 1 due to limited global state.

## Sensor Simulation Flow
1. `useSensorSimulation` hook starts a `setInterval` on mount.
2. Interval generates random sensor data:
   - Temperature: 15-35°C
   - Humidity: 30-80%
   - Soil moisture: 20-70%
   - Light intensity: 100-1000 lux
3. Data dispatched to PlantContext.
4. LocalStorage updated.
5. UI components re-render with new values.
6. Alerts checked against thresholds.

## Health Score Calculation Flow
1. Sensor readings collected (temperature, humidity, soil moisture, light).
2. Each metric scored on 0-100 scale based on optimal ranges:
   - Temperature: 20-25°C optimal.
   - Humidity: 40-60% optimal.
   - Soil moisture: 50-65% optimal.
   - Light: 500-1000 lux optimal.
3. Weighted average: (tempScore * 0.25 + humidityScore * 0.25 + moistureScore * 0.30 + lightScore * 0.20).
4. Final score rounded to nearest integer.
5. Displayed as percentage with visual indicator:
   - 80-100%: Healthy (green).
   - 60-79%: Moderate (yellow).
   - 0-59%: Needs attention (red).

## LocalStorage Persistence
- Data stored under key `plantiq_data`.
- JSON structure includes: plants array, settings, watering history.
- onbeforeunload handler ensures data is saved.
- LocalStorage JSON.parse on mount, JSON.stringify on update.
- Versioning: `schemaVersion: 1` for future compatibility.

## Future Hardware Integration
- When real IoT hardware is connected, sensor simulation hook will:
  - Replace random data with WebSocket readings.
  - Add connection status indicator.
  - Fall back to simulation if connection lost.
  - Store hardware metadata (device ID, firmware version).
- API layer can be added later without refactoring components.
- Database migration from LocalStorage to backend is a future task.