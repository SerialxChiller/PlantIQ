import type { SensorReading } from './types';

export interface HealthBreakdown {
  tempScore: number;
  humidityScore: number;
  moistureScore: number;
  lightScore: number;
  total: number;
}

function scoreInRange(value: number, min: number, max: number, tolerance: number): number {
  if (value >= min && value <= max) return 100;
  const distance = value < min ? min - value : value - max;
  // Linear falloff: lose ~8 points per tolerance unit, floor at 0
  const score = 100 - (distance / tolerance) * 40;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function calculateHealthScore(
  reading: Pick<SensorReading, 'temperature' | 'humidity' | 'soilMoisture' | 'lightIntensity'>,
  thresholds?: { tempMin: number; tempMax: number; humMin: number; humMax: number; moistMin: number; moistMax: number; lightMin: number; lightMax: number },
): HealthBreakdown {
  const t = thresholds ?? {
    tempMin: 20, tempMax: 25,
    humMin: 40, humMax: 60,
    moistMin: 50, moistMax: 65,
    lightMin: 500, lightMax: 1000,
  };
  const tempScore = scoreInRange(reading.temperature, t.tempMin, t.tempMax, 2);
  const humidityScore = scoreInRange(reading.humidity, t.humMin, t.humMax, 5);
  const moistureScore = scoreInRange(reading.soilMoisture, t.moistMin, t.moistMax, 5);
  const lightScore = scoreInRange(reading.lightIntensity, t.lightMin, t.lightMax, 100);
  const total = Math.round(tempScore * 0.25 + humidityScore * 0.25 + moistureScore * 0.3 + lightScore * 0.2);
  return { tempScore, humidityScore, moistureScore, lightScore, total };
}

export function healthStatus(score: number): 'healthy' | 'moderate' | 'needs-attention' {
  if (score >= 80) return 'healthy';
  if (score >= 60) return 'moderate';
  return 'needs-attention';
}

export function healthColor(score: number): string {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  return 'text-red-500';
}

export function healthBg(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
}
