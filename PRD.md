# PlantIQ - Product Requirements Document

## Project Overview
PlantIQ is an IoT-based Smart Plant Monitoring System. It is a college project that allows users to monitor plant conditions, view simulated IoT sensor readings, manage household plants, calculate plant health scores, simulate environmental conditions, virtually water plants, view historical sensor analytics, and receive in-app plant-care alerts.

## Problem Statement
Plants often go unmonitored, leading to under-watering, over-watering, and poor growth conditions. There is no simple way for plant owners to track plant health, understand environmental factors, or receive timely care alerts without manual checking.

## Project Objectives
- Provide a centralized dashboard for monitoring multiple plants.
- Simulate IoT sensor data (temperature, humidity, soil moisture, light).
- Calculate and display plant health scores based on sensor inputs.
- Allow virtual watering and condition simulation.
- Provide historical analytics and trends.
- Display plant-care alerts based on threshold violations.

## Target Users
- College students and instructors.
- Home plant enthusiasts.
- IoT and embedded systems learners.
- Anyone interested in plant care monitoring.

## Functional Requirements
- FR-01: Display plant list with current status.
- FR-02: Show simulated sensor readings (temperature, humidity, soil moisture, light intensity).
- FR-03: Calculate and display plant health score.
- FR-04: Simulate watering action.
- FR-05: View historical sensor data trends.
- FR-06: Receive in-app plant-care alerts.
- FR-07: Manage plant profiles (name, type, care settings).
- FR-08: Toggle between dark and light themes.
- FR-09: Simulate environmental conditions.

## Non-Functional Requirements
- NF-01: Frontend-only application (no backend, no database server).
- NF-02: Data persistence via LocalStorage.
- NF-03: Responsive layout (mobile and desktop).
- NF-04: Dark and light theme support.
- NF-05: Accessible UI (WCAG 2.1 AA compliance).
- NF-06: Fast initial load (Vite optimization).

## Feature List
- Plant management (add, edit, view, delete).
- Simulated IoT sensor readings.
- Plant health score calculation.
- Virtual watering simulation.
- Historical analytics chart (Recharts).
- In-app alert system.
- Dark and light theme toggle.
- Collapsible sidebar (NOOR-inspired).
- Dashboard overview with stat cards.
- Sensor simulation controls.

## Project Limitations
- Sensor data is simulated in JavaScript, not from real hardware.
- No backend, API layer, or database server.
- No user authentication or authorization.
- LocalStorage has size limitations (approx. 5MB per domain).
- No real-time WebSocket updates.
- Limited to 50 plants maximum in local storage.

## Future Improvements
- Integrate with real IoT hardware via ESP8266/ESP32.
- Backend server with Node.js/Express and MongoDB.
- User authentication with Firebase or Supabase.
- Real-time sensor updates via WebSockets.
- Push notifications for plant care alerts.
- Plant database with species-specific care requirements.
- Multi-user support.

## Success Criteria
- Project compiles and runs without errors using `npm run dev`.
- Dashboard loads with simulated sensor data.
- Plant health score is calculated and displayed.
- LocalStorage persistence works across page refreshes.
- Dark and light theme toggle functions correctly.
- responsive layout works on mobile and desktop.
- All documentation files are created and consistent.