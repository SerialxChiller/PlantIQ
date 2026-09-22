import {
  LayoutDashboard, Flower2, Radio, BarChart3, Bell, Settings,
  ChevronsLeft, ChevronsRight, Sprout, X,
} from 'lucide-react';
import { useStore } from '../../context/AppContext';
import { Tooltip } from '../ui/primitives';

const mainNav = [
  { label: 'Dashboard', href: '#/', match: '/', icon: LayoutDashboard },
  { label: 'Plants', href: '#/plants', match: '/plants', icon: Flower2 },
  { label: 'Sensors', href: '#/sensors', match: '/sensors', icon: Radio },
  { label: 'Analytics', href: '#/analytics', match: '/analytics', icon: BarChart3 },
  { label: 'Alerts', href: '#/alerts', match: '/alerts', icon: Bell },
];

const bottomNav = [
  { label: 'Settings', href: '#/settings', match: '/settings', icon: Settings },
];

function isActive(route: string, match: string): boolean {
  if (match === '/') return route === '/' || route === '';
  return route === match || route.startsWith(match + '/');
}

export function Sidebar({
  route,
  mobileOpen,
  onCloseMobile,
}: {
  route: string;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const { sidebarCollapsed, setSidebarCollapsed, activeAlerts, simulationRunning } = useStore();
  const collapsed = sidebarCollapsed;

  const linkCls = (active: boolean, isCollapsed: boolean) =>
    `relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors ${
      isCollapsed ? 'justify-center' : ''
    } ${
      active
        ? 'bg-[var(--elev)] font-semibold text-[var(--text)]'
        : 'text-[var(--text2)] hover:bg-[var(--elev)] hover:text-[var(--text)]'
    }`;

  const renderLink = (item: { label: string; href: string; match: string; icon: typeof Bell }, isCollapsed: boolean) => {
    const active = isActive(route, item.match);
    const showBadge = item.label === 'Alerts' && activeAlerts.length > 0;
    const link = (
      <a
        href={item.href}
        onClick={onCloseMobile}
        aria-current={active ? 'page' : undefined}
        className={linkCls(active, isCollapsed)}
      >
        {active && (
          <span
            className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-[var(--accent)]"
            aria-hidden="true"
          />
        )}
        <item.icon className="h-[18px] w-[18px] shrink-0" />
        {!isCollapsed && <span className="truncate">{item.label}</span>}
        {!isCollapsed && showBadge && (
          <span className="ml-auto rounded-full bg-red-500 px-1.5 py-px text-[11px] font-semibold leading-4 text-white tnum">
            {activeAlerts.length}
          </span>
        )}
        {isCollapsed && showBadge && (
          <span className="absolute right-1 top-1 rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-4 text-white tnum">
            {activeAlerts.length}
          </span>
        )}
      </a>
    );
    if (isCollapsed) {
      return (
        <Tooltip key={item.label} label={item.label}>
          {link}
        </Tooltip>
      );
    }
    return <div key={item.label}>{link}</div>;
  };

  return (
    <>
      {/* Mobile scrim */}
      <div
        className={`fixed inset-0 z-30 bg-black/60 lg:hidden ${mobileOpen ? 'block' : 'hidden'}`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />
      <aside
        className={`fixed bottom-0 left-0 top-0 z-40 flex flex-col border-r border-[var(--border)] bg-[var(--bg2)] transition-all duration-200 ease-out ${
          collapsed ? 'w-[232px] lg:w-[68px]' : 'w-[232px]'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        aria-label="Primary"
      >
        {/* Brand */}
        <div
          className={`flex h-14 items-center gap-2.5 border-b border-[var(--border)] px-3 ${
            collapsed ? 'lg:justify-center lg:px-0' : ''
          }`}
        >
          <a href="#/" onClick={onCloseMobile} className="flex min-w-0 items-center gap-2.5" aria-label="PlantIQ home">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--accent)]">
              <Sprout className="h-[18px] w-[18px] text-black" />
            </span>
            {!collapsed && (
              <span className="min-w-0 lg:block">
                <span className="brand-wordmark block truncate text-[var(--text)]">
                  PlantIQ
                </span>
                <span className="block text-[11px] leading-4 text-[var(--muted)]">IoT monitoring</span>
              </span>
            )}
          </a>
          <button
            onClick={onCloseMobile}
            className="ml-auto rounded-md p-1.5 text-[var(--muted)] hover:bg-[var(--elev)] hover:text-[var(--text)] lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Main navigation">
          <ul className="space-y-0.5">
            {mainNav.map((item) => (
              <li key={item.label}>{renderLink(item, collapsed)}</li>
            ))}
          </ul>
          <div className={`mt-4 border-t border-[var(--border)] pt-3 ${collapsed ? 'lg:mt-3' : ''}`}>
            {!collapsed && (
              <p className="mb-1.5 px-2.5 text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
                System
              </p>
            )}
            <ul className="space-y-0.5">
              {bottomNav.map((item) => (
                <li key={item.label}>{renderLink(item, collapsed)}</li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Status + collapse */}
        <div className="border-t border-[var(--border)] p-2">
          {!collapsed && (
            <div className="mb-2 flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--panel)] px-2.5 py-2">
              <span className="relative flex h-2 w-2">
                <span
                  className={`h-2 w-2 rounded-full ${simulationRunning ? 'bg-[var(--accent)] noor-live-dot' : 'bg-[var(--muted)]'}`}
                />
              </span>
              <span className="text-xs text-[var(--text2)]">
                {simulationRunning ? 'Simulation live' : 'Simulation paused'}
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!collapsed)}
            className="hidden w-full items-center justify-center gap-1.5 rounded-md px-2.5 py-2 text-[13px] text-[var(--muted)] transition-colors hover:bg-[var(--elev)] hover:text-[var(--text)] lg:flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronsLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
