import api from './client';
import {
  Project,
  ProjectFilters,
  PaginatedResponse,
  FilterOptions,
} from '@/types';

export const projectsApi = {
  getAll: async (
    filters?: ProjectFilters
  ): Promise<PaginatedResponse<Project>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get<PaginatedResponse<Project>>(
      `/projects?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<Project> => {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  create: async (
    data: Omit<Project, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Project> => {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Project>): Promise<Project> => {
    const response = await api.put<Project>(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>(`/projects/${id}`);
    return response.data;
  },

  archive: async (id: string): Promise<Project> => {
    const response = await api.post<Project>(`/projects/${id}/archive`);
    return response.data;
  },

  bulkAction: async (
    ids: string[],
    action: 'archive' | 'delete' | 'complete' | 'activate'
  ): Promise<{ success: boolean; affected: number }> => {
    const response = await api.post<{ success: boolean; affected: number }>(
      '/projects/bulk',
      { ids, action }
    );
    return response.data;
  },

  getFilterOptions: async (): Promise<FilterOptions> => {
    const response = await api.get<FilterOptions>('/projects/filter-options');
    return response.data;
  },
};
