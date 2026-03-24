import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Search } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { db } from '../db/database';
import type { Paciente, HistoriaClinica } from '../db/database';

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
            <h3 className="text-lg font-title font-semibold text-primary mb-4">
              Datos del Paciente
            </h3>
            {!selectedPatient && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-text mb-2">
                  Buscar Paciente por D.I.
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchDI}
                    onChange={(e) => setSearchDI(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ingrese documento de identidad"
                  />
                  <button
                    onClick={searchPatient}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Buscar
                  </button>
                </div>
                <p className="text-sm text-text-muted mt-2">
                  Si el paciente no existe, complete el formulario para crear uno nuevo
                </p>
              </div>
            )}

            {selectedPatient ? (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold text-primary mb-2">Paciente Seleccionado:</p>
                <p className="text-sm">
                  <span className="font-medium">Nombre:</span> {selectedPatient.nombres}{' '}
                  {selectedPatient.apellidos}
                </p>
                <p className="text-sm">
                  <span className="font-medium">D.I.:</span> {selectedPatient.di}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Edad:</span> {selectedPatient.edad} años
                </p>
                <button
                  onClick={() => {
                    setSelectedPatient(null);
                    setSearchDI('');
                  }}
                  className="mt-3 text-sm text-danger hover:underline"
                >
                  Cambiar paciente
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Nombres <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPatient.nombres || ''}
                    onChange={(e) => {
                      setNewPatient({ ...newPatient, nombres: e.target.value });
                      if (errors.nombres) setErrors({ ...errors, nombres: '' });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.nombres ? 'border-danger' : 'border-border'}`}
                  />
                  {errors.nombres && <p className="text-danger text-xs mt-1">{errors.nombres}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Apellidos <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPatient.apellidos || ''}
                    onChange={(e) => {
                      setNewPatient({ ...newPatient, apellidos: e.target.value });
                      if (errors.apellidos) setErrors({ ...errors, apellidos: '' });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.apellidos ? 'border-danger' : 'border-border'}`}
                  />
                  {errors.apellidos && <p className="text-danger text-xs mt-1">{errors.apellidos}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    D.I. <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPatient.di || ''}
                    onChange={(e) => {
                      setNewPatient({ ...newPatient, di: e.target.value });
                      if (errors.di) setErrors({ ...errors, di: '' });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.di ? 'border-danger' : 'border-border'}`}
                    placeholder="Solo números"
                  />
                  {errors.di && <p className="text-danger text-xs mt-1">{errors.di}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Fecha de Nacimiento <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    value={newPatient.fechaNacimiento || ''}
                    onChange={(e) => {
                      setNewPatient({ ...newPatient, fechaNacimiento: e.target.value });
                      if (errors.fechaNacimiento) setErrors({ ...errors, fechaNacimiento: '' });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.fechaNacimiento ? 'border-danger' : 'border-border'}`}
                  />
                  {errors.fechaNacimiento && <p className="text-danger text-xs mt-1">{errors.fechaNacimiento}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Género</label>
                  <select
                    value={newPatient.genero || 'Masculino'}
                    onChange={(e) => setNewPatient({ ...newPatient, genero: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={newPatient.telefono || ''}
                    onChange={(e) => {
                      setNewPatient({ ...newPatient, telefono: e.target.value });
                      if (errors.telefono) setErrors({ ...errors, telefono: '' });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.telefono ? 'border-danger' : 'border-border'}`}
                    placeholder="Solo números"
                  />
                  {errors.telefono && <p className="text-danger text-xs mt-1">{errors.telefono}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Dirección</label>
                  <input
                    type="text"
                    value={newPatient.direccion || ''}
                    onChange={(e) => setNewPatient({ ...newPatient, direccion: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Ocupación</label>
                  <input
                    type="text"
                    value={newPatient.ocupacion || ''}
                    onChange={(e) => setNewPatient({ ...newPatient, ocupacion: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">EPS</label>
                  <input
                    type="text"
                    value={newPatient.eps || ''}
                    onChange={(e) => setNewPatient({ ...newPatient, eps: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Acompañante</label>
                  <input
                    type="text"
                    value={newPatient.acompanante || ''}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, acompanante: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Parentesco</label>
                  <input
                    type="text"
                    value={newPatient.parentesco || ''}
                    onChange={(e) => setNewPatient({ ...newPatient, parentesco: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text mb-1">Antecedentes</label>
                  <textarea
                    value={newPatient.antecedentes || ''}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, antecedentes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}
          </Tabs.Content>

          <Tabs.Content value="motivo">
            <h3 className="text-lg font-title font-semibold text-primary mb-4">
              Motivo de Consulta
            </h3>
            <textarea
              value={historia.motivoConsulta || ''}
              onChange={(e) => setHistoria({ ...historia, motivoConsulta: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Describa el motivo de la consulta..."
            />
          </Tabs.Content>

          <Tabs.Content value="lensometria">
            <h3 className="text-lg font-title font-semibold text-primary mb-4">Lensometría</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-border p-2 text-sm font-semibold">Ojo</th>
                    <th className="border border-border p-2 text-sm font-semibold">ESF</th>
                    <th className="border border-border p-2 text-sm font-semibold">CYL</th>
                    <th className="border border-border p-2 text-sm font-semibold">EJE</th>
                    <th className="border border-border p-2 text-sm font-semibold">ADD</th>
                    <th className="border border-border p-2 text-sm font-semibold">DNP</th>
                    <th className="border border-border p-2 text-sm font-semibold">PRIS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-2 font-medium bg-gray-50">OD</td>
                    <td className="border border-border p-2">
                      <input
                        type="text"
                        value={historia.lensOD_esf || ''}
                        onChange={(e) =>
                          setHistoria({ ...historia, lensOD_esf: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                    <td className="border border-border p-2">
                      <input
                        type="text"
                        value={historia.lensOD_cyl || ''}
                        onChange={(e) =>
                          setHistoria({ ...historia, lensOD_cyl: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                    <td className="border border-border p-2">
                      <input
                        type="text"
                        value={historia.lensOD_eje || ''}
                        onChange={(e) =>
                          setHistoria({ ...historia, lensOD_eje: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                    <td className="border border-border p-2">
                      <input
                        type="text"
                        value={historia.lensOD_add || ''}
                        onChange={(e) =>
                          setHistoria({ ...historia, lensOD_add: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                    <td className="border border-border p-2">
                      <input
                        type="text"
                        value={historia.lensOD_dnp || ''}
                        onChange={(e) =>
                          setHistoria({ ...historia, lensOD_dnp: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                    <td className="border border-border p-2">
                      <input
                        type="text"
                        value={historia.lensOD_pris || ''}
                        onChange={(e) =>
                          setHistoria({ ...historia, lensOD_pris: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2 font-medium bg-gray-50">OI</td>
                    <td className="border border-border p-2">
                      <input
                        type="text"
                        value={historia.lensOI_esf || ''}
                        onChange={(e) =>
                          setHistoria({ ...historia, lensOI_esf: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                    <td className="border border-border p-2">
                      <input
                        type="text"
                        value={historia.lensOI_cyl || ''}
                        onChange={(e) =>
                          setHistoria({ ...historia, lensOI_cyl: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                    <td className="border border-border p-2">
                      <input
                        type="text"
                        value={historia.lensOI_eje || ''}
                        onChange={(e) =>
                          setHistoria({ ...historia, lensOI_eje: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                    <td className="border border-border p-2">
                      <input
                        type="text"
                        value={historia.lensOI_add || ''}
                        onChange={(e) =>
                          setHistoria({ ...historia, lensOI_add: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                    <td className="border border-border p-2">
                      <input
                        type="text"
                        value={historia.lensOI_dnp || ''}
                        onChange={(e) =>
                          setHistoria({ ...historia, lensOI_dnp: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                    <td className="border border-border p-2">
                      <input
                        type="text"
                        value={historia.lensOI_pris || ''}
                        onChange={(e) =>
                          setHistoria({ ...historia, lensOI_pris: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Tabs.Content>

          <Tabs.Content value="agudeza">
            <h3 className="text-lg font-title font-semibold text-primary mb-4">
              Agudeza Visual
            </h3>
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-border p-2 text-sm font-semibold">Ojo</th>
                      <th className="border border-border p-2 text-sm font-semibold">VL s/c</th>
                      <th className="border border-border p-2 text-sm font-semibold">PH</th>
                      <th className="border border-border p-2 text-sm font-semibold">VP s/c</th>
                      <th className="border border-border p-2 text-sm font-semibold">VL c/c</th>
                      <th className="border border-border p-2 text-sm font-semibold">VP c/c</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-2 font-medium bg-gray-50">OD</td>
                      <td className="border border-border p-2">
                        <input
                          type="text"
                          value={historia.av_od_vlsc || ''}
                          onChange={(e) =>
                            setHistoria({ ...historia, av_od_vlsc: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="border border-border p-2">
                        <input
                          type="text"
                          value={historia.av_od_ph || ''}
                          onChange={(e) => setHistoria({ ...historia, av_od_ph: e.target.value })}
                          className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="border border-border p-2">
                        <input
                          type="text"
                          value={historia.av_od_vpsc || ''}
                          onChange={(e) =>
                            setHistoria({ ...historia, av_od_vpsc: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="border border-border p-2">
                        <input
                          type="text"
                          value={historia.av_od_vlcc || ''}
                          onChange={(e) =>
                            setHistoria({ ...historia, av_od_vlcc: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="border border-border p-2">
                        <input
                          type="text"
                          value={historia.av_od_vpcc || ''}
                          onChange={(e) =>
                            setHistoria({ ...historia, av_od_vpcc: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2 font-medium bg-gray-50">OI</td>
                      <td className="border border-border p-2">
                        <input
                          type="text"
                          value={historia.av_oi_vlsc || ''}
                          onChange={(e) =>
                            setHistoria({ ...historia, av_oi_vlsc: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="border border-border p-2">
                        <input
                          type="text"
                          value={historia.av_oi_ph || ''}
                          onChange={(e) => setHistoria({ ...historia, av_oi_ph: e.target.value })}
                          className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="border border-border p-2">
                        <input
                          type="text"
                          value={historia.av_oi_vpsc || ''}
                          onChange={(e) =>
                            setHistoria({ ...historia, av_oi_vpsc: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="border border-border p-2">
                        <input
                          type="text"
                          value={historia.av_oi_vlcc || ''}
                          onChange={(e) =>
                            setHistoria({ ...historia, av_oi_vlcc: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="border border-border p-2">
                        <input
                          type="text"
                          value={historia.av_oi_vpcc || ''}
                          onChange={(e) =>
                            setHistoria({ ...historia, av_oi_vpcc: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Cover Test VL
                  </label>
                  <input
                    type="text"
                    value={historia.coverTest_vl || ''}
                    onChange={(e) => setHistoria({ ...historia, coverTest_vl: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Cover Test VP
                  </label>
                  <input
                    type="text"
                    value={historia.coverTest_vp || ''}
                    onChange={(e) => setHistoria({ ...historia, coverTest_vp: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="motilidad">
            <h3 className="text-lg font-title font-semibold text-primary mb-4">
              Motilidad Ocular
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Hirschberg</label>
                <input
                  type="text"
                  value={historia.hirschberg || ''}
                  onChange={(e) => setHistoria({ ...historia, hirschberg: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Kappa OD</label>
                  <input
                    type="text"
                    value={historia.kappaOD || ''}
                    onChange={(e) => setHistoria({ ...historia, kappaOD: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Kappa OI</label>
                  <input
                    type="text"
                    value={historia.kappaOI || ''}
                    onChange={(e) => setHistoria({ ...historia, kappaOI: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Versiones y DUC
                </label>
                <textarea
                  value={historia.versionesDUC || ''}
                  onChange={(e) => setHistoria({ ...historia, versionesDUC: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="examen">
            <h3 className="text-lg font-title font-semibold text-primary mb-4">
              Examen Externo y CFTA-Moscopia
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Examen Externo</label>
                <textarea
                  value={historia.examenExterno || ''}
                  onChange={(e) => setHistoria({ ...historia, examenExterno: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    CFTA-Moscopia OD
                  </label>
                  <textarea
                    value={historia.cftaMoscopiaOD || ''}
                    onChange={(e) =>
                      setHistoria({ ...historia, cftaMoscopiaOD: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    CFTA-Moscopia OI
                  </label>
                  <textarea
                    value={historia.cftaMoscopiaOI || ''}
                    onChange={(e) =>
                      setHistoria({ ...historia, cftaMoscopiaOI: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Observaciones CFTA
                </label>
                <textarea
                  value={historia.cftaObservaciones || ''}
                  onChange={(e) =>
                    setHistoria({ ...historia, cftaObservaciones: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="subjetivo">
            <h3 className="text-lg font-title font-semibold text-primary mb-4">
              Subjetivo y Refracción
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Subjetivo OD - AV
                  </label>
                  <input
                    type="text"
                    value={historia.subjetivoOD_av || ''}
                    onChange={(e) => setHistoria({ ...historia, subjetivoOD_av: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Subjetivo OD - ADD
                  </label>
                  <input
                    type="text"
                    value={historia.subjetivoOD_add || ''}
                    onChange={(e) =>
                      setHistoria({ ...historia, subjetivoOD_add: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Subjetivo OI - AV
                  </label>
                  <input
                    type="text"
                    value={historia.subjetivoOI_av || ''}
                    onChange={(e) => setHistoria({ ...historia, subjetivoOI_av: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Subjetivo OI - ADD
                  </label>
                  <input
                    type="text"
                    value={historia.subjetivoOI_add || ''}
                    onChange={(e) =>
                      setHistoria({ ...historia, subjetivoOI_add: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Refracción OD
                  </label>
                  <textarea
                    value={historia.refraccionOD || ''}
                    onChange={(e) => setHistoria({ ...historia, refraccionOD: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Refracción OI
                  </label>
                  <textarea
                    value={historia.refraccionOI || ''}
                    onChange={(e) => setHistoria({ ...historia, refraccionOI: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="tests">
            <h3 className="text-lg font-title font-semibold text-primary mb-4">
              Tests Especializados
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Test de Color</label>
                <input
                  type="text"
                  value={historia.testColor || ''}
                  onChange={(e) => setHistoria({ ...historia, testColor: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Test de Estereopsis
                </label>
                <input
                  type="text"
                  value={historia.testEstereopsis || ''}
                  onChange={(e) => setHistoria({ ...historia, testEstereopsis: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Queratometría</label>
                <textarea
                  value={historia.queratometria || ''}
                  onChange={(e) => setHistoria({ ...historia, queratometria: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="formula">
            <h3 className="text-lg font-title font-semibold text-primary mb-4">
              Fórmula Final
            </h3>
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-border p-2 text-sm font-semibold">Ojo</th>
                      <th className="border border-border p-2 text-sm font-semibold">ESF</th>
                      <th className="border border-border p-2 text-sm font-semibold">CYL</th>
                      <th className="border border-border p-2 text-sm font-semibold">EJE</th>
                      <th className="border border-border p-2 text-sm font-semibold">ADD</th>
                      <th className="border border-border p-2 text-sm font-semibold">DNP</th>
                      <th className="border border-border p-2 text-sm font-semibold">AV</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-2 font-medium bg-gray-50">OD</td>
                      <td className="border border-border p-2">
                        <input
                          type="text"
                          value={historia.formulaOD_esf || ''}
                          onChange={(e) =>
                            setHistoria({ ...historia, formulaOD_esf: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="border border-border p-2">
                        <input
                          type="text"
                          value={historia.formulaOD_cyl || ''}
                          onChange={(e) =>
                            setHistoria({ ...historia, formulaOD_cyl: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="border border-border p-2">
                        <input
                          type="text"
                          value={historia.formulaOD_eje || ''}
                          onChange={(e) =>
                            setHistoria({ ...historia, formulaOD_eje: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="border border-border p-2">
                        <input
                          type="text"
                          value={historia.formulaOD_add || ''}
                          onChange={(e) =>
                            setHistoria({ ...historia, formulaOD_add: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="border border-border p-2">
                        <input
                          type="text"
                          value={historia.formulaOD_dnp || ''}
                          onChange={(e) =>
                            setHistoria({ ...historia, formulaOD_dnp: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="border border-border p-2">
                        <input
                          type="text"
                          value={historia.formulaOD_av || ''}
                          onChange={(e) =>
                            setHistoria({ ...historia, formulaOD_av: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-2 font-medium bg-gray-50">OI</td>
                      <td className="border border-border p-2">
                        <input
                          type="text"
                          value={historia.formulaOI_esf || ''}
                          onChange={(e) =>
                            setHistoria({ ...historia, formulaOI_esf: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="border border-border p-2">
                        <input
                          type="text"
                          value={historia.formulaOI_cyl || ''}
                          onChange={(e) =>
                            setHistoria({ ...historia, formulaOI_cyl: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="border border-border p-2">
                        <input
                          type="text"
                          value={historia.formulaOI_eje || ''}
                          onChange={(e) =>
                            setHistoria({ ...historia, formulaOI_eje: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="border border-border p-2">
                        <input
                          type="text"
                          value={historia.formulaOI_add || ''}
                          onChange={(e) =>
                            setHistoria({ ...historia, formulaOI_add: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="border border-border p-2">
                        <input
                          type="text"
                          value={historia.formulaOI_dnp || ''}
                          onChange={(e) =>
                            setHistoria({ ...historia, formulaOI_dnp: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="border border-border p-2">
                        <input
                          type="text"
                          value={historia.formulaOI_av || ''}
                          onChange={(e) =>
                            setHistoria({ ...historia, formulaOI_av: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">ALT</label>
                  <input
                    type="text"
                    value={historia.formulaAlt || ''}
                    onChange={(e) => setHistoria({ ...historia, formulaAlt: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">RX</label>
                  <input
                    type="text"
                    value={historia.formulaRx || ''}
                    onChange={(e) => setHistoria({ ...historia, formulaRx: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Uso</label>
                  <input
                    type="text"
                    value={historia.formulaUso || ''}
                    onChange={(e) => setHistoria({ ...historia, formulaUso: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ej: Uso permanente, Solo para lejos, etc."
                  />
                </div>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="diagnostico">
            <h3 className="text-lg font-title font-semibold text-primary mb-4">
              Diagnóstico y Tratamiento
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Diagnóstico</label>
                <textarea
                  value={historia.diagnostico || ''}
                  onChange={(e) => setHistoria({ ...historia, diagnostico: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Tratamiento</label>
                <textarea
                  value={historia.tratamiento || ''}
                  onChange={(e) => setHistoria({ ...historia, tratamiento: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Controles</label>
                <input
                  type="text"
                  value={historia.controles || ''}
                  onChange={(e) => setHistoria({ ...historia, controles: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ej: Control en 6 meses"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Observaciones</label>
                <textarea
                  value={historia.observaciones || ''}
                  onChange={(e) => setHistoria({ ...historia, observaciones: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
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
