import { useState } from 'react';
import { ChevronDown, Building2, Search, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import * as storage from '@/lib/storage';

export function ClientsPage() {
  const [search, setSearch] = useState('');
  const [expandedClient, setExpandedClient] = useState<string | null>(null);

  const clientStats = storage.getClientStats();
  const filteredClients = clientStats.filter((client) =>
    client.company.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (company: string) => {
    setExpandedClient(expandedClient === company ? null : company);
  };

  const getClientProjects = (company: string) => {
    return storage.getProjects({ company });
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="page-header">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, hsl(280 60% 50%) 0%, hsl(280 55% 40%) 100%)', boxShadow: '0 4px 12px hsl(280 60% 40% / 0.3)' }}>
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <h1>All Clients</h1>
        </div>
        <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>Companies and their project details</p>
      </div>

      <div className="max-w-md relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'hsl(220, 15%, 50%)' }} />
        <Input placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="h-12 pl-11 rounded-xl border-2" style={{ borderColor: 'hsl(220 20% 90%)', background: 'hsl(0 0% 100%)' }} />
      </div>

      <div className="space-y-4 animate-stagger">
        {filteredClients.map((client) => (
          <div key={client.company} className="chart-container overflow-hidden" style={{ padding: 0 }}>
            <div className="p-5 cursor-pointer transition-all duration-200 hover:bg-muted/30" onClick={() => toggleExpand(client.company)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <ChevronDown className="h-5 w-5" style={{ transform: expandedClient === client.company ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center text-lg font-semibold"
                    style={{ background: 'linear-gradient(135deg, hsl(40 30% 95%) 0%, hsl(40 20% 92%) 100%)', color: 'hsl(220 25% 30%)', fontFamily: 'var(--font-display)' }}>
                    {client.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg" style={{ fontFamily: 'var(--font-display)', color: 'hsl(220 25% 15%)' }}>{client.company}</h3>
                    <p className="text-sm text-muted-foreground">{client.projectCount} project{client.projectCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Roles</p>
                    <p className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>{client.totalRoles}</p>
                  </div>
                  {client.totalHours > 0 && (
                    <div className="text-right">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Hours</p>
                      <p className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>{client.totalHours}</p>
                    </div>
                  )}
                  {client.totalHires > 0 && (
                    <div className="text-right">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Hires</p>
                      <p className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>{client.totalHires}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {expandedClient === client.company && (
              <div className="border-t px-5 py-4" style={{ borderColor: 'hsl(220 20% 92%)', background: 'linear-gradient(180deg, hsl(40 30% 98%) 0%, hsl(40 20% 97%) 100%)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="h-4 w-4" style={{ color: 'hsl(32 95% 44%)' }} />
                  <h4 className="font-medium text-sm uppercase tracking-wider" style={{ color: 'hsl(220 15% 45%)' }}>Projects</h4>
                </div>
                <div className="space-y-3">
                  {getClientProjects(client.company).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'hsl(0 0% 100%)', border: '1px solid hsl(220 20% 92%)' }}>
                      <div>
                        <p className="font-medium" style={{ fontFamily: 'var(--font-body)', color: 'hsl(220 25% 20%)' }}>{project.roles || 'Unspecified Role'}</p>
                        <p className="text-sm text-muted-foreground mt-1">{project.sourcer} • {project.start_date ? format(new Date(project.start_date), 'MMM yyyy') : 'No date'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={project.group_type === 'Israel' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}>{project.group_type}</Badge>
                        <Badge variant="outline">{project.model_type}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {filteredClients.length === 0 && (
          <div className="chart-container text-center py-16">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No clients found</p>
          </div>
        )}
      </div>
    </div>
  );
}
