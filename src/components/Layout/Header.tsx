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
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="bg-surface dark:bg-gray-800 shadow-sm border-b border-border dark:border-gray-700 h-16 flex items-center px-4 sm:px-8 gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          title="Menú"
        >
          <Menu className="w-5 h-5 text-text dark:text-gray-200" />
        </button>

        <h2 className="text-xl sm:text-2xl font-title font-semibold text-primary dark:text-blue-300 flex-1 truncate">
          {currentModule}
        </h2>

        {/* Search button */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-text-muted dark:text-gray-400 text-sm min-h-[44px]"
          title="Buscar (Ctrl+K)"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Buscar</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-700 ml-1">
            Ctrl+K
          </kbd>
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-accent" />
          ) : (
            <Moon className="w-5 h-5 text-text dark:text-gray-200" />
          )}
        </button>
      </header>

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
