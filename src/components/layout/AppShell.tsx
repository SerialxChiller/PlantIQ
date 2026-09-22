import { useState } from 'react';
import { useStore } from '../../context/AppContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Dashboard } from '../dashboard/Dashboard';
import { PlantsPage } from '../../pages/PlantsPage';
import { PlantDetailPage } from '../../pages/PlantDetailPage';
import { SensorsPage } from '../../pages/SensorsPage';
import { AnalyticsPage } from '../../pages/AnalyticsPage';
import { AlertsPage } from '../../pages/AlertsPage';
import { SettingsPage } from '../../pages/SettingsPage';
import { useHashRoute } from '../../hooks/useSensors';

export function AppShell() {
  const route = useHashRoute();
  const { sidebarCollapsed } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  let page: React.ReactNode;
  let key = route;
  if (route === '/' || route === '') {
    page = <Dashboard />;
    key = '/';
  } else if (route === '/plants') {
    page = <PlantsPage />;
  } else if (route.startsWith('/plants/')) {
    const id = decodeURIComponent(route.slice('/plants/'.length));
    page = <PlantDetailPage plantId={id} />;
    key = `/plants/${id}`;
  } else if (route === '/sensors') {
    page = <SensorsPage />;
  } else if (route === '/analytics') {
    page = <AnalyticsPage />;
  } else if (route === '/alerts') {
    page = <AlertsPage />;
  } else if (route === '/settings') {
    page = <SettingsPage />;
  } else {
    page = <Dashboard />;
    key = '/404';
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Header route={route} onOpenMobile={() => setMobileOpen(true)} />
      <Sidebar route={route} mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div
        className={`pt-14 transition-all duration-200 ${
          sidebarCollapsed ? 'lg:ml-[68px]' : 'lg:ml-[232px]'
        }`}
      >
        <main className="mx-auto w-full max-w-[1200px] px-4 py-5 sm:px-6">
          <div key={key} className="noor-enter">
            {page}
          </div>
        </main>
      </div>
    </div>
  );
}
