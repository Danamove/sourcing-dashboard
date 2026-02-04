import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    company: z.string().min(1, 'Company name is required'),
    sourcer: z.string().min(1, 'Sourcer name is required'),
    group_type: z.enum(['Israel', 'Global']),
    model_type: z.enum(['Hourly', 'Success', 'Success Executive']),
    roles: z.string().optional(),
    roles_count: z.number().int().min(0).optional().default(1),
    hours_or_hires: z.number().int().min(0).optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    time_to_hire: z.string().optional(),
    notes: z.string().optional(),
    status: z.enum(['active', 'completed', 'archived']).optional().default('active'),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    company: z.string().min(1).optional(),
    sourcer: z.string().min(1).optional(),
    group_type: z.enum(['Israel', 'Global']).optional(),
    model_type: z.enum(['Hourly', 'Success', 'Success Executive']).optional(),
    roles: z.string().optional(),
    roles_count: z.number().int().min(0).optional(),
    hours_or_hires: z.number().int().min(0).optional(),
    start_date: z.string().nullable().optional(),
    end_date: z.string().nullable().optional(),
    time_to_hire: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
    status: z.enum(['active', 'completed', 'archived']).optional(),
  }),
});

export const filterProjectsSchema = z.object({
  query: z.object({
    sourcer: z.string().optional(),
    model_type: z.enum(['Hourly', 'Success', 'Success Executive']).optional(),
    company: z.string().optional(),
    group_type: z.enum(['Israel', 'Global']).optional(),
    status: z.enum(['active', 'completed', 'archived']).optional(),
    roles_min: z.coerce.number().int().min(0).optional(),
    roles_max: z.coerce.number().int().min(0).optional(),
    hires_min: z.coerce.number().int().min(0).optional(),
    hires_max: z.coerce.number().int().min(0).optional(),
    start_date_from: z.string().optional(),
    start_date_to: z.string().optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    sort_by: z.string().optional().default('created_at'),
    sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
});

export const bulkActionSchema = z.object({
  body: z.object({
    ids: z.array(z.string().uuid()).min(1),
    action: z.enum(['archive', 'delete', 'complete', 'activate']),
  }),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>['body'];
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>['body'];
export type FilterProjectsInput = z.infer<typeof filterProjectsSchema>['query'];
