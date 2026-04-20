import type { HistoriaClinica } from '../../db/database';
import { S } from './tabStyles';
interface AgudezaVisualTabProps { historia: Partial<HistoriaClinica>; setHistoria: (h: Partial<HistoriaClinica>) => void; }
export const AgudezaVisualTab = ({ historia, setHistoria }: AgudezaVisualTabProps) => {
  const set = (field: keyof HistoriaClinica) => (e: React.ChangeEvent<HTMLInputElement>) => setHistoria({ ...historia, [field]: e.target.value });
  const odF = ['av_od_vlsc','av_od_ph','av_od_vpsc','av_od_vlcc','av_od_vpcc'] as const;
  const oiF = ['av_oi_vlsc','av_oi_ph','av_oi_vpsc','av_oi_vlcc','av_oi_vpcc'] as const;
  return (<div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
    <div><p style={S.title}>Agudeza Visual</p><p style={S.subtitle}>Registro con y sin corrección</p></div>
    <div style={{overflowX:'auto',borderRadius:'12px',border:'1px solid var(--border)'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
        <thead><tr><th style={S.th}>Ojo</th>{['VL s/c','PH','VP s/c','VL c/c','VP c/c'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
        <tbody>
          <tr><td style={S.tdLabel}>OD</td>{odF.map(f=><td key={f} style={S.td}><input type="text" value={historia[f]||''} onChange={set(f)} style={S.inputSm} onFocus={S.onFocus} onBlur={S.onBlur}/></td>)}</tr>
          <tr><td style={{...S.tdLabel,borderTop:'1px solid rgba(255,255,255,0.2)'}}>OI</td>{oiF.map(f=><td key={f} style={{...S.td,borderBottom:'none'}}><input type="text" value={historia[f]||''} onChange={set(f)} style={S.inputSm} onFocus={S.onFocus} onBlur={S.onBlur}/></td>)}</tr>
        </tbody>
      </table>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
      <div><label style={S.label}>Cover Test VL</label><input type="text" value={historia.coverTest_vl||''} onChange={set('coverTest_vl')} style={S.input} onFocus={S.onFocus} onBlur={S.onBlur}/></div>
      <div><label style={S.label}>Cover Test VP</label><input type="text" value={historia.coverTest_vp||''} onChange={set('coverTest_vp')} style={S.input} onFocus={S.onFocus} onBlur={S.onBlur}/></div>
    </div>
  </div>);
};