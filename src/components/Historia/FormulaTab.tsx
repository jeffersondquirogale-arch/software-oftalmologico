import type { HistoriaClinica } from '../../db/database';
import { S } from './tabStyles';
interface FormulaTabProps { historia: Partial<HistoriaClinica>; setHistoria: (h: Partial<HistoriaClinica>) => void; }
export const FormulaTab = ({ historia, setHistoria }: FormulaTabProps) => {
  const set = (field: keyof HistoriaClinica) => (e: React.ChangeEvent<HTMLInputElement>) => setHistoria({ ...historia, [field]: e.target.value });
  const odF = ['formulaOD_esf','formulaOD_cyl','formulaOD_eje','formulaOD_add','formulaOD_dnp','formulaOD_av'] as const;
  const oiF = ['formulaOI_esf','formulaOI_cyl','formulaOI_eje','formulaOI_add','formulaOI_dnp','formulaOI_av'] as const;
  return (<div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
    <div><p style={S.title}>Fórmula Final</p><p style={S.subtitle}>Prescripción óptica definitiva</p></div>
    <div style={{overflowX:'auto',borderRadius:'12px',border:'1px solid var(--border)'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
        <thead><tr><th style={S.th}>Ojo</th>{['ESF','CYL','EJE','ADD','DNP','AV'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
        <tbody>
          <tr><td style={S.tdLabel}>OD</td>{odF.map(f=><td key={f} style={S.td}><input type="text" value={historia[f]||''} onChange={set(f)} style={S.inputSm} onFocus={S.onFocus} onBlur={S.onBlur}/></td>)}</tr>
          <tr><td style={{...S.tdLabel,borderTop:'1px solid rgba(255,255,255,0.2)'}}>OI</td>{oiF.map(f=><td key={f} style={{...S.td,borderBottom:'none'}}><input type="text" value={historia[f]||''} onChange={set(f)} style={S.inputSm} onFocus={S.onFocus} onBlur={S.onBlur}/></td>)}</tr>
        </tbody>
      </table>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'20px'}}>
      <div><label style={S.label}>ALT</label><input type="text" value={historia.formulaAlt||''} onChange={set('formulaAlt')} style={S.input} onFocus={S.onFocus} onBlur={S.onBlur}/></div>

      <div><label style={S.label}>Uso</label><input type="text" value={historia.formulaUso||''} onChange={set('formulaUso')} style={S.input} onFocus={S.onFocus} onBlur={S.onBlur}/></div>
    </div>
  </div>);
};