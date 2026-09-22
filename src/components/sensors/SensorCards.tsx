import type { LucideIcon } from 'lucide-react';
import { ThermometerSun, Droplets, CloudRainWind, Sun, Play, Pause, RotateCcw } from 'lucide-react';
import type { SensorReading } from '../../lib/types';
import { formatTime } from '../../lib/format';

export interface SensorMeta {
  key: 'temperature' | 'humidity' | 'soilMoisture' | 'lightIntensity';
  label: string;
  unit: string;
  icon: LucideIcon;
  inRange: (r: SensorReading) => boolean;
}

export const SENSOR_META: SensorMeta[] = [
  {
    key: 'temperature',
    label: 'Temperature',
    unit: '°C',
    icon: ThermometerSun,
    inRange: (r) => r.temperature >= 20 && r.temperature <= 25,
  },
  {
    key: 'humidity',
    label: 'Humidity',
    unit: '%',
    icon: CloudRainWind,
    inRange: (r) => r.humidity >= 40 && r.humidity <= 60,
  },
  {
    key: 'soilMoisture',
    label: 'Soil Moisture',
    unit: '%',
    icon: Droplets,
    inRange: (r) => r.soilMoisture >= 50 && r.soilMoisture <= 65,
  },
  {
    key: 'lightIntensity',
    label: 'Light',
    unit: ' lux',
    icon: Sun,
    inRange: (r) => r.lightIntensity >= 500 && r.lightIntensity <= 1000,
  },
];

export type SensorKey = SensorMeta['key'];

const FALLBACK_THRESHOLDS = {
  temperatureMin: 20,
  temperatureMax: 25,
  humidityMin: 40,
  humidityMax: 60,
  moistureMin: 50,
  moistureMax: 65,
  lightMin: 500,
  lightMax: 1000,
};

/** Threshold-aware status check (falls back to defaults when settings absent). */
export function sensorOk(
  key: SensorKey,
  reading: SensorReading,
  s?: {
    temperatureMin: number;
    temperatureMax: number;
    humidityMin: number;
    humidityMax: number;
    moistureMin: number;
    moistureMax: number;
    lightMin: number;
    lightMax: number;
  },
): boolean {
  const t = s ?? FALLBACK_THRESHOLDS;
  switch (key) {
    case 'temperature':
      return reading.temperature >= t.temperatureMin && reading.temperature <= t.temperatureMax;
    case 'humidity':
      return reading.humidity >= t.humidityMin && reading.humidity <= t.humidityMax;
    case 'soilMoisture':
      return reading.soilMoisture >= t.moistureMin && reading.soilMoisture <= t.moistureMax;
    case 'lightIntensity':
      return reading.lightIntensity >= t.lightMin && reading.lightIntensity <= t.lightMax;
  }
}

function fmtValue(key: SensorKey, r: SensorReading): string {
  if (key === 'lightIntensity') return String(Math.round(r[key]));
  return r[key].toFixed(1);
}

