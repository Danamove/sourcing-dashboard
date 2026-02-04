import { useState } from 'react';
import { Plus, MapPin, Globe, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectsTable } from '@/components/projects/ProjectsTable';
import { ProjectFilters } from '@/components/projects/ProjectFilters';
import { ProjectFormDialog } from '@/components/projects/ProjectFormDialog';
import { useFiltersStore } from '@/stores/filters';
import { GroupType, ProjectFilters as Filters, ProjectStatus } from '@/types';

interface ProjectsPageProps {
  title: string;
  description?: string;
  defaultGroupType?: GroupType;
  defaultStatus?: ProjectStatus;
  hideGroupFilter?: boolean;
}

export function ProjectsPage({
  title,
  description,
  defaultGroupType,
  defaultStatus,
  hideGroupFilter,
}: ProjectsPageProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { filters, setFilter, setFilters, resetFilters } = useFiltersStore();

  const effectiveFilters: Filters = {
    ...filters,
    group_type: defaultGroupType || filters.group_type,
    status: defaultStatus || filters.status,
  };

  const handleFilterChange = <K extends keyof Filters>(
    key: K,
    value: Filters[K]
  ) => {
    setFilter(key, value);
  };

  const handleFiltersChange = (newFilters: Partial<Filters>) => {
    setFilters(newFilters);
  };

  const handleReset = () => {
    resetFilters();
  };

  // Determine icon and color based on page type
  const getPageStyle = () => {
    if (defaultGroupType === 'Israel') {
      return {
        icon: MapPin,
        gradient: 'linear-gradient(135deg, hsl(220 70% 50%) 0%, hsl(220 65% 40%) 100%)',
        shadow: '0 4px 12px hsl(220 70% 40% / 0.3)',
      };
    }
    if (defaultGroupType === 'Global') {
      return {
        icon: Globe,
        gradient: 'linear-gradient(135deg, hsl(160 60% 40%) 0%, hsl(160 55% 35%) 100%)',
        shadow: '0 4px 12px hsl(160 60% 35% / 0.3)',
      };
    }
    if (defaultStatus === 'archived') {
      return {
        icon: Archive,
        gradient: 'linear-gradient(135deg, hsl(220 15% 50%) 0%, hsl(220 15% 40%) 100%)',
        shadow: '0 4px 12px hsl(220 15% 40% / 0.3)',
      };
    }
    return {
      icon: MapPin,
      gradient: 'linear-gradient(135deg, hsl(32 95% 44%) 0%, hsl(32 80% 38%) 100%)',
      shadow: '0 4px 12px hsl(32 95% 40% / 0.3)',
    };
  };

  const pageStyle = getPageStyle();
  const IconComponent = pageStyle.icon;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="page-header flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{
                background: pageStyle.gradient,
                boxShadow: pageStyle.shadow,
              }}
            >
              <IconComponent className="h-5 w-5 text-white" />
            </div>
            <h1>{title}</h1>
          </div>
          {description && (
            <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
              {description}
            </p>
          )}
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

      {/* Filters */}
      <div className="chart-container">
        <ProjectFilters
          filters={effectiveFilters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          hideGroupFilter={hideGroupFilter || !!defaultGroupType}
        />
      </div>

      {/* Projects Table */}
      <div className="chart-container overflow-hidden" style={{ padding: 0 }}>
        <ProjectsTable
          filters={effectiveFilters}
          onFiltersChange={handleFiltersChange}
        />
      </div>

      <ProjectFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
