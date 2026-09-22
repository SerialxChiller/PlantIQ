export interface Plant {
  id: string;
  name: string;
  type: string;
  image?: string;
  status: 'healthy' | 'moderate' | 'needs-attention';
  lastWatered: string;
  createdAt: string;
  position: number;
}

export interface SensorReading {
  plantId: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  lightIntensity: number;
  timestamp: string;
}

export interface Alert {
  id: string;
  plantId: string;
  plantName: string;
  type: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  createdAt: string;
  resolved: boolean;
}

export interface WateringEvent {
  id: string;
  plantId: string;
  plantName: string;
  timestamp: string;
  note: string;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  sensorRefreshRate: number;
  temperatureMin: number;
  temperatureMax: number;
  humidityMin: number;
  humidityMax: number;
  moistureMin: number;
  moistureMax: number;
  lightMin: number;
  lightMax: number;
  schemaVersion: number;
}

export type Theme = 'dark' | 'light';
