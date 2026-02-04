import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Search, Filter } from 'lucide-react';
import { ProjectFilters as Filters } from '@/types';
import { projectsApi } from '@/api/projects';

interface ProjectFiltersProps {
  filters: Filters;
  onFilterChange: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  onReset: () => void;
  hideGroupFilter?: boolean;
}

export function ProjectFilters({
  filters,
  onFilterChange,
  onReset,
  hideGroupFilter,
}: ProjectFiltersProps) {
  const { data: filterOptions } = useQuery({
    queryKey: ['filter-options'],
    queryFn: projectsApi.getFilterOptions,
  });

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) =>
      value !== undefined &&
      value !== '' &&
      !['page', 'limit', 'sort_by', 'sort_order'].includes(key)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4" style={{ color: 'hsl(32 95% 44%)' }} />
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: 'hsl(220 15% 45%)' }}
        >
          Filters
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: 'hsl(220, 15%, 50%)' }}
          />
          <Input
            placeholder="Search projects..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="h-11 pl-11 rounded-xl border-2 transition-all duration-200"
            style={{
              borderColor: 'hsl(220 20% 90%)',
              background: 'hsl(0 0% 100%)',
              fontFamily: 'var(--font-body)',
            }}
          />
        </div>

        {/* Sourcer Select */}
        <Select
          value={filters.sourcer || ''}
          onValueChange={(value) =>
            onFilterChange('sourcer', value === 'all' ? undefined : value)
          }
        >
          <SelectTrigger
            className="w-[160px] h-11 rounded-xl border-2"
            style={{
              borderColor: 'hsl(220 20% 90%)',
              background: 'hsl(0 0% 100%)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <SelectValue placeholder="All Sourcers" />
          </SelectTrigger>
          <SelectContent
            className="rounded-xl"
            style={{
              background: 'hsl(0 0% 100%)',
              border: '1px solid hsl(220 20% 90%)',
            }}
          >
            <SelectItem value="all">All Sourcers</SelectItem>
            {filterOptions?.sourcers.map((sourcer) => (
              <SelectItem key={sourcer} value={sourcer}>
                {sourcer}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Model Select */}
        <Select
          value={filters.model_type || ''}
          onValueChange={(value) =>
            onFilterChange('model_type', value === 'all' ? undefined : (value as any))
          }
        >
          <SelectTrigger
            className="w-[160px] h-11 rounded-xl border-2"
            style={{
              borderColor: 'hsl(220 20% 90%)',
              background: 'hsl(0 0% 100%)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <SelectValue placeholder="All Models" />
          </SelectTrigger>
          <SelectContent
            className="rounded-xl"
            style={{
              background: 'hsl(0 0% 100%)',
              border: '1px solid hsl(220 20% 90%)',
            }}
          >
            <SelectItem value="all">All Models</SelectItem>
            <SelectItem value="Hourly">Hourly</SelectItem>
            <SelectItem value="Success">Success</SelectItem>
            <SelectItem value="Success Executive">Success Executive</SelectItem>
          </SelectContent>
        </Select>

        {/* Group Select */}
        {!hideGroupFilter && (
          <Select
            value={filters.group_type || ''}
            onValueChange={(value) =>
              onFilterChange('group_type', value === 'all' ? undefined : (value as any))
            }
          >
            <SelectTrigger
              className="w-[150px] h-11 rounded-xl border-2"
              style={{
                borderColor: 'hsl(220 20% 90%)',
                background: 'hsl(0 0% 100%)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <SelectValue placeholder="All Groups" />
            </SelectTrigger>
            <SelectContent
              className="rounded-xl"
              style={{
                background: 'hsl(0 0% 100%)',
                border: '1px solid hsl(220 20% 90%)',
              }}
            >
              <SelectItem value="all">All Groups</SelectItem>
              <SelectItem value="Israel">Israel</SelectItem>
              <SelectItem value="Global">Global</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Client Select */}
        <Select
          value={filters.company || ''}
          onValueChange={(value) =>
            onFilterChange('company', value === 'all' ? undefined : value)
          }
        >
          <SelectTrigger
            className="w-[160px] h-11 rounded-xl border-2"
            style={{
              borderColor: 'hsl(220 20% 90%)',
              background: 'hsl(0 0% 100%)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <SelectValue placeholder="All Clients" />
          </SelectTrigger>
          <SelectContent
            className="rounded-xl"
            style={{
              background: 'hsl(0 0% 100%)',
              border: '1px solid hsl(220 20% 90%)',
            }}
          >
            <SelectItem value="all">All Clients</SelectItem>
            {filterOptions?.companies.map((company) => (
              <SelectItem key={company} value={company}>
                {company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Select */}
        <Select
          value={filters.status || ''}
          onValueChange={(value) =>
            onFilterChange('status', value === 'all' ? undefined : (value as any))
          }
        >
          <SelectTrigger
            className="w-[140px] h-11 rounded-xl border-2"
            style={{
              borderColor: 'hsl(220 20% 90%)',
              background: 'hsl(0 0% 100%)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent
            className="rounded-xl"
            style={{
              background: 'hsl(0 0% 100%)',
              border: '1px solid hsl(220 20% 90%)',
            }}
          >
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            className="h-11 w-11 rounded-xl transition-all duration-200"
            style={{
              color: 'hsl(0 70% 50%)',
              background: 'hsl(0 80% 97%)',
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
