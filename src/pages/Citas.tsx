import { useEffect, useState } from 'react';
import { Plus, X, Search, CheckCircle, Clock, Calendar, XCircle } from 'lucide-react';
import { spGetCitas, spGetPacientes, spAddCita, spUpdateCita } from '../lib/supabaseService';
import type { Cita, Paciente } from '../db/database';

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
  pendiente:  { label: 'Pendiente',  color: '#c9a84c', bg: 'rgba(201,168,76,0.1)',  border: 'rgba(201,168,76,0.25)',  icon: Clock },
  confirmada: { label: 'Confirmada', color: '#4c9ac9', bg: 'rgba(76,154,201,0.1)',  border: 'rgba(76,154,201,0.25)',  icon: CheckCircle },
  atendida:   { label: 'Atendida',   color: '#4cc97a', bg: 'rgba(76,201,122,0.1)',  border: 'rgba(76,201,122,0.25)',  icon: CheckCircle },
  cancelada:  { label: 'Cancelada',  color: '#c96b4c', bg: 'rgba(201,107,76,0.1)',  border: 'rgba(201,107,76,0.25)',  icon: XCircle },
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid var(--border)',
  borderRadius: '10px', fontSize: '14px', color: 'var(--text)',
  background: 'var(--background)', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '12px', fontWeight: 600,
  color: 'var(--text-muted)', letterSpacing: '0.06em',
  textTransform: 'uppercase', marginBottom: '6px',
};

