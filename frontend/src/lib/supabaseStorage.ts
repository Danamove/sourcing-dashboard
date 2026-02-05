import { supabase, SupabaseProject } from './supabase';
import { Project, GroupType, ModelType, ProjectStatus } from '@/types';

const TABLE_NAME = 'sourcing_projects';
const LOCAL_STORAGE_KEY = 'sourcing_dashboard_data';

// Flag to track if we should use localStorage fallback
let useLocalStorage = false;

// Initial seed data - the 23 projects
const SEED_DATA = [
  { company: 'LakeFS', sourcer: 'Eszter', group_type: 'Global', model_type: 'Hourly', roles: null, roles_count: 2, hours_or_hires: 80, start_date: '2025-09-01', status: 'active' },
  { company: 'Nexite', sourcer: 'Alexey', group_type: 'Global', model_type: 'Hourly', roles: null, roles_count: 1, hours_or_hires: 40, start_date: '2025-06-01', status: 'active' },
  { company: 'Draftt', sourcer: 'Shiri', group_type: 'Israel', model_type: 'Success', roles: null, roles_count: 1, hours_or_hires: null, start_date: '2025-03-06', status: 'active' },
  { company: 'Lemonade', sourcer: 'Chen', group_type: 'Israel', model_type: 'Hourly', roles: null, roles_count: 1, hours_or_hires: 160, start_date: '2025-11-13', status: 'active' },
  { company: 'Lemonade', sourcer: 'Shiri', group_type: 'Israel', model_type: 'Hourly', roles: null, roles_count: 1, hours_or_hires: 40, start_date: '2025-02-07', status: 'active' },
  { company: 'ecton.io', sourcer: 'Shiri', group_type: 'Israel', model_type: 'Hourly', roles: null, roles_count: 2, hours_or_hires: 30, start_date: '2025-12-22', status: 'active' },
  { company: 'ecton.io', sourcer: 'Dana', group_type: 'Israel', model_type: 'Hourly', roles: null, roles_count: 2, hours_or_hires: 60, start_date: '2025-07-13', status: 'active' },
  { company: 'Apono', sourcer: 'Katinka', group_type: 'Global', model_type: 'Success', roles: null, roles_count: 4, hours_or_hires: null, start_date: '2026-02-02', status: 'active' },
  { company: 'Ubeya', sourcer: 'Katinka', group_type: 'Global', model_type: 'Success', roles: null, roles_count: 1, hours_or_hires: null, start_date: '2025-12-01', status: 'active' },
  { company: 'Flare', sourcer: 'Alexey', group_type: 'Global', model_type: 'Hourly', roles: null, roles_count: 2, hours_or_hires: 60, start_date: '2025-11-20', status: 'active' },
  { company: 'Flare', sourcer: 'Dana', group_type: 'Israel', model_type: 'Success Executive', roles: null, roles_count: 1, hours_or_hires: null, start_date: '2026-02-05', status: 'active' },
  { company: 'Carbyne', sourcer: 'Andrea', group_type: 'Global', model_type: 'Success', roles: null, roles_count: 3, hours_or_hires: null, start_date: '2025-11-20', status: 'active' },
  { company: 'Attribute', sourcer: 'Dana', group_type: 'Israel', model_type: 'Success', roles: null, roles_count: 1, hours_or_hires: null, start_date: '2025-10-21', status: 'active' },
  { company: 'Tailor Brands', sourcer: 'Chen', group_type: 'Israel', model_type: 'Hourly', roles: null, roles_count: 1, hours_or_hires: 40, start_date: '2025-11-27', status: 'active' },
  { company: 'Ledge', sourcer: 'Dana', group_type: 'Israel', model_type: 'Success', roles: null, roles_count: 2, hours_or_hires: 1, start_date: '2025-12-15', status: 'active' },
  { company: 'elixrbio', sourcer: 'Dana', group_type: 'Israel', model_type: 'Success', roles: null, roles_count: 1, hours_or_hires: null, start_date: '2026-02-01', status: 'active' },
  { company: 'Vinst', sourcer: 'Andrea', group_type: 'Global', model_type: 'Hourly', roles: null, roles_count: 1, hours_or_hires: 40, start_date: '2026-01-20', status: 'active' },
  { company: 'Autofleet', sourcer: 'Alexey', group_type: 'Global', model_type: 'Hourly', roles: null, roles_count: 3, hours_or_hires: 80, start_date: '2026-02-05', status: 'active' },
  { company: 'Evalon', sourcer: 'Dana', group_type: 'Israel', model_type: 'Success', roles: null, roles_count: 2, hours_or_hires: 1, start_date: '2025-11-16', status: 'active' },
  { company: 'Panjaya', sourcer: 'Eszter', group_type: 'Global', model_type: 'Success', roles: null, roles_count: 1, hours_or_hires: null, start_date: '2026-01-28', status: 'active' },
  { company: 'Traild', sourcer: 'Eszter', group_type: 'Global', model_type: 'Hourly', roles: null, roles_count: 1, hours_or_hires: 40, start_date: '2026-01-28', status: 'active' },
  { company: 'Clarity', sourcer: 'Dana', group_type: 'Israel', model_type: 'Success', roles: null, roles_count: 1, hours_or_hires: null, start_date: '2026-01-14', status: 'active' },
  { company: 'vero.security', sourcer: 'Dana', group_type: 'Israel', model_type: 'Success', roles: null, roles_count: 3, hours_or_hires: null, start_date: '2026-02-05', status: 'active' },
];

