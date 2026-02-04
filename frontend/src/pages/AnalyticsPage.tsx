import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Download, BarChart3, PieChartIcon, Users } from 'lucide-react';
import { analyticsApi } from '@/api/analytics';

const COLORS = [
  'hsl(32, 95%, 44%)',
  'hsl(220, 70%, 50%)',
  'hsl(160, 60%, 40%)',
  'hsl(280, 60%, 50%)',
  'hsl(0, 70%, 50%)',
];

export function AnalyticsPage() {
  const { data: byModel } = useQuery({
    queryKey: ['analytics', 'by-model'],
    queryFn: analyticsApi.getProjectsByModel,
  });

  const { data: byGroup } = useQuery({
    queryKey: ['analytics', 'by-group'],
    queryFn: analyticsApi.getProjectsByGroup,
  });

  const { data: bySourcer } = useQuery({
    queryKey: ['analytics', 'by-sourcer'],
    queryFn: analyticsApi.getProjectsBySourcer,
  });

  const { data: byStatus } = useQuery({
    queryKey: ['analytics', 'by-status'],
    queryFn: analyticsApi.getProjectsByStatus,
  });

  const handleExport = async () => {
    const blob = await analyticsApi.exportCSV();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projects_export.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="page-header flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, hsl(220 70% 50%) 0%, hsl(220 65% 40%) 100%)',
                boxShadow: '0 4px 12px hsl(220 70% 40% / 0.3)',
              }}
            >
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <h1>Analytics</h1>
          </div>
          <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
            Insights and statistics about your projects
          </p>
        </div>
        <Button
          onClick={handleExport}
          className="gap-2"
          style={{
            background: 'linear-gradient(135deg, hsl(32 95% 44%) 0%, hsl(32 80% 38%) 100%)',
            boxShadow: '0 4px 12px hsl(32 95% 40% / 0.25)',
            border: 'none',
          }}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 animate-stagger">
        {/* Projects by Model Type */}
        <div className="chart-container">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, hsl(32 90% 50%) 0%, hsl(25 85% 45%) 100%)',
              }}
            >
              <PieChartIcon className="h-4 w-4 text-white" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)' }}>Projects by Model Type</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byModel}
                  dataKey="count"
                  nameKey="model"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={40}
                  label={({ model, count }) => `${model}: ${count}`}
                  labelLine={{ stroke: 'hsl(220, 15%, 60%)' }}
                >
                  {byModel?.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'hsl(220, 25%, 12%)',
                    border: '1px solid hsl(220, 20%, 20%)',
                    borderRadius: '0.75rem',
                    color: 'hsl(40, 20%, 95%)',
                    fontFamily: 'var(--font-body)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Projects by Group */}
        <div className="chart-container">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, hsl(160 60% 40%) 0%, hsl(160 55% 35%) 100%)',
              }}
            >
              <PieChartIcon className="h-4 w-4 text-white" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)' }}>Projects by Group</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byGroup}
                  dataKey="count"
                  nameKey="group"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={40}
                  label={({ group, count }) => `${group}: ${count}`}
                  labelLine={{ stroke: 'hsl(220, 15%, 60%)' }}
                >
                  {byGroup?.map((_, index) => (
                    <Cell key={index} fill={index === 0 ? 'hsl(220, 70%, 50%)' : 'hsl(160, 60%, 40%)'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'hsl(220, 25%, 12%)',
                    border: '1px solid hsl(220, 20%, 20%)',
                    borderRadius: '0.75rem',
                    color: 'hsl(40, 20%, 95%)',
                    fontFamily: 'var(--font-body)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Projects by Sourcer */}
        <div className="chart-container md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, hsl(280 60% 50%) 0%, hsl(280 55% 45%) 100%)',
              }}
            >
              <Users className="h-4 w-4 text-white" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)' }}>Projects by Sourcer</h3>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bySourcer} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 90%)" />
                <XAxis
                  type="number"
                  tick={{ fill: 'hsl(220, 15%, 45%)', fontFamily: 'var(--font-body)', fontSize: 12 }}
                />
                <YAxis
                  dataKey="sourcer"
                  type="category"
                  width={120}
                  tick={{ fill: 'hsl(220, 15%, 45%)', fontFamily: 'var(--font-body)', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(220, 25%, 12%)',
                    border: '1px solid hsl(220, 20%, 20%)',
                    borderRadius: '0.75rem',
                    color: 'hsl(40, 20%, 95%)',
                    fontFamily: 'var(--font-body)',
                  }}
                />
                <Bar dataKey="projects" fill="hsl(32, 95%, 44%)" name="Projects" radius={[0, 4, 4, 0]} />
                <Bar dataKey="totalRoles" fill="hsl(220, 70%, 50%)" name="Total Roles" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Projects by Status */}
        <div className="chart-container md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, hsl(145 60% 40%) 0%, hsl(145 55% 35%) 100%)',
              }}
            >
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)' }}>Projects by Status</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 90%)" />
                <XAxis
                  dataKey="status"
                  tick={{ fill: 'hsl(220, 15%, 45%)', fontFamily: 'var(--font-body)', fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: 'hsl(220, 15%, 45%)', fontFamily: 'var(--font-body)', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(220, 25%, 12%)',
                    border: '1px solid hsl(220, 20%, 20%)',
                    borderRadius: '0.75rem',
                    color: 'hsl(40, 20%, 95%)',
                    fontFamily: 'var(--font-body)',
                  }}
                />
                <Bar
                  dataKey="count"
                  radius={[4, 4, 0, 0]}
                >
                  {byStatus?.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        entry.status === 'active'
                          ? 'hsl(145, 60%, 40%)'
                          : entry.status === 'completed'
                          ? 'hsl(220, 70%, 50%)'
                          : 'hsl(220, 15%, 60%)'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
