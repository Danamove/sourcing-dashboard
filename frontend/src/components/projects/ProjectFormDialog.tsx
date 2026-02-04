import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project, GroupType, ModelType } from '@/types';
import * as storage from '@/lib/storage';

interface ProjectFormDialogProps {
  project?: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ProjectFormDialog({ project, open, onOpenChange, onSuccess }: ProjectFormDialogProps) {
  const isEditing = !!project;
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: project || { group_type: 'Israel' as GroupType, model_type: 'Hourly' as ModelType, status: 'active', roles_count: 1 },
  });

  const onSubmit = (data: any) => {
    if (isEditing && project) {
      storage.updateProject(project.id, data);
    } else {
      storage.createProject(data);
    }
    reset();
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Project' : 'Create New Project'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Company *</Label><Input {...register('company', { required: true })} placeholder="Company name" /></div>
            <div><Label>Sourcer *</Label><Input {...register('sourcer', { required: true })} placeholder="Sourcer name" /></div>
            <div><Label>Group Type</Label>
              <Select value={watch('group_type')} onValueChange={(v: GroupType) => setValue('group_type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Israel">Israel</SelectItem><SelectItem value="Global">Global</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label>Model Type</Label>
              <Select value={watch('model_type')} onValueChange={(v: ModelType) => setValue('model_type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Hourly">Hourly</SelectItem><SelectItem value="Success">Success</SelectItem><SelectItem value="Success Executive">Success Executive</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label>Roles</Label><Input {...register('roles')} placeholder="e.g., Software Engineer" /></div>
            <div><Label>Roles Count</Label><Input type="number" {...register('roles_count', { valueAsNumber: true })} /></div>
            <div><Label>Hours/Hires</Label><Input type="number" {...register('hours_or_hires', { valueAsNumber: true })} /></div>
            <div><Label>Start Date</Label><Input type="date" {...register('start_date')} /></div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" style={{ background: 'linear-gradient(135deg, hsl(32 95% 44%) 0%, hsl(32 80% 38%) 100%)' }}>{isEditing ? 'Save' : 'Create'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
