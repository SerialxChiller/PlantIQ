import { Flower2, Droplets, ArrowRight, Pencil, Trash2 } from 'lucide-react';
import type { Plant } from '../../lib/types';
import { timeAgo } from '../../lib/format';
import { PlantHealthBadge, toneColor } from '../ui/StatCard';
import { navigate } from '../../hooks/useSensors';
import { useStore } from '../../context/AppContext';

const AVATAR_BG = ['#14532d', '#164e63', '#4a2c0a', '#3b0764', '#7c2d12', '#1e3a8a'];

export function avatarColorFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_BG[h % AVATAR_BG.length];
}

export function PlantAvatar({ plant, size = 'md' }: { plant: Plant; size?: 'md' | 'lg' }) {
  const initials = plant.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const dims = size === 'lg' ? 'h-20 w-20' : 'h-12 w-12';
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-md ${dims}`}
      style={{ backgroundColor: avatarColorFor(plant.id) }}
      aria-hidden="true"
    >
      <Flower2 className="absolute h-2/3 w-2/3 text-white/25" />
      <span className="relative text-sm font-semibold text-white">{initials}</span>
    </span>
  );
}

export function PlantCard({
  plant,
  health,
  onWater,
  onEdit,
  onDelete,
}: {
  plant: Plant;
  health: number | null;
  onWater: (id: string) => void;
  onEdit?: (plant: Plant) => void;
  onDelete?: (plant: Plant) => void;
}) {
  const store = useStore();
  const reading = store.readings[plant.id];
  const moisture = reading ? `${reading.soilMoisture.toFixed(0)}%` : '—';
  const temp = reading ? `${reading.temperature.toFixed(1)}°C` : '—';
  const color = toneColor(health);

  return (
    <article className="noor-card-hover flex flex-col rounded-lg border border-[var(--border)] bg-[var(--panel)]">
      <div className="flex items-start gap-3 p-4 pb-3">
        <PlantAvatar plant={plant} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="truncate text-sm font-semibold text-[var(--text)]">{plant.name}</h4>
              <p className="truncate text-xs text-[var(--muted)]">{plant.type}</p>
            </div>
            {(onEdit || onDelete) && (
              <div className="flex shrink-0 gap-0.5">
                {onEdit && (
                  <button
                    onClick={() => onEdit(plant)}
                    className="rounded-md p-1.5 text-[var(--muted)] hover:bg-[var(--elev)] hover:text-[var(--text)]"
                    aria-label={`Edit ${plant.name}`}
                    title={`Edit ${plant.name}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(plant)}
                    className="rounded-md p-1.5 text-[var(--muted)] hover:bg-red-500/10 hover:text-red-500"
                    aria-label={`Delete ${plant.name}`}
                    title={`Delete ${plant.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="mt-2">
            <PlantHealthBadge score={health} />
          </div>
        </div>
      </div>

      <div className="tnum mx-4 grid grid-cols-2 gap-2 border-t border-[var(--border)] py-3 text-xs">
        <div>
          <p className="text-[var(--muted)]">Soil moisture</p>
          <p className="mt-0.5 font-semibold text-[var(--text)]">{moisture}</p>
        </div>
        <div>
          <p className="text-[var(--muted)]">Temperature</p>
          <p className="mt-0.5 font-semibold text-[var(--text)]">{temp}</p>
        </div>
      </div>

      <div
        className="mx-4 mb-3 h-1 overflow-hidden rounded-full bg-[var(--elev)]"
        role="progressbar"
        aria-valuenow={health ?? 0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${plant.name} health ${health ?? 'unknown'} percent`}
      >
        <div className="noor-bar-fill h-full rounded-full" style={{ width: `${health ?? 0}%`, backgroundColor: color }} />
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--border)] px-4 py-2.5">
        <span className="truncate text-xs text-[var(--muted)]">Watered {timeAgo(plant.lastWatered)}</span>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={() => onWater(plant.id)}
            className="inline-flex items-center gap-1 rounded-md border border-blue-500/25 bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-400 transition-colors hover:bg-blue-500/20"
            aria-label={`Water ${plant.name}`}
          >
            <Droplets className="h-3 w-3" /> Water
          </button>
          <button
            onClick={() => navigate(`#/plants/${plant.id}`)}
            className="inline-flex items-center gap-0.5 rounded-md px-2 py-1 text-xs font-medium text-[var(--text2)] transition-colors hover:bg-[var(--elev)] hover:text-[var(--text)]"
            aria-label={`View details of ${plant.name}`}
          >
            Details <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </article>
  );
}
