import api from './client';
import { OverviewStats, ChartData, ClientStats, Project } from '@/types';

export const analyticsApi = {
  getOverviewStats: async (): Promise<OverviewStats> => {
    const response = await api.get<OverviewStats>('/analytics/overview');
    return response.data;
  },

  getProjectsByModel: async (): Promise<ChartData[]> => {
    const response = await api.get<ChartData[]>('/analytics/by-model');
    return response.data;
  },

  getProjectsByGroup: async (): Promise<ChartData[]> => {
    const response = await api.get<ChartData[]>('/analytics/by-group');
    return response.data;
  },

  getProjectsBySourcer: async (): Promise<ChartData[]> => {
    const response = await api.get<ChartData[]>('/analytics/by-sourcer');
    return response.data;
  },

  getProjectsByStatus: async (): Promise<ChartData[]> => {
    const response = await api.get<ChartData[]>('/analytics/by-status');
    return response.data;
  },

  getRecentProjects: async (limit?: number): Promise<Project[]> => {
    const response = await api.get<Project[]>('/analytics/recent', {
      params: { limit },
    });
    return response.data;
  },

  getClientStats: async (): Promise<ClientStats[]> => {
    const response = await api.get<ClientStats[]>('/analytics/clients');
    return response.data;
  },

  getSourcersLackingHours: async (minHours: number = 200): Promise<Array<{
    sourcer: string;
    totalHours: number;
    missingHours: number;
  }>> => {
    const response = await api.get('/analytics/lacking-hours', {
      params: { minHours },
    });
    return response.data;
  },

  exportCSV: async (filters?: Record<string, string>): Promise<Blob> => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/analytics/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
