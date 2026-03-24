import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { db } from '../db/database';
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

  const loadPatient = async (id: number) => {
    try {
      const patient = await db.pacientes.get(id);
      if (patient) {
        setSelectedPatient(patient);
        setActiveTab('motivo');
      }
    } catch {
      alert('Error al cargar el paciente. Intente nuevamente.');
    }
  };

  useEffect(() => {
    if (pacienteId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadPatient(parseInt(pacienteId));
    }
  }, [pacienteId]);

  const searchPatient = async () => {
    if (!searchDI) return;
    const patient = await db.pacientes.where('di').equals(searchDI).first();
    if (patient) {
      setSelectedPatient(patient);
      setNewPatient({});
      setActiveTab('motivo');
    } else {
      alert('Paciente no encontrado. Complete los datos para crear uno nuevo.');
      setSelectedPatient(null);
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const validatePatientForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!newPatient.nombres?.trim()) {
      newErrors.nombres = 'El nombre es obligatorio.';
    }
    if (!newPatient.apellidos?.trim()) {
      newErrors.apellidos = 'Los apellidos son obligatorios.';
    }
    if (!newPatient.di?.trim()) {
      newErrors.di = 'El documento de identidad es obligatorio.';
    } else if (!/^\d+$/.test(newPatient.di.trim())) {
      newErrors.di = 'El documento de identidad debe contener solo números.';
    }
    if (!newPatient.fechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria.';
    } else {
      const birth = new Date(newPatient.fechaNacimiento);
      const today = new Date();
      if (isNaN(birth.getTime()) || birth > today) {
        newErrors.fechaNacimiento = 'Ingrese una fecha de nacimiento válida.';
      }
    }
    if (newPatient.telefono && !/^\d+$/.test(newPatient.telefono.trim())) {
      newErrors.telefono = 'El teléfono debe contener solo números.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    try {
      let patientId: number;

      if (selectedPatient) {
        patientId = selectedPatient.id!;
      } else {
        if (!validatePatientForm()) {
          setActiveTab('paciente');
          return;
        }

        const edad = calculateAge(newPatient.fechaNacimiento!);
        patientId = (await db.pacientes.add({
          ...newPatient,
          edad,
        } as Paciente)) as number;
      }

      if (!historia.motivoConsulta) {
        alert('Por favor ingrese el motivo de consulta.');
        setActiveTab('motivo');
        return;
      }

      const newHistoria: HistoriaClinica = {
        ...historia,
        pacienteId: patientId,
        fecha: historia.fecha || new Date().toISOString().split('T')[0],
        motivoConsulta: historia.motivoConsulta || '',
      };

      await db.historiasClinicas.add(newHistoria);

      alert('Historia clínica guardada exitosamente.');
      navigate(`/pacientes/${patientId}`);
    } catch (error) {
      console.error('Error saving historia:', error);
      alert('Error al guardar la historia clínica. Intente nuevamente.');
    }
  };

  const tabs = [
    { value: 'paciente', label: '1. Paciente' },
    { value: 'motivo', label: '2. Motivo' },
    { value: 'lensometria', label: '3. Lensometría' },
    { value: 'agudeza', label: '4. Agudeza Visual' },
    { value: 'motilidad', label: '5. Motilidad' },
    { value: 'examen', label: '6. Examen Externo' },
    { value: 'subjetivo', label: '7. Subjetivo' },
    { value: 'tests', label: '8. Tests' },
    { value: 'formula', label: '9. Fórmula' },
    { value: 'diagnostico', label: '10. Diagnóstico' },
  ];

  return (
    <div className="space-y-6">
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="flex gap-2 overflow-x-auto pb-2 border-b border-border">
          {tabs.map((tab) => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.value
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-muted hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="bg-surface rounded-lg shadow-md p-6 border border-border mt-4">
          <Tabs.Content value="paciente">
            <PacienteTab
              searchDI={searchDI}
              setSearchDI={setSearchDI}
              onSearch={searchPatient}
              selectedPatient={selectedPatient}
              onClearPatient={() => { setSelectedPatient(null); setSearchDI(''); }}
              newPatient={newPatient}
              setNewPatient={setNewPatient}
              errors={errors}
              setErrors={setErrors}
            />
          </Tabs.Content>
          <Tabs.Content value="motivo">
            <MotivoTab historia={historia} setHistoria={setHistoria} />
          </Tabs.Content>
          <Tabs.Content value="lensometria">
            <LensometriaTab historia={historia} setHistoria={setHistoria} />
          </Tabs.Content>
          <Tabs.Content value="agudeza">
            <AgudezaVisualTab historia={historia} setHistoria={setHistoria} />
          </Tabs.Content>
          <Tabs.Content value="motilidad">
            <MotilidadTab historia={historia} setHistoria={setHistoria} />
          </Tabs.Content>
          <Tabs.Content value="examen">
            <ExamenExternoTab historia={historia} setHistoria={setHistoria} />
          </Tabs.Content>
          <Tabs.Content value="subjetivo">
            <SubjetivoTab historia={historia} setHistoria={setHistoria} />
          </Tabs.Content>
          <Tabs.Content value="tests">
            <TestsTab historia={historia} setHistoria={setHistoria} />
          </Tabs.Content>
          <Tabs.Content value="formula">
            <FormulaTab historia={historia} setHistoria={setHistoria} />
          </Tabs.Content>
          <Tabs.Content value="diagnostico">
            <DiagnosticoTab historia={historia} setHistoria={setHistoria} />
          </Tabs.Content>
        </div>
      </Tabs.Root>

      <div className="flex justify-end gap-4 bg-surface rounded-lg shadow-md p-6 border border-border">
        <button
          onClick={() => navigate('/pacientes')}
          className="px-6 py-2 border border-border rounded-lg hover:bg-gray-100 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Guardar Historia Clínica
        </button>
      </div>
    </div>
  );
};
