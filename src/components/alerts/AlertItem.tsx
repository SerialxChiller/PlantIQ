import { AlertTriangle, Info, OctagonAlert, Check } from 'lucide-react';
import type { Alert } from '../../lib/types';
import { timeAgo } from '../../lib/format';
import { navigate } from '../../hooks/useSensors';

const severityMeta = {
  critical: { Icon: OctagonAlert, label: 'Critical', cls: 'border-red-500/25 bg-red-500/10 text-red-500' },
  warning: { Icon: AlertTriangle, label: 'Warning', cls: 'border-amber-500/25 bg-amber-500/10 text-amber-500' },
  info: { Icon: Info, label: 'Info', cls: 'border-blue-500/25 bg-blue-500/10 text-blue-400' },
} as const;

export function AlertItem({
  alert,
  onResolve,
  onDismiss,
}: {
  alert: Alert;
  onResolve: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const meta = severityMeta[alert.severity] ?? severityMeta.info;
  const Icon = meta.Icon;
  return (
    <div className="flex items-start gap-3 rounded-md border border-[var(--border)] bg-[var(--panel)] p-3.5">
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${meta.cls}`}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`rounded border px-1.5 py-px text-[11px] font-semibold uppercase tracking-wide ${meta.cls}`}>
            {meta.label}
          </span>
          <button
            onClick={() => navigate(`#/plants/${alert.plantId}`)}
            className="truncate text-xs font-medium text-[var(--text2)] hover:text-[var(--text)] hover:underline"
            title={`Open ${alert.plantName}`}
          >
            {alert.plantName}
          </button>
          {alert.resolved && (
            <span className="rounded border border-[var(--border)] bg-[var(--elev)] px-1.5 py-px text-[11px] font-medium text-[var(--muted)]">
              Resolved
            </span>
          )}
          <span className="tnum ml-auto shrink-0 text-xs text-[var(--muted)]" title={alert.createdAt}>
            {timeAgo(alert.createdAt)}
          </span>
        </div>
        <p className="mt-1 text-[13px] leading-5 text-[var(--text)]">{alert.message}</p>
        {!alert.resolved && (
          <div className="mt-2 flex gap-1.5">
            <button
              onClick={() => onResolve(alert.id)}
              className="inline-flex items-center gap-1 rounded-md border border-green-500/25 bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500 transition-colors hover:bg-green-500/20"
            >
              <Check className="h-3 w-3" /> Resolve
            </button>
            <button
              onClick={() => onDismiss(alert.id)}
              className="rounded-md border border-[var(--border)] px-2 py-1 text-xs font-medium text-[var(--muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text)]"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
