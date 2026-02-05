import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { OverviewPage } from '@/pages/OverviewPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { ClientsPage } from '@/pages/ClientsPage';
import { LackOfHoursPage } from '@/pages/LackOfHoursPage';
import { LoginPage } from '@/pages/LoginPage';
import { useAuthStore } from '@/stores/auth';
import { DataProvider } from '@/contexts/DataContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#F5F0EB' }}>
        <div className="text-center">
          <div className="h-12 w-12 rounded-xl mx-auto mb-4 flex items-center justify-center animate-pulse" style={{ background: '#E8860C' }}>
            <span className="text-xl font-bold text-white">S</span>
          </div>
          <p style={{ color: '#6B7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DataProvider>
                <Layout />
              </DataProvider>
            </ProtectedRoute>
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
