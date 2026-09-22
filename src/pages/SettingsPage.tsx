import { useState } from 'react';
import { Sun, Moon, Download, Trash2, RotateCcw, Droplets } from 'lucide-react';
import { useStore, useTheme, defaultSettings } from '../context/AppContext';
import { Panel, SectionHeader, Button, Input, PageHeader, Badge } from '../components/ui/primitives';
import { Modal } from '../components/ui/Modal';
import { timeAgo, formatDateTime } from '../lib/format';
import { ActivityItem } from '../components/ui/ActivityItem';

function NumberField({
  label, value, min, max, step, onChange, suffix,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; suffix: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-medium text-[var(--text2)]">
        {label} <span className="text-[var(--muted)]">({suffix})</span>
      </span>
      <Input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (!Number.isNaN(v)) onChange(v);
        }}
      />
    </label>
  );
}

export function SettingsPage() {
  const store = useStore();
  const { theme, toggleTheme } = useTheme();
  const s = store.settings;
  const [pending, setPending] = useState<'clear' | 'reset' | null>(null);

  let storedBytes = 0;
  try {
    storedBytes = (window.localStorage.getItem('plantiq_data') ?? '').length;
  } catch {
    storedBytes = 0;
  }

  const exportAll = () => {
    try {
      const raw = window.localStorage.getItem('plantiq_data') ?? '{}';
      const blob = new Blob([raw], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'plantiq-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-3xl space-y-4">
      <PageHeader
        title="Settings"
        description="Appearance, simulation thresholds and local data management."
        meta={<Badge tone="neutral">v1.0.0 · frontend-only</Badge>}
      />

      <Panel className="p-4">
        <SectionHeader title="Appearance" hint="Dark is the default NOOR-inspired theme" />
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-md border border-[var(--border)] p-0.5" role="group" aria-label="Theme">
            {(['dark', 'light'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  if (theme !== t) toggleTheme();
                }}
                aria-pressed={theme === t}
                className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  theme === t
                    ? 'bg-[var(--elev)] text-[var(--text)]'
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                {t === 'dark' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                {t === 'dark' ? 'Dark' : 'Light'}
              </button>
            ))}
          </div>
          <span className="text-xs text-[var(--muted)]">Preference persists in LocalStorage and applies instantly.</span>
        </div>
      </Panel>

      <Panel className="p-4">
        <SectionHeader
          title="Simulation"
          hint="Refresh interval and optimal ranges — alerts trigger outside these bands"
          action={
            <Button
              variant="ghost"
              onClick={() =>
                store.updateSettings({
                  temperatureMin: defaultSettings.temperatureMin,
                  temperatureMax: defaultSettings.temperatureMax,
                  humidityMin: defaultSettings.humidityMin,
                  humidityMax: defaultSettings.humidityMax,
                  moistureMin: defaultSettings.moistureMin,
                  moistureMax: defaultSettings.moistureMax,
                  lightMin: defaultSettings.lightMin,
                  lightMax: defaultSettings.lightMax,
                })
              }
            >
              Reset thresholds
            </Button>
          }
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-[13px] font-medium text-[var(--text2)]">Refresh interval</span>
            <select
              value={s.sensorRefreshRate}
              onChange={(e) => store.updateSettings({ sensorRefreshRate: Number(e.target.value) })}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg2)] px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
            >
              <option value={1000}>Every 1 second</option>
              <option value={3000}>Every 3 seconds (default)</option>
              <option value={5000}>Every 5 seconds</option>
              <option value={10000}>Every 10 seconds</option>
            </select>
          </label>
          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={() => (store.simulationRunning ? store.stopSimulation() : store.startSimulation())}
            >
              {store.simulationRunning ? 'Pause simulation' : 'Start simulation'}
            </Button>
          </div>
          <NumberField label="Temperature min" value={s.temperatureMin} min={0} max={s.temperatureMax - 1} step={0.5} suffix="°C" onChange={(v) => store.updateSettings({ temperatureMin: v })} />
          <NumberField label="Temperature max" value={s.temperatureMax} min={s.temperatureMin + 1} max={50} step={0.5} suffix="°C" onChange={(v) => store.updateSettings({ temperatureMax: v })} />
          <NumberField label="Humidity min" value={s.humidityMin} min={0} max={s.humidityMax - 1} step={1} suffix="%" onChange={(v) => store.updateSettings({ humidityMin: v })} />
          <NumberField label="Humidity max" value={s.humidityMax} min={s.humidityMin + 1} max={100} step={1} suffix="%" onChange={(v) => store.updateSettings({ humidityMax: v })} />
          <NumberField label="Soil moisture min" value={s.moistureMin} min={0} max={s.moistureMax - 1} step={1} suffix="%" onChange={(v) => store.updateSettings({ moistureMin: v })} />
          <NumberField label="Soil moisture max" value={s.moistureMax} min={s.moistureMin + 1} max={100} step={1} suffix="%" onChange={(v) => store.updateSettings({ moistureMax: v })} />
          <NumberField label="Light min" value={s.lightMin} min={0} max={s.lightMax - 100} step={50} suffix="lux" onChange={(v) => store.updateSettings({ lightMin: v })} />
          <NumberField label="Light max" value={s.lightMax} min={s.lightMin + 100} max={2000} step={50} suffix="lux" onChange={(v) => store.updateSettings({ lightMax: v })} />
        </div>
      </Panel>

      <Panel className="p-4">
        <SectionHeader
          title="Recent watering activity"
          hint={`${store.wateringHistory.length} events logged`}
        />
        {store.wateringHistory.length === 0 ? (
          <p className="text-[13px] text-[var(--muted)]">No waterings logged yet.</p>
        ) : (
          <ul className="max-h-44 divide-y divide-[var(--border)] overflow-y-auto border-t border-[var(--border)]">
            {store.wateringHistory.slice(0, 10).map((w) => (
              <ActivityItem key={w.id} icon={Droplets} title={`${w.plantName} — ${w.note}`} meta={formatDateTime(w.timestamp)} time={timeAgo(w.timestamp)} tone="info" />
            ))}
          </ul>
        )}
      </Panel>

      <Panel className="p-4">
        <SectionHeader title="Data management" hint="LocalStorage only — nothing leaves your browser" />
        <dl className="tnum mb-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-md border border-[var(--border)] bg-[var(--bg2)] p-2.5">
            <p className="text-lg font-semibold text-[var(--text)]">{store.plants.length}</p>
            <p className="text-xs text-[var(--muted)]">Plants</p>
          </div>
          <div className="rounded-md border border-[var(--border)] bg-[var(--bg2)] p-2.5">
            <p className="text-lg font-semibold text-[var(--text)]">{store.alerts.length}</p>
            <p className="text-xs text-[var(--muted)]">Alerts</p>
          </div>
          <div className="rounded-md border border-[var(--border)] bg-[var(--bg2)] p-2.5">
            <p className="text-lg font-semibold text-[var(--text)]">{(storedBytes / 1024).toFixed(1)} KB</p>
            <p className="text-xs text-[var(--muted)]">Stored</p>
          </div>
        </dl>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={exportAll}>
            <Download className="h-4 w-4" /> Export JSON
          </Button>
          <Button variant="secondary" onClick={() => setPending('reset')}>
            <RotateCcw className="h-4 w-4" /> Reset demo data
          </Button>
          <Button variant="danger" onClick={() => setPending('clear')}>
            <Trash2 className="h-4 w-4" /> Clear local data
          </Button>
        </div>
      </Panel>

      <Panel className="p-4">
        <SectionHeader title="Application information" />
        <dl className="space-y-2 text-[13px]">
          <div className="flex justify-between gap-3"><dt className="text-[var(--muted)]">Version</dt><dd className="text-[var(--text)]">PlantIQ 1.0.0 (college demo)</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-[var(--muted)]">Stack</dt><dd className="text-right text-[var(--text)]">React + TypeScript + Tailwind · Lucide icons</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-[var(--muted)]">Storage key</dt><dd className="font-mono text-xs text-[var(--text)]">plantiq_data</dd></div>
        </dl>
        <p className="mt-3 rounded-md border border-[var(--border)] bg-[var(--bg2)] p-2.5 text-xs leading-5 text-[var(--muted)]">
          Simulated IoT disclaimer: all sensor data is randomly generated in JavaScript. No real
          hardware, backend, or accounts are involved. Future phases could bind this UI to
          ESP32/ESP8266 WebSocket telemetry without changing the components.
        </p>
      </Panel>

      <Modal open={pending != null} onClose={() => setPending(null)} title={pending === 'clear' ? 'Clear local data' : 'Reset demo data'}>
        <p className="text-sm leading-6 text-[var(--text2)]">
          {pending === 'clear'
            ? 'Remove all plants, alerts, readings and watering history from this browser? Your theme and threshold settings are kept.'
            : 'Replace your collection with the original 3-plant demo dataset? Current plants, alerts and history will be discarded.'}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setPending(null)}>Cancel</Button>
          <Button
            variant="danger"
            onClick={() => {
              if (pending === 'clear') store.clearAllData();
              else if (pending === 'reset') store.resetDemoData();
              setPending(null);
            }}
          >
            {pending === 'clear' ? 'Clear everything' : 'Reset demo'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
