import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main
        className="flex-1 overflow-auto"
        style={{
          background: `
            radial-gradient(ellipse at 0% 0%, hsl(32 40% 96% / 0.6) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 100%, hsl(220 30% 96% / 0.6) 0%, transparent 50%),
            hsl(40 33% 98%)
          `,
        }}
      >
        <div className="p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
