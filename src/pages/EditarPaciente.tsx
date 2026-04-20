import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { spGetPaciente, spUpdatePaciente } from '../lib/supabaseService';
import type { Paciente } from '../db/database';

export const EditarPaciente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<Partial<Paciente>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const p = await spGetPaciente(parseInt(id));
      if (p) setPaciente(p);
      setLoading(false);
    };
    load();
  }, [id]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!paciente.nombres?.trim()) e.nombres = 'El nombre es obligatorio.';
    if (!paciente.apellidos?.trim()) e.apellidos = 'Los apellidos son obligatorios.';
    if (!paciente.di?.trim()) e.di = 'El D.I. es obligatorio.';
    else if (!/^\d+$/.test(paciente.di.trim())) e.di = 'Solo números.';
    if (paciente.telefono && !/^\d+$/.test(paciente.telefono.trim())) e.telefono = 'Solo números.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      await spUpdatePaciente(parseInt(id!), paciente);
      navigate(`/pacientes/${id}`);
    } catch {
      alert('Error al actualizar el paciente.');
    } finally {
      setSaving(false);
    }
  };

  const set = (field: keyof Paciente) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setPaciente(p => ({ ...p, [field]: e.target.value }));

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: '8px',
    border: '1px solid var(--border)', background: 'var(--background)',
    color: 'var(--text)', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '13px', fontWeight: 600,
    color: 'var(--text)', marginBottom: '4px',
  };
  const errorStyle: React.CSSProperties = {
    fontSize: '12px', color: 'var(--danger)', marginTop: '3px',
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px', color: 'var(--text-muted)' }}>
        Cargando...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>

      {/* Header */}
      <div>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: 'var(--primary)' }}>
          Editar Paciente
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>
          {paciente.nombres} {paciente.apellidos}
        </p>
      </div>

      {/* Datos personales */}
      <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px' }}>
        <h2 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 700, color: 'var(--primary)' }}>Datos Personales</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Nombres <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input style={inputStyle} value={paciente.nombres || ''} onChange={set('nombres')}
              onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            {errors.nombres && <p style={errorStyle}>{errors.nombres}</p>}
          </div>
          <div>
            <label style={labelStyle}>Apellidos <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input style={inputStyle} value={paciente.apellidos || ''} onChange={set('apellidos')}
              onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            {errors.apellidos && <p style={errorStyle}>{errors.apellidos}</p>}
          </div>
          <div>
            <label style={labelStyle}>D.I. <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input style={inputStyle} value={paciente.di || ''} onChange={set('di')}
              onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            {errors.di && <p style={errorStyle}>{errors.di}</p>}
          </div>
          <div>
            <label style={labelStyle}>Fecha de Nacimiento</label>
            <input type="date" style={inputStyle} value={paciente.fechaNacimiento || ''} onChange={set('fechaNacimiento')}
              onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>
          <div>
            <label style={labelStyle}>Género</label>
            <select style={inputStyle} value={paciente.genero || ''} onChange={set('genero')}>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Teléfono</label>
            <input style={inputStyle} value={paciente.telefono || ''} onChange={set('telefono')}
              onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            {errors.telefono && <p style={errorStyle}>{errors.telefono}</p>}
          </div>
          <div>
            <label style={labelStyle}>EPS</label>
            <input style={inputStyle} value={paciente.eps || ''} onChange={set('eps')}
              onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>
          <div>
            <label style={labelStyle}>Ocupación</label>
            <input style={inputStyle} value={paciente.ocupacion || ''} onChange={set('ocupacion')}
              onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Dirección</label>
            <input style={inputStyle} value={paciente.direccion || ''} onChange={set('direccion')}
              onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>
          <div>
            <label style={labelStyle}>Acompañante</label>
            <input style={inputStyle} value={paciente.acompanante || ''} onChange={set('acompanante')}
              onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>
          <div>
            <label style={labelStyle}>Parentesco</label>
            <input style={inputStyle} value={paciente.parentesco || ''} onChange={set('parentesco')}
              onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Antecedentes</label>
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: 'none' }}
              value={paciente.antecedentes || ''}
              onChange={set('antecedentes')}
              onFocus={e => (e.target.style.borderColor = '#c9a84c')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>
        </div>
      </div>

      {/* Botones */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button
          onClick={() => navigate(`/pacientes/${id}`)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X style={{ width: '14px', height: '14px' }} />
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, border: 'none', background: 'var(--primary)', color: 'white', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
        >
          <Save style={{ width: '15px', height: '15px' }} />
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
};