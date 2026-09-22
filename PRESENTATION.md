# PlantIQ - PRESENTATION.md

## Project Introduction
PlantIQ is an IoT-based Smart Plant Monitoring System. It is a college project that helps plant owners monitor their plants' conditions through a web interface. The system simulates IoT sensor data and provides insights into plant health without requiring physical hardware.

## Problem Statement
Plant owners often neglect their plants because they lack easy ways to monitor environmental conditions. There is no simple tool to track humidity, temperature, soil moisture, or light levels. Manual checking is time-consuming and inconsistent.

## Objectives
- Provide a centralized dashboard for monitoring plant conditions.
- Simulate IoT sensor readings for demonstration purposes.
- Calculate plant health scores based on sensor data.
- Allow virtual watering and condition simulation.
- Display historical sensor analytics and trends.
- Provide in-app plant-care alerts.
- Offer dark and light theme preferences.

## Technology Explanation
PlantIQ is built using modern frontend technologies:
- **React**: Component-based UI library that makes it easy to build interactive interfaces.
- **Vite**: Fast build tool that provides instant server start and hot module replacement.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development with consistent design tokens.
- **Lucide React**: Beautiful, consistent icon set that is tree-shaken for optimal bundle size.
- **Motion**: Animation library for smooth UI transitions and hover effects.
- **Recharts**: Simple charting library for displaying sensor history and health scores.
- **LocalStorage**: Client-side data persistence that eliminates the need for a backend server in Phase 1.

## IoT Simulation Explanation
PlantIQ simulates IoT sensor data using JavaScript. Sensor readings are randomly generated within realistic ranges:
- Temperature: 15-35°C (optimal 20-25°C)
- Humidity: 30-80% (optimal 40-60%)
- Soil Moisture: 20-70% (optimal 50-65%)
- Light Intensity: 100-1000 lux (optimal 500-1000 lux)

Readings update every 3 seconds in a simulation loop. A health score is calculated as a weighted average of all sensor metrics against their optimal ranges. The simulation demonstrates how IoT sensors would work without requiring physical hardware.

## System Architecture
PlantIQ uses a frontend-only architecture:
- **React Components**: Organized by feature (layout, dashboard, plants, sensors, analytics, alerts, UI).
- **React Context**: Manages global state (theme, current plant, settings).
- **Custom Hooks**: Encapsulate logic (useSensorSimulation, useLocalStorage, useHealthScore).
- **LocalStorage**: Persists data client-side under `plantiq_data` key.
- **Data Flow**: Sensor simulation generates readings -> Context stores state -> UI components re-render.

## Feature Overview
- **Dashboard**: Overview with stat cards showing plant count, average health, active sensors, today's waterings.
- **Plant List**: Browse all plants in the collection with current status.
- **Plant Detail**: View specific plant with sensor readings, health score, watering history.
- **Sensor Page**: Live sensor readings with simulation controls (start/stop).
- **Analytics**: Historical charts showing sensor trends over time.
- **Alerts**: List of active plant-care alerts with severity indicators.
- **Settings**: Theme toggle, sensor configuration, simulation preferences.

## Limitations
- All sensor data is simulated in JavaScript, not from real hardware.
- No backend server, API, or database.
- No user authentication or accounts.
- LocalStorage has size limitations (approx. 5MB).
- Data is local to each browser/device, not synced.
- Maximum of 50 plants supported.
- No real-time WebSocket updates.

## Frequently Asked Viva Questions and Answers

### Q: What is PlantIQ?
A: PlantIQ is a smart plant monitoring system that simulates IoT sensor readings. It allows users to monitor plant conditions, view health scores, and receive care alerts through a web interface.

### Q: Does it use real IoT hardware?
A: No, Phase 1 uses completely simulated sensor data generated in JavaScript. Future phases may integrate with real hardware (ESP8266, ESP32).

### Q: How does the health score calculation work?
A: The health score is a weighted average of four sensor metrics (temperature, humidity, soil moisture, light intensity) each scored 0-100 based on optimal ranges, then averaged with weights: 25% temperature, 25% humidity, 30% soil moisture, 20% light.

### Q: Where is the data stored?
A: Data is stored in the client's LocalStorage under the key `plantiq_data`. It is JSON-serialized and persists across page refreshes.

### Q: Can multiple users use the same app?
A: No, Phase 1 is single-user, local-browser only. Each user has their own plant data in their LocalStorage.

### Q: What happens if LocalStorage is cleared?
A: All plant data and settings will be lost. The app will start with default empty state.

### Q: What technologies are used?
A: React, Vite, Tailwind CSS, Lucide React, Motion, Recharts, and LocalStorage. No backend or database is used in Phase 1.

### Q: Is the application responsive?
A: Yes, the design includes responsive breakpoints for mobile (max 640px), tablet (641-1024px), and desktop (min 1025px).

### Q: Can this be deployed online?
A: Yes, PlantIQ is a frontend-only application. It can be deployed to Vercel, Netlify, or GitHub Pages with no backend configuration.