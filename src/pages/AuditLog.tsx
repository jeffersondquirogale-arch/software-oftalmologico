import { useEffect, useState } from 'react';
import { ClipboardList, Search, X } from 'lucide-react';
import { db } from '../db/database';
import type { AuditLog as AuditLogType } from '../db/database';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 14px', border: '1px solid var(--border)',
  borderRadius: '10px', fontSize: '13px', color: 'var(--text)',
  background: 'var(--background)', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif',
};

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
    if (filterUser) result = result.filter(l => l.userId.toLowerCase().includes(filterUser.toLowerCase()));
    if (filterAction) result = result.filter(l => l.action === filterAction);
    if (filterEntity) result = result.filter(l => l.entity === filterEntity);
    if (filterFrom) result = result.filter(l => l.timestamp >= filterFrom);
    if (filterTo) result = result.filter(l => l.timestamp <= filterTo + 'T23:59:59');
    if (searchTerm) result = result.filter(l => l.description.toLowerCase().includes(searchTerm.toLowerCase()));
    setFiltered(result);
  }, [logs, filterUser, filterAction, filterEntity, filterFrom, filterTo, searchTerm]);

  const actionConfig: Record<string, { label: string; color: string; bg: string }> = {
    create: { label: 'Crear',      color: '#4cc97a', bg: 'rgba(76,201,122,0.1)' },
    update: { label: 'Actualizar', color: '#4c9ac9', bg: 'rgba(76,154,201,0.1)' },
    delete: { label: 'Eliminar',   color: '#c96b4c', bg: 'rgba(201,107,76,0.1)' },
  };

  const entityLabel = (e: string) =>
    e === 'paciente' ? 'Paciente' : e === 'historiaClinica' ? 'Historia Clínica' : e === 'cita' ? 'Cita' : e;

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }); }
    catch { return iso; }
  };

  const clearFilters = () => {
    setFilterUser(''); setFilterAction(''); setFilterEntity('');
    setFilterFrom(''); setFilterTo(''); setSearchTerm('');
  };

  const hasFilters = filterUser || filterAction || filterEntity || filterFrom || filterTo || searchTerm;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: 'var(--primary)' }}>
          Registro de Auditoría
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
          Historial de acciones realizadas en el sistema
        </p>
      </div>

      {/* Filtros */}
      <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Filtros
          </p>
          {hasFilters && (
            <button onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'var(--danger)', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>
              <X style={{ width: '12px', height: '12px' }} /> Limpiar
            </button>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Buscar descripción..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '36px' }}
              onFocus={e => (e.target as HTMLElement).style.borderColor = '#c9a84c'}
              onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'} />
          </div>
          <input type="text" placeholder="Usuario" value={filterUser}
            onChange={e => setFilterUser(e.target.value)} style={inputStyle}
            onFocus={e => (e.target as HTMLElement).style.borderColor = '#c9a84c'}
            onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'} />
          <select value={filterAction} onChange={e => setFilterAction(e.target.value)}
            style={{ ...inputStyle, appearance: 'auto', cursor: 'pointer' }}>
            <option value="">Todas las acciones</option>
            <option value="create">Crear</option>
            <option value="update">Actualizar</option>
            <option value="delete">Eliminar</option>
          </select>
          <select value={filterEntity} onChange={e => setFilterEntity(e.target.value)}
            style={{ ...inputStyle, appearance: 'auto', cursor: 'pointer' }}>
            <option value="">Todas las entidades</option>
            <option value="paciente">Paciente</option>
            <option value="historiaClinica">Historia Clínica</option>
            <option value="cita">Cita</option>
          </select>
          <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)}
            style={inputStyle} title="Desde"
            onFocus={e => (e.target as HTMLElement).style.borderColor = '#c9a84c'}
            onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'} />
          <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)}
            style={inputStyle} title="Hasta"
            onFocus={e => (e.target as HTMLElement).style.borderColor = '#c9a84c'}
            onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'} />
        </div>
      </div>

      {/* Tabla */}
      <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ClipboardList style={{ width: '18px', height: '18px', color: 'var(--primary)' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
              {filtered.length} {filtered.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <ClipboardList style={{ width: '32px', height: '32px', opacity: 0.4, margin: '0 auto 12px' }} />
              <p style={{ margin: 0, fontSize: '14px' }}>No hay registros de auditoría</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr>
                  {['Fecha/Hora', 'Usuario', 'Acción', 'Entidad', 'Descripción'].map((h, i) => (
                    <th key={h} style={{ padding: '12px 20px', background: 'rgba(0,0,0,0.02)', borderBottom: '2px solid var(--border)', color: 'var(--text-muted)', fontWeight: 700, fontSize: '11px', letterSpacing: '0.07em', textTransform: 'uppercase', textAlign: i === 4 ? 'left' : 'left', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, idx) => {
                  const cfg = actionConfig[log.action] || { label: log.action, color: '#888', bg: 'rgba(0,0,0,0.05)' };
                  return (
                    <tr key={log.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.04)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                      <td style={{ padding: '12px 20px', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: '12px' }}>{formatDate(log.timestamp)}</td>
                      <td style={{ padding: '12px 20px', fontWeight: 600, color: 'var(--text)' }}>{log.userId}</td>
                      <td style={{ padding: '12px 20px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, color: cfg.color, background: cfg.bg }}>
                          {cfg.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px 20px', color: 'var(--text)' }}>{entityLabel(log.entity)}</td>
                      <td style={{ padding: '12px 20px', color: 'var(--text-muted)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.description}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
