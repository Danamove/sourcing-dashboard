import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, TrendingDown, Loader2 } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

interface SourcerLacking {
  sourcer: string;
  totalHours: number;
  missingHours: number;
}

export function LackOfHoursPage() {
  const { getSourcersLackingHours } = useData();
  const [sourcersLacking, setSourcersLacking] = useState<SourcerLacking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await getSourcersLackingHours(200);
    setSourcersLacking(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalMissing = sourcersLacking.reduce((sum, s) => sum + s.missingHours, 0);

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
      <div className="page-header">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, hsl(32 95% 50%) 0%, hsl(25 90% 45%) 100%)',
              boxShadow: '0 4px 12px hsl(32 95% 40% / 0.3)',
            }}
          >
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <h1>Lack of Hours</h1>
        </div>
        <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
          Team members with less than 200 hours of active work.
          <span className="text-xs ml-2 opacity-70">(Success roles = 30 hours each)</span>
        </p>
      </div>

      {/* Summary Stats */}
      {sourcersLacking.length > 0 && (
        <div className="grid gap-5 md:grid-cols-3">
          <div className="stat-card rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div
                className="rounded-xl p-3"
                style={{
                  background: 'linear-gradient(135deg, hsl(32 90% 50%) 0%, hsl(25 85% 45%) 100%)',
                }}
              >
                <TrendingDown className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Team Members
                </p>
                <p className="text-3xl" style={{ fontFamily: 'var(--font-display)' }}>
                  {sourcersLacking.length}
                </p>
              </div>
            </div>
          </div>
          <div className="stat-card rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div
                className="rounded-xl p-3"
                style={{
                  background: 'linear-gradient(135deg, hsl(0 70% 50%) 0%, hsl(0 65% 45%) 100%)',
                }}
              >
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Total Missing
                </p>
                <p className="text-3xl" style={{ fontFamily: 'var(--font-display)' }}>
                  {totalMissing}h
                </p>
              </div>
            </div>
          </div>
          <div className="stat-card rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div
                className="rounded-xl p-3"
                style={{
                  background: 'linear-gradient(135deg, hsl(220 70% 50%) 0%, hsl(220 65% 45%) 100%)',
                }}
              >
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Avg Missing
                </p>
                <p className="text-3xl" style={{ fontFamily: 'var(--font-display)' }}>
                  {Math.round(totalMissing / sourcersLacking.length) || 0}h
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sourcers Cards */}
      {sourcersLacking.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 animate-stagger">
          {sourcersLacking.map((item) => {
            const percentage = (item.totalHours / 200) * 100;
            const urgency = percentage < 50 ? 'high' : percentage < 75 ? 'medium' : 'low';

            return (
              <div
                key={item.sourcer}
                className="alert-card group hover:shadow-lg transition-all duration-300"
                style={{
                  background:
                    urgency === 'high'
                      ? 'linear-gradient(135deg, hsl(0 80% 98%) 0%, hsl(0 60% 96%) 100%)'
                      : urgency === 'medium'
                      ? 'linear-gradient(135deg, hsl(32 100% 97%) 0%, hsl(32 80% 95%) 100%)'
                      : 'linear-gradient(135deg, hsl(45 80% 97%) 0%, hsl(45 60% 95%) 100%)',
                  borderColor:
                    urgency === 'high'
                      ? 'hsl(0 60% 85%)'
                      : urgency === 'medium'
                      ? 'hsl(32 60% 85%)'
                      : 'hsl(45 50% 85%)',
                }}
              >
                <div
                  className="absolute top-0 left-0 bottom-0 w-1 rounded-l-xl"
                  style={{
                    background:
                      urgency === 'high'
                        ? 'linear-gradient(180deg, hsl(0 70% 50%) 0%, hsl(0 60% 45%) 100%)'
                        : urgency === 'medium'
                        ? 'linear-gradient(180deg, hsl(32 95% 50%) 0%, hsl(25 90% 45%) 100%)'
                        : 'linear-gradient(180deg, hsl(45 80% 50%) 0%, hsl(40 70% 45%) 100%)',
                  }}
                />

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3
                      className="text-lg"
                      style={{ fontFamily: 'var(--font-display)', color: 'hsl(220 25% 15%)' }}
                    >
                      {item.sourcer}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {urgency === 'high' ? 'Needs attention' : urgency === 'medium' ? 'Below target' : 'Almost there'}
                    </p>
                  </div>
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        urgency === 'high'
                          ? 'hsl(0 70% 50%)'
                          : urgency === 'medium'
                          ? 'hsl(32 95% 50%)'
                          : 'hsl(45 80% 50%)',
                    }}
                  >
                    <AlertTriangle className="h-4 w-4 text-white" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current</span>
                    <span className="font-semibold" style={{ fontFamily: 'var(--font-body)' }}>
                      {item.totalHours} hours
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Missing</span>
                    <span
                      className="font-bold"
                      style={{
                        fontFamily: 'var(--font-body)',
                        color:
                          urgency === 'high'
                            ? 'hsl(0 70% 45%)'
                            : urgency === 'medium'
                            ? 'hsl(32 90% 40%)'
                            : 'hsl(45 70% 40%)',
                      }}
                    >
                      {item.missingHours} hours
                    </span>
                  </div>

                  <div className="pt-2">
                    <div className="progress-bar h-3">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${percentage}%`,
                          background:
                            urgency === 'high'
                              ? 'linear-gradient(90deg, hsl(0 70% 50%) 0%, hsl(0 60% 55%) 100%)'
                              : urgency === 'medium'
                              ? 'linear-gradient(90deg, hsl(32 95% 50%) 0%, hsl(40 90% 55%) 100%)'
                              : 'linear-gradient(90deg, hsl(45 80% 50%) 0%, hsl(50 70% 55%) 100%)',
                        }}
                      />
                    </div>
                    <p className="text-xs text-center mt-2 text-muted-foreground">
                      {Math.round(percentage)}% of 200h target
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="chart-container text-center py-16"
          style={{ background: 'linear-gradient(135deg, hsl(145 60% 97%) 0%, hsl(145 40% 95%) 100%)' }}
        >
          <div
            className="h-16 w-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, hsl(145 60% 45%) 0%, hsl(145 50% 40%) 100%)' }}
          >
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-display)', color: 'hsl(145 50% 30%)' }}>
            All caught up!
          </h3>
          <p className="text-muted-foreground">
            Every team member has at least 200 hours of active work.
          </p>
        </div>
      )}
    </div>
  );
}
