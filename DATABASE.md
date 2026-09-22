# PlantIQ - Database Document

## Overview
This project does not use a database server. All data is stored in the client's LocalStorage. This is a frontend-only application with no backend, API, or database infrastructure.

## LocalStorage Data Model

### Plants
Collection of plant objects, each representing a household plant.

```json
{
  "id": "plant-1",
  "name": "Snake Plant",
  "type": "Sansevieria",
  "image": "snake-plant.svg",
  "status": "healthy",
  "lastWatered": "2024-01-15T10:30:00Z",
  "position": 0
}
```

### Sensor Readings
Current sensor values for each plant.

```json
{
  "plantId": "plant-1",
  "temperature": 22.5,
  "humidity": 55.3,
  "soilMoisture": 52.1,
  "lightIntensity": 850.0,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Alerts
Generated alerts based on threshold violations.

```json
{
  "id": "alert-1",
  "plantId": "plant-1",
  "type": "low_water",
  "message": "Soil moisture is low. Consider watering.",
  "severity": "warning",
  "createdAt": "2024-01-15T10:30:00Z",
  "resolved": false
}
```

### Watering History
Log of all watering actions performed.

```json
{
  "plantId": "plant-1",
  "action": "watered",
  "timestamp": "2024-01-15T10:30:00Z",
  "note": "Manual watering"
}
```

### Application Settings
User preferences and configuration.

```json
{
  "theme": "dark",
  "sensorRefreshRate": 3000,
  "temperatureOptimalMin": 20,
  "temperatureOptimalMax": 25,
  "humidityOptimalMin": 40,
  "humidityOptimalMax": 60,
  "schemaVersion": 1
}
```

## LocalStorage Limitations
- **Storage Size**: Approx. 5MB per domain. Not suitable for large datasets.
- **No Query Capabilities**: Data must be read and filtered in JavaScript.
- **No Concurrency**: Only one tab can modify data at a time. Conflicts resolved by latest write.
- **User Clearance**: User can clear LocalStorage from browser settings, losing all data.
- **Cross-Device**: Data is local to each browser/device. Not synced across phones/web.
- **Browser Support**: Supported in all modern browsers, not available in some older environments.
- **Not a Real Database**: Does not offer ACID guarantees, indexing, or relational queries. Use only for Phase 1 prototyping.

## Data Migration Path
When a backend is added in future phases:
1. Export LocalStorage data to JSON.
2. Send to Node.js/Express API endpoint.
3. Store in MongoDB/PostgreSQL.
4. on successful migration, LocalStorage can be phased out or used as cache.