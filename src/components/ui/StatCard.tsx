import type { LucideIcon } from 'lucide-react';

export type HealthTone = 'healthy' | 'moderate' | 'critical' | 'nodata';

export function toneFor(score: number | null): HealthTone {
  if (score == null) return 'nodata';
  if (score >= 80) return 'healthy';
  if (score >= 60) return 'moderate';
  return 'critical';
}

export function toneColor(score: number | null): string {
  const t = toneFor(score);
  if (t === 'healthy') return '#22c55e';
  if (t === 'moderate') return '#f59e0b';
  if (t === 'critical') return '#ef4444';
  return '#71717a';
}

export function toneLabel(score: number | null): string {
  const t = toneFor(score);
  if (t === 'healthy') return 'Healthy';
  if (t === 'moderate') return 'Moderate';
  if (t === 'critical') return 'Needs attention';
  return 'No data';
}

/* Compact overview stat — small icon, muted label, prominent value, supporting line */
export function StatCard({
  label,
  value,
  icon: Icon,
  iconClass,
  sub,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  iconClass?: string;
  sub?: string;
}) {
  return (
    <div className="noor-card-hover rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
      <div className="flex items-center gap-2">
        <span className={`flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--elev)] ${iconClass ?? 'text-[var(--accent)]'}`}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-xs font-medium text-[var(--muted)]">{label}</span>
      </div>
      <p className="tnum type-stat-value mt-2.5 text-[var(--text)]">
        {value}
      </p>
      {sub ? <p className="mt-1 truncate text-xs text-[var(--muted)]">{sub}</p> : null}
    </div>
  );
}

export function PlantHealthBadge({ score }: { score: number | null }) {
  const t = toneFor(score);
  const cls =
    t === 'healthy'
      ? 'border-green-500/25 bg-green-500/10 text-green-500'
      : t === 'moderate'
        ? 'border-amber-500/25 bg-amber-500/10 text-amber-500'
        : t === 'critical'
          ? 'border-red-500/25 bg-red-500/10 text-red-500'
          : 'border-[var(--border)] bg-[var(--elev)] text-[var(--muted)]';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {toneLabel(score)}{score != null ? ` · ${score}%` : ''}
    </span>
  );
}

export function HealthRing({ score, size = 72 }: { score: number | null; size?: number }) {
  const v = score ?? 0;
  const sw = 6;
  const r = (size - sw * 2) / 2;
  const c = 2 * Math.PI * r;
  const color = toneColor(score);
  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={score == null ? 'No health data' : `Health ${score} percent`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={sw}
          stroke="var(--border)"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * v) / 100}
          style={{ transition: 'stroke-dashoffset 0.4s ease, stroke 0.2s ease' }}
        />
      </svg>
      <span className="tnum absolute text-[13px] font-semibold text-[var(--text)]">
        {score == null ? '—' : `${score}%`}
      </span>
    </div>
  );
}

export function HealthBar({ score, className = '' }: { score: number | null; className?: string }) {
  const v = score ?? 0;
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-[var(--elev)] ${className}`}
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={score == null ? 'No health data' : `Health ${score} percent`}
    >
      <div
        className="noor-bar-fill h-full rounded-full"
        style={{ width: `${v}%`, backgroundColor: toneColor(score) }}
      />
    </div>
  );
}
