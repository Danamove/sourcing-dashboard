export type UserRole = 'admin' | 'manager' | 'user';
export type GroupType = 'Israel' | 'Global';
export type ModelType = 'Hourly' | 'Success' | 'Success Executive';
export type ProjectStatus = 'active' | 'completed' | 'archived';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
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
  start_date: Date | null;
  end_date: Date | null;
  time_to_hire: string | null;
  notes: string | null;
  status: ProjectStatus;
  created_at: Date;
  updated_at: Date;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'ARCHIVE';
  entity_type: 'project' | 'user';
  entity_id: string;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  created_at: Date;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
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
}
