import { useState } from 'react';
import { Plus, MapPin, Globe, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectFormDialog } from '@/components/projects/ProjectFormDialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import * as storage from '@/lib/storage';
import { GroupType, ProjectStatus } from '@/types';

interface ProjectsPageProps {
  title: string;
  description?: string;
  defaultGroupType?: GroupType;
  defaultStatus?: ProjectStatus;
  hideGroupFilter?: boolean;
}

export function ProjectsPage({ title, description, defaultGroupType, defaultStatus }: ProjectsPageProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const filters: any = {};
  if (defaultGroupType) filters.group_type = defaultGroupType;
  if (defaultStatus) filters.status = defaultStatus;

  const projects = storage.getProjects(filters);
  const refresh = () => setRefreshKey(k => k + 1);

  const handleDelete = (id: string) => {
    if (confirm('Delete this project?')) {
      storage.deleteProject(id);
      refresh();
    }
  };

  const handleArchive = (id: string) => {
    storage.archiveProject(id);
    refresh();
  };

  const getIcon = () => {
    if (defaultGroupType === 'Israel') return MapPin;
    if (defaultGroupType === 'Global') return Globe;
    if (defaultStatus === 'archived') return Archive;
    return MapPin;
  };
  const Icon = getIcon();

  return (
    <div key={refreshKey} className="space-y-8 animate-fade-in-up">
      <div className="page-header flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(32 95% 44%) 0%, hsl(32 80% 38%) 100%)' }}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <h1>{title}</h1>
          </div>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        <Button onClick={() => setShowCreateDialog(true)} style={{ background: 'linear-gradient(135deg, hsl(32 95% 44%) 0%, hsl(32 80% 38%) 100%)' }}>
          <Plus className="h-4 w-4 mr-2" /> New Project
        </Button>
      </div>

      <div className="chart-container" style={{ padding: 0 }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'hsl(40 30% 97%)', borderBottom: '2px solid hsl(220 20% 90%)' }}>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sourcer</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Group</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Model</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Roles</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
              <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30">
                <td className="p-4 font-medium">{p.company}</td>
                <td className="p-4">{p.sourcer}</td>
                <td className="p-4"><Badge className={p.group_type === 'Israel' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}>{p.group_type}</Badge></td>
                <td className="p-4"><Badge variant="outline">{p.model_type}</Badge></td>
                <td className="p-4">{p.roles} ({p.roles_count})</td>
                <td className="p-4">{p.start_date ? format(new Date(p.start_date), 'MMM d, yyyy') : '-'}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setEditingProject(p)}>Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleArchive(p.id)}>Archive</Button>
                    <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDelete(p.id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No projects found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ProjectFormDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onSuccess={refresh} />
      {editingProject && <ProjectFormDialog project={editingProject} open={!!editingProject} onOpenChange={(o) => !o && setEditingProject(null)} onSuccess={refresh} />}
    </div>
  );
}
