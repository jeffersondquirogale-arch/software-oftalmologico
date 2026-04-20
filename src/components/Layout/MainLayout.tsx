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
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      {/* Sidebar — siempre visible en desktop */}
      <div className='no-print'><Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} /></div>

      {/* Contenido principal */}
      <div style={{
        flex: 1,
        marginLeft: '256px', // 64 * 4 = 256px = w-64
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
      }} className="lg:ml-64 ml-0">
        <div className='no-print'><Header onToggleSidebar={() => setSidebarOpen(prev => !prev)} /></div>
        <main style={{
          flex: 1,
          padding: '32px',
          paddingBottom: '80px',
          maxWidth: '1400px',
          width: '100%',
          boxSizing: 'border-box',
        }} className="sm:p-8 p-4 pb-20 md:pb-8">
          {children}
        </main>

        {/* Mobile bottom navigation */}
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          zIndex: 20,
        }} className="md:hidden">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 4px',
                  minHeight: '56px',
                  textDecoration: 'none',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 400,
                  transition: 'color 0.15s',
                }}
              >
                <Icon style={{ width: '20px', height: '20px' }} />
                <span style={{ fontSize: '10px', marginTop: '2px' }}>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <InstallPWA />
    </div>
  );
};
