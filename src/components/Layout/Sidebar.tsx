import { Link, useLocation } from 'react-router-dom';
import { Home, Users, FileText, Calendar, BarChart3, Eye } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const Sidebar = () => {
  const location = useLocation();
  const { setCurrentModule } = useAppStore();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Pacientes', path: '/pacientes', icon: Users },
    { name: 'Nueva Historia', path: '/nueva-historia', icon: FileText },
    { name: 'Citas', path: '/citas', icon: Calendar },
    { name: 'Reportes', path: '/reportes', icon: BarChart3 },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-primary text-white shadow-xl flex flex-col">
      <div className="p-6 border-b border-primary-light">
        <div className="flex items-center gap-3 mb-2">
          <Eye className="w-8 h-8 text-accent" />
          <h1 className="text-2xl font-title font-bold text-accent">OptiSalud</h1>
        </div>
        <p className="text-sm text-gray-300 font-light">Dr. Juan D. Lozada S.</p>
        <p className="text-xs text-gray-400 mt-1">Optómetra F.U.A.A.</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setCurrentModule(item.name)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-accent text-primary font-semibold'
                      : 'text-gray-300 hover:bg-primary-light hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-6 border-t border-primary-light">
        <p className="text-xs text-gray-400 text-center">
          TP 1.010.201.450 | RM 3945 CTNPO
        </p>
      </div>
    </div>
  );
};
