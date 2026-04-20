import { useState, useEffect } from 'react';
import { Sun, Moon, Search, Menu } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useTheme } from '../../hooks/useTheme';
import { GlobalSearch } from '../GlobalSearch';
import { NotificationBell } from '../NotificationBell';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { currentModule } = useAppStore();
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: '12px',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      }}>
        {/* Hamburger mobile */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '40px', height: '40px', borderRadius: '10px',
            border: '1px solid var(--border)', background: 'transparent',
            cursor: 'pointer', flexShrink: 0, color: 'var(--text)',
          }}
          title="Menú"
        >
          <Menu style={{ width: '18px', height: '18px' }} />
        </button>

        {/* Título módulo */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 700,
            fontFamily: "'Playfair Display', serif",
            color: 'var(--primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {currentModule}
          </h2>
        </div>

        {/* Search button */}
        <button
          onClick={() => setSearchOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 14px', borderRadius: '10px',
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
          }}
          title="Buscar (Ctrl+K)"
        >
          <Search style={{ width: '15px', height: '15px' }} />
          <span className="hidden sm:inline">Buscar</span>
          <kbd className="hidden sm:inline-flex" style={{
            padding: '2px 6px', borderRadius: '5px', fontSize: '10px',
            fontWeight: 600, background: 'var(--background)',
            border: '1px solid var(--border)', color: 'var(--text-muted)',
            fontFamily: 'monospace',
          }}>
            Ctrl+K
          </kbd>
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '40px', height: '40px', borderRadius: '10px',
            border: '1px solid var(--border)', background: 'transparent',
            cursor: 'pointer', flexShrink: 0,
            color: theme === 'dark' ? '#c9a84c' : 'var(--text)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >
          {theme === 'dark'
            ? <Sun style={{ width: '18px', height: '18px' }} />
            : <Moon style={{ width: '18px', height: '18px' }} />
          }
        </button>
      </header>

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
