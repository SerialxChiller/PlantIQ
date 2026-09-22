import { useState, useEffect, useCallback } from 'react';
import type { SensorReading } from '../lib/types';

function randomIn(min: number, max: number, decimals = 1): number {
  const v = Math.random() * (max - min) + min;
  return Number(v.toFixed(decimals));
}

function drift(prev: number, min: number, max: number, step: number, decimals = 1): number {
  const next = prev + (Math.random() - 0.5) * 2 * step;
  const clamped = Math.max(min, Math.min(max, next));
  return Number(clamped.toFixed(decimals));
}

export function generateReading(plantId: string, prev?: SensorReading): SensorReading {
  if (!prev) {
    return {
      plantId,
      temperature: randomIn(15, 35),
      humidity: randomIn(30, 80),
      soilMoisture: randomIn(20, 70),
      lightIntensity: randomIn(100, 1000, 0),
      timestamp: new Date().toISOString(),
    };
  }
  return {
    plantId,
    temperature: drift(prev.temperature, 15, 35, 1.2),
    humidity: drift(prev.humidity, 30, 80, 3),
    soilMoisture: Math.max(5, drift(prev.soilMoisture, 5, 85, 1.5)),
    lightIntensity: drift(prev.lightIntensity, 100, 1200, 60, 0),
    timestamp: new Date().toISOString(),
  };
}

export function useSensorTick(
  active: boolean,
  intervalMs: number,
  onTick: () => void,
): void {
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(onTick, intervalMs);
    return () => window.clearInterval(id);
  }, [active, intervalMs, onTick]);
}

export function useHashRoute(): string {
  const getPath = useCallback(() => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash === '' ? '/' : hash;
  }, []);
  const [path, setPath] = useState<string>(getPath);

  useEffect(() => {
    const onChange = () => setPath(getPath());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, [getPath]);

  return path;
}

export function navigate(to: string): void {
  window.location.hash = to;
}
