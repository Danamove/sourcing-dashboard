import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Building2, Search, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { analyticsApi } from '@/api/analytics';
import { projectsApi } from '@/api/projects';
import { format } from 'date-fns';

export function ClientsPage() {
  const [search, setSearch] = useState('');
  const [expandedClient, setExpandedClient] = useState<string | null>(null);

  const { data: clientStats } = useQuery({
    queryKey: ['analytics', 'clients'],
    queryFn: analyticsApi.getClientStats,
  });

  const { data: clientProjects } = useQuery({
    queryKey: ['projects', 'client', expandedClient],
    queryFn: () =>
      projectsApi.getAll({ company: expandedClient!, limit: 100 }),
    enabled: !!expandedClient,
  });

  const filteredClients = clientStats?.filter((client) =>
    client.company.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (company: string) => {
    setExpandedClient(expandedClient === company ? null : company);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, hsl(280 60% 50%) 0%, hsl(280 55% 40%) 100%)',
              boxShadow: '0 4px 12px hsl(280 60% 40% / 0.3)',
            }}
          >
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <h1>All Clients</h1>
        </div>
        <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
          Companies and their project details
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4"
          style={{ color: 'hsl(220, 15%, 50%)' }}
        />
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 pl-11 rounded-xl border-2 transition-all duration-200"
          style={{
            borderColor: 'hsl(220 20% 90%)',
            background: 'hsl(0 0% 100%)',
          }}
        />
      </div>

      {/* Clients List */}
      <div className="space-y-4 animate-stagger">
        {filteredClients?.map((client) => (
          <div
            key={client.company}
            className="chart-container overflow-hidden transition-all duration-300"
            style={{
              padding: 0,
            }}
          >
            {/* Client Header */}
            <div
              className="p-5 cursor-pointer transition-all duration-200 hover:bg-muted/30"
              onClick={() => toggleExpand(client.company)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="h-5 w-5 rounded transition-transform duration-200 flex items-center justify-center"
                    style={{
                      transform: expandedClient === client.company ? 'rotate(0deg)' : 'rotate(-90deg)',
                      color: 'hsl(220, 15%, 50%)',
                    }}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </div>
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center text-lg font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, hsl(40 30% 95%) 0%, hsl(40 20% 92%) 100%)',
                      color: 'hsl(220 25% 30%)',
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {client.company.charAt(0)}
                  </div>
                  <div>
                    <h3
                      className="text-lg"
                      style={{ fontFamily: 'var(--font-display)', color: 'hsl(220 25% 15%)' }}
                    >
                      {client.company}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {client.projectCount} project{client.projectCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Total Roles
                    </p>
                    <p className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
                      {client.totalRoles}
                    </p>
                  </div>
                  {client.totalHours > 0 && (
                    <div className="text-right">
                      <p
                        className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        Hours
                      </p>
                      <p className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
                        {client.totalHours}
                      </p>
                    </div>
                  )}
                  {client.totalHires > 0 && (
                    <div className="text-right">
                      <p
                        className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        Hires
                      </p>
                      <p className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
                        {client.totalHires}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Projects */}
            {expandedClient === client.company && (
              <div
                className="border-t px-5 py-4"
                style={{
                  borderColor: 'hsl(220 20% 92%)',
                  background: 'linear-gradient(180deg, hsl(40 30% 98%) 0%, hsl(40 20% 97%) 100%)',
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="h-4 w-4" style={{ color: 'hsl(32 95% 44%)' }} />
                  <h4
                    className="font-medium text-sm uppercase tracking-wider"
                    style={{ color: 'hsl(220 15% 45%)' }}
                  >
                    Projects
                  </h4>
                </div>
                <div className="space-y-3">
                  {clientProjects?.data.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 rounded-xl transition-all duration-200"
                      style={{
                        background: 'hsl(0 0% 100%)',
                        border: '1px solid hsl(220 20% 92%)',
                      }}
                    >
                      <div>
                        <p
                          className="font-medium"
                          style={{ fontFamily: 'var(--font-body)', color: 'hsl(220 25% 20%)' }}
                        >
                          {project.roles || 'Unspecified Role'}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {project.sourcer} •{' '}
                          {project.start_date
                            ? format(new Date(project.start_date), 'MMM yyyy')
                            : 'No date'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            project.group_type === 'Israel'
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                              : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                          }
                        >
                          {project.group_type}
                        </Badge>
                        <span className={`badge-model ${project.model_type?.toLowerCase().replace(' ', '-')}`}>
                          {project.model_type}
                        </span>
                        <Badge
                          className={
                            project.status === 'active'
                              ? 'bg-green-100 text-green-700 hover:bg-green-100'
                              : project.status === 'completed'
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-100'
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {(!clientProjects?.data || clientProjects.data.length === 0) && (
                    <div className="text-center py-8">
                      <div
                        className="animate-pulse text-muted-foreground"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        Loading projects...
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {(!filteredClients || filteredClients.length === 0) && (
          <div
            className="chart-container text-center py-16"
            style={{ background: 'linear-gradient(135deg, hsl(220 30% 97%) 0%, hsl(220 20% 95%) 100%)' }}
          >
            <div
              className="h-16 w-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, hsl(220 30% 85%) 0%, hsl(220 25% 80%) 100%)' }}
            >
              <Building2 className="h-8 w-8" style={{ color: 'hsl(220 25% 50%)' }} />
            </div>
            <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-display)', color: 'hsl(220 25% 30%)' }}>
              No clients found
            </h3>
            <p className="text-muted-foreground">
              {search ? 'Try adjusting your search term' : 'Add your first project to see clients here'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
