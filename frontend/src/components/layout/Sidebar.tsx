import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, BarChart3, Archive, Globe, MapPin, Building2, AlertTriangle } from 'lucide-react';

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

  return (
    <div className="flex h-full w-72 flex-col" style={{ background: 'linear-gradient(180deg, hsl(220 25% 12%) 0%, hsl(220 30% 8%) 100%)' }}>
      <div className="px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(32 95% 50%) 0%, hsl(32 80% 40%) 100%)', boxShadow: '0 4px 12px hsl(32 95% 40% / 0.3)' }}>
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-lg font-medium tracking-tight" style={{ color: 'hsl(40 20% 95%)' }}>Sourcing</h1>
            <p className="text-xs tracking-widest uppercase" style={{ color: 'hsl(32 60% 60%)' }}>Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <p className="px-4 py-2 text-xs font-medium uppercase tracking-widest" style={{ color: 'hsl(220 15% 45%)' }}>Menu</p>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
          return (
            <Link key={item.name} to={item.href} className={cn('sidebar-nav-item', isActive && 'active')}>
              <item.icon className="h-5 w-5" style={{ opacity: isActive ? 1 : 0.7 }} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 mb-4 p-4 rounded-xl" style={{ background: 'hsl(220 25% 16%)', border: '1px solid hsl(220 20% 20%)' }}>
        <p className="text-xs text-center" style={{ color: 'hsl(220 15% 55%)' }}>Data stored locally in your browser</p>
      </div>
    </div>
  );
}
