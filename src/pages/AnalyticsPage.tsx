import { useMemo, useState } from 'react';
import { Download, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useStore } from '../context/AppContext';
import { Panel, SectionHeader, Button, EmptyState, PageHeader, Badge } from '../components/ui/primitives';
import { SensorChart, CHART_COLORS } from '../components/analytics/SensorChart';
import { downloadCsv } from '../lib/format';

const SERIES = [
  { key: 'temperature', label: 'Temperature', unit: '°C' },
  { key: 'humidity', label: 'Humidity', unit: '%' },
  { key: 'soilMoisture', label: 'Soil moisture', unit: '%' },
  { key: 'lightIntensity', label: 'Light', unit: 'lux' },
] as const;

type RangeId = '24h' | '7d' | '30d';

const RANGES: { id: RangeId; label: string; window: number; note: string }[] = [
  { id: '24h', label: '24H', window: 20, note: 'last 20 readings' },
  { id: '7d', label: '7D', window: 50, note: 'last 50 readings' },
  { id: '30d', label: '30D', window: 100, note: 'last 100 readings' },
];

export function AnalyticsPage() {
  const store = useStore();
  const [selectedId, setSelectedId] = useState<string>(store.plants[0]?.id ?? '');
  const [range, setRange] = useState<RangeId>('7d');
  const plant = store.plants.find((p) => p.id === selectedId) ?? store.plants[0];
  const full = plant ? (store.history[plant.id] ?? []) : [];
  const windowSize = RANGES.find((r) => r.id === range)?.window ?? 50;
  const data = useMemo(() => full.slice(-windowSize), [full, windowSize]);

  const summary = useMemo(() => {
    if (data.length < 2) return null;
    return SERIES.map((s) => {
      const vals = data.map((d) => d[s.key]);
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const delta = vals[vals.length - 1] - vals[0];
      return { ...s, avg, min, max, delta };
    });
  }, [data]);

  if (store.plants.length === 0) {
    return (
      <div className="space-y-4">
        <PageHeader title="Analytics" description="Sensor history and trends." />
        <EmptyState title="No analytics yet" hint="Add a plant and run the simulation to collect history." />
      </div>
    );
  }

  const exportCsv = () => {
    if (!plant) return;
    const rows = [
      ['timestamp', 'temperature_C', 'humidity_pct', 'soil_moisture_pct', 'light_lux'],
      ...data.map((d) => [d.timestamp, String(d.temperature), String(d.humidity), String(d.soilMoisture), String(d.lightIntensity)]),
    ];
    downloadCsv(`${plant.name}-sensor-history.csv`, rows);
  };

  const activeRange = RANGES.find((r) => r.id === range);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Analytics"
        description={`Session history for ${plant?.name ?? '—'}. Simulated telemetry — custom calendar ranges are not supported for generated data.`}
        meta={
          <>
            <Badge tone="neutral">{data.length} readings in view</Badge>
            <Badge tone="neutral">{activeRange?.note}</Badge>
          </>
        }
        actions={
          <Button variant="secondary" onClick={exportCsv} disabled={data.length === 0}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        }
      />

      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <label className="flex items-center gap-2 text-[13px] text-[var(--muted)]">
          Plant
          <select
            value={plant?.id ?? ''}
            onChange={(e) => setSelectedId(e.target.value)}
            className="rounded-md border border-[var(--border)] bg-[var(--bg2)] px-2 py-1.5 text-[13px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
            aria-label="Select plant"
          >
            {store.plants.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </label>
        <div className="flex items-center gap-1.5" role="group" aria-label="Time range">
          {RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              aria-pressed={range === r.id}
              title={r.note}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                range === r.id
                  ? 'border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--text)]'
                  : 'border-[var(--border)] bg-[var(--panel)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]'
              }`}
            >
              {r.label}
            </button>
          ))}
          <span className="ml-1 hidden text-xs text-[var(--muted)] sm:inline">
            Session windows · custom ranges N/A for simulated data
          </span>
        </div>
      </div>

      {data.length < 2 || !summary ? (
        <EmptyState
          title="Not enough history"
          hint="Run the simulation for a while to build up trend data."
          action={<Button onClick={store.startSimulation}>Start simulation</Button>}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
            {summary.map((s) => {
              const TrendIcon = Math.abs(s.delta) < (s.key === 'lightIntensity' ? 1 : 0.05) ? Minus : s.delta > 0 ? TrendingUp : TrendingDown;
              const fmt = (v: number) => (s.key === 'lightIntensity' ? String(Math.round(v)) : v.toFixed(1));
              return (
                <Panel key={s.key} className="p-3.5">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)]">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CHART_COLORS[s.key] }} />
                    {s.label}
                  </p>
                  <p className="tnum mt-1.5 text-xl font-semibold tracking-tight text-[var(--text)]">
                    {fmt(s.avg)}
                    <span className="ml-1 text-xs font-normal text-[var(--muted)]">avg {s.unit}</span>
                  </p>
                  <p className="tnum mt-1 flex items-center justify-between text-xs text-[var(--muted)]">
                    <span>{fmt(s.min)} – {fmt(s.max)}</span>
                    <span className="inline-flex items-center gap-1">
                      <TrendIcon className="h-3.5 w-3.5" />
                      {s.delta >= 0 ? '+' : ''}{fmt(s.delta)}
                    </span>
                  </p>
                </Panel>
              );
            })}
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {SERIES.map((s) => (
              <Panel key={s.key} className="p-4">
                <SectionHeader
                  title={s.label}
                  hint={`Unit: ${s.unit} · hover the chart for values`}
                  action={
                    <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CHART_COLORS[s.key] }} />
                      {s.label}
                    </span>
                  }
                />
                <SensorChart data={data} dataKey={s.key} unit={s.unit} />
              </Panel>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
