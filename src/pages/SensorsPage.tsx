import { FlaskConical, Droplets } from 'lucide-react';
import { useStore } from '../context/AppContext';
import { Panel, SectionHeader, EmptyState, Button, PageHeader, Badge } from '../components/ui/primitives';
import { SensorCard, SimulationControls } from '../components/sensors/SensorCards';
import { HealthRing, PlantHealthBadge } from '../components/ui/StatCard';
import { PlantAvatar } from '../components/plants/PlantCard';
import { timeAgo } from '../lib/format';
import { navigate } from '../hooks/useSensors';

export function SensorsPage() {
  const store = useStore();
  const totalSensors = store.plants.length * 4;
  const totalReadings = Object.values(store.history).reduce((a, h) => a + h.length, 0);

  if (store.plants.length === 0) {
    return (
      <div className="space-y-4">
        <PageHeader title="Sensors" description="Live simulated IoT telemetry." />
        <EmptyState
          title="No plants to monitor"
          hint="Add a plant before using the sensor simulation."
          action={<Button onClick={() => navigate('#/plants')}>Go to plants</Button>}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Sensors"
        description="Live simulated telemetry. No hardware connected — values drift from a random-walk generator."
        meta={
          <>
            <Badge tone={store.simulationRunning ? 'success' : 'neutral'} dot>
              {store.simulationRunning ? 'Streaming' : 'Paused'}
            </Badge>
            <Badge tone="neutral">{totalSensors} virtual sensors</Badge>
            <Badge tone="neutral">{totalReadings} readings buffered</Badge>
          </>
        }
      />

      <div className="flex gap-2.5 rounded-md border border-amber-500/25 bg-amber-500/[0.07] p-3 text-[13px] leading-5 text-[var(--text2)]">
        <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
        <p>
          <span className="font-medium text-[var(--text)]">Simulated data disclaimer — </span>
          every reading on this page is generated in JavaScript for demonstration. Do not use it for
          real plant-care decisions. Future hardware (ESP32/ESP8266) would replace this stream.
        </p>
      </div>

      <Panel className="p-4">
        <SectionHeader title="Simulation controls" hint="Affects all plants · interval applies on restart of the tick loop" />
        <SimulationControls
          running={store.simulationRunning}
          refreshRate={store.settings.sensorRefreshRate}
          onStart={store.startSimulation}
          onStop={store.stopSimulation}
          onRateChange={(ms) => store.updateSettings({ sensorRefreshRate: ms })}
          onReset={store.resetSimulation}
        />
        <div className="tnum mt-3 grid grid-cols-2 gap-2 border-t border-[var(--border)] pt-3 text-xs sm:grid-cols-4">
          <p className="text-[var(--muted)]">Temp optimal <span className="block font-medium text-[var(--text)]">{store.settings.temperatureMin}–{store.settings.temperatureMax}°C</span></p>
          <p className="text-[var(--muted)]">Humidity <span className="block font-medium text-[var(--text)]">{store.settings.humidityMin}–{store.settings.humidityMax}%</span></p>
          <p className="text-[var(--muted)]">Moisture <span className="block font-medium text-[var(--text)]">{store.settings.moistureMin}–{store.settings.moistureMax}%</span></p>
          <p className="text-[var(--muted)]">Light <span className="block font-medium text-[var(--text)]">{store.settings.lightMin}–{store.settings.lightMax} lux</span></p>
        </div>
      </Panel>

      <div className="space-y-3">
        {store.plants.map((plant) => {
          const reading = store.readings[plant.id];
          const count = store.history[plant.id]?.length ?? 0;
          return (
            <Panel key={plant.id} className="p-4">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <PlantAvatar plant={plant} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => navigate(`#/plants/${plant.id}`)}
                      className="truncate text-sm font-semibold text-[var(--text)] hover:underline"
                    >
                      {plant.name}
                    </button>
                    <PlantHealthBadge score={store.healthFor(plant.id)} />
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--muted)]">
                    {reading ? `Updated ${timeAgo(reading.timestamp)} · ${count} readings buffered` : count > 0 ? `${count} readings buffered · stream paused` : 'No readings yet — start the simulation'}
                  </p>
                </div>
                <HealthRing score={store.healthFor(plant.id)} size={48} />
                <Button variant="secondary" onClick={() => store.waterPlant(plant.id)}>
                  <Droplets className="h-3.5 w-3.5" /> Water
                </Button>
              </div>
              {reading ? (
                <SensorCard reading={reading} settings={store.settings} />
              ) : (
                <div className="rounded-md border border-dashed border-[var(--border-strong)] p-4 text-center text-[13px] text-[var(--muted)]">
                  No live reading for {plant.name} yet.
                </div>
              )}
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
