import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Trash2, FileText, Eye, Users, UserPlus, X } from 'lucide-react';
import type { Paciente } from '../db/database';
import { spGetPacientes, spDeletePaciente } from '../lib/supabaseService';

export const Pacientes = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const itemsPerPage = 10;

  const loadPacientes = async () => {
    try {
      const allPacientes = await spGetPacientes();
      setPacientes(allPacientes);
    } catch {
      alert('Error al cargar los pacientes. Intente nuevamente.');
    }
  };

  const filterPacientes = () => {
    if (!searchTerm) {
      setFilteredPacientes(pacientes);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = pacientes.filter(
      (p) =>
        p.nombres.toLowerCase().includes(term) ||
        p.apellidos.toLowerCase().includes(term) ||
        p.di.toLowerCase().includes(term)
    );
    setFilteredPacientes(filtered);
    setCurrentPage(1);
  };

  useEffect(() => { loadPacientes(); }, []);
  useEffect(() => { filterPacientes(); }, [searchTerm, pacientes]);

  const handleDelete = async (id: number) => {
    try {
      await spDeletePaciente(id);
      setDeleteConfirm(null);
      loadPacientes();
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('Error al eliminar el paciente');
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPacientes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPacientes.length / itemsPerPage);

  const getInitials = (nombres: string, apellidos: string) => {
    return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase();
  };

  const avatarColors = [
    '#c9a84c', '#4c9ac9', '#4cc97a', '#c96b4c', '#9a4cc9', '#c94c8a'
  ];
  const getAvatarColor = (id: number) => avatarColors[id % avatarColors.length];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{
            margin: 0, fontSize: '28px', fontWeight: 700,
            fontFamily: "'Playfair Display', serif",
            color: 'var(--primary)',
          }}>
            Pacientes
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>
            {pacientes.length} {pacientes.length === 1 ? 'paciente registrado' : 'pacientes registrados'}
          </p>
        </div>
        <Link
          to="/nueva-historia"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px',
            background: 'var(--primary)',
            color: 'white',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
            transition: 'opacity 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
        >
          <UserPlus style={{ width: '16px', height: '16px' }} />
          Nueva Historia
        </Link>
      </div>

      {/* Search + Table */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        overflow: 'hidden',
      }}>
        {/* Search bar */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <Search style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
              width: '16px', height: '16px', color: 'var(--text-muted)',
            }} />
            <input
              type="text"
              placeholder="Buscar por nombre o documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 40px',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                fontSize: '14px',
                color: 'var(--text)',
                background: 'var(--background)',
                outline: 'none',
                transition: 'border-color 0.15s',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.target as HTMLElement).style.borderColor = '#c9a84c'}
              onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                  color: 'var(--text-muted)',
                }}
              >
                <X style={{ width: '14px', height: '14px' }} />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          {currentItems.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: '64px 24px', textAlign: 'center',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(201,168,76,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <Users style={{ width: '28px', height: '28px', color: '#c9a84c', opacity: 0.6 }} />
              </div>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--text)', fontSize: '16px' }}>
                {searchTerm ? 'Sin resultados' : 'No hay pacientes'}
              </p>
              <p style={{ margin: '6px 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>
                {searchTerm ? `No se encontraron resultados para "${searchTerm}"` : 'Crea la primera historia clínica para comenzar'}
              </p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.02)' }}>
                  {['Paciente', 'D.I.', 'Teléfono', 'EPS', 'Fecha Registro', 'Acciones'].map((col, i) => (
                    <th key={col} style={{
                      padding: '12px 20px',
                      textAlign: i === 5 ? 'center' : 'left',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid var(--border)',
                      whiteSpace: 'nowrap',
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((paciente, idx) => (
                  <tr
                    key={paciente.id}
                    style={{
                      borderBottom: idx < currentItems.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.04)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    {/* Paciente con avatar */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: getAvatarColor(paciente.id ?? idx),
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                          fontSize: '13px', fontWeight: 700, color: 'white',
                        }}>
                          {getInitials(paciente.nombres, paciente.apellidos)}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: 'var(--text)' }}>
                            {paciente.nombres} {paciente.apellidos}
                          </p>
                          <p style={{ margin: '1px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                            {paciente.ocupacion || 'Sin ocupación'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text)', fontFamily: 'monospace', letterSpacing: '0.04em' }}>
                      {paciente.di}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text)' }}>
                      {paciente.telefono}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 500,
                        background: 'rgba(76,154,201,0.1)',
                        color: '#4c9ac9',
                        border: '1px solid rgba(76,154,201,0.2)',
                      }}>
                        {paciente.eps || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      {new Date(paciente.fechaRegistro).toLocaleDateString('es-ES', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <Link
                          to={`/pacientes/${paciente.id}`}
                          title="Ver Historial"
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: 'rgba(26,58,92,0.08)', border: '1px solid rgba(26,58,92,0.15)',
                            color: 'var(--primary)', textDecoration: 'none',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = 'var(--primary)';
                            (e.currentTarget as HTMLElement).style.color = 'white';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(26,58,92,0.08)';
                            (e.currentTarget as HTMLElement).style.color = 'var(--primary)';
                          }}
                        >
                          <Eye style={{ width: '14px', height: '14px' }} />
                        </Link>
                        <Link
                          to={`/nueva-historia/${paciente.id}`}
                          title="Nueva Historia"
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: 'rgba(46,125,82,0.08)', border: '1px solid rgba(46,125,82,0.15)',
                            color: 'var(--success)', textDecoration: 'none',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = 'var(--success)';
                            (e.currentTarget as HTMLElement).style.color = 'white';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(46,125,82,0.08)';
                            (e.currentTarget as HTMLElement).style.color = 'var(--success)';
                          }}
                        >
                          <FileText style={{ width: '14px', height: '14px' }} />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(paciente.id!)}
                          title="Eliminar"
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.15)',
                            color: 'var(--danger)', cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = 'var(--danger)';
                            (e.currentTarget as HTMLElement).style.color = 'white';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(192,57,43,0.08)';
                            (e.currentTarget as HTMLElement).style.color = 'var(--danger)';
                          }}
                        >
                          <Trash2 style={{ width: '14px', height: '14px' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 24px',
            borderTop: '1px solid var(--border)',
          }}>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
              Mostrando {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredPacientes.length)} de {filteredPacientes.length}
            </p>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                  border: '1px solid var(--border)', background: 'transparent',
                  color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text)',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.5 : 1,
                  transition: 'all 0.15s',
                }}
              >
                Anterior
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    width: '34px', height: '34px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                    border: currentPage === page ? 'none' : '1px solid var(--border)',
                    background: currentPage === page ? 'var(--primary)' : 'transparent',
                    color: currentPage === page ? 'white' : 'var(--text)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                  border: '1px solid var(--border)', background: 'transparent',
                  color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text)',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  transition: 'all 0.15s',
                }}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50, padding: '16px',
        }}>
          <div style={{
            background: 'var(--surface)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '420px',
            width: '100%',
            border: '1px solid var(--border)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: 'rgba(192,57,43,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '20px',
            }}>
              <Trash2 style={{ width: '22px', height: '22px', color: 'var(--danger)' }} />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: 'var(--primary)' }}>
              Eliminar Paciente
            </h3>
            <p style={{ margin: '0 0 28px', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Esta acción eliminará permanentemente al paciente junto con todas sus historias clínicas y citas. No se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                  border: '1px solid var(--border)', background: 'transparent',
                  color: 'var(--text)', cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                style={{
                  padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                  border: 'none', background: 'var(--danger)',
                  color: 'white', cursor: 'pointer',
                }}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};