import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Printer, TrendingUp, TrendingDown, Minus, Eye, Calendar, Activity, Pencil } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { spGetPaciente, spGetHistorias } from '../lib/supabaseService';
import type { Paciente, HistoriaClinica } from '../db/database';
import { HistoriaCompletaPrint } from '../components/Print/HistoriaCompletaPrint';
import { TarjetaFormulaPrint } from '../components/Print/TarjetaFormulaPrint';
import { CertificadoMedico } from '../components/Print/CertificadoMedico';

interface ChartDataPoint {
  visita: string; fecha: string;
  OD_ESF: number; OI_ESF: number; OD_CYL: number; OI_CYL: number;
}

export const PerfilPaciente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [historias, setHistorias] = useState<HistoriaClinica[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [trend, setTrend] = useState<'mejora' | 'empeora' | 'mantiene'>('mantiene');
  const [printHistoria, setPrintHistoria] = useState<HistoriaClinica | null>(null);
  const [printType, setPrintType] = useState<string>('completa');
  const printRef = useRef<HTMLDivElement>(null);

  const loadData = async (patientId: number) => {
    try {
      const patient = await spGetPaciente(patientId);
      if (patient) setPaciente(patient);
      const historiasList = await spGetHistorias(patientId);
      historiasList.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      setHistorias(historiasList);
      if (historiasList.length > 0) {
        setChartData(historiasList.map((h, index) => ({
          visita: `V${index + 1}`,
          fecha: new Date(h.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
          OD_ESF: parseFloat(h.formulaOD_esf || '0'),
          OI_ESF: parseFloat(h.formulaOI_esf || '0'),
          OD_CYL: parseFloat(h.formulaOD_cyl || '0'),
          OI_CYL: parseFloat(h.formulaOI_cyl || '0'),
        })));
        if (historiasList.length >= 2) {
          const firstOD = Math.abs(parseFloat(historiasList[0].formulaOD_esf || '0'));
          const lastOD = Math.abs(parseFloat(historiasList[historiasList.length - 1].formulaOD_esf || '0'));
          if (lastOD < firstOD) setTrend('mejora');
          else if (lastOD > firstOD) setTrend('empeora');
          else setTrend('mantiene');
        }
      }
    } catch { alert('Error al cargar el perfil del paciente.'); }
  };

  useEffect(() => { if (id) loadData(parseInt(id)); }, [id]);

  const handlePrint = (historia: HistoriaClinica, type = 'completa') => {
    setPrintType(type);
    setPrintHistoria(historia);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print();
        window.addEventListener('afterprint', () => setPrintHistoria(null), { once: true });
      });
    });
  };

  if (!paciente) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px', color: 'var(--text-muted)' }}>
        Cargando información del paciente...
      </div>
    );
  }

  const trendConfig = {
    mejora:   { icon: TrendingUp,   color: '#4cc97a', bg: 'rgba(76,201,122,0.1)',  border: 'rgba(76,201,122,0.25)',  text: 'Mejoró' },
    empeora:  { icon: TrendingDown, color: '#c96b4c', bg: 'rgba(201,107,76,0.1)', border: 'rgba(201,107,76,0.25)', text: 'Empeoró' },
    mantiene: { icon: Minus,        color: '#c9a84c', bg: 'rgba(201,168,76,0.1)', border: 'rgba(201,168,76,0.25)', text: 'Se mantiene' },
  }[trend];

  const avatarColors = ['#c9a84c', '#4c9ac9', '#4cc97a', '#c96b4c', '#9a4cc9'];
  const avatarColor = avatarColors[(paciente.id ?? 0) % avatarColors.length];

  return (
    <>
      {printHistoria && paciente && (
        <div ref={printRef} className="print-content" style={{ display: 'none' }}>
          {printType === 'completa'    && <HistoriaCompletaPrint paciente={paciente} historia={printHistoria} numeroHistoria={historias.findIndex(h => h.id === printHistoria.id) + 1} />}
          {printType === 'tarjeta'     && <TarjetaFormulaPrint paciente={paciente} historia={printHistoria} />}
          {printType === 'certificado' && <CertificadoMedico paciente={paciente} historia={printHistoria} />}
        </div>
      )}

      <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <button
            onClick={() => navigate('/pacientes')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: '14px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Volver a Pacientes
          </button>
          <Link
            to={`/nueva-historia/${paciente.id}`}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', background: '#c9a84c', color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}
          >
            <FileText style={{ width: '16px', height: '16px' }} />
            Nueva Historia
          </Link>
        </div>

        {/* Tarjeta paciente */}
        <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '22px', fontWeight: 700, color: 'white' }}>
              {paciente.nombres.charAt(0)}{paciente.apellidos.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>

              {/* Nombre + botón editar paciente */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: 'var(--primary)' }}>
                  {paciente.nombres} {paciente.apellidos}
                </h2>
                <Link
                  to={`/pacientes/${paciente.id}/editar`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '7px 14px', borderRadius: '8px',
                    border: '1px solid var(--border)', background: 'transparent',
                    color: 'var(--text)', fontSize: '13px', fontWeight: 600,
                    textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'var(--primary)';
                    el.style.color = 'white';
                    el.style.borderColor = 'var(--primary)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'transparent';
                    el.style.color = 'var(--text)';
                    el.style.borderColor = 'var(--border)';
                  }}
                >
                  <Pencil style={{ width: '13px', height: '13px' }} />
                  Editar paciente
                </Link>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '12px' }}>
                {[
                  { label: 'D.I.', value: paciente.di },
                  { label: 'Edad', value: `${paciente.edad} años` },
                  { label: 'Género', value: paciente.genero },
                  { label: 'Teléfono', value: paciente.telefono },
                  { label: 'EPS', value: paciente.eps },
                  { label: 'Ocupación', value: paciente.ocupacion },
                ].map(({ label, value }) => value ? (
                  <div key={label}>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                    <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text)', fontWeight: 500 }}>{value}</p>
                  </div>
                ) : null)}
              </div>
              {paciente.antecedentes && (
                <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '8px' }}>
                  <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Antecedentes</p>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text)' }}>{paciente.antecedentes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Total Visitas', value: historias.length, icon: Eye, color: '#4c9ac9', bg: 'rgba(76,154,201,0.08)', border: 'rgba(76,154,201,0.2)' },
            { label: 'Última Visita', value: historias.length > 0 ? new Date(historias[historias.length - 1].fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A', icon: Calendar, color: '#c9a84c', bg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.2)' },
            { label: 'Tendencia Visual', value: trendConfig.text, icon: Activity, color: trendConfig.color, bg: trendConfig.bg, border: trendConfig.border },
          ].map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} style={{ background: 'var(--surface)', borderRadius: '14px', border: `1px solid ${border}`, padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: bg, flexShrink: 0 }}>
                <Icon style={{ width: '20px', height: '20px', color }} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                <p style={{ margin: '3px 0 0', fontSize: '18px', fontWeight: 700, color, fontFamily: typeof value === 'number' ? "'Playfair Display', serif" : 'inherit' }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Gráfico evolución */}
        {chartData.length > 1 && (
          <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '28px' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: 'var(--primary)' }}>Evolución de Refracción</h3>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: 'var(--text-muted)' }}>ESF y CYL por visita</p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="visita" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid var(--border)', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="OD_ESF" stroke="#1a3a5c" name="OD ESF" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="OI_ESF" stroke="#2d6a9f" name="OI ESF" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="OD_CYL" stroke="#c9a84c" name="OD CYL" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="OI_CYL" stroke="#2e7d52" name="OI CYL" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Historial de visitas */}
        <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: 'var(--primary)' }}>Historial de Visitas</h3>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>{historias.length} {historias.length === 1 ? 'consulta registrada' : 'consultas registradas'}</p>
            </div>
          </div>

          {historias.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <FileText style={{ width: '32px', height: '32px', color: 'var(--text-muted)', opacity: 0.4, margin: '0 auto 12px' }} />
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>No hay historias clínicas registradas</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[...historias].reverse().map((historia, index) => (
                <div key={historia.id} style={{ padding: '20px 28px', borderBottom: index < historias.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: 'white', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                          {historias.length - index}
                        </span>
                        <div>
                          <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>Visita #{historias.length - index}</p>
                          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                            {new Date(historia.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      {historia.motivoConsulta && (
                        <div style={{ marginBottom: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Motivo: </span>
                          <span style={{ fontSize: '13px', color: 'var(--text)' }}>{historia.motivoConsulta}</span>
                        </div>
                      )}
                      {historia.diagnostico && (
                        <div style={{ marginBottom: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Diagnóstico: </span>
                          <span style={{ fontSize: '13px', color: 'var(--text)' }}>{historia.diagnostico}</span>
                        </div>
                      )}
                      {(historia.formulaOD_esf || historia.formulaOI_esf) && (
                        <div style={{ marginTop: '10px', padding: '10px 14px', background: 'rgba(26,58,92,0.04)', border: '1px solid var(--border)', borderRadius: '8px', display: 'inline-block' }}>
                          <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Fórmula Óptica</p>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
                            <div style={{ fontSize: '12px', color: 'var(--text)' }}>
                              <strong>OD:</strong> ESF {historia.formulaOD_esf} CYL {historia.formulaOD_cyl} EJE {historia.formulaOD_eje}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text)' }}>
                              <strong>OI:</strong> ESF {historia.formulaOI_esf} CYL {historia.formulaOI_cyl} EJE {historia.formulaOI_eje}
                            </div>
                          </div>
                          {historia.formulaUso && (
                            <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                              <strong>Uso:</strong> {historia.formulaUso}
                            </p>
                          )}
                        </div>
                      )}
                      {historia.tratamiento && (
                        <div style={{ marginTop: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tratamiento: </span>
                          <span style={{ fontSize: '13px', color: 'var(--text)' }}>{historia.tratamiento}</span>
                        </div>
                      )}
                      {historia.controles && (
                        <div style={{ marginTop: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Controles: </span>
                          <span style={{ fontSize: '13px', color: 'var(--text)' }}>{historia.controles}</span>
                        </div>
                      )}
                    </div>

                    {/* Botones acción */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0 }}>
                      <Link
                        to={`/editar-historia/${historia.id}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--primary)', background: 'transparent', color: 'var(--primary)', fontSize: '12px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--primary)'; (e.currentTarget as HTMLElement).style.color = 'white'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--primary)'; }}
                      >
                        <Pencil style={{ width: '12px', height: '12px' }} /> Editar
                      </Link>
                      <button onClick={() => handlePrint(historia, 'tarjeta')}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px', border: '1px solid #c9a84c', background: 'transparent', color: '#c9a84c', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#c9a84c'; (e.currentTarget as HTMLElement).style.color = 'white'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#c9a84c'; }}>
                        <Printer style={{ width: '12px', height: '12px' }} /> Tarjeta
                      </button>
                      <button onClick={() => handlePrint(historia, 'completa')}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--primary)', background: 'transparent', color: 'var(--primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--primary)'; (e.currentTarget as HTMLElement).style.color = 'white'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--primary)'; }}>
                        <Printer style={{ width: '12px', height: '12px' }} /> Historia
                      </button>
                      <button onClick={() => handlePrint(historia, 'certificado')}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px', border: '1px solid #4cc97a', background: 'transparent', color: '#4cc97a', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#4cc97a'; (e.currentTarget as HTMLElement).style.color = 'white'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#4cc97a'; }}>
                        <Printer style={{ width: '12px', height: '12px' }} /> Certificado
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
