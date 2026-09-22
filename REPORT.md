# PlantIQ - Report.md

## College Project Report Outline

### Abstract
PlantIQ is an IoT-based Smart Plant Monitoring System developed as a college project. The application provides a frontend interface for monitoring plant conditions through simulated IoT sensor readings. It allows users to track plant health, view sensor analytics, and receive care alerts without requiring backend infrastructure. The project demonstrates frontend technologies (React, Vite, Tailwind CSS) and client-side data persistence using LocalStorage.

### Introduction
Plant care often suffers from neglect due to lack of monitoring tools. PlantIQ addresses this by providing a digital dashboard where plant owners can monitor their plants' conditions in real-time (simulated). The project aims to combine IoT concepts with web development to create an accessible monitoring tool.

### Problem Statement
Plant owners often lack visibility into their plants' environmental conditions. Manual checking is time-consuming, and there is no simple way to track historical data or receive alerts when conditions degrade. Existing solutions may require expensive hardware or technical knowledge to set up.

### Objectives
- Create a responsive web application for plant monitoring.
- Simulate IoT sensor data (temperature, humidity, soil moisture, light).
- Calculate and display plant health scores based on sensor inputs.
- Provide virtual watering simulation and condition updates.
- Display historical sensor analytics and trends.
- Implement in-app plant-care alerts.
- Use only frontend technologies (no backend required).

### Existing System
No existing system is targeted for replacement. This is a new project from absolute zero. Conceptually, simple plant tracker apps exist, but they typically require account creation, backend servers, or physical hardware. PlantIQ differs by being completely frontend-only with simulated data.

### Proposed System
PlantIQ proposes a frontend-only smart plant monitoring system. Key components include:
- Simulated IoT sensor readings.
- Plant health score calculation algorithm.
- Virtual watering and condition simulation.
- Historical analytics charts.
- In-app alert system.
- Dark and light theme support.
- LocalStorage data persistence.

### Methodology
1. **Requirement Analysis**: Defined project scope and functional requirements.
2. **Design System**: Created color tokens, typography, spacing, and component hierarchy.
3. **Architecture Design**: Frontend-only architecture with React components, hooks, and context.
4. **Data Modeling**: Designed LocalStorage data model (plants, sensors, alerts, settings).
5. **Implementation**: Built React + Vite project with Tailwind CSS styling.
6. **Testing**: Verified functionality across browsers and responsive breakpoints.

### System Architecture
Frontend-only architecture with React components organized by feature area:
- Component hierarchy: Layout > Pages > Feature components.
- State management: React Context for global state, useState for local state.
- Data flow: Sensor simulation -> Context -> LocalStorage -> UI re-render.
- Persistence: JSON serialized in LocalStorage under `plantiq_data` key.

### Technologies Used
- React 18 + Vite 5
- Tailwind CSS 3
- Lucide React for icons
- Framer Motion (Motion) for animations
- Recharts for data visualization
- LocalStorage for persistence
- ES2024 JavaScript

### Functional Modules
- Plant Management (add, edit, view, delete).
- Sensor Simulation (random data generation, real-time updates).
- Health Score Calculation (weighted average of sensor metrics).
- Alert System (threshold violation detection).
- Historical Analytics (Recharts line charts).
- Theme Toggle (dark/light with LocalStorage persistence).
- Collapsible Sidebar (NOOR-inspired design).

### Limitations
- Sensor data is simulated, not from real hardware.
- No backend, API, or database server.
- No user authentication or accounts.
- LocalStorage size limitations (approx. 5MB).
- Data not synced across devices.
- Maximum 50 plants supported.
- No real-time WebSocket updates.

### Future Scope
- Integrate with real IoT hardware (ESP8266/ESP32).
- Add backend server with Node.js and database.
- Implement user authentication (Firebase, Supabase).
- Real-time sensor updates via WebSockets.
- Push notifications for care alerts.
- Plant species-specific care requirements.
- Multi-user support and cloud synchronization.

### Conclusion
PlantIQ demonstrates that a fully functional smart plant monitoring system can be built using frontend technologies alone. The project proves that simulated IoT data can provide a meaningful user experience for plant care monitoring. Future phases can extend the system with real hardware integration and backend infrastructure.