import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { LoginPage } from '@/pages/LoginPage';
import { OverviewPage } from '@/pages/OverviewPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { ClientsPage } from '@/pages/ClientsPage';
import { LackOfHoursPage } from '@/pages/LackOfHoursPage';
import { useAuthStore } from '@/stores/auth';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<OverviewPage />} />

        <Route
          path="analytics"
          element={<AnalyticsPage />}
        />

        <Route
          path="lack-of-hours"
          element={<LackOfHoursPage />}
        />

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
  );
}

export default App;
