import { create } from 'zustand';
import { ProjectFilters } from '@/types';

interface FiltersState {
  filters: ProjectFilters;
  setFilter: <K extends keyof ProjectFilters>(
    key: K,
    value: ProjectFilters[K]
  ) => void;
  setFilters: (filters: Partial<ProjectFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: ProjectFilters = {
  page: 1,
  limit: 20,
  sort_by: 'created_at',
  sort_order: 'desc',
};

export const useFiltersStore = create<FiltersState>((set) => ({
  filters: defaultFilters,

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value, page: 1 },
    })),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters, page: 1 },
    })),

  resetFilters: () => set({ filters: defaultFilters }),
}));
