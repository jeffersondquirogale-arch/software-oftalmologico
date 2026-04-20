import type { HistoriaClinica } from '../db/database';
import { S } from '../components/Historia/tabStyles';

interface QueratometriaTabProps {
  historia: Partial<HistoriaClinica>;
  setHistoria: (h: Partial<HistoriaClinica>) => void;
}

export const QueratometriaTab = ({ historia, setHistoria }: QueratometriaTabProps) => {
  const set = (field: keyof HistoriaClinica) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setHistoria({ ...historia, [field]: e.target.value });

  const inputSm: React.CSSProperties = {
    width: '100%', padding: '7px 8px', border: '1px solid var(--border)',
    borderRadius: '6px', fontSize: '13px', textAlign: 'center',
    background: 'var(--background)', color: 'var(--text)',
    outline: 'none', fontFamily: 'DM Sans, sans-serif',
  };

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
              <th style={{ ...S.th, textAlign: 'center' }}>ESF / CYL</th>
              <th style={S.th}>EJE</th>
            </tr>
          </thead>
          <tbody>
            {/* OD */}
            <tr>
              <td style={S.tdLabel}>OD</td>
              <td style={S.td}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="text"
                    value={historia.queratometriaOD_esf || ''}
                    onChange={set('queratometriaOD_esf')}
                    placeholder="ESF"
                    style={inputSm}
                    onFocus={S.onFocus} onBlur={S.onBlur}
                  />
                  <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '16px' }}>/</span>
                  <input
                    type="text"
                    value={historia.queratometriaOD_cyl || ''}
                    onChange={set('queratometriaOD_cyl')}
                    placeholder="CYL"
                    style={inputSm}
                    onFocus={S.onFocus} onBlur={S.onBlur}
                  />
                </div>
              </td>
              <td style={S.td}>
                <input
                  type="text"
                  value={historia.queratometriaOD_eje || ''}
                  onChange={set('queratometriaOD_eje')}
                  placeholder="EJE"
                  style={inputSm}
                  onFocus={S.onFocus} onBlur={S.onBlur}
                />
              </td>
            </tr>
            {/* OI */}
            <tr>
              <td style={{ ...S.tdLabel, borderTop: '1px solid rgba(255,255,255,0.2)' }}>OI</td>
              <td style={{ ...S.td, borderBottom: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="text"
                    value={historia.queratometriaOI_esf || ''}
                    onChange={set('queratometriaOI_esf')}
                    placeholder="ESF"
                    style={inputSm}
                    onFocus={S.onFocus} onBlur={S.onBlur}
                  />
                  <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '16px' }}>/</span>
                  <input
                    type="text"
                    value={historia.queratometriaOI_cyl || ''}
                    onChange={set('queratometriaOI_cyl')}
                    placeholder="CYL"
                    style={inputSm}
                    onFocus={S.onFocus} onBlur={S.onBlur}
                  />
                </div>
              </td>
              <td style={{ ...S.td, borderBottom: 'none' }}>
                <input
                  type="text"
                  value={historia.queratometriaOI_eje || ''}
                  onChange={set('queratometriaOI_eje')}
                  placeholder="EJE"
                  style={inputSm}
                  onFocus={S.onFocus} onBlur={S.onBlur}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <label style={S.label}>Observaciones</label>
        <textarea
          value={historia.queratometriaObservaciones || ''}
          onChange={set('queratometriaObservaciones')}
          rows={3}
          style={S.textarea}
          onFocus={S.onFocus}
          onBlur={S.onBlur}
        />
      </div>
    </div>
  );
};