import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BarChart3,
  Archive,
  Globe,
  MapPin,
  Building2,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth';

const navigation = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Lack of Hours', href: '/lack-of-hours', icon: AlertTriangle },
  { name: 'Israel Group', href: '/israel', icon: MapPin },
  { name: 'Global Group', href: '/global', icon: Globe },
  { name: 'All Clients', href: '/clients', icon: Building2 },
  { name: 'Archive', href: '/archive', icon: Archive },
];

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  return (
    <div
      className="flex h-full w-72 flex-col"
      style={{
        background: 'linear-gradient(180deg, hsl(220 25% 12%) 0%, hsl(220 30% 8%) 100%)',
      }}
    >
      {/* Logo Area */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, hsl(32 95% 50%) 0%, hsl(32 80% 40%) 100%)',
              boxShadow: '0 4px 12px hsl(32 95% 40% / 0.3)',
            }}
          >
            <span className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>S</span>
          </div>
          <div>
            <h1
              className="text-lg font-medium tracking-tight"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'hsl(40 20% 95%)',
              }}
            >
              Sourcing
            </h1>
            <p
              className="text-xs tracking-widest uppercase"
              style={{ color: 'hsl(32 60% 60%)' }}
            >
              Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        <p
          className="px-4 py-2 text-xs font-medium uppercase tracking-widest"
          style={{ color: 'hsl(220 15% 45%)' }}
        >
          Menu
        </p>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn('sidebar-nav-item', isActive && 'active')}
            >
              <item.icon className="h-5 w-5" style={{ opacity: isActive ? 1 : 0.7 }} />
              <span>{item.name}</span>
              {item.name === 'Lack of Hours' && (
                <span
                  className="ml-auto h-2 w-2 rounded-full"
                  style={{ background: 'hsl(32 95% 50%)' }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div
        className="mx-4 mb-4 rounded-xl p-4"
        style={{
          background: 'linear-gradient(135deg, hsl(220 25% 16%) 0%, hsl(220 25% 14%) 100%)',
          border: '1px solid hsl(220 20% 20%)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold"
            style={{
              background: 'linear-gradient(135deg, hsl(220 30% 25%) 0%, hsl(220 30% 20%) 100%)',
              color: 'hsl(32 80% 60%)',
              border: '2px solid hsl(32 80% 50% / 0.3)',
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-medium truncate"
              style={{ color: 'hsl(40 20% 90%)' }}
            >
              {user?.name}
            </p>
            <p
              className="text-xs truncate"
              style={{ color: 'hsl(220 15% 50%)' }}
            >
              {user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200"
          style={{
            color: 'hsl(220 15% 55%)',
            background: 'hsl(220 25% 12%)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'hsl(0 60% 40%)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'hsl(220 25% 12%)';
            e.currentTarget.style.color = 'hsl(220 15% 55%)';
          }}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
