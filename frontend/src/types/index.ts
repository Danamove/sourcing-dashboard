export type UserRole = 'admin' | 'manager' | 'user';
export type GroupType = 'Israel' | 'Global';
export type ModelType = 'Hourly' | 'Success' | 'Success Executive';
export type ProjectStatus = 'active' | 'completed' | 'archived';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Project {
  id: string;
  company: string;
  sourcer: string;
  group_type: GroupType;
  model_type: ModelType;
  roles: string | null;
  roles_count: number;
  hours_or_hires: number | null;
  start_date: string | null;
  end_date: string | null;
  time_to_hire: string | null;
  notes: string | null;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface ProjectFilters {
  sourcer?: string;
  model_type?: ModelType;
  company?: string;
  group_type?: GroupType;
  status?: ProjectStatus;
  roles_min?: number;
  roles_max?: number;
  hires_min?: number;
  hires_max?: number;
  start_date_from?: string;
  start_date_to?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterOptions {
  sourcers: string[];
  companies: string[];
  model_types: ModelType[];
  group_types: GroupType[];
  statuses: ProjectStatus[];
}

export interface OverviewStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalRoles: number;
  totalHires: number;
  totalCompanies: number;
  totalSourcers: number;
}

export interface ChartData {
  model?: string;
  group?: string;
  sourcer?: string;
  status?: string;
  count: number;
  projects?: number;
  totalRoles?: number;
}

export interface ClientStats {
  company: string;
  projectCount: number;
  totalRoles: number;
  totalHires: number;
  totalHours: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