export const Citas = () => {
  const [citas, setCitas] = useState<(Cita & { paciente?: Paciente })[]>([]);
  const [citasHoy, setCitasHoy] = useState<(Cita & { paciente?: Paciente })[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [statusModal, setStatusModal] = useState<{ id: number; estado: Cita['estado'] } | null>(null);
  const [searchDI, setSearchDI] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Paciente | null>(null);
  const [newCita, setNewCita] = useState<Partial<Cita>>({
    fecha: new Date().toISOString().split('T')[0],
    estado: 'pendiente',
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const loadCitas = async () => {
    try {
      const startOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1).toISOString().split('T')[0];
      const endOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).toISOString().split('T')[0];
      const allCitas = await spGetCitas(startOfMonth, endOfMonth);
      const citasConPaciente = await Promise.all(allCitas.map(async (cita) => {
        const allPacs = await spGetPacientes(); const paciente = allPacs.find(p => p.id === cita.pacienteId);
        return { ...cita, paciente };
      }));
      setCitas(citasConPaciente);
      const hoy = new Date().toISOString().split('T')[0];
      setCitasHoy(citasConPaciente.filter((c) => c.fecha === hoy));
    } catch { alert('Error al cargar las citas.'); }
  };

  useEffect(() => { loadCitas(); }, [selectedMonth]);

  const searchPatient = async () => {
    if (!searchDI) return;
    const allPacsS = await spGetPacientes(); const patient = allPacsS.find(p => p.di === searchDI);
    if (patient) setSelectedPatient(patient);
    else alert('Paciente no encontrado');
  };

  const handleSaveCita = async () => {
    if (!selectedPatient) { alert('Seleccione un paciente'); return; }
    if (!newCita.fecha || !newCita.hora || !newCita.motivo) { alert('Complete todos los campos'); return; }
    await spAddCita({ ...newCita, pacienteId: selectedPatient.id! } as any);
    setShowModal(false); setSelectedPatient(null); setSearchDI('');
    setNewCita({ fecha: new Date().toISOString().split('T')[0], estado: 'pendiente' });
    loadCitas();
  };

  const handleChangeStatus = async (citaId: number, newStatus: Cita['estado']) => {
    await spUpdateCita(citaId, newStatus);
    setStatusModal(null);
    loadCitas();
  };

  const getDaysInMonth = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const getCitasForDay = (day: number) => {
    const dateStr = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day).toISOString().split('T')[0];
    return citas.filter((c) => c.fecha === dateStr);
  };

  const changeMonth = (delta: number) => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + delta, 1));

  const today = new Date();
  const isToday = (day: number) =>
    today.getDate() === day &&
    today.getMonth() === selectedMonth.getMonth() &&
    today.getFullYear() === selectedMonth.getFullYear();

  const selectedDayCitas = selectedDay ? getCitasForDay(selectedDay) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: 'var(--primary)' }}>
            Citas
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>
            {citas.length} {citas.length === 1 ? 'cita este mes' : 'citas este mes'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Month navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '6px 12px' }}>
            <button onClick={() => changeMonth(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '16px', padding: '2px 6px', borderRadius: '6px' }}>‹</button>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', minWidth: '130px', textAlign: 'center', textTransform: 'capitalize' }}>
              {selectedMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => changeMonth(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '16px', padding: '2px 6px', borderRadius: '6px' }}>›</button>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '10px',
              background: 'var(--primary)', color: 'white',
              border: 'none', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
            }}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            Nueva Cita
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px' } as any}>

        {/* Calendario */}
        <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border)' }}>
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((d) => (
              <div key={d} style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {d}
              </div>
            ))}
          </div>
          {/* Days grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {getDaysInMonth().map((day, index) => {
              const dayCitas = day ? getCitasForDay(day) : [];
              const isTodayDay = day ? isToday(day) : false;
              const isSelected = day === selectedDay;
              return (
                <div
                  key={index}
                  onClick={() => day && setSelectedDay(isSelected ? null : day)}
                  style={{
                    minHeight: '90px',
                    padding: '8px',
                    borderRight: (index + 1) % 7 !== 0 ? '1px solid var(--border)' : 'none',
                    borderBottom: index < getDaysInMonth().length - 7 ? '1px solid var(--border)' : 'none',
                    background: isSelected
                      ? 'rgba(201,168,76,0.08)'
                      : !day ? 'rgba(0,0,0,0.02)' : 'transparent',
                    cursor: day ? 'pointer' : 'default',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => day && !isSelected && ((e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.02)')}
                  onMouseLeave={e => day && !isSelected && ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  {day && (
                    <>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '26px', height: '26px', borderRadius: '50%',
                        background: isTodayDay ? 'var(--primary)' : isSelected ? 'rgba(201,168,76,0.2)' : 'transparent',
                        color: isTodayDay ? 'white' : 'var(--text)',
                        fontSize: '13px', fontWeight: isTodayDay ? 700 : 500,
                        marginBottom: '4px',
                      }}>
                        {day}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {dayCitas.slice(0, 3).map((cita) => {
                          const cfg = statusConfig[cita.estado] || statusConfig.pendiente;
                          return (
                            <div
                              key={cita.id}
                              onClick={(e) => { e.stopPropagation(); setStatusModal({ id: cita.id!, estado: cita.estado }); }}
                              style={{
                                padding: '2px 6px', borderRadius: '4px',
                                fontSize: '11px', fontWeight: 500,
                                background: cfg.bg, color: cfg.color,
                                border: `1px solid ${cfg.border}`,
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                cursor: 'pointer',
                              }}
                            >
                              {cita.hora} {cita.paciente?.nombres?.split(' ')[0]}
                            </div>
                          );
                        })}
                        {dayCitas.length > 3 && (
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, paddingLeft: '4px' }}>
                            +{dayCitas.length - 3} más
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel lateral */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Citas del día seleccionado o de hoy */}
          <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '20px', flex: 1 }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: 'var(--primary)' }}>
              {selectedDay ? `Día ${selectedDay}` : 'Citas de Hoy'}
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
              {(selectedDay ? selectedDayCitas : citasHoy).length} citas
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(selectedDay ? selectedDayCitas : citasHoy).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <Calendar style={{ width: '28px', height: '28px', color: 'var(--text-muted)', opacity: 0.4, margin: '0 auto 10px' }} />
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Sin citas</p>
                </div>
              ) : (
                (selectedDay ? selectedDayCitas : citasHoy).map((cita) => {
                  const cfg = statusConfig[cita.estado] || statusConfig.pendiente;
                  return (
                    <div
                      key={cita.id}
                      onClick={() => setStatusModal({ id: cita.id!, estado: cita.estado })}
                      style={{
                        padding: '12px', borderRadius: '10px',
                        border: `1px solid ${cfg.border}`,
                        background: cfg.bg, cursor: 'pointer',
                        transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.8'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '13px', color: 'var(--text)' }}>
                          {cita.paciente?.nombres} {cita.paciente?.apellidos}
                        </p>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: cfg.color }}>{cita.hora}</span>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>{cita.motivo}</p>
                      <span style={{
                        display: 'inline-block', marginTop: '8px',
                        padding: '2px 8px', borderRadius: '20px',
                        fontSize: '11px', fontWeight: 600,
                        color: cfg.color, background: 'rgba(255,255,255,0.5)',
                      }}>
                        {cfg.label}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Resumen del mes */}
          <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '20px' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>Resumen del Mes</h3>
            {Object.entries(statusConfig).map(([key, cfg]) => {
              const count = citas.filter(c => c.estado === key).length;
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: 'var(--text)' }}>{cfg.label}</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: cfg.color }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Nueva Cita */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 50, padding: '16px',
        }}>
          <div style={{
            background: 'var(--surface)', borderRadius: '16px', padding: '32px',
            maxWidth: '460px', width: '100%', border: '1px solid var(--border)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: 'var(--primary)' }}>Nueva Cita</h3>
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>Complete los datos para agendar</p>
              </div>
              <button onClick={() => { setShowModal(false); setSelectedPatient(null); setSearchDI(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Buscador paciente */}
              {!selectedPatient ? (
                <div>
                  <label style={labelStyle}>Buscar Paciente por D.I.</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'var(--text-muted)' }} />
                      <input type="text" value={searchDI}
                        onChange={(e) => setSearchDI(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && searchPatient()}
                        style={{ ...inputStyle, paddingLeft: '36px' }}
                        placeholder="Número de documento"
                      />
                    </div>
                    <button onClick={searchPatient}
                      style={{ padding: '10px 16px', borderRadius: '10px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}>
                      Buscar
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'rgba(76,201,122,0.07)', border: '1px solid rgba(76,201,122,0.25)', borderRadius: '10px' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: 'var(--text)' }}>{selectedPatient.nombres} {selectedPatient.apellidos}</p>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>D.I.: {selectedPatient.di}</p>
                  </div>
                  <button onClick={() => { setSelectedPatient(null); setSearchDI(''); }}
                    style={{ background: 'none', border: '1px solid rgba(192,57,43,0.3)', borderRadius: '8px', padding: '4px 10px', color: 'var(--danger)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                    Cambiar
                  </button>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Fecha</label>
                  <input type="date" value={newCita.fecha || ''}
                    onChange={(e) => setNewCita({ ...newCita, fecha: e.target.value })}
                    style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Hora</label>
                  <input type="time" value={newCita.hora || ''}
                    onChange={(e) => setNewCita({ ...newCita, hora: e.target.value })}
                    style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Motivo</label>
                <input type="text" value={newCita.motivo || ''} placeholder="Motivo de la cita"
                  onChange={(e) => setNewCita({ ...newCita, motivo: e.target.value })}
                  style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Estado</label>
                <select value={newCita.estado || 'pendiente'}
                  onChange={(e) => setNewCita({ ...newCita, estado: e.target.value as Cita['estado'] })}
                  style={{ ...inputStyle, appearance: 'auto' }}>
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="atendida">Atendida</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Notas (opcional)</label>
                <textarea value={newCita.notas || ''}
                  onChange={(e) => setNewCita({ ...newCita, notas: e.target.value })}
                  rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '8px' }}>
                <button onClick={() => { setShowModal(false); setSelectedPatient(null); setSearchDI(''); }}
                  style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  Cancelar
                </button>
                <button onClick={handleSaveCita}
                  style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: 'white', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  Guardar Cita
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal cambiar estado */}
      {statusModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 50, padding: '16px',
        }}>
          <div style={{
            background: 'var(--surface)', borderRadius: '16px', padding: '28px',
            maxWidth: '340px', width: '100%', border: '1px solid var(--border)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: 'var(--primary)' }}>Cambiar Estado</h3>
              <button onClick={() => setStatusModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(Object.entries(statusConfig) as [Cita['estado'], typeof statusConfig[string]][]).map(([key, cfg]) => {
                const isActive = statusModal.estado === key;
                const Icon = cfg.icon;
                return (
                  <button key={key}
                    onClick={() => handleChangeStatus(statusModal.id, key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 16px', borderRadius: '10px',
                      border: `1px solid ${isActive ? cfg.border : 'var(--border)'}`,
                      background: isActive ? cfg.bg : 'transparent',
                      cursor: 'pointer', textAlign: 'left',
                      fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => !isActive && ((e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.03)')}
                    onMouseLeave={e => !isActive && ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                  >
                    <Icon style={{ width: '16px', height: '16px', color: isActive ? cfg.color : 'var(--text-muted)', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', fontWeight: isActive ? 700 : 500, color: isActive ? cfg.color : 'var(--text)' }}>
                      {cfg.label}
                    </span>
                    {isActive && <span style={{ marginLeft: 'auto', fontSize: '12px', color: cfg.color, fontWeight: 700 }}>Actual</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
