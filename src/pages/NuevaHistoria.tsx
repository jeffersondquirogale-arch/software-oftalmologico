import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { spGetPaciente, spAddPaciente, spAddHistoria } from '../lib/supabaseService';
import type { Paciente, HistoriaClinica } from '../db/database';
import { PacienteTab } from '../components/Historia/PacienteTab';
import { MotivoTab } from '../components/Historia/MotivoTab';
import { LensometriaTab } from '../components/Historia/LensometriaTab';
import { AgudezaVisualTab } from '../components/Historia/AgudezaVisualTab';
import { MotilidadTab } from '../components/Historia/MotilidadTab';
import { ExamenExternoTab } from '../components/Historia/ExamenExternoTab';
import { SubjetivoTab } from '../components/Historia/SubjetivoTab';
import { TestsTab } from '../components/Historia/TestsTab';
import { FormulaTab } from '../components/Historia/FormulaTab';
import { DiagnosticoTab } from '../components/Historia/DiagnosticoTab';

export const NuevaHistoria = () => {
  const navigate = useNavigate();
  const { pacienteId } = useParams();
  const [activeTab, setActiveTab] = useState('paciente');
  const [searchDI, setSearchDI] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Paciente | null>(null);
  const [newPatient, setNewPatient] = useState<Partial<Paciente>>({
    genero: 'Masculino',
    fechaRegistro: new Date().toISOString().split('T')[0],
  });
  const [historia, setHistoria] = useState<Partial<HistoriaClinica>>({
    fecha: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const tabs = [
    { value: 'paciente', label: 'Paciente', num: '1' },
    { value: 'motivo', label: 'Motivo', num: '2' },
    { value: 'lensometria', label: 'Lensometría', num: '3' },
    { value: 'agudeza', label: 'Agudeza Visual', num: '4' },
    { value: 'motilidad', label: 'Motilidad', num: '5' },
    { value: 'examen', label: 'Examen Externo', num: '6' },
    { value: 'subjetivo', label: 'Subjetivo', num: '7' },
    { value: 'tests', label: 'Tests', num: '8' },
    { value: 'formula', label: 'Fórmula', num: '9' },
    { value: 'diagnostico', label: 'Diagnóstico', num: '10' },
  ];

  const loadPatient = async (id: number) => {
    try {
      const patient = await spGetPaciente(id);
      if (patient) { setSelectedPatient(patient); setActiveTab('motivo'); }
    } catch { alert('Error al cargar el paciente.'); }
  };

  useEffect(() => {
    if (pacienteId) loadPatient(parseInt(pacienteId));
  }, [pacienteId]);

  const searchPatient = async () => {
    if (!searchDI) return;
    const { supabase } = await import('../lib/supabase');
    const { data } = await supabase.from('pacientes').select('*').eq('di', searchDI).single();
    if (data) {
      const { spGetPaciente: gp } = await import('../lib/supabaseService');
      const p = await gp(data.id);
      if (p) { setSelectedPatient(p); setNewPatient({}); setActiveTab('motivo'); }
    } else { alert('Paciente no encontrado. Complete los datos para crear uno nuevo.'); setSelectedPatient(null); }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date(); const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const validatePatientForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!newPatient.nombres?.trim()) newErrors.nombres = 'El nombre es obligatorio.';
    if (!newPatient.apellidos?.trim()) newErrors.apellidos = 'Los apellidos son obligatorios.';
    if (!newPatient.di?.trim()) newErrors.di = 'El D.I. es obligatorio.';
    else if (!/^\d+$/.test(newPatient.di.trim())) newErrors.di = 'Solo números.';
    if (!newPatient.fechaNacimiento) newErrors.fechaNacimiento = 'La fecha es obligatoria.';
    if (newPatient.telefono && !/^\d+$/.test(newPatient.telefono.trim())) newErrors.telefono = 'Solo números.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    try {
      let patientId: number;
      if (selectedPatient) { patientId = selectedPatient.id!; }
      else {
        if (!validatePatientForm()) { setActiveTab('paciente'); return; }
        const edad = calculateAge(newPatient.fechaNacimiento!);
        patientId = await spAddPaciente({ ...newPatient, edad } as any);
      }
      if (!historia.motivoConsulta) { alert('Ingrese el motivo de consulta.'); setActiveTab('motivo'); return; }
      await spAddHistoria({ ...historia, pacienteId: patientId, fecha: historia.fecha || new Date().toISOString().split('T')[0], motivoConsulta: historia.motivoConsulta || '' } as any);
      alert('Historia clínica guardada exitosamente.');
      navigate(`/pacientes/${patientId}`);
    } catch (error) { console.error(error); alert('Error al guardar.'); }
  };

  const activeIndex = tabs.findIndex(t => t.value === activeTab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: 'var(--primary)' }}>
          Nueva Historia Clínica
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>

        {/* Tab bar */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: '16px 16px 0 0',
          border: '1px solid var(--border)',
          borderBottom: 'none',
          padding: '16px 20px 0',
          overflowX: 'auto',
        }}>
          <Tabs.List style={{ display: 'flex', gap: '4px', minWidth: 'max-content' }}>
            {tabs.map((tab, idx) => {
              const isActive = activeTab === tab.value;
              const isPast = idx < activeIndex;
              return (
                <Tabs.Trigger
                  key={tab.value}
                  value={tab.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px 8px 0 0',
                    border: 'none',
                    background: isActive
                      ? 'var(--primary)'
                      : isPast
                      ? 'rgba(76,201,122,0.1)'
                      : 'transparent',
                    color: isActive ? 'white' : isPast ? '#4cc97a' : 'var(--text-muted)',
                    fontSize: '13px',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '20px', height: '20px', borderRadius: '50%', fontSize: '11px', fontWeight: 700,
                    background: isActive ? 'rgba(255,255,255,0.2)' : isPast ? 'rgba(76,201,122,0.2)' : 'rgba(0,0,0,0.06)',
                    color: isActive ? 'white' : isPast ? '#4cc97a' : 'var(--text-muted)',
                    flexShrink: 0,
                  }}>
                    {isPast ? '✓' : tab.num}
                  </span>
                  {tab.label}
                </Tabs.Trigger>
              );
            })}
          </Tabs.List>
        </div>

        {/* Content */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderTop: '2px solid var(--primary)',
          padding: '28px',
          minHeight: '400px',
        }}>
          <Tabs.Content value="paciente">
            <PacienteTab searchDI={searchDI} setSearchDI={setSearchDI} onSearch={searchPatient}
              selectedPatient={selectedPatient} onClearPatient={() => { setSelectedPatient(null); setSearchDI(''); }}
              newPatient={newPatient} setNewPatient={setNewPatient} errors={errors} setErrors={setErrors} />
          </Tabs.Content>
          <Tabs.Content value="motivo"><MotivoTab historia={historia} setHistoria={setHistoria} /></Tabs.Content>
          <Tabs.Content value="lensometria"><LensometriaTab historia={historia} setHistoria={setHistoria} /></Tabs.Content>
          <Tabs.Content value="agudeza"><AgudezaVisualTab historia={historia} setHistoria={setHistoria} /></Tabs.Content>
          <Tabs.Content value="motilidad"><MotilidadTab historia={historia} setHistoria={setHistoria} /></Tabs.Content>
          <Tabs.Content value="examen"><ExamenExternoTab historia={historia} setHistoria={setHistoria} /></Tabs.Content>
          <Tabs.Content value="subjetivo"><SubjetivoTab historia={historia} setHistoria={setHistoria} /></Tabs.Content>
          <Tabs.Content value="tests"><TestsTab historia={historia} setHistoria={setHistoria} /></Tabs.Content>
          <Tabs.Content value="formula"><FormulaTab historia={historia} setHistoria={setHistoria} /></Tabs.Content>
          <Tabs.Content value="diagnostico"><DiagnosticoTab historia={historia} setHistoria={setHistoria} /></Tabs.Content>
        </div>

        {/* Footer navigation */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: '0 0 16px 16px',
          border: '1px solid var(--border)',
          borderTop: 'none',
          padding: '16px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {activeIndex > 0 && (
              <button
                onClick={() => setActiveTab(tabs[activeIndex - 1].value)}
                style={{
                  padding: '9px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                  border: '1px solid var(--border)', background: 'transparent',
                  color: 'var(--text)', cursor: 'pointer',
                }}
              >
                ← Anterior
              </button>
            )}
            {activeIndex < tabs.length - 1 && (
              <button
                onClick={() => setActiveTab(tabs[activeIndex + 1].value)}
                style={{
                  padding: '9px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                  border: '1px solid var(--primary)', background: 'transparent',
                  color: 'var(--primary)', cursor: 'pointer',
                }}
              >
                Siguiente →
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => navigate('/pacientes')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '9px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--text-muted)', cursor: 'pointer',
              }}
            >
              <X style={{ width: '14px', height: '14px' }} />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '9px 24px', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
                border: 'none', background: 'var(--primary)',
                color: 'white', cursor: 'pointer',
              }}
            >
              <Save style={{ width: '15px', height: '15px' }} />
              Guardar Historia
            </button>
          </div>
        </div>
      </Tabs.Root>
    </div>
  );
};
