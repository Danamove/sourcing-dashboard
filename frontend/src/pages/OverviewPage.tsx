import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Briefcase,
  Users,
  Building2,
  Plus,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { analyticsApi } from '@/api/analytics';
import { ProjectFormDialog } from '@/components/projects/ProjectFormDialog';
import { format } from 'date-fns';

export function OverviewPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: analyticsApi.getOverviewStats,
  });

  const { data: recentProjects } = useQuery({
    queryKey: ['analytics', 'recent'],
    queryFn: () => analyticsApi.getRecentProjects(5),
  });

  const { data: byModel } = useQuery({
    queryKey: ['analytics', 'by-model'],
    queryFn: analyticsApi.getProjectsByModel,
  });

  const { data: byGroup } = useQuery({
    queryKey: ['analytics', 'by-group'],
    queryFn: analyticsApi.getProjectsByGroup,
  });

  const statCards = [
    {
      title: 'Total Projects',
      value: stats?.totalProjects || 0,
      icon: Briefcase,
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Active Projects',
      value: stats?.activeProjects || 0,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-emerald-600',
    },
    {
      title: 'Total Clients',
      value: stats?.totalCompanies || 0,
      icon: Building2,
      gradient: 'from-violet-500 to-violet-600',
    },
    {
      title: 'Team Members',
      value: stats?.totalSourcers || 0,
      icon: Users,
      gradient: 'from-amber-500 to-amber-600',
    },
    {
      title: 'Total Roles',
      value: stats?.totalRoles || 0,
      icon: Briefcase,
      gradient: 'from-rose-500 to-rose-600',
    },
  ];

  const getModelClass = (model: string | undefined) => {
    switch (model) {
      case 'Hourly':
        return 'badge-model hourly';
      case 'Success':
        return 'badge-model success';
      case 'Success Executive':
        return 'badge-model executive';
      default:
        return 'badge-model';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="page-header flex items-end justify-between">
        <div>
          <h1>Overview</h1>
          <p className="text-muted-foreground mt-1" style={{ fontFamily: 'var(--font-body)' }}>
            Welcome back. Here's what's happening with your projects.
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="gap-2"
          style={{
            background: 'linear-gradient(135deg, hsl(32 95% 44%) 0%, hsl(32 80% 38%) 100%)',
            boxShadow: '0 4px 12px hsl(32 95% 40% / 0.25)',
            border: 'none',
          }}
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 animate-stagger">
        {statCards.map((stat) => (
          <div key={stat.title} className="stat-card rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {stat.title}
                </p>
                <p
                  className="mt-2 text-3xl font-normal"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {stat.value}
                </p>
              </div>
              <div
                className={`rounded-xl p-3 bg-gradient-to-br ${stat.gradient}`}
                style={{ boxShadow: '0 4px 12px hsl(220 25% 10% / 0.1)' }}
              >
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="chart-container">
          <h3 className="mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Projects by Model
          </h3>
          <div className="space-y-4">
            {byModel?.map((item) => {
              const total = byModel.reduce((sum, i) => sum + i.count, 0);
              const percentage = total > 0 ? (item.count / total) * 100 : 0;
              return (
                <div key={item.model} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className={getModelClass(item.model)}>{item.model}</span>
                    <span
                      className="text-sm font-medium"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {item.count}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="chart-container">
          <h3 className="mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Projects by Group
          </h3>
          <div className="space-y-4">
            {byGroup?.map((item) => {
              const total = byGroup.reduce((sum, i) => sum + i.count, 0);
              const percentage = total > 0 ? (item.count / total) * 100 : 0;
              return (
                <div key={item.group} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="inline-flex items-center gap-2 text-sm font-medium"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{
                          background:
                            item.group === 'Israel'
                              ? 'linear-gradient(135deg, hsl(220 70% 50%) 0%, hsl(220 70% 40%) 100%)'
                              : 'linear-gradient(135deg, hsl(160 60% 40%) 0%, hsl(160 60% 30%) 100%)',
                        }}
                      />
                      {item.group}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {item.count}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${percentage}%`,
                        background:
                          item.group === 'Israel'
                            ? 'linear-gradient(90deg, hsl(220 70% 50%) 0%, hsl(220 60% 60%) 100%)'
                            : 'linear-gradient(90deg, hsl(160 60% 40%) 0%, hsl(160 50% 50%) 100%)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="chart-container">
        <div className="flex items-center justify-between mb-6">
          <h3 style={{ fontFamily: 'var(--font-display)' }}>Recent Projects</h3>
          <a
            href="/israel"
            className="text-sm font-medium flex items-center gap-1 transition-colors"
            style={{
              color: 'hsl(32 95% 44%)',
              fontFamily: 'var(--font-body)',
            }}
          >
            View all
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
        <div className="space-y-1">
          {recentProjects?.map((project, index) => (
            <div
              key={project.id}
              className="flex items-center justify-between py-4 border-b border-border/50 last:border-0 group hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center text-sm font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, hsl(40 30% 95%) 0%, hsl(40 20% 92%) 100%)',
                    color: 'hsl(220 25% 30%)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {project.company.charAt(0)}
                </div>
                <div>
                  <p className="font-medium" style={{ fontFamily: 'var(--font-body)' }}>
                    {project.company}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {project.roles || 'No roles specified'} • {project.sourcer}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  className={
                    project.group_type === 'Israel'
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                  }
                >
                  {project.group_type}
                </Badge>
                <span className="text-sm text-muted-foreground min-w-[80px] text-right">
                  {project.start_date
                    ? format(new Date(project.start_date), 'MMM d')
                    : '—'}
                </span>
              </div>
            </div>
          ))}
          {(!recentProjects || recentProjects.length === 0) && (
            <p className="text-center text-muted-foreground py-8">
              No projects yet. Create your first project to get started.
            </p>
          )}
        </div>
      </div>

      <ProjectFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
