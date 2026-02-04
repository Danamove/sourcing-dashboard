import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  MoreHorizontal,
  Pencil,
  Archive,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Project, ProjectFilters } from '@/types';
import { projectsApi } from '@/api/projects';
import { ProjectFormDialog } from './ProjectFormDialog';

interface ProjectsTableProps {
  filters: ProjectFilters;
  onFiltersChange: (filters: Partial<ProjectFilters>) => void;
}

export function ProjectsTable({ filters, onFiltersChange }: ProjectsTableProps) {
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['projects', filters],
    queryFn: () => projectsApi.getAll(filters),
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => projectsApi.archive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const bulkMutation = useMutation({
    mutationFn: ({ ids, action }: { ids: string[]; action: 'archive' | 'delete' }) =>
      projectsApi.bulkAction(ids, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setSelectedIds([]);
    },
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (data?.data) {
      if (selectedIds.length === data.data.length) {
        setSelectedIds([]);
      } else {
        setSelectedIds(data.data.map((p) => p.id));
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium"
            style={{
              background: 'linear-gradient(135deg, hsl(145 60% 94%) 0%, hsl(145 50% 90%) 100%)',
              color: 'hsl(145 60% 30%)',
              border: '1px solid hsl(145 50% 80%)',
            }}
          >
            Active
          </span>
        );
      case 'completed':
        return (
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium"
            style={{
              background: 'linear-gradient(135deg, hsl(220 60% 94%) 0%, hsl(220 50% 90%) 100%)',
              color: 'hsl(220 60% 40%)',
              border: '1px solid hsl(220 50% 80%)',
            }}
          >
            Completed
          </span>
        );
      case 'archived':
        return (
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium"
            style={{
              background: 'linear-gradient(135deg, hsl(220 15% 94%) 0%, hsl(220 10% 90%) 100%)',
              color: 'hsl(220 15% 45%)',
              border: '1px solid hsl(220 15% 80%)',
            }}
          >
            Archived
          </span>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div
          className="animate-pulse text-muted-foreground"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Loading projects...
        </div>
      </div>
    );
  }

  const projects = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div
          className="flex items-center gap-4 p-4 mx-5 mt-5 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, hsl(32 90% 95%) 0%, hsl(32 70% 92%) 100%)',
            border: '1px solid hsl(32 60% 85%)',
          }}
        >
          <span
            className="text-sm font-medium"
            style={{ color: 'hsl(32 80% 30%)', fontFamily: 'var(--font-body)' }}
          >
            {selectedIds.length} selected
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => bulkMutation.mutate({ ids: selectedIds, action: 'archive' })}
            className="rounded-lg gap-2"
            style={{
              borderColor: 'hsl(32 60% 75%)',
              color: 'hsl(32 80% 30%)',
            }}
          >
            <Archive className="h-4 w-4" />
            Archive
          </Button>
          <Button
            size="sm"
            onClick={() => bulkMutation.mutate({ ids: selectedIds, action: 'delete' })}
            className="rounded-lg gap-2"
            style={{
              background: 'linear-gradient(135deg, hsl(0 70% 50%) 0%, hsl(0 65% 45%) 100%)',
              border: 'none',
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow
              style={{
                background: 'linear-gradient(180deg, hsl(40 30% 97%) 0%, hsl(40 20% 95%) 100%)',
                borderBottom: '2px solid hsl(220 20% 90%)',
              }}
            >
              <TableHead className="w-12 pl-5">
                <Checkbox
                  checked={selectedIds.length === projects.length && projects.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'hsl(220 15% 45%)', fontFamily: 'var(--font-body)' }}
              >
                Company
              </TableHead>
              <TableHead
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'hsl(220 15% 45%)', fontFamily: 'var(--font-body)' }}
              >
                Sourcer
              </TableHead>
              <TableHead
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'hsl(220 15% 45%)', fontFamily: 'var(--font-body)' }}
              >
                Group
              </TableHead>
              <TableHead
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'hsl(220 15% 45%)', fontFamily: 'var(--font-body)' }}
              >
                Model
              </TableHead>
              <TableHead
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'hsl(220 15% 45%)', fontFamily: 'var(--font-body)' }}
              >
                Roles
              </TableHead>
              <TableHead
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'hsl(220 15% 45%)', fontFamily: 'var(--font-body)' }}
              >
                Hours/Hires
              </TableHead>
              <TableHead
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'hsl(220 15% 45%)', fontFamily: 'var(--font-body)' }}
              >
                Start Date
              </TableHead>
              <TableHead
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'hsl(220 15% 45%)', fontFamily: 'var(--font-body)' }}
              >
                Status
              </TableHead>
              <TableHead className="w-12 pr-5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project, index) => (
              <TableRow
                key={project.id}
                className="transition-colors duration-150 hover:bg-muted/30"
                style={{
                  animationDelay: `${index * 0.03}s`,
                }}
              >
                <TableCell className="pl-5">
                  <Checkbox
                    checked={selectedIds.includes(project.id)}
                    onCheckedChange={() => toggleSelect(project.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-9 w-9 rounded-lg flex items-center justify-center text-sm font-semibold"
                      style={{
                        background: 'linear-gradient(135deg, hsl(40 30% 95%) 0%, hsl(40 20% 92%) 100%)',
                        color: 'hsl(220 25% 30%)',
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      {project.company.charAt(0)}
                    </div>
                    <span
                      className="font-medium"
                      style={{ fontFamily: 'var(--font-body)', color: 'hsl(220 25% 20%)' }}
                    >
                      {project.company}
                    </span>
                  </div>
                </TableCell>
                <TableCell style={{ fontFamily: 'var(--font-body)' }}>{project.sourcer}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      project.group_type === 'Israel'
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                    }
                  >
                    {project.group_type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={`badge-model ${project.model_type?.toLowerCase().replace(' ', '-')}`}>
                    {project.model_type}
                  </span>
                </TableCell>
                <TableCell>
                  {project.roles && (
                    <span className="text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                      <span style={{ color: 'hsl(220 25% 25%)' }}>{project.roles}</span>
                      <span className="text-muted-foreground ml-1">({project.roles_count})</span>
                    </span>
                  )}
                </TableCell>
                <TableCell style={{ fontFamily: 'var(--font-body)' }}>
                  {project.hours_or_hires || '-'}
                </TableCell>
                <TableCell style={{ fontFamily: 'var(--font-body)' }}>
                  {project.start_date
                    ? format(new Date(project.start_date), 'MMM d, yyyy')
                    : '-'}
                </TableCell>
                <TableCell>{getStatusBadge(project.status)}</TableCell>
                <TableCell className="pr-5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-xl"
                      style={{
                        background: 'hsl(0 0% 100%)',
                        border: '1px solid hsl(220 20% 90%)',
                        boxShadow: '0 8px 24px hsl(220 25% 10% / 0.1)',
                      }}
                    >
                      <DropdownMenuItem
                        onClick={() => setEditingProject(project)}
                        className="gap-2 rounded-lg"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => archiveMutation.mutate(project.id)}
                        className="gap-2 rounded-lg"
                      >
                        <Archive className="h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteMutation.mutate(project.id)}
                        className="gap-2 rounded-lg text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-16">
                  <div
                    className="text-muted-foreground"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    No projects found
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{
            borderTop: '1px solid hsl(220 20% 92%)',
          }}
        >
          <p
            className="text-sm text-muted-foreground"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFiltersChange({ page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="rounded-lg gap-1"
              style={{
                borderColor: 'hsl(220 20% 90%)',
              }}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span
              className="text-sm px-3"
              style={{ fontFamily: 'var(--font-body)', color: 'hsl(220 15% 45%)' }}
            >
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFiltersChange({ page: pagination.page + 1 })}
              disabled={pagination.page === pagination.totalPages}
              className="rounded-lg gap-1"
              style={{
                borderColor: 'hsl(220 20% 90%)',
              }}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {editingProject && (
        <ProjectFormDialog
          project={editingProject}
          open={!!editingProject}
          onOpenChange={(open) => !open && setEditingProject(null)}
        />
      )}
    </div>
  );
}
