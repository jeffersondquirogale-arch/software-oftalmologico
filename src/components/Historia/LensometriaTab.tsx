import type { HistoriaClinica } from '../../db/database';
import { S } from './tabStyles';
interface LensometriaTabProps { historia: Partial<HistoriaClinica>; setHistoria: (h: Partial<HistoriaClinica>) => void; }
export const LensometriaTab = ({ historia, setHistoria }: LensometriaTabProps) => {
  const set = (field: keyof HistoriaClinica) => (e: React.ChangeEvent<HTMLInputElement>) => setHistoria({ ...historia, [field]: e.target.value });
  const odF = ['lensOD_esf','lensOD_cyl','lensOD_eje','lensOD_add','lensOD_dnp','lensOD_pris'] as const;
  const oiF = ['lensOI_esf','lensOI_cyl','lensOI_eje','lensOI_add','lensOI_dnp','lensOI_pris'] as const;
  return (<div><p style={S.title}>Lensometría</p><p style={S.subtitle}>Medición de los lentes actuales</p>
    <div style={{overflowX:'auto',borderRadius:'12px',border:'1px solid var(--border)'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
        <thead><tr><th style={S.th}>Ojo</th>{['ESF','CYL','EJE','ADD','DNP','PRIS'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
        <tbody>
          <tr><td style={S.tdLabel}>OD</td>{odF.map(f=><td key={f} style={S.td}><input type="text" value={historia[f]||''} onChange={set(f)} style={S.inputSm} onFocus={S.onFocus} onBlur={S.onBlur}/></td>)}</tr>
          <tr><td style={{...S.tdLabel,borderTop:'1px solid rgba(255,255,255,0.2)'}}>OI</td>{oiF.map(f=><td key={f} style={{...S.td,borderBottom:'none'}}><input type="text" value={historia[f]||''} onChange={set(f)} style={S.inputSm} onFocus={S.onFocus} onBlur={S.onBlur}/></td>)}</tr>
        </tbody>
      </table>
    </div>
  </div>);
};