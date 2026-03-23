import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { db } from '../db/database';
import type { Cita, Paciente } from '../db/database';

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

  useEffect(() => {
    loadCitas();
  }, [selectedMonth]);

  const loadCitas = async () => {
    const startOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1)
      .toISOString()
      .split('T')[0];
    const endOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0];

    const allCitas = await db.citas
      .where('fecha')
      .between(startOfMonth, endOfMonth, true, true)
      .toArray();

    const citasConPaciente = await Promise.all(
      allCitas.map(async (cita) => {
        const paciente = await db.pacientes.get(cita.pacienteId);
        return { ...cita, paciente };
      })
    );

    setCitas(citasConPaciente);

    const hoy = new Date().toISOString().split('T')[0];
    const citasDeHoy = citasConPaciente.filter((c) => c.fecha === hoy);
    setCitasHoy(citasDeHoy);
  };

  const searchPatient = async () => {
    if (!searchDI) return;
    const patient = await db.pacientes.where('di').equals(searchDI).first();
    if (patient) {
      setSelectedPatient(patient);
    } else {
      alert('Paciente no encontrado');
    }
  };

  const handleSaveCita = async () => {
    if (!selectedPatient) {
      alert('Por favor seleccione un paciente');
      return;
    }
    if (!newCita.fecha || !newCita.hora || !newCita.motivo) {
      alert('Por favor complete todos los campos');
      return;
    }

    await db.citas.add({
      ...newCita,
      pacienteId: selectedPatient.id!,
    } as Cita);

    setShowModal(false);
    setSelectedPatient(null);
    setSearchDI('');
    setNewCita({
      fecha: new Date().toISOString().split('T')[0],
      estado: 'pendiente',
    });
    loadCitas();
  };

  const handleChangeStatus = async (citaId: number, newStatus: Cita['estado']) => {
    await db.citas.update(citaId, { estado: newStatus });
    loadCitas();
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmada':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'atendida':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelada':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getDaysInMonth = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getCitasForDay = (day: number) => {
    const dateStr = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day)
      .toISOString()
      .split('T')[0];
    return citas.filter((c) => c.fecha === dateStr);
  };

  const changeMonth = (delta: number) => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + delta, 1));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => changeMonth(-1)}
            className="px-3 py-2 border border-border rounded-lg hover:bg-gray-100 transition-colors"
          >
            ←
          </button>
          <h3 className="text-xl font-title font-semibold text-primary">
            {selectedMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </h3>
          <button
            onClick={() => changeMonth(1)}
            className="px-3 py-2 border border-border rounded-lg hover:bg-gray-100 transition-colors"
          >
            →
          </button>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Cita
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-surface rounded-lg shadow-md p-6 border border-border">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-text-muted py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth().map((day, index) => (
              <div
                key={index}
                className={`min-h-24 border border-border rounded-lg p-2 ${
                  day ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {day && (
                  <>
                    <div className="text-sm font-semibold text-primary mb-1">{day}</div>
                    <div className="space-y-1">
                      {getCitasForDay(day).map((cita) => (
                        <div
                          key={cita.id}
                          className={`text-xs p-1 rounded border cursor-pointer ${getStatusColor(
                            cita.estado
                          )}`}
                          onClick={() => setStatusModal({ id: cita.id!, estado: cita.estado })}
                        >
                          {cita.hora} - {cita.paciente?.nombres?.split(' ')[0]}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-lg shadow-md p-6 border border-border">
          <h3 className="text-lg font-title font-semibold text-primary mb-4">Citas de Hoy</h3>
          <div className="space-y-3">
            {citasHoy.length === 0 ? (
              <p className="text-text-muted text-sm">No hay citas para hoy</p>
            ) : (
              citasHoy.map((cita) => (
                <div
                  key={cita.id}
                  className={`p-3 rounded-lg border ${getStatusColor(cita.estado)}`}
                >
                  <p className="font-semibold text-sm">
                    {cita.paciente?.nombres} {cita.paciente?.apellidos}
                  </p>
                  <p className="text-xs mt-1">{cita.hora}</p>
                  <p className="text-xs">{cita.motivo}</p>
                  <span className="inline-block mt-2 text-xs font-medium">{cita.estado}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-title font-semibold text-primary">Nueva Cita</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedPatient(null);
                  setSearchDI('');
                }}
                className="text-text-muted hover:text-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {!selectedPatient && (
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Buscar Paciente por D.I.
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchDI}
                      onChange={(e) => setSearchDI(e.target.value)}
                      className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={searchPatient}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
                    >
                      Buscar
                    </button>
                  </div>
                </div>
              )}

              {selectedPatient && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-semibold text-sm">
                    {selectedPatient.nombres} {selectedPatient.apellidos}
                  </p>
                  <p className="text-xs text-text-muted">D.I.: {selectedPatient.di}</p>
                  <button
                    onClick={() => {
                      setSelectedPatient(null);
                      setSearchDI('');
                    }}
                    className="mt-2 text-xs text-danger hover:underline"
                  >
                    Cambiar paciente
                  </button>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text mb-1">Fecha</label>
                <input
                  type="date"
                  value={newCita.fecha || ''}
                  onChange={(e) => setNewCita({ ...newCita, fecha: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">Hora</label>
                <input
                  type="time"
                  value={newCita.hora || ''}
                  onChange={(e) => setNewCita({ ...newCita, hora: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">Motivo</label>
                <input
                  type="text"
                  value={newCita.motivo || ''}
                  onChange={(e) => setNewCita({ ...newCita, motivo: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Motivo de la cita"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">Estado</label>
                <select
                  value={newCita.estado || 'pendiente'}
                  onChange={(e) =>
                    setNewCita({ ...newCita, estado: e.target.value as Cita['estado'] })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="atendida">Atendida</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Notas (opcional)
                </label>
                <textarea
                  value={newCita.notas || ''}
                  onChange={(e) => setNewCita({ ...newCita, notas: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedPatient(null);
                    setSearchDI('');
                  }}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveCita}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
                >
                  Guardar Cita
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {statusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-title font-semibold text-primary">Cambiar Estado</h3>
              <button onClick={() => setStatusModal(null)} className="text-text-muted hover:text-text">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {(['pendiente', 'confirmada', 'atendida', 'cancelada'] as Cita['estado'][]).map((estado) => (
                <button
                  key={estado}
                  onClick={() => {
                    handleChangeStatus(statusModal.id, estado);
                    setStatusModal(null);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg border font-medium capitalize transition-colors ${
                    statusModal.estado === estado
                      ? getStatusColor(estado) + ' font-bold'
                      : 'border-border hover:bg-gray-50'
                  }`}
                >
                  {estado}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStatusModal(null)}
              className="mt-4 w-full px-4 py-2 border border-border rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
