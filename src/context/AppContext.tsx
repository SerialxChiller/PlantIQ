import { createContext, useContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Alert, AppSettings, Plant, SensorReading, WateringEvent } from '../lib/types';
import { calculateHealthScore, healthStatus } from '../lib/healthScore';
import { uid } from '../lib/format';
import { generateReading } from '../hooks/useSensors';
import { DEFAULT_PLANTS } from '../data/mockPlants';

const STORAGE_KEY = 'plantiq_data';
const THEME_KEY = 'plantiq_theme';
const SIDEBAR_KEY = 'plantiq_sidebar';

interface PersistedState {
  plants: Plant[];
  alerts: Alert[];
  wateringHistory: WateringEvent[];
  settings: AppSettings;
  schemaVersion: number;
}

export const defaultSettings: AppSettings = {
  theme: 'dark',
  sensorRefreshRate: 3000,
  temperatureMin: 20,
  temperatureMax: 25,
  humidityMin: 40,
  humidityMax: 60,
  moistureMin: 50,
  moistureMax: 65,
  lightMin: 500,
  lightMax: 1000,
  schemaVersion: 1,
};

function loadPersisted(): PersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      return {
        plants: Array.isArray(parsed.plants) ? parsed.plants.slice(0, 50) : DEFAULT_PLANTS,
        alerts: Array.isArray(parsed.alerts) ? parsed.alerts : [],
        wateringHistory: Array.isArray(parsed.wateringHistory) ? parsed.wateringHistory : [],
        settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
        schemaVersion: 1,
      };
    }
  } catch {
    // fall through
  }
  return { plants: DEFAULT_PLANTS, alerts: [], wateringHistory: [], settings: defaultSettings, schemaVersion: 1 };
}

