import { Menu, Bell, Settings as SettingsIcon, ChevronRight } from 'lucide-react';
import { useStore } from '../../context/AppContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Badge } from '../ui/primitives';

function pageMeta(route: string, plantName?: string): { crumb: string[]; title: string; desc: string } {
  if (route === '/' || route === '')
    return { crumb: ['Overview'], title: 'Dashboard', desc: 'Plant health, live sensors and recent activity.' };
  if (route === '/plants')
    return { crumb: ['Collection'], title: 'Plants', desc: 'Manage your monitored plants.' };
  if (route.startsWith('/plants/'))
    return { crumb: ['Plants', plantName ?? 'Details'], title: plantName ?? 'Plant details', desc: 'Health, readings and care history.' };
  if (route === '/sensors')
    return { crumb: ['Live'], title: 'Sensors', desc: 'Simulated IoT telemetry stream.' };
  if (route === '/analytics')
    return { crumb: ['Insights'], title: 'Analytics', desc: 'Sensor history, trends and summaries.' };
  if (route === '/alerts')
    return { crumb: ['Monitor'], title: 'Alerts', desc: 'Threshold violations and care reminders.' };
  if (route === '/settings')
    return { crumb: ['System'], title: 'Settings', desc: 'Appearance, simulation and data.' };
  return { crumb: ['Overview'], title: 'Dashboard', desc: '' };
}

export function Header({ route, onOpenMobile }: { route: string; onOpenMobile: () => void }) {
  const { activeAlerts, simulationRunning, sidebarCollapsed, plants } = useStore();
  const plantId = route.startsWith('/plants/') ? decodeURIComponent(route.slice('/plants/'.length)) : null;
  const plantName = plantId ? plants.find((p) => p.id === plantId)?.name : undefined;
  const meta = pageMeta(route, plantName);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-30 h-14 border-b border-[var(--border)] bg-[var(--bg2)] transition-all duration-200 ${
        sidebarCollapsed ? 'lg:left-[68px]' : 'lg:left-[232px]'
      }`}
    >
      <div className="flex h-full items-center gap-2 px-3 sm:px-5">
        <button
          onClick={onOpenMobile}
          className="rounded-md p-2 text-[var(--text2)] hover:bg-[var(--elev)] hover:text-[var(--text)] lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <nav className="hidden items-center gap-1 text-[11px] text-[var(--muted)] sm:flex" aria-label="Breadcrumb">
            {meta.crumb.map((c, i) => (
              <span key={c} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                <span className={i === meta.crumb.length - 1 ? 'text-[var(--text2)]' : ''}>{c}</span>
              </span>
            ))}
          </nav>
          <h1 className="truncate text-[15px] font-semibold leading-5 tracking-tight text-[var(--text)]">
            {meta.title}
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <Badge tone={simulationRunning ? 'success' : 'neutral'} dot className="hidden md:inline-flex">
            {simulationRunning ? 'Live · Simulated' : 'Paused · Simulated'}
          </Badge>
          <a
            href="#/alerts"
            className="relative inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--panel)] text-[var(--text2)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text)]"
            aria-label={`Alerts, ${activeAlerts.length} active`}
            title="Alerts"
          >
            <Bell className="h-4 w-4" />
            {activeAlerts.length > 0 && (
              <span className="tnum absolute -right-1 -top-1 rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-4 text-white">
                {activeAlerts.length > 9 ? '9+' : activeAlerts.length}
              </span>
            )}
          </a>
          <ThemeToggle compact />
          <a
            href="#/settings"
            className="hidden h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--panel)] text-[var(--text2)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text)] sm:inline-flex"
            aria-label="Settings"
            title="Settings"
          >
            <SettingsIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
