import { Search, CheckCircle, X } from 'lucide-react';
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

const inputStyle = (hasError?: boolean): React.CSSProperties => ({
  width: '100%', padding: '10px 14px',
  border: `1px solid ${hasError ? 'var(--danger)' : 'var(--border)'}`,
  borderRadius: '10px', fontSize: '14px', color: 'var(--text)',
  background: 'var(--background)', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif',
});

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '12px', fontWeight: 600,
  color: 'var(--text-muted)', letterSpacing: '0.06em',
  textTransform: 'uppercase', marginBottom: '6px',
};

const focus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
  (e.target as HTMLElement).style.borderColor = '#c9a84c';
const blur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
  (e.target as HTMLElement).style.borderColor = 'var(--border)';

export const PacienteTab = ({
  searchDI, setSearchDI, onSearch, selectedPatient, onClearPatient,
  newPatient, setNewPatient, errors, setErrors,
}: PacienteTabProps) => (
  <div>
    <div style={{ marginBottom: '28px' }}>
      <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: 'var(--primary)' }}>
        Datos del Paciente
      </h3>
      <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
        Busca un paciente existente o completa el formulario para registrar uno nuevo
      </p>
    </div>

    {!selectedPatient && (
      <div style={{ padding: '20px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', marginBottom: '28px' }}>
        <label style={labelStyle}>Buscar por Documento de Identidad</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
            <input type="text" value={searchDI} onChange={(e) => setSearchDI(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              placeholder="Ingrese el número de documento"
              style={{ ...inputStyle(), paddingLeft: '38px' }} onFocus={focus} onBlur={blur} />
          </div>
          <button onClick={onSearch} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', background: 'var(--primary)', color: 'white', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            <Search style={{ width: '15px', height: '15px' }} /> Buscar
          </button>
        </div>
        <p style={{ margin: '10px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
          Si no se encuentra, complete el formulario para registrar un nuevo paciente
        </p>
      </div>
    )}

    {selectedPatient ? (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', background: 'rgba(76,201,122,0.07)', border: '1px solid rgba(76,201,122,0.25)', borderRadius: '12px', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(76,201,122,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle style={{ width: '24px', height: '24px', color: '#4cc97a' }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>{selectedPatient.nombres} {selectedPatient.apellidos}</p>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>D.I.: {selectedPatient.di} · {selectedPatient.edad} años · {selectedPatient.genero}</p>
          </div>
        </div>
        <button onClick={onClearPatient} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(192,57,43,0.3)', color: 'var(--danger)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
          <X style={{ width: '13px', height: '13px' }} /> Cambiar
        </button>
      </div>
    ) : (
      <div>
        <p style={{ margin: '0 0 20px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Registrar Nuevo Paciente
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>

          <div>
            <label style={labelStyle}>Nombres <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="text" value={newPatient.nombres || ''}
              onChange={(e) => { setNewPatient({ ...newPatient, nombres: e.target.value }); if (errors.nombres) setErrors({ ...errors, nombres: '' }); }}
              style={inputStyle(!!errors.nombres)} onFocus={focus} onBlur={blur} />
            {errors.nombres && <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--danger)' }}>{errors.nombres}</p>}
          </div>

          <div>
            <label style={labelStyle}>Apellidos <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="text" value={newPatient.apellidos || ''}
              onChange={(e) => { setNewPatient({ ...newPatient, apellidos: e.target.value }); if (errors.apellidos) setErrors({ ...errors, apellidos: '' }); }}
              style={inputStyle(!!errors.apellidos)} onFocus={focus} onBlur={blur} />
            {errors.apellidos && <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--danger)' }}>{errors.apellidos}</p>}
          </div>

          <div>
            <label style={labelStyle}>D.I. <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="text" value={newPatient.di || ''} placeholder="Solo números"
              onChange={(e) => { setNewPatient({ ...newPatient, di: e.target.value }); if (errors.di) setErrors({ ...errors, di: '' }); }}
              style={inputStyle(!!errors.di)} onFocus={focus} onBlur={blur} />
            {errors.di && <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--danger)' }}>{errors.di}</p>}
          </div>

          <div>
            <label style={labelStyle}>Fecha de Nacimiento <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="date" value={newPatient.fechaNacimiento || ''}
              onChange={(e) => { setNewPatient({ ...newPatient, fechaNacimiento: e.target.value }); if (errors.fechaNacimiento) setErrors({ ...errors, fechaNacimiento: '' }); }}
              style={inputStyle(!!errors.fechaNacimiento)} onFocus={focus} onBlur={blur} />
            {errors.fechaNacimiento && <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--danger)' }}>{errors.fechaNacimiento}</p>}
          </div>

          <div>
            <label style={labelStyle}>Género</label>
            <select value={newPatient.genero || 'Masculino'}
              onChange={(e) => setNewPatient({ ...newPatient, genero: e.target.value })}
              style={{ ...inputStyle(), appearance: 'auto' }} onFocus={focus} onBlur={blur}>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Teléfono</label>
            <input type="tel" value={newPatient.telefono || ''} placeholder="Solo números"
              onChange={(e) => { setNewPatient({ ...newPatient, telefono: e.target.value }); if (errors.telefono) setErrors({ ...errors, telefono: '' }); }}
              style={inputStyle(!!errors.telefono)} onFocus={focus} onBlur={blur} />
            {errors.telefono && <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--danger)' }}>{errors.telefono}</p>}
          </div>

          <div>
            <label style={labelStyle}>Dirección</label>
            <input type="text" value={newPatient.direccion || ''}
              onChange={(e) => setNewPatient({ ...newPatient, direccion: e.target.value })}
              style={inputStyle()} onFocus={focus} onBlur={blur} />
          </div>

          <div>
            <label style={labelStyle}>Ocupación</label>
            <input type="text" value={newPatient.ocupacion || ''}
              onChange={(e) => setNewPatient({ ...newPatient, ocupacion: e.target.value })}
              style={inputStyle()} onFocus={focus} onBlur={blur} />
          </div>

          <div>
            <label style={labelStyle}>EPS</label>
            <input type="text" value={newPatient.eps || ''}
              onChange={(e) => setNewPatient({ ...newPatient, eps: e.target.value })}
              style={inputStyle()} onFocus={focus} onBlur={blur} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Antecedentes</label>
            <textarea value={newPatient.antecedentes || ''}
              onChange={(e) => setNewPatient({ ...newPatient, antecedentes: e.target.value })}
              rows={3}
              style={{ ...inputStyle(), resize: 'vertical', lineHeight: 1.6 }}
              onFocus={focus} onBlur={blur} />
          </div>

        </div>
      </div>
    )}
  </div>
);