// ============ LOCAL STORAGE HELPERS ============

function getLocalData(): Project[] {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      return data.projects || [];
    } catch {
      return [];
    }
  }
  // Initialize with seed data
  const projects = SEED_DATA.map((p, i) => ({
    ...p,
    id: String(i + 1),
    end_date: null,
    time_to_hire: null,
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })) as Project[];
  saveLocalData(projects);
  return projects;
}

function saveLocalData(projects: Project[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
    projects,
    lastUpdated: new Date().toISOString(),
  }));
}

// ============ SUPABASE HELPERS ============

function toProject(sp: SupabaseProject): Project {
  return {
    id: sp.id,
    company: sp.company,
    sourcer: sp.sourcer,
    group_type: sp.group_type as GroupType,
    model_type: sp.model_type as ModelType,
    roles: sp.roles,
    roles_count: sp.roles_count,
    hours_or_hires: sp.hours_or_hires,
    start_date: sp.start_date,
    end_date: null,
    time_to_hire: null,
    notes: null,
    status: sp.status as ProjectStatus,
    created_at: sp.created_at,
    updated_at: sp.updated_at,
  };
}

// Check if Supabase is accessible
export async function checkSupabaseConnection(): Promise<{ connected: boolean; error?: string }> {
  const { error } = await supabase.from(TABLE_NAME).select('id').limit(1);

  if (error) {
    console.warn('Supabase not accessible, using localStorage fallback:', error.message);
    useLocalStorage = true;
    return { connected: false, error: error.message };
  }

  useLocalStorage = false;
  return { connected: true };
}

// Seed the database with initial data if empty
export async function seedDatabaseIfEmpty(): Promise<boolean> {
  if (useLocalStorage) {
    // localStorage is auto-seeded in getLocalData
    return true;
  }

  const { count, error: countError } = await supabase
    .from(TABLE_NAME)
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.warn('Cannot check database, using localStorage:', countError.message);
    useLocalStorage = true;
    return true;
  }

  if (count === 0) {
    console.log('Database is empty, seeding with initial data...');
    const { error: insertError } = await supabase
      .from(TABLE_NAME)
      .insert(SEED_DATA);

    if (insertError) {
      console.warn('Cannot seed database, using localStorage:', insertError.message);
      useLocalStorage = true;
      return true;
    }
    console.log('Database seeded successfully with 23 projects');
    return true;
  }

  console.log('Database already has', count, 'projects');
  return false;
}

// ============ CRUD OPERATIONS ============

