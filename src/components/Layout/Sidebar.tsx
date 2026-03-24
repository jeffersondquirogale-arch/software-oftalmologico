import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, FileText, Calendar, BarChart3, Eye, Settings, LogOut, ClipboardList, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCurrentModule } = useAppStore();
  const { logout, user } = useAuth();

  const isDoctor = user?.role === 'doctor';

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: Home, roles: ['doctor', 'asistente'] },
    { name: 'Pacientes', path: '/pacientes', icon: Users, roles: ['doctor', 'asistente'] },
    { name: 'Nueva Historia', path: '/nueva-historia', icon: FileText, roles: ['doctor', 'asistente'] },
    { name: 'Citas', path: '/citas', icon: Calendar, roles: ['doctor', 'asistente'] },
    { name: 'Reportes', path: '/reportes', icon: BarChart3, roles: ['doctor'] },
    { name: 'Registro de Auditoría', path: '/audit', icon: ClipboardList, roles: ['doctor'] },
    { name: 'Configuración', path: '/configuracion', icon: Settings, roles: ['doctor'] },
  ];

  const visibleItems = menuItems.filter((item) =>
    !user?.role || item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleNavClick = (name: string) => {
    setCurrentModule(name);
    onClose?.();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-primary text-white shadow-xl flex flex-col z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-6 border-b border-primary-light">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-accent" />
              <h1 className="text-2xl font-title font-bold text-accent">OptiSalud</h1>
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar menú"
              className="lg:hidden text-gray-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-300 font-light">Dr. Juan D. Lozada S.</p>
          <p className="text-xs text-gray-400 mt-1">Optómetra F.U.A.A.</p>
          {user && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-gray-300">{user.username}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                isDoctor
                  ? 'bg-accent text-primary'
                  : 'bg-gray-500 text-white'
              }`}>
                {isDoctor ? 'Doctor' : 'Asistente'}
              </span>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => handleNavClick(item.name)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all min-h-[44px] ${
                      isActive
                        ? 'bg-accent text-primary font-semibold'
                        : 'text-gray-300 hover:bg-primary-light hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-primary-light">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-300 hover:bg-danger hover:text-white transition-all min-h-[44px]"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Cerrar Sesión</span>
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">
            TP 1.010.201.450 | RM 3945 CTNPO
          </p>
        </div>
      </div>
    </>
  );
};
