import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, TrendingUp, UserPlus, FileText, CalendarPlus, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { spGetPacientes, spGetCitasByFecha, spCountHistoriasByFecha } from '../lib/supabaseService';
import type { Paciente, Cita } from '../db/database';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    pacientesHoy: 0,
    citasHoy: 0,
    totalPacientes: 0,
    nuevosEsteMes: 0,
  });
  const [chartData, setChartData] = useState<{ fecha: string; pacientes: number }[]>([]);
  const [citasHoy, setCitasHoy] = useState<(Cita & { paciente?: Paciente })[]>([]);

  const loadDashboardData = async () => {
    const hoy = new Date().toISOString().split('T')[0];
    const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0];

    const allPacs = await spGetPacientes(); const totalPacientes = allPacs.length;
    const nuevosEsteMes = allPacs.filter(p => p.fechaRegistro >= inicioMes).length;

    const todasCitas = await spGetCitasByFecha(hoy);
    const citasHoyCount = todasCitas.length;

    const citasConPaciente = await Promise.all(
      todasCitas.map(async (cita) => {
        const paciente = allPacs.find(p => p.id === cita.pacienteId);
        return { ...cita, paciente };
      })
    );
    setCitasHoy(citasConPaciente);

    const historiasHoy = await spCountHistoriasByFecha(hoy);

    setStats({
      pacientesHoy: historiasHoy,
      citasHoy: citasHoyCount,
      totalPacientes,
      nuevosEsteMes,
    });

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = await spCountHistoriasByFecha(dateStr);
      const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
      last7Days.push({ fecha: dayName, pacientes: count });
    }
    setChartData(last7Days);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const statsCards = [
    {
      title: 'Pacientes Hoy',
      value: stats.pacientesHoy,
      icon: Users,
      accent: '#c9a84c',
      bg: 'rgba(201,168,76,0.08)',
      border: 'rgba(201,168,76,0.2)',
    },
    {
      title: 'Citas Hoy',
      value: stats.citasHoy,
      icon: Calendar,
      accent: '#4c9ac9',
      bg: 'rgba(76,154,201,0.08)',
      border: 'rgba(76,154,201,0.2)',
    },
    {
      title: 'Total Pacientes',
      value: stats.totalPacientes,
      icon: TrendingUp,
      accent: '#4cc97a',
      bg: 'rgba(76,201,122,0.08)',
      border: 'rgba(76,201,122,0.2)',
    },
    {
      title: 'Nuevos Este Mes',
      value: stats.nuevosEsteMes,
      icon: UserPlus,
      accent: '#c96b4c',
      bg: 'rgba(201,107,76,0.08)',
      border: 'rgba(201,107,76,0.2)',
    },
  ];

  const getStatusConfig = (estado: string) => {
    switch (estado) {
      case 'pendiente': return { label: 'Pendiente', color: '#c9a84c', bg: 'rgba(201,168,76,0.12)' };
      case 'confirmada': return { label: 'Confirmada', color: '#4c9ac9', bg: 'rgba(76,154,201,0.12)' };
      case 'atendida': return { label: 'Atendida', color: '#4cc97a', bg: 'rgba(76,201,122,0.12)' };
      case 'cancelada': return { label: 'Cancelada', color: '#c96b4c', bg: 'rgba(201,107,76,0.12)' };
      default: return { label: estado, color: '#6b7a8d', bg: 'rgba(107,122,141,0.12)' };
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(26,58,92,0.95)',
          border: '1px solid rgba(201,168,76,0.3)',
          borderRadius: '8px',
          padding: '10px 16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}>
          <p style={{ color: '#c9a84c', fontWeight: 600, fontSize: '13px' }}>{label}</p>
          <p style={{ color: '#e2e8f0', fontSize: '13px' }}>{payload[0].value} pacientes</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            fontFamily: "'Playfair Display', serif",
            color: 'var(--primary)',
            lineHeight: 1.2,
            margin: 0,
          }}>
            Panel de Control
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px', textTransform: 'capitalize' }}>
            {today}
          </p>
        </div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: 'rgba(201,168,76,0.1)',
          border: '1px solid rgba(201,168,76,0.25)',
          borderRadius: '20px',
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4cc97a', boxShadow: '0 0 8px #4cc97a' }} />
          <span style={{ fontSize: '13px', color: '#c9a84c', fontWeight: 500 }}>Sistema activo</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              style={{
                background: 'var(--surface)',
                border: `1px solid ${card.border}`,
                borderRadius: '16px',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px rgba(0,0,0,0.15)`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {/* Subtle glow background */}
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: '80px', height: '80px',
                background: card.bg,
                borderRadius: '0 16px 0 80px',
                pointerEvents: 'none',
              }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
                    {card.title}
                  </p>
                  <p style={{ fontSize: '42px', fontWeight: 700, color: card.accent, margin: '8px 0 0', lineHeight: 1, fontFamily: "'Playfair Display', serif" }}>
                    {card.value}
                  </p>
                </div>
                <div style={{
                  padding: '10px',
                  background: card.bg,
                  borderRadius: '12px',
                  border: `1px solid ${card.border}`,
                }}>
                  <Icon style={{ width: '20px', height: '20px', color: card.accent }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart + Citas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', flexWrap: 'wrap' } as any}>
        
        {/* Chart */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: '16px',
          padding: '28px',
          border: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: 'var(--primary)' }}>
                Actividad Clínica
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>Últimos 7 días</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="fecha"
                tick={{ fontSize: 12, fill: 'var(--text-muted)', fontFamily: 'DM Sans' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'var(--text-muted)', fontFamily: 'DM Sans' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(201,168,76,0.05)', radius: 6 } as any} />
              <Bar dataKey="pacientes" fill="#c9a84c" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Citas de Hoy */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: '16px',
          padding: '28px',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: 'var(--primary)' }}>
                Citas de Hoy
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                {citasHoy.length} {citasHoy.length === 1 ? 'cita agendada' : 'citas agendadas'}
              </p>
            </div>
            <Link to="/citas" style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '12px', color: '#c9a84c', textDecoration: 'none', fontWeight: 600,
            }}>
              Ver todas <ArrowUpRight style={{ width: '14px', height: '14px' }} />
            </Link>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {citasHoy.length === 0 ? (
              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '32px 16px', textAlign: 'center',
              }}>
                <Calendar style={{ width: '32px', height: '32px', color: 'var(--text-muted)', marginBottom: '12px', opacity: 0.5 }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
                  No hay citas programadas para hoy
                </p>
              </div>
            ) : (
              citasHoy.map((cita) => {
                const status = getStatusConfig(cita.estado);
                return (
                  <div key={cita.id} style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    background: 'rgba(0,0,0,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '13px', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {cita.paciente?.nombres} {cita.paciente?.apellidos}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                        {cita.hora} · {cita.motivo}
                      </p>
                    </div>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: status.color,
                      background: status.bg,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}>
                      {status.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: '16px',
        padding: '28px',
        border: '1px solid var(--border)',
      }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: 'var(--primary)' }}>
          Acciones Rápidas
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {[
            { to: '/nueva-historia', icon: FileText, label: 'Nueva Historia Clínica', accent: '#c9a84c', bg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.25)' },
            { to: '/citas', icon: CalendarPlus, label: 'Agendar Cita', accent: '#4c9ac9', bg: 'rgba(76,154,201,0.08)', border: 'rgba(76,154,201,0.25)' },
            { to: '/pacientes', icon: Users, label: 'Ver Pacientes', accent: '#4cc97a', bg: 'rgba(76,201,122,0.08)', border: 'rgba(76,201,122,0.25)' },
          ].map(({ to, icon: Icon, label, accent, bg, border }) => (
            <Link
              key={to}
              to={to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '18px 20px',
                borderRadius: '12px',
                border: `1px solid ${border}`,
                background: bg,
                textDecoration: 'none',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px rgba(0,0,0,0.1)`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div style={{
                padding: '10px',
                borderRadius: '10px',
                background: `${accent}18`,
                border: `1px solid ${accent}30`,
                flexShrink: 0,
              }}>
                <Icon style={{ width: '20px', height: '20px', color: accent }} />
              </div>
              <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text)' }}>{label}</span>
              <ArrowUpRight style={{ width: '16px', height: '16px', color: accent, marginLeft: 'auto', opacity: 0.7 }} />
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};
