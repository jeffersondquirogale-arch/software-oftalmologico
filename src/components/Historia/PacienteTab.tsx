import { Search } from 'lucide-react';
import type { Paciente } from '../../db/database';

interface PacienteTabProps {
  searchDI: string;
  setSearchDI: (v: string) => void;
  onSearch: () => void;
  selectedPatient: Paciente | null;
  onClearPatient: () => void;
  newPatient: Partial<Paciente>;
  setNewPatient: (p: Partial<Paciente>) => void;
  errors: Record<string, string>;
  setErrors: (e: Record<string, string>) => void;
}

export const PacienteTab = ({
  searchDI,
  setSearchDI,
  onSearch,
  selectedPatient,
  onClearPatient,
  newPatient,
  setNewPatient,
  errors,
  setErrors,
}: PacienteTabProps) => {
  return (
    <div>
      <h3 className="text-lg font-title font-semibold text-primary mb-4">Datos del Paciente</h3>

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
              onClick={onSearch}
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
          <button onClick={onClearPatient} className="mt-3 text-sm text-danger hover:underline">
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
            {errors.fechaNacimiento && (
              <p className="text-danger text-xs mt-1">{errors.fechaNacimiento}</p>
            )}
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
              onChange={(e) => setNewPatient({ ...newPatient, acompanante: e.target.value })}
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
              onChange={(e) => setNewPatient({ ...newPatient, antecedentes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}
    </div>
  );
};