export async function getProjects(filters?: {
  search?: string;
  sourcer?: string;
  company?: string;
  group_type?: string;
  model_type?: string;
  status?: string;
}): Promise<Project[]> {
  if (useLocalStorage) {
    let projects = getLocalData();
    if (filters) {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        projects = projects.filter(p =>
          p.company.toLowerCase().includes(s) ||
          p.sourcer.toLowerCase().includes(s) ||
          p.roles?.toLowerCase().includes(s)
        );
      }
      if (filters.sourcer) projects = projects.filter(p => p.sourcer === filters.sourcer);
      if (filters.company) projects = projects.filter(p => p.company === filters.company);
      if (filters.group_type) projects = projects.filter(p => p.group_type === filters.group_type);
      if (filters.model_type) projects = projects.filter(p => p.model_type === filters.model_type);
      if (filters.status) projects = projects.filter(p => p.status === filters.status);
    }
    return projects.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  let query = supabase.from(TABLE_NAME).select('*');

  if (filters) {
    if (filters.sourcer) query = query.eq('sourcer', filters.sourcer);
    if (filters.company) query = query.eq('company', filters.company);
    if (filters.group_type) query = query.eq('group_type', filters.group_type);
    if (filters.model_type) query = query.eq('model_type', filters.model_type);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.search) {
      query = query.or(`company.ilike.%${filters.search}%,sourcer.ilike.%${filters.search}%,roles.ilike.%${filters.search}%`);
    }
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return (data || []).map(toProject);
}

export async function createProject(project: Partial<Project>): Promise<Project | null> {
  const newProjectData = {
    company: project.company || '',
    sourcer: project.sourcer || '',
    group_type: project.group_type || 'Israel',
    model_type: project.model_type || 'Hourly',
    roles: project.roles || null,
    roles_count: project.roles_count || 1,
    hours_or_hires: project.hours_or_hires || null,
    start_date: project.start_date || new Date().toISOString().split('T')[0],
    status: project.status || 'active',
  };

  if (useLocalStorage) {
    const projects = getLocalData();
    const newProject: Project = {
      ...newProjectData,
      id: crypto.randomUUID(),
      end_date: null,
      time_to_hire: null,
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Project;
    projects.push(newProject);
    saveLocalData(projects);
    return newProject;
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(newProjectData)
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return null;
  }

  return toProject(data);
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  if (useLocalStorage) {
    const projects = getLocalData();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return null;
    projects[index] = { ...projects[index], ...updates, updated_at: new Date().toISOString() };
    saveLocalData(projects);
    return projects[index];
  }

  const updateData: Record<string, unknown> = {};

  if (updates.company !== undefined) updateData.company = updates.company;
  if (updates.sourcer !== undefined) updateData.sourcer = updates.sourcer;
  if (updates.group_type !== undefined) updateData.group_type = updates.group_type;
  if (updates.model_type !== undefined) updateData.model_type = updates.model_type;
  if (updates.roles !== undefined) updateData.roles = updates.roles;
  if (updates.roles_count !== undefined) updateData.roles_count = updates.roles_count;
  if (updates.hours_or_hires !== undefined) updateData.hours_or_hires = updates.hours_or_hires;
  if (updates.start_date !== undefined) updateData.start_date = updates.start_date;
  if (updates.status !== undefined) updateData.status = updates.status;

  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    return null;
  }

  return toProject(data);
}

export async function deleteProject(id: string): Promise<boolean> {
  if (useLocalStorage) {
    const projects = getLocalData();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return false;
    projects.splice(index, 1);
    saveLocalData(projects);
    return true;
  }

  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }

  return true;
}

export async function archiveProject(id: string): Promise<Project | null> {
  return updateProject(id, { status: 'archived' as ProjectStatus });
}

export async function restoreProject(id: string): Promise<Project | null> {
  return updateProject(id, { status: 'active' as ProjectStatus });
}

// ============ ANALYTICS ============

export async function getOverviewStats() {
  const projects = await getProjects();
  return {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    totalCompanies: new Set(projects.map(p => p.company)).size,
    totalSourcers: new Set(projects.map(p => p.sourcer)).size,
    totalRoles: projects.reduce((s, p) => s + (p.roles_count || 0), 0),
  };
}

export async function getProjectsByModel() {
  const projects = await getProjects();
  const m: Record<string, number> = {};
  projects.forEach(p => { m[p.model_type] = (m[p.model_type] || 0) + 1; });
  return Object.entries(m).map(([model, count]) => ({ model, count }));
}

