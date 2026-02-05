import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { OverviewPage } from '@/pages/OverviewPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { ClientsPage } from '@/pages/ClientsPage';
import { LackOfHoursPage } from '@/pages/LackOfHoursPage';
import { DataProvider } from '@/contexts/DataContext';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <DataProvider>
              <Layout />
            </DataProvider>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="lack-of-hours" element={<LackOfHoursPage />} />
          <Route
            path="israel"
            element={
              <ProjectsPage
                title="Israel Group"
                description="Projects for the Israel group"
                defaultGroupType="Israel"
                hideGroupFilter
              />
            }
          />
          <Route
            path="global"
            element={
              <ProjectsPage
                title="Global Group"
                description="Projects for the Global group"
                defaultGroupType="Global"
                hideGroupFilter
              />
            }
          />
          <Route path="clients" element={<ClientsPage />} />
          <Route
            path="archive"
            element={
              <ProjectsPage
                title="Archive"
                description="Completed and archived projects"
                defaultStatus="archived"
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
