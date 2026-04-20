import type { HistoriaClinica } from '../../db/database';
import { S } from './tabStyles';
interface DiagnosticoTabProps { historia: Partial<HistoriaClinica>; setHistoria: (h: Partial<HistoriaClinica>) => void; }

const diagnosticos = [
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
  const set = (field: keyof HistoriaClinica) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setHistoria({ ...historia, [field]: e.target.value });
  return (<div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
    <div><p style={S.title}>Diagnóstico y Tratamiento</p><p style={S.subtitle}>Conclusión clínica y plan de manejo</p></div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
      <div>
        <label style={S.label}>Diagnóstico</label>
        <select
          value={historia.diagnostico || ''}
          onChange={(e) => setHistoria({ ...historia, diagnostico: e.target.value })}
          style={{ ...S.input, appearance: 'auto', cursor: 'pointer' }}
        >
          <option value="">-- Seleccionar diagnóstico --</option>
          {diagnosticos.map(d => (
            <option key={d.codigo} value={`${d.codigo} - ${d.nombre}`}>
              {d.codigo} — {d.nombre}
            </option>
          ))}
        </select>
      </div>
      <div><label style={S.label}>Tratamiento</label><textarea value={historia.tratamiento||''} onChange={set('tratamiento')} rows={5} style={S.textarea} onFocus={S.onFocus} onBlur={S.onBlur}/></div>
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
    <div><label style={S.label}>Observaciones</label><textarea value={historia.observaciones||''} onChange={set('observaciones')} rows={3} style={S.textarea} onFocus={S.onFocus} onBlur={S.onBlur}/></div>
  </div>);
};
