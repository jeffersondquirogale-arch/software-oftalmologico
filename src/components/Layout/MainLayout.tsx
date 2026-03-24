import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, BarChart3, Settings } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../../hooks/useAuth';
import { InstallPWA } from '../InstallPWA';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const bottomNavItems = [
    { name: 'Inicio', path: '/', icon: Home },
    { name: 'Pacientes', path: '/pacientes', icon: Users },
    { name: 'Citas', path: '/citas', icon: Calendar },
    ...(user?.role === 'doctor' ? [{ name: 'Reportes', path: '/reportes', icon: BarChart3 }] : []),
    ...(user?.role === 'doctor' ? [{ name: 'Config.', path: '/configuracion', icon: Settings }] : []),
  ].slice(0, 5);

  return (
    <div className="flex min-h-screen bg-background dark:bg-gray-900">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 lg:ml-64 flex flex-col">
        <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 p-4 sm:p-8 pb-20 md:pb-8">
          {children}
        </main>
        {/* Mobile bottom navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-surface dark:bg-gray-800 border-t border-border dark:border-gray-700 flex md:hidden z-20">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-1 flex flex-col items-center justify-center py-2 min-h-[56px] transition-colors ${
                  isActive
                    ? 'text-primary dark:text-blue-300 font-semibold'
                    : 'text-text-muted dark:text-gray-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <InstallPWA />
    </div>
  );
};
