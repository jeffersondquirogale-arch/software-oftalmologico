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
    { name: 'Auditoría', path: '/audit', icon: ClipboardList, roles: ['doctor'] },
    { name: 'Configuración', path: '/configuracion', icon: Settings, roles: ['doctor'] },
  ];

  const visibleItems = menuItems.filter(item =>
    !user?.role || item.roles.includes(user.role)
  );

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };
  const handleNavClick = (name: string) => { setCurrentModule(name); onClose?.(); };

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && onClose && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 30,
          }}
          className="lg:hidden"
        />
      )}

      <div style={{
        position: 'fixed',
        left: 0, top: 0,
        height: '100vh',
        width: '256px',
        background: '#1a3a5c',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 40,
        boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
      }}
      className="lg:translate-x-0"
      >
        {/* Logo */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px',
                background: 'rgba(201,168,76,0.2)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Eye style={{ width: '20px', height: '20px', color: '#c9a84c' }} />
              </div>
              <h1 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 700,
                color: '#c9a84c',
                fontFamily: "'Playfair Display', serif",
              }}>
                OptiSalud
              </h1>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.5)', padding: '4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
            Dr. Juan D. Lozada S.
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
            Optómetra F.U.A.A.
          </p>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{user.username}</span>
              <span style={{
                fontSize: '10px', padding: '2px 8px', borderRadius: '20px',
                fontWeight: 700,
                background: isDoctor ? '#c9a84c' : 'rgba(255,255,255,0.15)',
                color: isDoctor ? '#1a3a5c' : 'white',
              }}>
                {isDoctor ? 'Doctor' : 'Asistente'}
              </span>
            </div>
          )}
        </div>

        {/* Navegación */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => handleNavClick(item.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      transition: 'all 0.15s',
                      background: isActive ? '#c9a84c' : 'transparent',
                      color: isActive ? '#1a3a5c' : 'rgba(255,255,255,0.75)',
                      fontWeight: isActive ? 700 : 400,
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                        (e.currentTarget as HTMLElement).style.color = 'white';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)';
                      }
                    }}
                  >
                    <Icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px' }}>{item.name}</span>
                    {isActive && (
                      <div style={{
                        marginLeft: 'auto',
                        width: '6px', height: '6px',
                        borderRadius: '50%',
                        background: '#1a3a5c',
                        flexShrink: 0,
                      }} />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div style={{
          padding: '12px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 14px', width: '100%', borderRadius: '10px',
              border: 'none', background: 'transparent',
              color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(192,57,43,0.3)';
              (e.currentTarget as HTMLElement).style.color = '#ff8a80';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)';
            }}
          >
            <LogOut style={{ width: '18px', height: '18px', flexShrink: 0 }} />
            <span>Cerrar Sesión</span>
          </button>
          <p style={{
            margin: '8px 0 0',
            fontSize: '10px',
            color: 'rgba(255,255,255,0.3)',
            textAlign: 'center',
          }}>
            TP 1.010.201.450 | RM 3945 CTNPO
          </p>
        </div>
      </div>
    </>
  );
};
