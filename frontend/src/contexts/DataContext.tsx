import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Project } from '@/types';
import * as storage from '@/lib/supabaseStorage';
import { subscribeToChanges, seedDatabaseIfEmpty, checkSupabaseConnection } from '@/lib/supabaseStorage';

interface DataContextValue {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createProject: (project: Partial<Project>) => Promise<Project | null>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<boolean>;
  archiveProject: (id: string) => Promise<Project | null>;
  restoreProject: (id: string) => Promise<Project | null>;
  getProjects: typeof storage.getProjects;
  getOverviewStats: typeof storage.getOverviewStats;
  getProjectsByModel: typeof storage.getProjectsByModel;
  getProjectsByGroup: typeof storage.getProjectsByGroup;
  getProjectsBySourcer: typeof storage.getProjectsBySourcer;
  getProjectsByStatus: typeof storage.getProjectsByStatus;
  getClientStats: typeof storage.getClientStats;
  getSourcersLackingHours: typeof storage.getSourcersLackingHours;
  getRecentProjects: typeof storage.getRecentProjects;
  exportData: typeof storage.exportData;
  importData: typeof storage.importData;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await storage.getProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load and real-time subscription
  useEffect(() => {
    const init = async () => {
      // Check Supabase connection (will fallback to localStorage if needed)
      await checkSupabaseConnection();

      // Seed database if empty (works for both Supabase and localStorage)
      await seedDatabaseIfEmpty();

      // Load data
      await refresh();
    };

    init();

    // Subscribe to real-time changes (no-op for localStorage)
    const unsubscribe = subscribeToChanges((updatedProjects) => {
      setProjects(updatedProjects);
    });

    return unsubscribe;
  }, [refresh]);

  const createProject = useCallback(async (project: Partial<Project>) => {
    const result = await storage.createProject(project);
    if (result) await refresh();
    return result;
  }, [refresh]);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
    const result = await storage.updateProject(id, updates);
    if (result) await refresh();
    return result;
  }, [refresh]);

  const deleteProject = useCallback(async (id: string) => {
    const result = await storage.deleteProject(id);
    if (result) await refresh();
    return result;
  }, [refresh]);

  const archiveProject = useCallback(async (id: string) => {
    const result = await storage.archiveProject(id);
    if (result) await refresh();
    return result;
  }, [refresh]);

  const restoreProject = useCallback(async (id: string) => {
    const result = await storage.restoreProject(id);
    if (result) await refresh();
    return result;
  }, [refresh]);

  const value: DataContextValue = {
    projects,
    loading,
    error,
    refresh,
    createProject,
    updateProject,
    deleteProject,
    archiveProject,
    restoreProject,
    getProjects: storage.getProjects,
    getOverviewStats: storage.getOverviewStats,
    getProjectsByModel: storage.getProjectsByModel,
    getProjectsByGroup: storage.getProjectsByGroup,
    getProjectsBySourcer: storage.getProjectsBySourcer,
    getProjectsByStatus: storage.getProjectsByStatus,
    getClientStats: storage.getClientStats,
    getSourcersLackingHours: storage.getSourcersLackingHours,
    getRecentProjects: storage.getRecentProjects,
    exportData: storage.exportData,
    importData: storage.importData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
