import { useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useStore } from '../context/AppContext';
import { AlertItem } from '../components/alerts/AlertItem';
import { EmptyState, Button, PageHeader, Badge } from '../components/ui/primitives';

type SevFilter = 'all' | 'critical' | 'warning' | 'info';
type StatusFilter = 'active' | 'resolved' | 'all';

export function AlertsPage() {
  const { alerts, activeAlerts, resolveAlert, dismissAlert, clearResolvedAlerts } = useStore();
  const [sev, setSev] = useState<SevFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('active');
  const resolved = alerts.filter((a) => a.resolved);
  const critical = activeAlerts.filter((a) => a.severity === 'critical').length;

  const visible = useMemo(
    () =>
      alerts.filter((a) => {
        if (sev !== 'all' && a.severity !== sev) return false;
        if (status === 'active' && a.resolved) return false;
        if (status === 'resolved' && !a.resolved) return false;
        return true;
      }),
    [alerts, sev, status],
  );

  const sevBtn = (id: SevFilter, label: string) => (
    <button
      key={id}
      onClick={() => setSev(id)}
      aria-pressed={sev === id}
      className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
        sev === id
          ? 'border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--text)]'
          : 'border-[var(--border)] bg-[var(--panel)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]'
      }`}
    >
      {label}
    </button>
  );

  const statusBtn = (id: StatusFilter, label: string) => (
    <button
      key={id}
      onClick={() => setStatus(id)}
      aria-pressed={status === id}
      className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
        status === id
          ? 'border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--text)]'
          : 'border-[var(--border)] bg-[var(--panel)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="Alerts"
        description="Threshold violations and care reminders, generated from simulated readings."
        meta={
          <>
            <Badge tone={activeAlerts.length ? 'warning' : 'success'} dot>
              {activeAlerts.length} active
            </Badge>
            {critical > 0 && <Badge tone="danger">{critical} critical</Badge>}
            <Badge tone="neutral">{resolved.length} resolved</Badge>
          </>
        }
        actions={
          resolved.length > 0 ? (
            <Button variant="secondary" onClick={clearResolvedAlerts}>Clear resolved</Button>
          ) : undefined
        }
      />

      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by severity">
          <span className="mr-1 text-xs text-[var(--muted)]">Severity:</span>
          {sevBtn('all', `All · ${alerts.length}`)}
          {sevBtn('critical', `Critical · ${alerts.filter((a) => a.severity === 'critical').length}`)}
          {sevBtn('warning', `Warning · ${alerts.filter((a) => a.severity === 'warning').length}`)}
          {sevBtn('info', `Info · ${alerts.filter((a) => a.severity === 'info').length}`)}
        </div>
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by status">
          <span className="mr-1 text-xs text-[var(--muted)]">Status:</span>
          {statusBtn('active', `Active · ${activeAlerts.length}`)}
          {statusBtn('resolved', `Resolved · ${resolved.length}`)}
          {statusBtn('all', 'All')}
        </div>
      </div>

      {alerts.length === 0 ? (
        <EmptyState
          icon={<span className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--elev)] text-green-500"><ShieldCheck className="h-4 w-4" /></span>}
          title="All clear — no alerts yet"
          hint="Run the simulation. When a reading leaves its optimal range, a severity-tagged alert appears here."
        />
      ) : visible.length === 0 ? (
        <EmptyState
          title="No alerts match these filters"
          hint="Widen the severity or status filter to see more."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setSev('all');
                setStatus('all');
              }}
            >
              Reset filters
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {visible.map((a) => (
            <div key={a.id} className={a.resolved ? 'opacity-70' : ''}>
              <AlertItem alert={a} onResolve={resolveAlert} onDismiss={dismissAlert} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
