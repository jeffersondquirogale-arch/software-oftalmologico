import { useState } from 'react';
import type { HistoriaClinica } from '../../db/database';
import { S } from './tabStyles';

interface DiagnosticoTabProps {
  historia: Partial<HistoriaClinica>;
  setHistoria: (h: Partial<HistoriaClinica>) => void;
}

const DIAGNOSTICOS = [
  { codigo: 'H520', nombre: 'Hipermetropía' },
  { codigo: 'H521', nombre: 'Miopía' },
  { codigo: 'H522', nombre: 'Astigmatismo' },
  { codigo: 'H524', nombre: 'Presbicia' },
  { codigo: 'H527', nombre: 'Trastorno de la refracción no especificado' },
  { codigo: 'H100', nombre: 'Conjuntivitis mucopurulenta' },
  { codigo: 'H103', nombre: 'Conjuntivitis aguda no especificada' },
  { codigo: 'H110', nombre: 'Pterigión' },
  { codigo: 'H160', nombre: 'Úlcera de la córnea' },
  { codigo: 'H169', nombre: 'Queratitis no especificada' },
  { codigo: 'H250', nombre: 'Catarata senil incipiente' },
  { codigo: 'H259', nombre: 'Catarata senil no especificada' },
  { codigo: 'H400', nombre: 'Sospecha de glaucoma' },
  { codigo: 'H401', nombre: 'Glaucoma primario de ángulo abierto' },
  { codigo: 'H409', nombre: 'Glaucoma no especificado' },
  { codigo: 'H530', nombre: 'Ambliopía' },
  { codigo: 'H532', nombre: 'Diplopía' },
  { codigo: 'H534', nombre: 'Defectos del campo visual' },
  { codigo: 'H539', nombre: 'Alteración visual no especificada' },
];

export const DiagnosticoTab = ({ historia, setHistoria }: DiagnosticoTabProps) => {
  const [search, setSearch] = useState('');

  const set = (field: keyof HistoriaClinica) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setHistoria({ ...historia, [field]: e.target.value });

  // Parse diagnosticos seleccionados (guardados como JSON array en diagnostico)
  const getSelected = (): string[] => {
    try {
      const parsed = JSON.parse(historia.diagnostico || '[]');
      return Array.isArray(parsed) ? parsed : [historia.diagnostico || ''].filter(Boolean);
    } catch {
      return historia.diagnostico ? [historia.diagnostico] : [];
    }
  };

  const selected = getSelected();

  const toggleDiagnostico = (valor: string) => {
    const current = getSelected();
    const exists = current.includes(valor);
    const updated = exists ? current.filter(d => d !== valor) : [...current, valor];
    setHistoria({ ...historia, diagnostico: JSON.stringify(updated) });
  };

  const removeDiagnostico = (valor: string) => {
    const updated = selected.filter(d => d !== valor);
    setHistoria({ ...historia, diagnostico: JSON.stringify(updated) });
  };

  const filtered = DIAGNOSTICOS.filter(d =>
    d.codigo.toLowerCase().includes(search.toLowerCase()) ||
    d.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <p style={S.title}>Diagnóstico y Tratamiento</p>
        <p style={S.subtitle}>Conclusión clínica y plan de manejo</p>
      </div>

      {/* Diagnósticos seleccionados */}
      {selected.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {selected.map(d => (
            <span key={d} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '4px 10px', borderRadius: '20px',
              background: 'rgba(26,58,92,0.1)', border: '1px solid rgba(26,58,92,0.3)',
              fontSize: '12px', fontWeight: 600, color: 'var(--primary)',
            }}>
              {d}
              <button onClick={() => removeDiagnostico(d)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--primary)', fontSize: '14px', lineHeight: 1, padding: '0',
              }}>×</button>
            </span>
          ))}
        </div>
      )}

      {/* Buscador + lista */}
      <div>
        <label style={S.label}>Seleccionar diagnóstico(s)</label>
        <input
          type="text"
          placeholder="Buscar por código o nombre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...S.input, marginBottom: '8px' }}
          onFocus={S.onFocus} onBlur={S.onBlur}
        />
        <div style={{
          maxHeight: '200px', overflowY: 'auto',
          border: '1px solid var(--border)', borderRadius: '10px',
        }}>
          {filtered.map((d, i) => {
            const valor = `${d.codigo} - ${d.nombre}`;
            const isSelected = selected.includes(valor);
            return (
              <div
                key={d.codigo}
                onClick={() => toggleDiagnostico(valor)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px', cursor: 'pointer',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                  background: isSelected ? 'rgba(26,58,92,0.06)' : 'transparent',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.05)'; }}
                onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <div style={{
                  width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
                  border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                  background: isSelected ? 'var(--primary)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isSelected && <span style={{ color: 'white', fontSize: '12px', lineHeight: 1 }}>✓</span>}
                </div>
                <span style={{ fontSize: '13px', color: 'var(--text)' }}>
                  <strong>{d.codigo}</strong> — {d.nombre}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tratamiento */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={S.label}>Tratamiento</label>
          <textarea value={historia.tratamiento || ''} onChange={set('tratamiento')}
            rows={4} style={S.textarea} onFocus={S.onFocus} onBlur={S.onBlur} />
        </div>
        <div>
          <label style={S.label}>Controles</label>
          <select
            value={historia.controles || ''}
            onChange={(e) => setHistoria({ ...historia, controles: e.target.value })}
            style={{ ...S.input, appearance: 'auto', cursor: 'pointer' }}
          >
            <option value="">-- Seleccionar --</option>
            <option value="Cada 3 meses">Cada 3 meses</option>
            <option value="Cada 6 meses">Cada 6 meses</option>
            <option value="Cada 9 meses">Cada 9 meses</option>
            <option value="Cada 12 meses">Cada 12 meses</option>
          </select>
        </div>
      </div>

      <div>
        <label style={S.label}>Observaciones</label>
        <textarea value={historia.observaciones || ''} onChange={set('observaciones')}
          rows={3} style={S.textarea} onFocus={S.onFocus} onBlur={S.onBlur} />
      </div>
    </div>
  );
};