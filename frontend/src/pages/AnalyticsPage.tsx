import { useState, useEffect } from 'react';
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
import { Download, BarChart3, PieChartIcon, Users, Loader2 } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

const COLORS = [
  'hsl(32, 95%, 44%)',
  'hsl(220, 70%, 50%)',
  'hsl(160, 60%, 40%)',
  'hsl(280, 60%, 50%)',
  'hsl(0, 70%, 50%)',
];

export function AnalyticsPage() {
  const { getProjectsByModel, getProjectsByGroup, getProjectsBySourcer, getProjectsByStatus, getProjects } = useData();

  const [byModel, setByModel] = useState<{ model: string; count: number }[]>([]);
  const [byGroup, setByGroup] = useState<{ group: string; count: number }[]>([]);
  const [bySourcer, setBySourcer] = useState<{ sourcer: string; projects: number; totalRoles: number }[]>([]);
  const [byStatus, setByStatus] = useState<{ status: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [model, group, sourcer, status] = await Promise.all([
      getProjectsByModel(),
      getProjectsByGroup(),
      getProjectsBySourcer(),
      getProjectsByStatus(),
    ]);
    setByModel(model);
    setByGroup(group);
    setBySourcer(sourcer);
    setByStatus(status);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExport = async () => {
    const projects = await getProjects();
    const csv = [
      ['Company', 'Sourcer', 'Group', 'Model', 'Roles', 'Roles Count', 'Hours/Hires', 'Start Date', 'Status'].join(','),
      ...projects.map(p => [
        p.company,
        p.sourcer,
        p.group_type,
        p.model_type,
        p.roles || '',
        p.roles_count || 0,
        p.hours_or_hires || 0,
        p.start_date || '',
        p.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projects_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
                >
                  {byModel.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
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
                >
                  {byGroup.map((_, index) => (
                    <Cell key={index} fill={index === 0 ? 'hsl(220, 70%, 50%)' : 'hsl(160, 60%, 40%)'} />
                  ))}
                </Pie>
                <Tooltip />
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
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bySourcer} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 90%)" />
                <XAxis type="number" />
                <YAxis dataKey="sourcer" type="category" width={100} />
                <Tooltip />
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
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 90%)" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {byStatus.map((entry, index) => (
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