export async function getProjectsByGroup() {
  const projects = await getProjects();
  const g: Record<string, number> = {};
  projects.forEach(p => { g[p.group_type] = (g[p.group_type] || 0) + 1; });
  return Object.entries(g).map(([group, count]) => ({ group, count }));
}

export async function getProjectsBySourcer() {
  const projects = await getProjects();
  const s: Record<string, { projects: number; totalRoles: number }> = {};
  projects.forEach(p => {
    if (!s[p.sourcer]) s[p.sourcer] = { projects: 0, totalRoles: 0 };
    s[p.sourcer].projects += 1;
    s[p.sourcer].totalRoles += p.roles_count || 0;
  });
  return Object.entries(s).map(([sourcer, d]) => ({ sourcer, ...d }));
}

export async function getProjectsByStatus() {
  const projects = await getProjects();
  const s: Record<string, number> = {};
  projects.forEach(p => { s[p.status] = (s[p.status] || 0) + 1; });
  return Object.entries(s).map(([status, count]) => ({ status, count }));
}

export async function getClientStats() {
  const projects = await getProjects();
  const c: Record<string, { projectCount: number; totalRoles: number; totalHours: number; totalHires: number }> = {};
  projects.forEach(p => {
    if (!c[p.company]) c[p.company] = { projectCount: 0, totalRoles: 0, totalHours: 0, totalHires: 0 };
    c[p.company].projectCount += 1;
    c[p.company].totalRoles += p.roles_count || 0;
    const h = p.hours_or_hires || 0;
    if (h > 10) c[p.company].totalHours += h; else c[p.company].totalHires += h;
  });
  return Object.entries(c).map(([company, d]) => ({ company, ...d }));
}

export async function getSourcersLackingHours(minHours: number = 200) {
  const projects = await getProjects({ status: 'active' });
  const s: Record<string, number> = {};
  projects.forEach(p => {
    if (!s[p.sourcer]) s[p.sourcer] = 0;
    s[p.sourcer] += p.model_type === 'Hourly' ? (p.hours_or_hires || 0) : (p.roles_count || 0) * 30;
  });
  return Object.entries(s)
    .filter(([, h]) => h < minHours)
    .map(([sourcer, totalHours]) => ({ sourcer, totalHours, missingHours: minHours - totalHours }))
    .sort((a, b) => a.totalHours - b.totalHours);
}

export async function getRecentProjects(limit: number = 5): Promise<Project[]> {
  if (useLocalStorage) {
    return getLocalData().slice(0, limit);
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent projects:', error);
    return [];
  }

  return (data || []).map(toProject);
}

// ============ IMPORT/EXPORT ============

export async function exportData(): Promise<string> {
  const projects = await getProjects();
  return JSON.stringify({ projects, lastUpdated: new Date().toISOString() }, null, 2);
}

export async function importData(jsonString: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonString);
    if (!data.projects || !Array.isArray(data.projects)) {
      throw new Error('Invalid data format');
    }

    if (useLocalStorage) {
      saveLocalData(data.projects);
      return true;
    }

    // Clear existing data and insert new
    const { error: deleteError } = await supabase.from(TABLE_NAME).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (deleteError) {
      console.error('Error clearing data:', deleteError);
      return false;
    }

    const projectsToInsert = data.projects.map((p: Project) => ({
      company: p.company,
      sourcer: p.sourcer,
      group_type: p.group_type,
      model_type: p.model_type,
      roles: p.roles,
      roles_count: p.roles_count,
      hours_or_hires: p.hours_or_hires,
      start_date: p.start_date,
      status: p.status,
    }));

    const { error: insertError } = await supabase.from(TABLE_NAME).insert(projectsToInsert);
    if (insertError) {
      console.error('Error importing data:', insertError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error parsing import data:', error);
    return false;
  }
}

// ============ REAL-TIME ============

export function subscribeToChanges(callback: (projects: Project[]) => void) {
  if (useLocalStorage) {
    // No real-time for localStorage, just return a no-op unsubscribe
    return () => {};
  }

  const channel = supabase
    .channel('projects-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: TABLE_NAME },
      async () => {
        const projects = await getProjects();
        callback(projects);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Export the storage mode for UI display
export function isUsingLocalStorage(): boolean {
  return useLocalStorage;
}
