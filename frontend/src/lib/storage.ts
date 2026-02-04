import { Project, GroupType, ModelType, ProjectStatus } from '@/types';

const STORAGE_KEY = 'sourcing_dashboard_data';

export interface DashboardData {
  projects: Project[];
  lastUpdated: string;
}

const initialData: DashboardData = {
  projects: [
    { id: '1', company: 'LakeFS', sourcer: 'Eszter', group_type: 'Global', model_type: 'Hourly', roles: null, roles_count: 2, hours_or_hires: 80, start_date: '2025-09-01', end_date: null, time_to_hire: null, notes: null, status: 'active', created_at: '2026-02-04T17:18:20.992Z', updated_at: '2026-02-04T17:18:20.992Z' },
    { id: '2', company: 'Nexite', sourcer: 'Alexey', group_type: 'Global', model_type: 'Hourly', roles: null, roles_count: 1, hours_or_hires: 40, start_date: '2025-06-01', end_date: null, time_to_hire: null, notes: null, status: 'active', created_at: '2026-02-04T17:18:20.992Z', updated_at: '2026-02-04T17:18:20.992Z' },
    { id: '3', company: 'Draftt', sourcer: 'Shiri', group_type: 'Israel', model_type: 'Success', roles: null, roles_count: 1, hours_or_hires: null, start_date: '2025-03-06', end_date: null, time_to_hire: null, notes: null, status: 'active', created_at: '2026-02-04T17:18:20.992Z', updated_at: '2026-02-04T17:18:20.992Z' },
    { id: '4', company: 'Lemonade', sourcer: 'Chen', group_type: 'Israel', model_type: 'Hourly', roles: null, roles_count: 1, hours_or_hires: 160, start_date: '2025-11-13', end_date: null, time_to_hire: null, notes: null, status: 'active', created_at: '2026-02-04T17:18:20.992Z', updated_at: '2026-02-04T17:18:20.992Z' },
    { id: '5', company: 'Lemonade', sourcer: 'Shiri', group_type: 'Israel', model_type: 'Hourly', roles: null, roles_count: 1, hours_or_hires: 40, start_date: '2025-02-07', end_date: null, time_to_hire: null, notes: null, status: 'active', created_at: '2026-02-04T17:18:20.992Z', updated_at: '2026-02-04T17:18:20.992Z' },
    { id: '6', company: 'ecton.io', sourcer: 'Shiri', group_type: 'Israel', model_type: 'Hourly', roles: null, roles_count: 2, hours_or_hires: 30, start_date: '2025-12-22', end_date: null, time_to_hire: null, notes: null, status: 'active', created_at: '2026-02-04T17:18:20.992Z', updated_at: '2026-02-04T17:18:20.992Z' },
    { id: '7', company: 'ecton.io', sourcer: 'Dana', group_type: 'Israel', model_type: 'Hourly', roles: null, roles_count: 2, hours_or_hires: 60, start_date: '2025-07-13', end_date: null, time_to_hire: null, notes: null, status: 'active', created_at: '2026-02-04T17:18:20.992Z', updated_at: '2026-02-04T17:18:20.992Z' },
    { id: '8', company: 'Apono', sourcer: 'Katinka', group_type: 'Global', model_type: 'Success', roles: null, roles_count: 4, hours_or_hires: null, start_date: '2026-02-02', end_date: null, time_to_hire: null, notes: null, status: 'active', created_at: '2026-02-04T17:18:20.992Z', updated_at: '2026-02-04T17:18:20.992Z' },
    { id: '9', company: 'Ubeya', sourcer: 'Katinka', group_type: 'Global', model_type: 'Success', roles: null, roles_count: 1, hours_or_hires: null, start_date: '2025-12-01', end_date: null, time_to_hire: null, notes: null, status: 'active', created_at: '2026-02-04T17:18:20.992Z', updated_at: '2026-02-04T17:18:20.992Z' },
    { id: '10', company: 'Flare', sourcer: 'Alexey', group_type: 'Global', model_type: 'Hourly', roles: null, roles_count: 2, hours_or_hires: 60, start_date: '2025-11-20', end_date: null, time_to_hire: null, notes: null, status: 'active', created_at: '2026-02-04T17:18:20.992Z', updated_at: '2026-02-04T17:18:20.992Z' },
    { id: '11', company: 'Flare', sourcer: 'Dana', group_type: 'Israel', model_type: 'Success Executive', roles: null, roles_count: 1, hours_or_hires: null, start_date: '2026-02-05', end_date: null, time_to_hire: null, notes: null, status: 'active', created_at: '2026-02-04T17:18:20.992Z', updated_at: '2026-02-04T17:18:20.992Z' },
    { id: '12', company: 'Carbyne', sourcer: 'Andrea', group_type: 'Global', model_type: 'Success', roles: null, roles_count: 3, hours_or_hires: null, start_date: '2025-11-20', end_date: null, time_to_hire: null, notes: null, status: 'active', created_at: '2026-02-04T17:18:20.992Z', updated_at: '2026-02-04T17:18:20.992Z' },
    { id: '13', company: 'Attribute', sourcer: 'Dana', group_type: 'Israel', model_type: 'Success', roles: null, roles_count: 1, hours_or_hires: null, start_date: '2025-10-21', end_date: null, time_to_hire: null, notes: null, status: 'active', created_at: '2026-02-04T17:18:20.992Z', updated_at: '2026-02-04T17:18:20.992Z' },
    { id: '14', company: 'Tailor Brands', sourcer: 'Chen', group_type: 'Israel', model_type: 'Hourly', roles: null, roles_count: 1, hours_or_hires: 40, start_date: '2025-11-27', end_date: null, time_to_hire: null, notes: null, status: 'active', created_at: '2026-02-04T17:18:20.992Z', updated_at: '2026-02-04T17:18:20.992Z' },
    { id: '15', company: 'Ledge', sourcer: 'Dana', group_type: 'Israel', model_type: 'Success', roles: null, roles_count: 2, hours_or_hires: 1, start_date: '2025-12-15', end_date: null, time_to_hire: 'Senior produt designer - 1 month', notes: null, status: 'active', created_at: '2026-02-04T17:18:20.992Z', updated_at: '2026-02-04T17:18:20.992Z' },
    { id: '16', company: 'elixrbio', sourcer: 'Dana', group_type: 'Israel', model_type: 'Success', roles: null, roles_count: 1, hours_or_hires: null, start_date: '2026-02-01', end_date: null, time_to_hire: null, notes: null, status: 'active', created_at: '2026-02-04T17:18:20.992Z', updated_at: '2026-02-04T17:18:20.992Z' },
    { id: '17', company: 'Vinst', sourcer: 'Andrea', group_type: 'Global', model_type: 'Hourly', roles: null, roles_count: 1, hours_or_hires: 40, start_date: '2026-01-20', end_date: null, time_to_hire: null, notes: null, status: 'active', created_at: '2026-02-04T17:18:20.992Z', updated_at: '2026-02-04T17:18:20.992Z' },
    { id: '18', company: 'Autofleet', sourcer: 'Alexey', group_type: 'Global', model_type: 'Hourly', roles: null, roles_count: 3, hours_or_hires: 80, start_date: '2026-02-05', end_date: null, time_to_hire: null, notes: null, status: 'active', created_at: '2026-02-04T17:18:20.992Z', updated_at: '2026-02-04T17:18:20.992Z' },
    { id: '19', company: 'Evalon', sourcer: 'Dana', group_type: 'Israel', model_type: 'Success', roles: null, roles_count: 2, hours_or_hires: 1, start_date: '2025-11-16', end_date: null, time_to_hire: 'Staff backend engineer - 3 weeks', notes: null, status: 'active', created_at: '2026-02-04T17:18:20.992Z', updated_at: '2026-02-04T17:18:20.992Z' },
    { id: '20', company: 'Panjaya', sourcer: 'Eszter', group_type: 'Global', model_type: 'Success', roles: null, roles_count: 1, hours_or_hires: null, start_date: '2026-01-28', end_date: null, time_to_hire: null, notes: null, status: 'active', created_at: '2026-02-04T17:18:20.992Z', updated_at: '2026-02-04T17:18:20.992Z' },
    { id: '21', company: 'Traild', sourcer: 'Eszter', group_type: 'Global', model_type: 'Hourly', roles: null, roles_count: 1, hours_or_hires: 40, start_date: '2026-01-28', end_date: null, time_to_hire: null, notes: null, status: 'active', created_at: '2026-02-04T17:18:20.992Z', updated_at: '2026-02-04T17:18:20.992Z' },
    { id: '22', company: 'Clarity', sourcer: 'Dana', group_type: 'Israel', model_type: 'Success', roles: null, roles_count: 1, hours_or_hires: null, start_date: '2026-01-14', end_date: null, time_to_hire: null, notes: null, status: 'active', created_at: '2026-02-04T17:18:20.992Z', updated_at: '2026-02-04T17:18:20.992Z' },
    { id: '23', company: 'vero.security', sourcer: 'Dana', group_type: 'Israel', model_type: 'Success', roles: null, roles_count: 3, hours_or_hires: null, start_date: '2026-02-05', end_date: null, time_to_hire: null, notes: null, status: 'active', created_at: '2026-02-04T17:18:20.992Z', updated_at: '2026-02-04T17:18:20.992Z' },
  ] as Project[],
  lastUpdated: '2026-02-04T17:18:20.992Z',
};

