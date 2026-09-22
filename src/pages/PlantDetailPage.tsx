import { useState } from 'react';
import { ArrowLeft, Droplets, Pencil, Trash2, Info } from 'lucide-react';
import { useStore } from '../context/AppContext';
import { Panel, SectionHeader, Button, EmptyState, Badge, PageHeader } from '../components/ui/primitives';
import { HealthRing, PlantHealthBadge, toneFor } from '../components/ui/StatCard';
import { SensorCard } from '../components/sensors/SensorCards';
import { SensorChart } from '../components/analytics/SensorChart';
import { PlantFormModal } from './PlantsPage';
import { PlantAvatar } from '../components/plants/PlantCard';
import { Modal } from '../components/ui/Modal';
import { navigate } from '../hooks/useSensors';
import { formatDateTime, timeAgo } from '../lib/format';
import { calculateHealthScore } from '../lib/healthScore';
import { ActivityItem } from '../components/ui/ActivityItem';
import type { Plant } from '../lib/types';

export function PlantDetailPage({ plantId }: { plantId: string }) {
  const store = useStore();
  const plant: Plant | undefined = store.plants.find((p) => p.id === plantId);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!plant) {
    return (
      <EmptyState
        title="Plant not found"
        hint="This plant may have been deleted from local storage."
        action={<Button onClick={() => navigate('#/plants')}>Back to plants</Button>}
      />
    );
  }

  const reading = store.readings[plant.id];
  const hist = store.history[plant.id] ?? [];
  const score = store.healthFor(plant.id);
  const t = store.settings;
  const breakdown = reading
    ? calculateHealthScore(reading, {
        tempMin: t.temperatureMin, tempMax: t.temperatureMax,
        humMin: t.humidityMin, humMax: t.humidityMax,
        moistMin: t.moistureMin, moistMax: t.moistureMax,
        lightMin: t.lightMin, lightMax: t.lightMax,
      })
    : null;
  const waterings = store.wateringHistory.filter((w) => w.plantId === plant.id);
  const plantAlerts = store.alerts.filter((a) => a.plantId === plant.id && !a.resolved);
  const tone = toneFor(score);

  const rows: { label: string; value: number; range: string }[] = breakdown
    ? [
        { label: 'Temperature', value: breakdown.tempScore, range: `${t.temperatureMin}–${t.temperatureMax}°C` },
        { label: 'Humidity', value: breakdown.humidityScore, range: `${t.humidityMin}–${t.humidityMax}%` },
        { label: 'Soil moisture', value: breakdown.moistureScore, range: `${t.moistureMin}–${t.moistureMax}%` },
        { label: 'Light', value: breakdown.lightScore, range: `${t.lightMin}–${t.lightMax} lux` },
      ]
    : [];

  return (
    <div className="space-y-4">
      <button
        onClick={() => navigate('#/plants')}
        className="inline-flex items-center gap-1.5 rounded-md px-1 py-1 text-[13px] font-medium text-[var(--muted)] transition-colors hover:text-[var(--text)]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to plants
      </button>

      <PageHeader
        title={plant.name}
        description={`${plant.type} · Added ${formatDateTime(plant.createdAt)} · Watered ${timeAgo(plant.lastWatered)}`}
        meta={
          <>
            <PlantHealthBadge score={score} />
            <Badge tone="neutral">Simulated IoT</Badge>
            {plantAlerts.length > 0 && <Badge tone="warning">{plantAlerts.length} active alert{plantAlerts.length > 1 ? 's' : ''}</Badge>}
          </>
        }
        actions={
          <>
            <Button variant="secondary" onClick={() => setEditing(true)}>
              <Pencil className="h-4 w-4" /> Edit
            </Button>
            <Button variant="secondary" onClick={() => store.waterPlant(plant.id)}>
              <Droplets className="h-4 w-4" /> Water now
            </Button>
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        {/* Identity + health explanation */}
        <Panel className="p-4 xl:col-span-2">
          <SectionHeader title="Health overview" hint="Weighted from live sensor values" />
          <div className="flex items-center gap-4">
            <PlantAvatar plant={plant} size="lg" />
            <HealthRing score={score} size={84} />
            <div className="min-w-0 text-[13px] leading-5 text-[var(--muted)]">
              {score == null ? (
                <p>Start the simulation to compute a live health score for this plant.</p>
              ) : tone === 'healthy' ? (
                <p><span className="font-medium text-green-500">Looking healthy.</span> All four signals are near their optimal ranges.</p>
              ) : tone === 'moderate' ? (
                <p><span className="font-medium text-amber-500">Needs a check.</span> One or more signals drifted from optimal — see the breakdown.</p>
              ) : (
                <p><span className="font-medium text-red-500">Needs attention.</span> Values are well outside optimal ranges. Water or relocate the plant.</p>
              )}
            </div>
          </div>
          {rows.length > 0 && (
            <ul className="mt-4 space-y-2.5 border-t border-[var(--border)] pt-4">
              {rows.map((r) => (
                <li key={r.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-[var(--text2)]">{r.label}</span>
                    <span className="tnum text-[var(--muted)]">{r.value} · optimal {r.range}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[var(--elev)]" role="progressbar" aria-valuenow={r.value} aria-valuemin={0} aria-valuemax={100} aria-label={`${r.label} score`}>
                    <div
                      className="noor-bar-fill h-full rounded-full"
                      style={{ width: `${r.value}%`, backgroundColor: r.value >= 80 ? '#22c55e' : r.value >= 60 ? '#f59e0b' : '#ef4444' }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 flex gap-1.5 rounded-md border border-[var(--border)] bg-[var(--bg2)] p-2.5 text-xs leading-5 text-[var(--muted)]">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Weights: temperature 25% · humidity 25% · soil moisture 30% · light 20%. Thresholds are configurable in Settings.
          </p>
        </Panel>

        {/* Readings */}
        <Panel className="p-4 xl:col-span-3">
          <SectionHeader
            title="Current readings"
            hint={reading ? `Updated ${timeAgo(reading.timestamp)} · simulated` : 'No live data for this plant'}
            action={<Badge tone={reading ? 'success' : 'neutral'} dot>{reading ? 'Live' : 'Paused'}</Badge>}
          />
          {reading ? (
            <>
              <SensorCard reading={reading} settings={store.settings} />
              <div className="tnum mt-3 grid grid-cols-2 gap-2 rounded-md border border-[var(--border)] bg-[var(--bg2)] p-3 text-xs sm:grid-cols-4">
                <p className="text-[var(--muted)]">Temp optimal <span className="block font-medium text-[var(--text)]">{t.temperatureMin}–{t.temperatureMax}°C</span></p>
                <p className="text-[var(--muted)]">Humidity <span className="block font-medium text-[var(--text)]">{t.humidityMin}–{t.humidityMax}%</span></p>
                <p className="text-[var(--muted)]">Moisture <span className="block font-medium text-[var(--text)]">{t.moistureMin}–{t.moistureMax}%</span></p>
                <p className="text-[var(--muted)]">Light <span className="block font-medium text-[var(--text)]">{t.lightMin}–{t.lightMax} lux</span></p>
              </div>
            </>
          ) : (
            <EmptyState title="No live data" hint="Start the simulation to generate readings for this plant." action={<Button onClick={store.startSimulation}>Start simulation</Button>} />
          )}
          {hist.length > 1 && (
            <div className="mt-4">
              <p className="mb-1.5 text-xs font-medium text-[var(--muted)]">Soil moisture history</p>
              <SensorChart data={hist} dataKey="soilMoisture" unit="%" height={170} />
            </div>
          )}
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel className="p-4">
          <SectionHeader title="Care information" hint="Simulated guidance, not botanical advice" />
          <dl className="tnum space-y-2 border-t border-[var(--border)] pt-3 text-[13px]">
            <div className="flex justify-between gap-3"><dt className="text-[var(--muted)]">Last watered</dt><dd className="text-right text-[var(--text)]">{formatDateTime(plant.lastWatered)} ({timeAgo(plant.lastWatered)})</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-[var(--muted)]">Waterings logged</dt><dd className="text-[var(--text)]">{waterings.length}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-[var(--muted)]">Active alerts</dt><dd className="text-[var(--text)]">{plantAlerts.length}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-[var(--muted)]">Data source</dt><dd className="text-[var(--text)]">Simulated · LocalStorage</dd></div>
          </dl>
          {plantAlerts.length > 0 && (
            <ul className="mt-3 space-y-1.5 border-t border-[var(--border)] pt-3 text-[13px] text-[var(--text2)]">
              {plantAlerts.map((a) => (
                <li key={a.id} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  {a.message}
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel className="p-4">
          <SectionHeader title="Watering history" hint={`${waterings.length} event${waterings.length === 1 ? '' : 's'}`} />
          {waterings.length === 0 ? (
            <p className="border-t border-[var(--border)] pt-3 text-[13px] text-[var(--muted)]">No waterings logged yet. Use “Water now” to record one.</p>
          ) : (
            <ul className="max-h-52 divide-y divide-[var(--border)] overflow-y-auto border-t border-[var(--border)]">
              {waterings.slice(0, 20).map((w) => (
                <ActivityItem key={w.id} icon={Droplets} title={w.note} meta={formatDateTime(w.timestamp)} time={timeAgo(w.timestamp)} tone="info" />
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <PlantFormModal open={editing} onClose={() => setEditing(false)} editing={plant} />
      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Delete plant">
        <p className="text-sm leading-6 text-[var(--text2)]">
          Delete <span className="font-medium text-[var(--text)]">{plant.name}</span>? Its readings, alerts and
          watering history will be removed from this browser.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button
            variant="danger"
            onClick={() => {
              store.deletePlant(plant.id);
              navigate('#/plants');
            }}
          >
            Delete plant
          </Button>
        </div>
      </Modal>
    </div>
  );
}
