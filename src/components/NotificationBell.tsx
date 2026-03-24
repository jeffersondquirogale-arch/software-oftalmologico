import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X, CheckCheck, Calendar, Clock, UserCheck } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, dismiss, dismissAll } = useNotifications();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const iconForType = (type: string) => {
    if (type === 'cita_hoy') return <Calendar className="w-4 h-4 text-danger" />;
    if (type === 'cita_proxima') return <Clock className="w-4 h-4 text-accent" />;
    return <UserCheck className="w-4 h-4 text-success" />;
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="Notificaciones"
      >
        <Bell className="w-5 h-5 text-text dark:text-gray-200" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-surface dark:bg-gray-800 rounded-xl shadow-xl border border-border dark:border-gray-600 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border dark:border-gray-600">
            <h3 className="font-semibold text-text dark:text-gray-100 text-sm">Notificaciones</h3>
            {notifications.length > 0 && (
              <button
                onClick={dismissAll}
                className="text-xs text-primary dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" />
                Limpiar todo
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="w-8 h-8 mx-auto mb-2 text-text-muted opacity-40" />
                <p className="text-sm text-text-muted dark:text-gray-400">Sin notificaciones pendientes</p>
              </div>
            ) : (
              <ul>
                {notifications.map((notif) => (
                  <li key={notif.id} className="border-b border-border dark:border-gray-700 last:border-0">
                    <div className="flex items-start gap-3 px-4 py-3 hover:bg-background dark:hover:bg-gray-700">
                      <span className="mt-0.5">{iconForType(notif.type)}</span>
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => {
                          navigate(notif.link);
                          setIsOpen(false);
                        }}
                      >
                        <p className="text-sm font-medium text-text dark:text-gray-100">{notif.title}</p>
                        <p className="text-xs text-text-muted dark:text-gray-400 truncate">{notif.message}</p>
                      </div>
                      <button
                        onClick={() => dismiss(notif.id)}
                        className="text-text-muted hover:text-danger dark:hover:text-red-400 ml-1 flex-shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
