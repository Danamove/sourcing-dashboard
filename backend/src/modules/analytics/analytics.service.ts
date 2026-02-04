import { db } from '../../db/index.js';
import { Project } from '../../types/index.js';

interface CountResult {
  count: string;
}

interface SumResult {
  sum: string | null;
}

export class AnalyticsService {
  async getOverviewStats() {
    const [totalProjects] = await db('projects').count('* as count') as CountResult[];
    const [activeProjects] = await db('projects')
      .where({ status: 'active' })
      .count('* as count') as CountResult[];
    const [completedProjects] = await db('projects')
      .where({ status: 'completed' })
      .count('* as count') as CountResult[];
    const [totalRoles] = await db('projects').sum('roles_count as sum') as SumResult[];
    const [totalHires] = await db('projects')
      .where('hours_or_hires', '<=', 10)
      .sum('hours_or_hires as sum') as SumResult[];

    const uniqueCompanies = await db('projects')
      .countDistinct('company as count') as CountResult[];
    const uniqueSourcers = await db('projects')
      .countDistinct('sourcer as count') as CountResult[];

    return {
      totalProjects: parseInt(totalProjects.count, 10),
      activeProjects: parseInt(activeProjects.count, 10),
      completedProjects: parseInt(completedProjects.count, 10),
      totalRoles: parseInt(totalRoles.sum || '0', 10),
      totalHires: parseInt(totalHires.sum || '0', 10),
      totalCompanies: parseInt(uniqueCompanies[0].count, 10),
      totalSourcers: parseInt(uniqueSourcers[0].count, 10),
    };
  }

  async getProjectsByModel() {
    const result = await db('projects')
      .select('model_type')
      .count('* as count')
      .groupBy('model_type') as Array<{ model_type: string; count: string }>;

    return result.map((r) => ({
      model: r.model_type,
      count: parseInt(r.count, 10),
    }));
  }

  async getProjectsByGroup() {
    const result = await db('projects')
      .select('group_type')
      .count('* as count')
      .groupBy('group_type') as Array<{ group_type: string; count: string }>;

    return result.map((r) => ({
      group: r.group_type,
      count: parseInt(r.count, 10),
    }));
  }

  async getProjectsBySourcer() {
    const result = await db('projects')
      .select('sourcer')
      .count('* as count')
      .sum('roles_count as total_roles')
      .groupBy('sourcer')
      .orderBy('count', 'desc') as Array<{ sourcer: string; count: string; total_roles: string | null }>;

    return result.map((r) => ({
      sourcer: r.sourcer,
      projects: parseInt(r.count, 10),
      totalRoles: parseInt(r.total_roles || '0', 10),
    }));
  }

  async getSourcersLackingHours(minHours: number = 200) {
    // For Hourly model: use hours_or_hires directly
    // For Success model: count each role as 30 hours
    const result = await db.raw(`
      SELECT
        sourcer,
        SUM(
          CASE
            WHEN model_type = 'Hourly' THEN COALESCE(hours_or_hires, 0)
            ELSE roles_count * 30
          END
        ) as total_hours
      FROM projects
      WHERE status = 'active'
      GROUP BY sourcer
      HAVING SUM(
        CASE
          WHEN model_type = 'Hourly' THEN COALESCE(hours_or_hires, 0)
          ELSE roles_count * 30
        END
      ) < ${minHours}
      ORDER BY total_hours ASC
    `);

    return result.rows.map((r: { sourcer: string; total_hours: string }) => ({
      sourcer: r.sourcer,
      totalHours: parseInt(r.total_hours || '0', 10),
      missingHours: minHours - parseInt(r.total_hours || '0', 10),
    }));
  }

  async getProjectsByStatus() {
    const result = await db('projects')
      .select('status')
      .count('* as count')
      .groupBy('status') as Array<{ status: string; count: string }>;

    return result.map((r) => ({
      status: r.status,
      count: parseInt(r.count, 10),
    }));
  }

  async getRecentProjects(limit: number = 10) {
    return db<Project>('projects')
      .orderBy('created_at', 'desc')
      .limit(limit);
  }

  async getProjectsTimeline(months: number = 12) {
    const result = await db.raw(`
      SELECT
        DATE_TRUNC('month', start_date) as month,
        COUNT(*) as count,
        SUM(roles_count) as total_roles
      FROM projects
      WHERE start_date >= NOW() - INTERVAL '${months} months'
      GROUP BY DATE_TRUNC('month', start_date)
      ORDER BY month ASC
    `);

    return result.rows.map((r: { month: string; count: string; total_roles: string }) => ({
      month: r.month,
      count: parseInt(r.count, 10),
      totalRoles: parseInt(r.total_roles, 10) || 0,
    }));
  }

  async getClientStats() {
    const result = await db.raw(`
      SELECT
        company,
        COUNT(*) as project_count,
        SUM(roles_count) as total_roles,
        SUM(CASE WHEN hours_or_hires <= 10 THEN hours_or_hires ELSE 0 END) as total_hires,
        SUM(CASE WHEN hours_or_hires > 10 THEN hours_or_hires ELSE 0 END) as total_hours
      FROM projects
      GROUP BY company
      ORDER BY project_count DESC
    `);

    return result.rows.map((r: {
      company: string;
      project_count: string;
      total_roles: string | null;
      total_hires: string | null;
      total_hours: string | null;
    }) => ({
      company: r.company,
      projectCount: parseInt(r.project_count, 10),
      totalRoles: parseInt(r.total_roles || '0', 10),
      totalHires: parseInt(r.total_hires || '0', 10),
      totalHours: parseInt(r.total_hours || '0', 10),
    }));
  }

  async exportProjectsCSV(filters: Record<string, string> = {}) {
    let query = db<Project>('projects').select('*');

    if (filters.status) {
      query = query.where('status', filters.status);
    }
    if (filters.group_type) {
      query = query.where('group_type', filters.group_type);
    }
    if (filters.model_type) {
      query = query.where('model_type', filters.model_type);
    }

    const projects = await query.orderBy('created_at', 'desc');

    const headers = [
      'ID',
      'Company',
      'Sourcer',
      'Group',
      'Model',
      'Roles',
      'Roles Count',
      'Hours/Hires',
      'Start Date',
      'End Date',
      'Time to Hire',
      'Status',
      'Notes',
      'Created At',
    ];

    const rows = projects.map((p) => [
      p.id,
      p.company,
      p.sourcer,
      p.group_type,
      p.model_type,
      p.roles || '',
      p.roles_count,
      p.hours_or_hires || '',
      p.start_date || '',
      p.end_date || '',
      p.time_to_hire || '',
      p.status,
      p.notes || '',
      p.created_at,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');

    return csv;
  }
}

export const analyticsService = new AnalyticsService();
