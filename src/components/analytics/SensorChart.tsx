import { useState } from 'react';
import type { SensorReading } from '../../lib/types';
import { formatTime } from '../../lib/format';

export const CHART_COLORS: Record<string, string> = {
  temperature: '#f59e0b',
  humidity: '#38bdf8',
  soilMoisture: '#22c55e',
  lightIntensity: '#eab308',
};

export type ChartKey = 'temperature' | 'humidity' | 'soilMoisture' | 'lightIntensity';

export function SensorChart({
  data,
  dataKey,
  unit,
  height = 200,
}: {
  data: SensorReading[];
  dataKey: ChartKey;
  unit: string;
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);

  if (data.length < 2) {
    return (
      <div
        className="flex items-center justify-center rounded-md border border-dashed border-[var(--border-strong)] bg-[var(--bg2)] px-4 text-center text-[13px] text-[var(--muted)]"
        style={{ height }}
      >
        Not enough data yet — run the simulation to collect readings.
      </div>
    );
  }

  const W = 600;
  const H = height;
  const PAD_L = 40;
  const PAD_R = 12;
  const PAD_T = 12;
  const PAD_B = 24;
  const values = data.map((d) => d[dataKey]);
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (max - min < 1e-6) {
    min -= 1;
    max += 1;
  }
  const pad = (max - min) * 0.12;
  min -= pad;
  max += pad;
  const span = max - min;

  const x = (i: number) => PAD_L + (i / (data.length - 1)) * (W - PAD_L - PAD_R);
  const y = (v: number) => PAD_T + (1 - (v - min) / span) * (H - PAD_T - PAD_B);

  const pts = data.map((d, i) => ({ x: x(i), y: y(d[dataKey]), d, i }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1].x.toFixed(1)},${(H - PAD_B).toFixed(1)} L${pts[0].x.toFixed(1)},${(H - PAD_B).toFixed(1)} Z`;
  const color = CHART_COLORS[dataKey];
  const ticks = [0, 1, 2, 3].map((i) => min + (span * i) / 3);
  const hov = hover != null ? pts[Math.min(hover, pts.length - 1)] : null;

  return (
    <div className="w-full">
      <div
        className="relative w-full overflow-hidden"
        onMouseLeave={() => setHover(null)}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full"
          style={{ height }}
          role="img"
          aria-label={`${dataKey} history chart, ${data.length} readings`}
          onMouseMove={(e) => {
            const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
            const px = ((e.clientX - rect.left) / rect.width) * W;
            let best = 0;
            let bestDist = Infinity;
            pts.forEach((p, i) => {
              const dist = Math.abs(p.x - px);
              if (dist < bestDist) {
                bestDist = dist;
                best = i;
              }
            });
            setHover(best);
          }}
        >
          {ticks.map((t, i) => (
            <g key={i}>
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={y(t)}
                y2={y(t)}
                stroke="var(--border)"
                strokeDasharray={i === 0 ? undefined : '3 4'}
                strokeWidth={1}
              />
              <text x={4} y={y(t) + 3.5} fontSize={10} fill="var(--muted)" className="tnum">
                {t >= 100 ? Math.round(t) : t.toFixed(1)}
              </text>
            </g>
          ))}
          <path d={area} fill={color} opacity={0.08} />
          <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {hov && (
            <g>
              <line
                x1={hov.x}
                x2={hov.x}
                y1={PAD_T}
                y2={H - PAD_B}
                stroke="var(--border-strong)"
                strokeWidth={1}
              />
              <circle cx={hov.x} cy={hov.y} r={4} fill={color} stroke="var(--panel)" strokeWidth={2} />
            </g>
          )}
          <text x={PAD_L} y={H - 8} fontSize={10} fill="var(--muted)">
            {formatTime(data[0].timestamp)}
          </text>
          <text x={W - PAD_R} y={H - 8} fontSize={10} fill="var(--muted)" textAnchor="end">
            {formatTime(data[data.length - 1].timestamp)}
          </text>
        </svg>
        {hov && (
          <div
            className="tnum pointer-events-none absolute z-10 rounded-md border border-[var(--border-strong)] bg-[var(--elev)] px-2 py-1 text-xs text-[var(--text)]"
            style={{
              left: `clamp(4px, ${(hov.x / W) * 100}%, calc(100% - 120px))`,
              top: Math.max(0, hov.y - 44),
            }}
          >
            <span className="font-semibold">
              {dataKey === 'lightIntensity' ? Math.round(hov.d[dataKey]) : hov.d[dataKey].toFixed(1)}{unit}
            </span>
            <span className="ml-1.5 text-[var(--muted)]">{formatTime(hov.d.timestamp)}</span>
          </div>
        )}
      </div>
      <div className="tnum mt-1.5 flex items-center justify-between text-[11px] text-[var(--muted)]">
        <span>
          min {dataKey === 'lightIntensity' ? Math.round(Math.min(...values)) : Math.min(...values).toFixed(1)}{unit}
        </span>
        <span>
          max {dataKey === 'lightIntensity' ? Math.round(Math.max(...values)) : Math.max(...values).toFixed(1)}{unit}
        </span>
        <span>{data.length} readings</span>
      </div>
    </div>
  );
}