export function getData(): DashboardData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) { try { return JSON.parse(stored); } catch { return initialData; } }
  saveData(initialData);
  return initialData;
}

export function saveData(data: DashboardData): void {
  data.lastUpdated = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function exportData(): string { return JSON.stringify(getData(), null, 2); }

export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as DashboardData;
    if (!data.projects || !Array.isArray(data.projects)) throw new Error('Invalid');
    saveData(data);
    return true;
  } catch { return false; }
}

export function getProjects(filters?: { search?: string; sourcer?: string; company?: string; group_type?: string; model_type?: string; status?: string }): Project[] {
  let projects = [...getData().projects];
  if (filters) {
    if (filters.search) { const s = filters.search.toLowerCase(); projects = projects.filter(p => p.company.toLowerCase().includes(s) || p.sourcer.toLowerCase().includes(s) || p.roles?.toLowerCase().includes(s)); }
    if (filters.sourcer) projects = projects.filter(p => p.sourcer === filters.sourcer);
    if (filters.company) projects = projects.filter(p => p.company === filters.company);
    if (filters.group_type) projects = projects.filter(p => p.group_type === filters.group_type);
    if (filters.model_type) projects = projects.filter(p => p.model_type === filters.model_type);
    if (filters.status) projects = projects.filter(p => p.status === filters.status);
  }
  return projects.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function createProject(project: Partial<Project>): Project {
  const data = getData();
  const newProject: Project = {
    id: crypto.randomUUID(), company: project.company || '', sourcer: project.sourcer || '',
    group_type: (project.group_type || 'Israel') as GroupType, model_type: (project.model_type || 'Hourly') as ModelType,
    roles: project.roles || null, roles_count: project.roles_count || 1, hours_or_hires: project.hours_or_hires || null,
    start_date: project.start_date || null, end_date: project.end_date || null, time_to_hire: project.time_to_hire || null,
    notes: project.notes || null, status: (project.status || 'active') as ProjectStatus,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  };
  data.projects.push(newProject);
  saveData(data);
  return newProject;
}

export function updateProject(id: string, updates: Partial<Project>): Project | null {
  const data = getData();
  const i = data.projects.findIndex(p => p.id === id);
  if (i === -1) return null;
  data.projects[i] = { ...data.projects[i], ...updates, updated_at: new Date().toISOString() };
  saveData(data);
  return data.projects[i];
}

export function deleteProject(id: string): boolean {
  const data = getData();
  const i = data.projects.findIndex(p => p.id === id);
  if (i === -1) return false;
  data.projects.splice(i, 1);
  saveData(data);
  return true;
}

export function archiveProject(id: string): Project | null {
  return updateProject(id, { status: 'archived' as ProjectStatus });
}

export function getOverviewStats() {
  const projects = getProjects();
  return {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    totalCompanies: new Set(projects.map(p => p.company)).size,
    totalSourcers: new Set(projects.map(p => p.sourcer)).size,
    totalRoles: projects.reduce((s, p) => s + (p.roles_count || 0), 0),
  };
}

export function getProjectsByModel() {
  const m: Record<string, number> = {};
  getProjects().forEach(p => { m[p.model_type] = (m[p.model_type] || 0) + 1; });
  return Object.entries(m).map(([model, count]) => ({ model, count }));
}

export function getProjectsByGroup() {
  const g: Record<string, number> = {};
  getProjects().forEach(p => { g[p.group_type] = (g[p.group_type] || 0) + 1; });
  return Object.entries(g).map(([group, count]) => ({ group, count }));
}

export function getProjectsBySourcer() {
  const s: Record<string, { projects: number; totalRoles: number }> = {};
  getProjects().forEach(p => {
    if (!s[p.sourcer]) s[p.sourcer] = { projects: 0, totalRoles: 0 };
    s[p.sourcer].projects += 1;
    s[p.sourcer].totalRoles += p.roles_count || 0;
  });
  return Object.entries(s).map(([sourcer, d]) => ({ sourcer, ...d }));
}

export function getProjectsByStatus() {
  const s: Record<string, number> = {};
  getProjects().forEach(p => { s[p.status] = (s[p.status] || 0) + 1; });
  return Object.entries(s).map(([status, count]) => ({ status, count }));
}

export function getClientStats() {
  const c: Record<string, { projectCount: number; totalRoles: number; totalHours: number; totalHires: number }> = {};
  getProjects().forEach(p => {
    if (!c[p.company]) c[p.company] = { projectCount: 0, totalRoles: 0, totalHours: 0, totalHires: 0 };
    c[p.company].projectCount += 1;
    c[p.company].totalRoles += p.roles_count || 0;
    const h = p.hours_or_hires || 0;
    if (h > 10) c[p.company].totalHours += h; else c[p.company].totalHires += h;
  });
  return Object.entries(c).map(([company, d]) => ({ company, ...d }));
}

export function getSourcersLackingHours(minHours: number = 200) {
  const projects = getProjects().filter(p => p.status === 'active');
  const s: Record<string, number> = {};
  projects.forEach(p => {
    if (!s[p.sourcer]) s[p.sourcer] = 0;
    s[p.sourcer] += p.model_type === 'Hourly' ? (p.hours_or_hires || 0) : (p.roles_count || 0) * 30;
  });
  return Object.entries(s).filter(([, h]) => h < minHours).map(([sourcer, totalHours]) => ({ sourcer, totalHours, missingHours: minHours - totalHours })).sort((a, b) => a.totalHours - b.totalHours);
}

export function getRecentProjects(limit: number = 5) { return getProjects().slice(0, limit); }
