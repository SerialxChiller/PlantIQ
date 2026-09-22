import { useMemo, useState } from 'react';
import {
  Leaf, HeartPulse, AlertTriangle, Bell,
  Plus, Play, Pause, Droplets, BarChart3, ChevronRight,
  Sprout, FlaskConical, History, Zap,
} from 'lucide-react';
import { useStore } from '../../context/AppContext';
import { StatCard, HealthRing, HealthBar, toneFor } from '../ui/StatCard';
import { Panel, SectionHeader, EmptyState, Button, Badge, PageHeader } from '../ui/primitives';
import { SensorTile, SimulationControls } from '../sensors/SensorCards';
import { SensorChart } from '../analytics/SensorChart';
import { AlertItem } from '../alerts/AlertItem';
import { ActivityItem } from '../ui/ActivityItem';
import { PlantAvatar } from '../plants/PlantCard';
import { navigate } from '../../hooks/useSensors';
import { timeAgo } from '../../lib/format';
import { PlantFormModal } from '../../pages/PlantsPage';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function Dashboard() {
  const store = useStore();
  const { plants, readings, history, wateringHistory, activeAlerts, simulationRunning } = store;
  const [showAdd, setShowAdd] = useState(false);
  const [sensorPlantId, setSensorPlantId] = useState<string>(plants[0]?.id ?? '');

  const scores = useMemo(
    () => plants.map((p) => ({ plant: p, score: store.healthFor(p.id) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [plants, readings, store],
  );
  const withData = scores.filter((s) => s.score != null);
  const healthy = withData.filter((s) => (s.score ?? 0) >= 80).length;
  const needsAttention = withData.filter((s) => (s.score ?? 0) < 60).length;
  const criticalAlerts = activeAlerts.filter((a) => a.severity === 'critical').length;
  const avgHealth = withData.length > 0
    ? Math.round(withData.reduce((a, b) => a + (b.score ?? 0), 0) / withData.length)
    : null;

  const today = new Date().toDateString();
  const todaysWaterings = wateringHistory.filter((w) => new Date(w.timestamp).toDateString() === today).length;

  const sensorPlant = plants.find((p) => p.id === sensorPlantId) ?? plants[0] ?? null;
  const sensorReading = sensorPlant ? readings[sensorPlant.id] : undefined;
  const sensorHist = sensorPlant ? (history[sensorPlant.id] ?? []) : [];
  const prevReading = sensorHist.length > 1 ? sensorHist[sensorHist.length - 2] : undefined;

  const needsWaterFirst = useMemo(() => {
    const withMoisture = plants
      .map((p) => ({ p, m: readings[p.id]?.soilMoisture }))
      .filter((x): x is { p: typeof x.p; m: number } => x.m != null)
      .sort((a, b) => a.m - b.m);
    return withMoisture[0]?.p ?? [...plants].sort((a, b) => +new Date(a.lastWatered) - +new Date(b.lastWatered))[0];
  }, [plants, readings]);

  const worstFirst = useMemo(
    () => [...scores].sort((a, b) => (a.score ?? 101) - (b.score ?? 101)).slice(0, 5),
    [scores],
  );

  const dateStr = new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-4">
      <PageHeader
        title={`${greeting()} — here's your greenhouse`}
        description={`${dateStr} · ${plants.length} plant${plants.length === 1 ? '' : 's'} monitored · All telemetry is simulated.`}
        meta={
          <>
            <Badge tone={simulationRunning ? 'success' : 'neutral'} dot>
              {simulationRunning ? 'Simulation live' : 'Simulation paused'}
            </Badge>
            <Badge tone="neutral">
              <FlaskConical className="h-3 w-3" /> Simulated IoT data
            </Badge>
            {avgHealth != null && <Badge tone={avgHealth >= 80 ? 'success' : avgHealth >= 60 ? 'warning' : 'danger'}>Avg health {avgHealth}%</Badge>}
          </>
        }
        actions={
          <>
            <Button variant="secondary" onClick={() => setShowAdd(true)}>
              <Plus className="h-4 w-4" /> Add plant
            </Button>
            {simulationRunning ? (
              <Button variant="secondary" onClick={store.stopSimulation}>
                <Pause className="h-4 w-4" /> Pause
              </Button>
            ) : (
              <Button onClick={store.startSimulation}>
                <Play className="h-4 w-4" /> Start simulation
              </Button>
            )}
          </>
        }
      />

      {/* B. Overview statistics */}
      <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
        <StatCard label="Total Plants" value={String(plants.length)} icon={Leaf} sub={`${healthy} healthy · ${todaysWaterings} watered today`} />
        <StatCard label="Healthy Plants" value={String(healthy)} icon={HeartPulse} iconClass="text-green-500" sub={withData.length ? `${avgHealth}% average health` : 'No sensor data yet'} />
        <StatCard label="Needs Attention" value={String(needsAttention)} icon={AlertTriangle} iconClass={needsAttention > 0 ? 'text-red-500' : 'text-[var(--muted)]'} sub={needsAttention > 0 ? 'Check health list below' : 'Nothing critical right now'} />
        <StatCard label="Active Alerts" value={String(activeAlerts.length)} icon={Bell} iconClass={activeAlerts.length > 0 ? 'text-amber-500' : 'text-[var(--muted)]'} sub={criticalAlerts > 0 ? `${criticalAlerts} critical` : 'All clear'} />
      </div>

      {/* C + D */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Panel className="p-4 xl:col-span-2">
          <SectionHeader
            title="Plant health"
            hint="Worst first · click through for details"
            action={
              <a href="#/plants" className="inline-flex items-center gap-0.5 text-[13px] font-medium text-[var(--accent)] hover:underline">
                View all <ChevronRight className="h-3.5 w-3.5" />
              </a>
            }
          />
          {plants.length === 0 ? (
            <EmptyState
              icon={<span className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--elev)] text-[var(--muted)]"><Sprout className="h-4 w-4" /></span>}
              title="No plants yet"
              hint="Add your first plant to start tracking health scores."
              action={<Button onClick={() => setShowAdd(true)}>Add plant</Button>}
            />
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {worstFirst.map(({ plant, score }) => (
                <li key={plant.id}>
                  <button
                    onClick={() => navigate(`#/plants/${plant.id}`)}
                    className="flex w-full items-center gap-3 rounded-md py-2.5 text-left transition-colors hover:bg-[var(--elev)]"
                  >
                    <PlantAvatar plant={plant} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-[13px] font-medium text-[var(--text)]">{plant.name}</span>
                        <span className={`tnum text-[13px] font-semibold ${toneFor(score) === 'healthy' ? 'text-green-500' : toneFor(score) === 'moderate' ? 'text-amber-500' : toneFor(score) === 'critical' ? 'text-red-500' : 'text-[var(--muted)]'}`}>
                          {score == null ? '—' : `${score}%`}
                        </span>
                      </span>
                      <span className="block truncate text-xs text-[var(--muted)]">{plant.type}</span>
                      <HealthBar score={score} className="mt-1.5" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel className="p-4 xl:col-span-3">
          <SectionHeader
            title="Live sensors"
            hint="Simulated IoT data · values drift while running"
            action={
              <div className="flex items-center gap-2">
                <Badge tone="neutral">Simulated</Badge>
                {plants.length > 1 && (
                  <select
                    value={sensorPlant?.id ?? ''}
                    onChange={(e) => setSensorPlantId(e.target.value)}
                    className="rounded-md border border-[var(--border)] bg-[var(--bg2)] px-2 py-1 text-[13px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                    aria-label="Select plant for live sensors"
                  >
                    {plants.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                )}
                <a href="#/sensors" className="hidden items-center gap-0.5 text-[13px] font-medium text-[var(--accent)] hover:underline sm:inline-flex">
                  Sensors <ChevronRight className="h-3.5 w-3.5" />
                </a>
              </div>
            }
          />
          {!sensorPlant ? (
            <EmptyState title="No plants to monitor" hint="Add a plant, then start the simulation." action={<Button onClick={() => setShowAdd(true)}>Add plant</Button>} />
          ) : !sensorReading ? (
            <EmptyState title="Simulation is paused" hint={`Start the simulation to stream live readings for ${sensorPlant.name}.`} action={<Button onClick={store.startSimulation}>Start simulation</Button>} />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2.5">
                <SensorTile sensorKey="temperature" reading={sensorReading} prev={prevReading} updatedAt={sensorReading.timestamp} settings={store.settings} />
                <SensorTile sensorKey="humidity" reading={sensorReading} prev={prevReading} updatedAt={sensorReading.timestamp} settings={store.settings} />
                <SensorTile sensorKey="soilMoisture" reading={sensorReading} prev={prevReading} updatedAt={sensorReading.timestamp} settings={store.settings} />
                <SensorTile sensorKey="lightIntensity" reading={sensorReading} prev={prevReading} updatedAt={sensorReading.timestamp} settings={store.settings} />
              </div>
              <div className="mt-3 border-t border-[var(--border)] pt-3">
                <SimulationControls
                  running={simulationRunning}
                  refreshRate={store.settings.sensorRefreshRate}
                  onStart={store.startSimulation}
                  onStop={store.stopSimulation}
                  onRateChange={(ms) => store.updateSettings({ sensorRefreshRate: ms })}
                  onReset={store.resetSimulation}
                />
              </div>
            </>
          )}
        </Panel>
      </div>

      {/* E + F */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Panel className="p-4 xl:col-span-3">
          <SectionHeader
            title="Sensor trends"
            hint={sensorPlant ? `${sensorPlant.name} · recent session history` : 'Run the simulation to build history'}
            action={
              <a href="#/analytics" className="inline-flex items-center gap-0.5 text-[13px] font-medium text-[var(--accent)] hover:underline">
                Analytics <ChevronRight className="h-3.5 w-3.5" />
              </a>
            }
          />
          {sensorHist.length > 1 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1.5 text-xs font-medium text-[var(--muted)]">Soil moisture · %</p>
                <SensorChart data={sensorHist} dataKey="soilMoisture" unit="%" height={170} />
              </div>
              <div>
                <p className="mb-1.5 text-xs font-medium text-[var(--muted)]">Temperature · °C</p>
                <SensorChart data={sensorHist} dataKey="temperature" unit="°C" height={170} />
              </div>
            </div>
          ) : (
            <EmptyState title="No trend data yet" hint="Run the simulation for a bit — charts appear after a few readings." action={<Button onClick={store.startSimulation}>Start simulation</Button>} />
          )}
        </Panel>

        <Panel className="p-4 xl:col-span-2">
          <SectionHeader
            title="Recent alerts"
            hint={activeAlerts.length ? `${activeAlerts.length} active` : 'Nothing needs attention'}
            action={
              <a href="#/alerts" className="inline-flex items-center gap-0.5 text-[13px] font-medium text-[var(--accent)] hover:underline">
                View all <ChevronRight className="h-3.5 w-3.5" />
              </a>
            }
          />
          {activeAlerts.length === 0 ? (
            <EmptyState title="All clear" hint="Threshold violations will surface here while simulating." />
          ) : (
            <div className="space-y-2">
              {activeAlerts.slice(0, 3).map((a) => (
                <AlertItem key={a.id} alert={a} onResolve={store.resolveAlert} onDismiss={store.dismissAlert} />
              ))}
            </div>
          )}
        </Panel>
      </div>

      {/* Activity + Quick actions */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Panel className="p-4 xl:col-span-3">
          <SectionHeader title="Recent activity" hint="Watering and care events" />
          {wateringHistory.length === 0 ? (
            <EmptyState
              icon={<span className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--elev)] text-[var(--muted)]"><History className="h-4 w-4" /></span>}
              title="No activity yet"
              hint="Water a plant and it will be logged here with a timestamp."
            />
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {wateringHistory.slice(0, 5).map((w) => (
                <ActivityItem
                  key={w.id}
                  icon={Droplets}
                  title={`${w.plantName} watered`}
                  meta={w.note}
                  time={timeAgo(w.timestamp)}
                  tone="info"
                />
              ))}
            </ul>
          )}
          <div className="mt-3 flex items-center gap-3 border-t border-[var(--border)] pt-3">
            <HealthRing score={avgHealth} size={52} />
            <p className="text-xs leading-5 text-[var(--muted)]">
              <span className="font-medium text-[var(--text)]">Collection health {avgHealth == null ? '—' : `${avgHealth}%`}. </span>
              Scores blend temperature, humidity, soil moisture and light against your thresholds.
            </p>
          </div>
        </Panel>

        <Panel className="p-4 xl:col-span-2">
          <SectionHeader title="Quick actions" hint="Connected to live functionality" />
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowAdd(true)}
              className="flex flex-col items-start gap-2 rounded-md border border-[var(--border)] bg-[var(--bg2)] p-3 text-left transition-colors hover:border-[var(--border-strong)]"
            >
              <Plus className="h-4 w-4 text-[var(--accent)]" />
              <span className="text-[13px] font-medium text-[var(--text)]">Add plant</span>
              <span className="text-xs text-[var(--muted)]">Grow the collection</span>
            </button>
            <button
              onClick={() => needsWaterFirst && store.waterPlant(needsWaterFirst.id)}
              disabled={!needsWaterFirst}
              className="flex flex-col items-start gap-2 rounded-md border border-[var(--border)] bg-[var(--bg2)] p-3 text-left transition-colors hover:border-[var(--border-strong)] disabled:opacity-50"
            >
              <Droplets className="h-4 w-4 text-blue-400" />
              <span className="text-[13px] font-medium text-[var(--text)]">Water plant</span>
              <span className="truncate text-xs text-[var(--muted)]">{needsWaterFirst ? needsWaterFirst.name : 'No plants'}</span>
            </button>
            <button
              onClick={() => (simulationRunning ? store.stopSimulation() : store.startSimulation())}
              className="flex flex-col items-start gap-2 rounded-md border border-[var(--border)] bg-[var(--bg2)] p-3 text-left transition-colors hover:border-[var(--border-strong)]"
            >
              {simulationRunning ? <Pause className="h-4 w-4 text-amber-500" /> : <Zap className="h-4 w-4 text-[var(--accent)]" />}
              <span className="text-[13px] font-medium text-[var(--text)]">{simulationRunning ? 'Pause stream' : 'Start stream'}</span>
              <span className="text-xs text-[var(--muted)]">Simulated telemetry</span>
            </button>
            <a
              href="#/analytics"
              className="flex flex-col items-start gap-2 rounded-md border border-[var(--border)] bg-[var(--bg2)] p-3 text-left transition-colors hover:border-[var(--border-strong)]"
            >
              <BarChart3 className="h-4 w-4 text-[var(--text2)]" />
              <span className="text-[13px] font-medium text-[var(--text)]">View analytics</span>
              <span className="text-xs text-[var(--muted)]">Trends + export</span>
            </a>
          </div>
        </Panel>
      </div>

      <PlantFormModal open={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  );
}
