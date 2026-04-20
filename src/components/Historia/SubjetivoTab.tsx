import type { HistoriaClinica } from '../../db/database';
import { S } from './tabStyles';

interface SubjetivoTabProps {
  historia: Partial<HistoriaClinica>;
  setHistoria: (h: Partial<HistoriaClinica>) => void;
}

export const SubjetivoTab = ({ historia, setHistoria }: SubjetivoTabProps) => {
  const set = (field: keyof HistoriaClinica) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setHistoria({ ...historia, [field]: e.target.value });

  const subjetivoOD = ['subjetivoOD_esf','subjetivoOD_cyl','subjetivoOD_eje','subjetivoOD_av','subjetivoOD_add'] as const;
  const subjetivoOI = ['subjetivoOI_esf','subjetivoOI_cyl','subjetivoOI_eje','subjetivoOI_av','subjetivoOI_add'] as const;
  const refraccionOD = ['refraccionOD_esf','refraccionOD_cyl','refraccionOD_eje','refraccionOD_add','refraccionOD_dnp','refraccionOD_av'] as const;
  const refraccionOI = ['refraccionOI_esf','refraccionOI_cyl','refraccionOI_eje','refraccionOI_add','refraccionOI_dnp','refraccionOI_av'] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Subjetivo */}
      <div>
        <p style={S.title}>Subjetivo</p>
        <p style={S.subtitle}>Refracción subjetiva</p>
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>
                <th style={S.th}>Ojo</th>
                {['ESF', 'CYL', 'EJE', 'AV', 'ADD'].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={S.tdLabel}>OD</td>
                {subjetivoOD.map(f => (
                  <td key={f} style={S.td}>
                    <input type="text" value={historia[f] || ''} onChange={set(f)} style={S.inputSm} onFocus={S.onFocus} onBlur={S.onBlur} />
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ ...S.tdLabel, borderTop: '1px solid rgba(255,255,255,0.2)' }}>OI</td>
                {subjetivoOI.map(f => (
                  <td key={f} style={{ ...S.td, borderBottom: 'none' }}>
                    <input type="text" value={historia[f] || ''} onChange={set(f)} style={S.inputSm} onFocus={S.onFocus} onBlur={S.onBlur} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Refracción */}
      <div>
        <p style={S.title}>Refracción</p>
        <p style={S.subtitle}>Refracción objetiva / ciclopléjica</p>
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>
                <th style={S.th}>Ojo</th>
                {['ESF', 'CYL', 'EJE', 'ADD', 'DNP', 'AV'].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={S.tdLabel}>OD</td>
                {refraccionOD.map(f => (
                  <td key={f} style={S.td}>
                    <input type="text" value={historia[f] || ''} onChange={set(f)} style={S.inputSm} onFocus={S.onFocus} onBlur={S.onBlur} />
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ ...S.tdLabel, borderTop: '1px solid rgba(255,255,255,0.2)' }}>OI</td>
                {refraccionOI.map(f => (
                  <td key={f} style={{ ...S.td, borderBottom: 'none' }}>
                    <input type="text" value={historia[f] || ''} onChange={set(f)} style={S.inputSm} onFocus={S.onFocus} onBlur={S.onBlur} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
