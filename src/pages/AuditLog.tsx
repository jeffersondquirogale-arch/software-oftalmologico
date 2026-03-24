import { useEffect, useState } from 'react';
import { ClipboardList, Filter, Search } from 'lucide-react';
import { db } from '../db/database';
import type { AuditLog as AuditLogType } from '../db/database';

export const AuditLog = () => {
  const [logs, setLogs] = useState<AuditLogType[]>([]);
  const [filtered, setFiltered] = useState<AuditLogType[]>([]);
  const [filterUser, setFilterUser] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterEntity, setFilterEntity] = useState('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    db.auditLog.orderBy('timestamp').reverse().toArray().then(setLogs);
  }, []);

  useEffect(() => {
    let result = [...logs];
    if (filterUser) result = result.filter((l) => l.userId.toLowerCase().includes(filterUser.toLowerCase()));
    if (filterAction) result = result.filter((l) => l.action === filterAction);
    if (filterEntity) result = result.filter((l) => l.entity === filterEntity);
    if (filterFrom) result = result.filter((l) => l.timestamp >= filterFrom);
    if (filterTo) result = result.filter((l) => l.timestamp <= filterTo + 'T23:59:59');
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      result = result.filter((l) => l.description.toLowerCase().includes(t));
    }
    setFiltered(result);
  }, [logs, filterUser, filterAction, filterEntity, filterFrom, filterTo, searchTerm]);

  const actionLabel = (action: string) => {
    if (action === 'create') return <span className="px-2 py-0.5 bg-success/10 text-success rounded-full text-xs">Crear</span>;
    if (action === 'update') return <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">Actualizar</span>;
    return <span className="px-2 py-0.5 bg-danger/10 text-danger rounded-full text-xs">Eliminar</span>;
  };

  const entityLabel = (entity: string) => {
    if (entity === 'paciente') return 'Paciente';
    if (entity === 'historiaClinica') return 'Historia Clínica';
    if (entity === 'cita') return 'Cita';
    return entity;
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ClipboardList className="w-7 h-7 text-primary dark:text-blue-300" />
        <h1 className="text-2xl font-title font-bold text-primary dark:text-blue-300">Registro de Auditoría</h1>
      </div>

      {/* Filters */}
      <div className="bg-surface dark:bg-gray-800 rounded-xl border border-border dark:border-gray-700 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-text-muted" />
          <span className="font-medium text-text dark:text-gray-200 text-sm">Filtros</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-border dark:border-gray-600 rounded-lg text-sm bg-background dark:bg-gray-700 text-text dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <input
            type="text"
            placeholder="Usuario"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="px-3 py-2 border border-border dark:border-gray-600 rounded-lg text-sm bg-background dark:bg-gray-700 text-text dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-2 border border-border dark:border-gray-600 rounded-lg text-sm bg-background dark:bg-gray-700 text-text dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Todas las acciones</option>
            <option value="create">Crear</option>
            <option value="update">Actualizar</option>
            <option value="delete">Eliminar</option>
          </select>
          <select
            value={filterEntity}
            onChange={(e) => setFilterEntity(e.target.value)}
            className="px-3 py-2 border border-border dark:border-gray-600 rounded-lg text-sm bg-background dark:bg-gray-700 text-text dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Todas las entidades</option>
            <option value="paciente">Paciente</option>
            <option value="historiaClinica">Historia Clínica</option>
            <option value="cita">Cita</option>
          </select>
          <input
            type="date"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            className="px-3 py-2 border border-border dark:border-gray-600 rounded-lg text-sm bg-background dark:bg-gray-700 text-text dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary"
            title="Desde"
          />
          <input
            type="date"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
            className="px-3 py-2 border border-border dark:border-gray-600 rounded-lg text-sm bg-background dark:bg-gray-700 text-text dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary"
            title="Hasta"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface dark:bg-gray-800 rounded-xl border border-border dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-border dark:border-gray-700 flex items-center justify-between">
          <span className="text-sm font-medium text-text dark:text-gray-200">
            {filtered.length} registro{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="text-left px-4 py-3 text-text-muted dark:text-gray-400 font-medium">Fecha/Hora</th>
                <th className="text-left px-4 py-3 text-text-muted dark:text-gray-400 font-medium">Usuario</th>
                <th className="text-left px-4 py-3 text-text-muted dark:text-gray-400 font-medium">Acción</th>
                <th className="text-left px-4 py-3 text-text-muted dark:text-gray-400 font-medium">Entidad</th>
                <th className="text-left px-4 py-3 text-text-muted dark:text-gray-400 font-medium">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-text-muted dark:text-gray-400">
                    No hay registros de auditoría
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="border-t border-border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 text-text dark:text-gray-300 whitespace-nowrap">{formatDate(log.timestamp)}</td>
                    <td className="px-4 py-3 text-text dark:text-gray-300">{log.userId}</td>
                    <td className="px-4 py-3">{actionLabel(log.action)}</td>
                    <td className="px-4 py-3 text-text dark:text-gray-300">{entityLabel(log.entity)}</td>
                    <td className="px-4 py-3 text-text dark:text-gray-300 max-w-xs truncate">{log.description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
