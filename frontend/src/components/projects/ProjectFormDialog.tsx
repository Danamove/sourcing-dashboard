import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Project } from '@/types';
import { projectsApi } from '@/api/projects';
import { Briefcase } from 'lucide-react';

const projectSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  sourcer: z.string().min(1, 'Sourcer is required'),
  group_type: z.enum(['Israel', 'Global']),
  model_type: z.enum(['Hourly', 'Success', 'Success Executive']),
  roles: z.string().optional().transform(v => v || undefined),
  roles_count: z.coerce.number().int().min(0).optional().default(1),
  hours_or_hires: z.coerce.number().int().min(0).optional().transform(v => v || undefined),
  start_date: z.string().optional().transform(v => v || undefined),
  end_date: z.string().optional().transform(v => v || undefined),
  time_to_hire: z.string().optional().transform(v => v || undefined),
  notes: z.string().optional().transform(v => v || undefined),
  status: z.enum(['active', 'completed', 'archived']).optional().default('active'),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormDialogProps {
  project?: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectFormDialog({
  project,
  open,
  onOpenChange,
}: ProjectFormDialogProps) {
  const queryClient = useQueryClient();
  const isEditing = !!project;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: project
      ? {
          company: project.company,
          sourcer: project.sourcer,
          group_type: project.group_type,
          model_type: project.model_type,
          roles: project.roles || '',
          roles_count: project.roles_count,
          hours_or_hires: project.hours_or_hires || undefined,
          start_date: project.start_date?.split('T')[0] || '',
          end_date: project.end_date?.split('T')[0] || '',
          time_to_hire: project.time_to_hire || '',
          notes: project.notes || '',
          status: project.status,
        }
      : {
          group_type: 'Israel',
          model_type: 'Hourly',
          status: 'active',
          roles_count: 1,
        },
  });

  const createMutation = useMutation({
    mutationFn: (data: ProjectFormData) => projectsApi.create(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      onOpenChange(false);
      reset();
    },
    onError: (error: any) => {
      console.error('Create project error:', error);
      alert(error.response?.data?.error || 'Failed to create project');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProjectFormData) =>
      projectsApi.update(project!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error('Update project error:', error);
      alert(error.response?.data?.error || 'Failed to update project');
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const inputStyle = {
    borderColor: 'hsl(220 20% 90%)',
    background: 'hsl(0 0% 100%)',
    fontFamily: 'var(--font-body)',
  };

  const labelStyle = {
    color: 'hsl(220 15% 45%)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.75rem',
    fontWeight: 500,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(40 20% 99%) 100%)',
          border: '1px solid hsl(220 20% 92%)',
          boxShadow: `
            0 4px 6px hsl(220 25% 10% / 0.02),
            0 12px 24px hsl(220 25% 10% / 0.04),
            0 24px 48px hsl(220 25% 10% / 0.04)
          `,
        }}
      >
        <DialogHeader className="pb-4" style={{ borderBottom: '1px solid hsl(220 20% 92%)' }}>
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, hsl(32 95% 50%) 0%, hsl(32 80% 40%) 100%)',
                boxShadow: '0 4px 12px hsl(32 95% 40% / 0.3)',
              }}
            >
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <DialogTitle
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                color: 'hsl(220 25% 15%)',
              }}
            >
              {isEditing ? 'Edit Project' : 'Create New Project'}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Company */}
            <div className="space-y-2">
              <Label htmlFor="company" style={labelStyle}>Company *</Label>
              <Input
                id="company"
                {...register('company')}
                placeholder="Company name"
                className="h-11 rounded-xl border-2 transition-all duration-200"
                style={inputStyle}
              />
              {errors.company && (
                <p className="text-xs" style={{ color: 'hsl(0 70% 50%)' }}>
                  {errors.company.message}
                </p>
              )}
            </div>

            {/* Sourcer */}
            <div className="space-y-2">
              <Label htmlFor="sourcer" style={labelStyle}>Sourcer *</Label>
              <Input
                id="sourcer"
                {...register('sourcer')}
                placeholder="Sourcer name"
                className="h-11 rounded-xl border-2 transition-all duration-200"
                style={inputStyle}
              />
              {errors.sourcer && (
                <p className="text-xs" style={{ color: 'hsl(0 70% 50%)' }}>
                  {errors.sourcer.message}
                </p>
              )}
            </div>

            {/* Group Type */}
            <div className="space-y-2">
              <Label style={labelStyle}>Group Type *</Label>
              <Select
                value={watch('group_type')}
                onValueChange={(value) =>
                  setValue('group_type', value as 'Israel' | 'Global')
                }
              >
                <SelectTrigger
                  className="h-11 rounded-xl border-2"
                  style={inputStyle}
                >
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent className="rounded-xl" style={{ border: '1px solid hsl(220 20% 90%)' }}>
                  <SelectItem value="Israel">Israel</SelectItem>
                  <SelectItem value="Global">Global</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Model Type */}
            <div className="space-y-2">
              <Label style={labelStyle}>Model Type *</Label>
              <Select
                value={watch('model_type')}
                onValueChange={(value) =>
                  setValue('model_type', value as 'Hourly' | 'Success' | 'Success Executive')
                }
              >
                <SelectTrigger
                  className="h-11 rounded-xl border-2"
                  style={inputStyle}
                >
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent className="rounded-xl" style={{ border: '1px solid hsl(220 20% 90%)' }}>
                  <SelectItem value="Hourly">Hourly</SelectItem>
                  <SelectItem value="Success">Success</SelectItem>
                  <SelectItem value="Success Executive">Success Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Roles */}
            <div className="space-y-2">
              <Label htmlFor="roles" style={labelStyle}>Roles</Label>
              <Input
                id="roles"
                {...register('roles')}
                placeholder="e.g., Software Engineer"
                className="h-11 rounded-xl border-2 transition-all duration-200"
                style={inputStyle}
              />
            </div>

            {/* Roles Count */}
            <div className="space-y-2">
              <Label htmlFor="roles_count" style={labelStyle}>Roles Count</Label>
              <Input
                id="roles_count"
                type="number"
                {...register('roles_count')}
                placeholder="1"
                className="h-11 rounded-xl border-2 transition-all duration-200"
                style={inputStyle}
              />
            </div>

            {/* Hours / Hires */}
            <div className="space-y-2">
              <Label htmlFor="hours_or_hires" style={labelStyle}>Hours / Hires</Label>
              <Input
                id="hours_or_hires"
                type="number"
                {...register('hours_or_hires')}
                placeholder="0"
                className="h-11 rounded-xl border-2 transition-all duration-200"
                style={inputStyle}
              />
            </div>

            {/* Time to Hire */}
            <div className="space-y-2">
              <Label htmlFor="time_to_hire" style={labelStyle}>Time to Hire</Label>
              <Input
                id="time_to_hire"
                {...register('time_to_hire')}
                placeholder="e.g., 3 weeks"
                className="h-11 rounded-xl border-2 transition-all duration-200"
                style={inputStyle}
              />
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="start_date" style={labelStyle}>Start Date</Label>
              <Input
                id="start_date"
                type="date"
                {...register('start_date')}
                className="h-11 rounded-xl border-2 transition-all duration-200"
                style={inputStyle}
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="end_date" style={labelStyle}>End Date</Label>
              <Input
                id="end_date"
                type="date"
                {...register('end_date')}
                className="h-11 rounded-xl border-2 transition-all duration-200"
                style={inputStyle}
              />
            </div>

            {/* Status (only for editing) */}
            {isEditing && (
              <div className="space-y-2">
                <Label style={labelStyle}>Status</Label>
                <Select
                  value={watch('status')}
                  onValueChange={(value) =>
                    setValue('status', value as 'active' | 'completed' | 'archived')
                  }
                >
                  <SelectTrigger
                    className="h-11 rounded-xl border-2"
                    style={inputStyle}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl" style={{ border: '1px solid hsl(220 20% 90%)' }}>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" style={labelStyle}>Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional notes..."
              rows={3}
              className="rounded-xl border-2 transition-all duration-200"
              style={inputStyle}
            />
          </div>

          {/* Actions */}
          <div
            className="flex justify-end gap-3 pt-4"
            style={{ borderTop: '1px solid hsl(220 20% 92%)' }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 px-6 rounded-xl border-2"
              style={{
                borderColor: 'hsl(220 20% 85%)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="h-11 px-6 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, hsl(32 95% 44%) 0%, hsl(32 80% 38%) 100%)',
                boxShadow: '0 4px 12px hsl(32 95% 40% / 0.25)',
                border: 'none',
                fontFamily: 'var(--font-body)',
              }}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : isEditing
                ? 'Save Changes'
                : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