export function SensorCard({
  reading,
  settings,
}: {
  reading: SensorReading;
  settings?: {
    temperatureMin: number;
    temperatureMax: number;
    humidityMin: number;
    humidityMax: number;
    moistureMin: number;
    moistureMax: number;
    lightMin: number;
    lightMax: number;
  };
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
      {SENSOR_META.map((meta) => {
        const Icon = meta.icon;
        const ok = sensorOk(meta.key, reading, settings);
        return (
          <div
            key={meta.key}
            className="rounded-md border border-[var(--border)] bg-[var(--bg2)] p-3.5"
          >
            <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)]">
              <Icon className="h-3.5 w-3.5" />
              {meta.label}
            </div>
            <p className={`tnum type-sensor-value mt-1.5 ${ok ? 'text-[var(--text)]' : 'text-red-500'}`}>
              {fmtValue(meta.key, reading)}
              <span className="ml-1 text-xs font-normal text-[var(--muted)]">{meta.unit}</span>
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs">
              <span className={`h-1.5 w-1.5 rounded-full ${ok ? 'bg-[var(--accent)]' : 'bg-red-500'}`} aria-hidden="true" />
              <span className={ok ? 'text-[var(--muted)]' : 'text-red-500'}>
                {ok ? 'Optimal' : 'Check thresholds'}
              </span>
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function SensorTile({
  sensorKey,
  reading,
  prev,
  updatedAt,
  settings,
}: {
  sensorKey: SensorKey;
  reading: SensorReading;
  prev?: SensorReading;
  updatedAt?: string;
  settings?: {
    temperatureMin: number;
    temperatureMax: number;
    humidityMin: number;
    humidityMax: number;
    moistureMin: number;
    moistureMax: number;
    lightMin: number;
    lightMax: number;
  };
}) {
  const meta = SENSOR_META.find((m) => m.key === sensorKey) ?? SENSOR_META[0];
  const Icon = meta.icon;
  const ok = sensorOk(sensorKey, reading, settings);
  const delta = prev ? reading[sensorKey] - prev[sensorKey] : 0;
  const showDelta = prev != null && Math.abs(delta) >= (sensorKey === 'lightIntensity' ? 1 : 0.05);
  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--bg2)] p-3.5">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)]">
          <Icon className="h-3.5 w-3.5" />
          {meta.label}
        </span>
        <span className={`h-1.5 w-1.5 rounded-full ${ok ? 'bg-[var(--accent)]' : 'bg-red-500'}`} aria-hidden="true" />
      </div>
      <p className="tnum type-sensor-value mt-1.5 text-[var(--text)]">
        {fmtValue(sensorKey, reading)}
        <span className="ml-1 text-xs font-normal text-[var(--muted)]">{meta.unit}</span>
      </p>
      <div className="mt-1 flex items-center justify-between gap-2 text-xs text-[var(--muted)]">
        <span className={ok ? '' : 'text-red-500'}>{ok ? 'Optimal' : 'Out of range'}</span>
        <span className="tnum">
          {showDelta ? `${delta > 0 ? '+' : ''}${sensorKey === 'lightIntensity' ? Math.round(delta) : delta.toFixed(1)}` : '—'}
        </span>
      </div>
      {updatedAt ? (
        <p className="mt-1 text-[11px] text-[var(--muted)]">Updated {formatTime(updatedAt)}</p>
      ) : null}
    </div>
  );
}

export function SimulationControls({
  running,
  refreshRate,
  onStart,
  onStop,
  onRateChange,
  onReset,
}: {
  running: boolean;
  refreshRate: number;
  onStart: () => void;
  onStop: () => void;
  onRateChange: (ms: number) => void;
  onReset?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {running ? (
        <button
          onClick={onStop}
          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--border-strong)]"
        >
          <Pause className="h-4 w-4" /> Pause
        </button>
      ) : (
        <button
          onClick={onStart}
          className="inline-flex items-center gap-1.5 rounded-md bg-[var(--accent)] px-3 py-2 text-sm font-medium text-black transition-[filter] hover:brightness-110"
        >
          <Play className="h-4 w-4" /> Start simulation
        </button>
      )}
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-sm font-medium text-[var(--text2)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text)]"
          title="Clear readings and history"
          aria-label="Reset simulation data"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      )}
      <label className="ml-auto flex items-center gap-2 text-[13px] text-[var(--muted)]">
        Interval
        <select
          value={refreshRate}
          onChange={(e) => onRateChange(Number(e.target.value))}
          className="rounded-md border border-[var(--border)] bg-[var(--bg2)] px-2 py-1.5 text-[13px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
          aria-label="Simulation refresh interval"
        >
          <option value={1000}>1s</option>
          <option value={3000}>3s</option>
          <option value={5000}>5s</option>
          <option value={10000}>10s</option>
        </select>
      </label>
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted)]">
        <span className={`h-2 w-2 rounded-full ${running ? 'bg-[var(--accent)] noor-live-dot' : 'bg-[var(--muted)]'}`} />
        {running ? 'Live' : 'Paused'}
      </span>
    </div>
  );
}
