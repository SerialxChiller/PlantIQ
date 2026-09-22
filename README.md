# PlantIQ - README.md

## PlantIQ - IoT-based Smart Plant Monitoring System

### Project Overview
PlantIQ is a frontend-only smart plant monitoring system that simulates IoT sensor readings and helps users monitor plant conditions, calculate health scores, and manage household plants. This is a college project developed as part of an IoT and web development course.

### Features
- **Simulated IoT Sensors**: Temperature, humidity, soil moisture, and light intensity readings.
- **Plant Health Scores**: Automatic calculation based on sensor data.
- **Virtual Watering**: Simulate watering plants.
- **Historical Analytics**: View sensor trends and history.
- **In-App Alerts**: Receive plant-care alerts based on threshold violations.
- **Dark and Light Themes**: Toggle between themes with persistence.
- **Collapsible Sidebar**: NOOR-inspired navigation menu.
- **Plant Management**: Add, edit, and view sensor activity houseplants.

### Technology Stack
- **React + TypeScript**: UI library with strict type-checking (`tsc` runs on every build).
- **Vite**: Frontend build tool for fast development.
- **Tailwind CSS v4**: Utility-first styling with CSS-variable design tokens (CSS-first config in `src/style.css`).
- **Lexend + Josefin Sans**: Application UI font (Lexend) and brand wordmark font (Josefin Sans), loaded via Google Fonts.
- **Lucide React**: Icon set.
- **LocalStorage**: Client-side data persistence (key: `plantiq_data`).
- **Custom SVG charts**: Lightweight hover-tooltip sensor history charts (no charting dependency).

No backend, no database server, no authentication. No environment variables required.

### Folder Structure
```
plantiq/
├── src/
│   ├── components/
│   │   ├── layout/       # AppShell, Sidebar, Header
│   │   ├── dashboard/    # Dashboard overview
│   │   ├── plants/       # PlantCard, PlantAvatar
│   │   ├── sensors/      # SensorCard, SensorTile, SimulationControls
│   │   ├── analytics/    # SensorChart (custom SVG)
│   │   ├── alerts/       # AlertItem
│   │   └── ui/           # Button, Badge, Modal, StatCard, HealthRing, PageHeader, …
│   ├── pages/            # Plants, PlantDetail, Sensors, Analytics, Alerts, Settings
│   ├── data/             # Mock plants and defaults
│   ├── hooks/            # useLocalStorage, sensor simulation, hash routing
│   ├── context/          # AppContext (theme, plants, simulation, alerts, settings)
│   ├── lib/              # Types, health-score logic, formatting
│   ├── style.css         # NOOR design tokens, Lexend/Josefin fonts, type scale
│   ├── App.tsx
│   └── main.tsx
├── docs/                 # DESIGN, THEME, COMPONENTS, LAYOUT, TYPOGRAPHY
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── images/plants/    # Plant images
├── index.html            # Font loading (Lexend + Josefin Sans)
├── package.json
└── vite.config.ts
```

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open browser at `http://localhost:5173`

4. To build for production:
   ```bash
   npm run build
   ```

### Simulation Disclaimer
All sensor data displayed in PlantIQ is **simulated** in JavaScript for demonstration purposes. The application does not connect to real IoT hardware, physical sensors, or any backend server. Sensor readings are randomly generated within realistic ranges and should not be used for actual plant care decisions. Real-world plant monitoring requires physical sensors and proper IoT infrastructure.

### Future Hardware Integration
- This project is designed to integrate with real IoT devices (ESP8266, ESP32, Arduino) in future phases.
- When hardware is connected, sensor simulation will be replaced with WebSocket or MQTT readings.
- Backend API layer can be added for user accounts and data persistence.
- Multi-user support and cloud synchronization are planned for later versions.

### GitHub and Vercel Deployment
- Repository: GitHub can host the source code.
- Vercel: Frontend-only deployment is straightforward with Vite + React.
- Set build command: `npm run build`
- Set output directory: `dist`
- No environment variables required for Phase 1.
- Deploy via GitHub Integration or `vercel` CLI.