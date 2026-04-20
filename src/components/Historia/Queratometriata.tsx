import type { HistoriaClinica } from '../../db/database';
import { S } from './tabStyles';

interface QueratometriaTabProps {
  historia: Partial<HistoriaClinica>;
  setHistoria: (h: Partial<HistoriaClinica>) => void;
}

export const QueratometriaTab = ({ historia, setHistoria }: QueratometriaTabProps) => {
  const set = (field: keyof HistoriaClinica) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setHistoria({ ...historia, [field]: e.target.value });

  const odF = ['queratometriaOD_esf', 'queratometriaOD_cyl', 'queratometriaOD_eje'] as const;
  const oiF = ['queratometriaOI_esf', 'queratometriaOI_cyl', 'queratometriaOI_eje'] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <p style={S.title}>Queratometría</p>
        <p style={S.subtitle}>Medición de la curvatura corneal</p>
      </div>
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr>
              <th style={S.th}>Ojo</th>
              {['ESF', 'CYL', 'EJE'].map(h => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={S.tdLabel}>OD</td>
              {odF.map(f => (
                <td key={f} style={S.td}>
                  <input type="text" value={historia[f] || ''} onChange={set(f)} style={S.inputSm} onFocus={S.onFocus} onBlur={S.onBlur} />
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ ...S.tdLabel, borderTop: '1px solid rgba(255,255,255,0.2)' }}>OI</td>
              {oiF.map(f => (
                <td key={f} style={{ ...S.td, borderBottom: 'none' }}>
                  <input type="text" value={historia[f] || ''} onChange={set(f)} style={S.inputSm} onFocus={S.onFocus} onBlur={S.onBlur} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
