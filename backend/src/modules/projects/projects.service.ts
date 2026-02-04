import { db } from '../../db/index.js';
import { Project, AuditLog } from '../../types/index.js';
import { AppError } from '../../middleware/errorHandler.js';
import { CreateProjectInput, UpdateProjectInput, FilterProjectsInput } from './projects.schema.js';

export class ProjectsService {
  async findAll(filters: FilterProjectsInput) {
    const {
      page = 1,
      limit = 20,
      sort_by = 'created_at',
      sort_order = 'desc',
      ...filterParams
    } = filters;

    const query = db('projects');

    // Apply filters
    if (filterParams.sourcer) {
      query.where('sourcer', filterParams.sourcer);
    }
    if (filterParams.model_type) {
      query.where('model_type', filterParams.model_type);
    }
    if (filterParams.company) {
      query.where('company', filterParams.company);
    }
    if (filterParams.group_type) {
      query.where('group_type', filterParams.group_type);
    }
    if (filterParams.status) {
      query.where('status', filterParams.status);
    }
    if (filterParams.roles_min !== undefined) {
      query.where('roles_count', '>=', filterParams.roles_min);
    }
    if (filterParams.roles_max !== undefined) {
      query.where('roles_count', '<=', filterParams.roles_max);
    }
    if (filterParams.hires_min !== undefined) {
      query.where('hours_or_hires', '>=', filterParams.hires_min);
    }
    if (filterParams.hires_max !== undefined) {
      query.where('hours_or_hires', '<=', filterParams.hires_max);
    }
    if (filterParams.start_date_from) {
      query.where('start_date', '>=', filterParams.start_date_from);
    }
    if (filterParams.start_date_to) {
      query.where('start_date', '<=', filterParams.start_date_to);
    }
    if (filterParams.search) {
      query.where(function () {
        this.where('company', 'ilike', `%${filterParams.search}%`)
          .orWhere('sourcer', 'ilike', `%${filterParams.search}%`)
          .orWhere('roles', 'ilike', `%${filterParams.search}%`)
          .orWhere('notes', 'ilike', `%${filterParams.search}%`);
      });
    }

    // Get total count
    const countQuery = query.clone();
    const [countResult] = await countQuery.count('* as count') as Array<{ count: string }>;
    const total = parseInt(countResult.count, 10);

    // Apply pagination and sorting
    const projects = await query
      .orderBy(sort_by, sort_order)
      .limit(limit)
      .offset((page - 1) * limit) as Project[];

    return {
      data: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const project = await db<Project>('projects').where({ id }).first();

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    return project;
  }

  async create(data: CreateProjectInput, userId?: string) {
    const insertData: Record<string, unknown> = { ...data };
    const [project] = await db('projects').insert(insertData).returning('*') as Project[];

    // Audit log
    await this.createAuditLog(userId, 'CREATE', 'project', project.id, null, project);

    return project;
  }

  async update(id: string, data: UpdateProjectInput, userId?: string) {
    const existing = await this.findById(id);

    const updateData: Record<string, unknown> = { ...data, updated_at: db.fn.now() };
    const [project] = await db('projects')
      .where({ id })
      .update(updateData)
      .returning('*') as Project[];

    // Audit log
    await this.createAuditLog(userId, 'UPDATE', 'project', id, existing, project);

    return project;
  }

  async delete(id: string, userId?: string) {
    const existing = await this.findById(id);

    await db('projects').where({ id }).delete();

    // Audit log
    await this.createAuditLog(userId, 'DELETE', 'project', id, existing, null);

    return { success: true };
  }

  async archive(id: string, userId?: string) {
    return this.update(id, { status: 'archived' }, userId);
  }

  async bulkAction(ids: string[], action: string, userId?: string) {
    switch (action) {
      case 'archive':
        await db('projects')
          .whereIn('id', ids)
          .update({ status: 'archived', updated_at: db.fn.now() });
        break;
      case 'complete':
        await db('projects')
          .whereIn('id', ids)
          .update({ status: 'completed', updated_at: db.fn.now() });
        break;
      case 'activate':
        await db('projects')
          .whereIn('id', ids)
          .update({ status: 'active', updated_at: db.fn.now() });
        break;
      case 'delete':
        await db('projects').whereIn('id', ids).delete();
        break;
      default:
        throw new AppError('Invalid action', 400);
    }

    return { success: true, affected: ids.length };
  }

  async getFilterOptions() {
    const [sourcers, companies] = await Promise.all([
      db('projects').distinct('sourcer').orderBy('sourcer') as Promise<Array<{ sourcer: string }>>,
      db('projects').distinct('company').orderBy('company') as Promise<Array<{ company: string }>>,
    ]);

    return {
      sourcers: sourcers.map((s) => s.sourcer),
      companies: companies.map((c) => c.company),
      model_types: ['Hourly', 'Success', 'Success Executive'],
      group_types: ['Israel', 'Global'],
      statuses: ['active', 'completed', 'archived'],
    };
  }

  private async createAuditLog(
    userId: string | undefined,
    action: AuditLog['action'],
    entityType: AuditLog['entity_type'],
    entityId: string,
    oldValues: unknown,
    newValues: unknown
  ) {
    await db('audit_logs').insert({
      user_id: userId || null,
      action,
      entity_type: entityType,
      entity_id: entityId,
      old_values: oldValues ? JSON.stringify(oldValues) : null,
      new_values: newValues ? JSON.stringify(newValues) : null,
    });
  }
}

export const projectsService = new ProjectsService();