// --- Theme context ---
interface ThemeCtx {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeCtx>({ theme: 'dark', toggleTheme: () => {} });
export function useTheme(): ThemeCtx {
  return useContext(ThemeContext);
}

// --- App store context ---
interface PlantStore {
  plants: Plant[];
  readings: Record<string, SensorReading>;
  history: Record<string, SensorReading[]>;
  alerts: Alert[];
  activeAlerts: Alert[];
  wateringHistory: WateringEvent[];
  settings: AppSettings;
  simulationRunning: boolean;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  addPlant: (name: string, type: string) => void;
  updatePlant: (id: string, patch: Partial<Plant>) => void;
  deletePlant: (id: string) => void;
  waterPlant: (id: string) => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  tickSimulation: () => void;
  resetSimulation: () => void;
  clearAllData: () => void;
  resetDemoData: () => void;
  dismissAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  clearResolvedAlerts: () => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  healthFor: (plantId: string) => number | null;
}

const StoreContext = createContext<PlantStore | null>(null);
export function useStore(): PlantStore {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside AppProviders');
  return ctx;
}

function thresholdsFrom(s: AppSettings) {
  return {
    tempMin: s.temperatureMin, tempMax: s.temperatureMax,
    humMin: s.humidityMin, humMax: s.humidityMax,
    moistMin: s.moistureMin, moistMax: s.moistureMax,
    lightMin: s.lightMin, lightMax: s.lightMax,
  };
}

function buildAlertsForReading(
  plant: Plant,
  reading: SensorReading,
  settings: AppSettings,
  existing: Alert[],
): Alert[] {
  const out: Alert[] = [];
  const has = (type: string) =>
    existing.some((a) => a.plantId === plant.id && a.type === type && !a.resolved);
  const mk = (type: string, message: string, severity: Alert['severity']): Alert => ({
    id: uid('alert'),
    plantId: plant.id,
    plantName: plant.name,
    type,
    message,
    severity,
    createdAt: new Date().toISOString(),
    resolved: false,
  });
  if (reading.soilMoisture < settings.moistureMin - 10 && !has('low_water')) {
    out.push(mk('low_water', `${plant.name}: soil moisture is low (${reading.soilMoisture.toFixed(0)}%). Consider watering.`, 'warning'));
  }
  if (reading.soilMoisture < 15 && !has('critical_water')) {
    out.push(mk('critical_water', `${plant.name}: soil critically dry! Water immediately.`, 'critical'));
  }
  if ((reading.temperature < settings.temperatureMin - 3 || reading.temperature > settings.temperatureMax + 5) && !has('temperature')) {
    out.push(mk('temperature', `${plant.name}: temperature ${reading.temperature.toFixed(1)}°C is outside optimal range.`, 'warning'));
  }
  if ((reading.humidity < settings.humidityMin - 10 || reading.humidity > settings.humidityMax + 15) && !has('humidity')) {
    out.push(mk('humidity', `${plant.name}: humidity ${reading.humidity.toFixed(0)}% is outside optimal range.`, 'info'));
  }
  if (reading.lightIntensity < settings.lightMin - 200 && !has('low_light')) {
    out.push(mk('low_light', `${plant.name}: light level low (${reading.lightIntensity.toFixed(0)} lux). Move closer to light.`, 'info'));
  }
  return out;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [persisted, setPersisted] = useState<PersistedState>(loadPersisted);
  const [readings, setReadings] = useState<Record<string, SensorReading>>({});
  const [history, setHistory] = useState<Record<string, SensorReading[]>>({});
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsedState] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(SIDEBAR_KEY) === '1';
    } catch {
      return false;
    }
  });
  const timerRef = useRef<number | null>(null);

  // Persist to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // ignore quota errors
    }
  }, [persisted]);

  // Theme: apply .dark class
  const theme = persisted.settings.theme;
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const setSidebarCollapsed = useCallback((v: boolean) => {
    setSidebarCollapsedState(v);
    try {
      window.localStorage.setItem(SIDEBAR_KEY, v ? '1' : '0');
    } catch {
      // ignore
    }
  }, []);

  const tickSimulation = useCallback(() => {
    setPersisted((prev) => {
      if (prev.plants.length === 0) return prev;
      let newAlerts = prev.alerts;
      const updatedPlants = prev.plants.map((p) => ({ ...p }));
      // readings/history updated via setState below using functional access to latest
      return { ...prev, plants: updatedPlants, alerts: newAlerts };
    });

    setReadings((prevReadings) => {
      const next: Record<string, SensorReading> = { ...prevReadings };
      setPersisted((prev) => {
        const freshAlerts: Alert[] = [];
        const updatedPlants = prev.plants.map((plant) => {
          const r = generateReading(plant.id, next[plant.id]);
          next[plant.id] = r;
          const score = calculateHealthScore(r, thresholdsFrom(prev.settings)).total;
          freshAlerts.push(...buildAlertsForReading(plant, r, prev.settings, [...prev.alerts, ...freshAlerts]));
          return { ...plant, status: healthStatus(score) };
        });
        // auto-resolve alerts that are back in range is skipped for simplicity;
        // cap alerts list
        const merged = [...freshAlerts, ...prev.alerts].slice(0, 100);
        // persist updated plants + alerts
        queueMicrotask(() => {
          setHistory((prevH) => {
            const h: Record<string, SensorReading[]> = { ...prevH };
            for (const plant of prev.plants) {
              const r = next[plant.id];
              if (r) h[plant.id] = [...(h[plant.id] ?? []), r].slice(-100);
            }
            return h;
          });
        });
        if (freshAlerts.length === 0 && merged.length === prev.alerts.length) {
          // still need plant status updates
          if (JSON.stringify(updatedPlants) === JSON.stringify(prev.plants)) return prev;
        }
        return { ...prev, plants: updatedPlants, alerts: merged };
      });
      return next;
    });
  }, []);

  // Simulation loop
  useEffect(() => {
    if (!simulationRunning) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    // immediate first tick so UI isn't empty
    tickSimulation();
    timerRef.current = window.setInterval(tickSimulation, persisted.settings.sensorRefreshRate);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [simulationRunning, persisted.settings.sensorRefreshRate, tickSimulation]);

  const addPlant = useCallback((name: string, type: string) => {
    setPersisted((prev) => {
      if (prev.plants.length >= 50) return prev;
      const plant: Plant = {
        id: uid('plant'),
        name: name.trim() || 'Unnamed plant',
        type: type.trim() || 'Other',
        status: 'moderate',
        lastWatered: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        position: prev.plants.length,
      };
      return { ...prev, plants: [...prev.plants, plant] };
    });
  }, []);

  const updatePlant = useCallback((id: string, patch: Partial<Plant>) => {
    setPersisted((prev) => ({
      ...prev,
      plants: prev.plants.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }, []);

  const deletePlant = useCallback((id: string) => {
    setPersisted((prev) => ({
      ...prev,
      plants: prev.plants.filter((p) => p.id !== id),
      alerts: prev.alerts.filter((a) => a.plantId !== id),
      wateringHistory: prev.wateringHistory.filter((w) => w.plantId !== id),
    }));
    setReadings((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setHistory((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const waterPlant = useCallback((id: string) => {
    const now = new Date().toISOString();
    setPersisted((prev) => {
      const plant = prev.plants.find((p) => p.id === id);
      if (!plant) return prev;
      const event: WateringEvent = {
        id: uid('water'),
        plantId: id,
        plantName: plant.name,
        timestamp: now,
        note: 'Manual watering',
      };
      return {
        ...prev,
        plants: prev.plants.map((p) => (p.id === id ? { ...p, lastWatered: now } : p)),
        wateringHistory: [event, ...prev.wateringHistory].slice(0, 200),
      };
    });
    // watering boosts soil moisture in the live reading
    setReadings((prev) => {
      const r = prev[id];
      if (!r) return prev;
      return {
        ...prev,
        [id]: { ...r, soilMoisture: Math.min(85, r.soilMoisture + 25), timestamp: now },
      };
    });
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setPersisted((prev) => ({
      ...prev,
      alerts: prev.alerts.filter((a) => a.id !== id),
    }));
  }, []);

  const resolveAlert = useCallback((id: string) => {
    setPersisted((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a) => (a.id === id ? { ...a, resolved: true } : a)),
    }));
  }, []);

  const clearResolvedAlerts = useCallback(() => {
    setPersisted((prev) => ({
      ...prev,
      alerts: prev.alerts.filter((a) => !a.resolved),
    }));
  }, []);

  const resetSimulation = useCallback(() => {
    setSimulationRunning(false);
    setReadings({});
    setHistory({});
  }, []);

  const clearAllData = useCallback(() => {
    setSimulationRunning(false);
    setReadings({});
    setHistory({});
    setPersisted((prev) => ({
      ...prev,
      plants: [],
      alerts: [],
      wateringHistory: [],
    }));
  }, []);

  const resetDemoData = useCallback(() => {
    setSimulationRunning(false);
    setReadings({});
    setHistory({});
    const now = Date.now();
    const fresh = DEFAULT_PLANTS.map((p, i) => ({
      ...p,
      lastWatered: new Date(now - (i + 2) * 86400000).toISOString(),
      createdAt: new Date(now - (i + 1) * 30 * 86400000).toISOString(),
    }));
    setPersisted((prev) => ({
      ...prev,
      plants: fresh,
      alerts: [],
      wateringHistory: [],
    }));
  }, []);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setPersisted((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  }, []);

  const toggleTheme = useCallback(() => {
    setPersisted((prev) => ({
      ...prev,
      settings: { ...prev.settings, theme: prev.settings.theme === 'dark' ? 'light' : 'dark' },
    }));
  }, []);

  const healthFor = useCallback(
    (plantId: string): number | null => {
      const r = readings[plantId];
      if (!r) return null;
      return calculateHealthScore(r, thresholdsFrom(persisted.settings)).total;
    },
    [readings, persisted.settings],
  );

  const activeAlerts = useMemo(
    () => persisted.alerts.filter((a) => !a.resolved),
    [persisted.alerts],
  );

  const themeCtx = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  const store: PlantStore = useMemo(
    () => ({
      plants: persisted.plants,
      readings,
      history,
      alerts: persisted.alerts,
      activeAlerts,
      wateringHistory: persisted.wateringHistory,
      settings: persisted.settings,
      simulationRunning,
      sidebarCollapsed,
      setSidebarCollapsed,
      addPlant,
      updatePlant,
      deletePlant,
      waterPlant,
      startSimulation: () => setSimulationRunning(true),
      stopSimulation: () => setSimulationRunning(false),
      tickSimulation,
      resetSimulation,
      clearAllData,
      resetDemoData,
      dismissAlert,
      resolveAlert,
      clearResolvedAlerts,
      updateSettings,
      healthFor,
    }),
    [
      persisted, readings, history, activeAlerts, simulationRunning, sidebarCollapsed,
      setSidebarCollapsed, addPlant, updatePlant, deletePlant, waterPlant,
      tickSimulation, resetSimulation, clearAllData, resetDemoData,
      dismissAlert, resolveAlert, clearResolvedAlerts, updateSettings, healthFor,
    ],
  );

  return (
    <ThemeContext.Provider value={themeCtx}>
      <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    </ThemeContext.Provider>
  );
}

export { THEME_KEY, STORAGE_KEY };
