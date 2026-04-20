import type { HistoriaClinica } from '../../db/database';
import { S } from './tabStyles';

interface ExamenExternoSoloTabProps {
  historia: Partial<HistoriaClinica>;
  setHistoria: (h: Partial<HistoriaClinica>) => void;
}

export const ExamenExternoSoloTab = ({ historia, setHistoria }: ExamenExternoSoloTabProps) => {
  const set = (field: keyof HistoriaClinica) =>
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
      setHistoria({ ...historia, [field]: e.target.value });

  const parseExt = () => {
    try { return JSON.parse(historia.examenExterno || '{}'); } catch { return {}; }
  };
  const ext = parseExt();
  const setExt = (key: string, val: string) => {
    const current = parseExt();
    current[key] = val;
    setHistoria({ ...historia, examenExterno: JSON.stringify(current) });
  };

  const inp = (key: string) => (
    <input type="text" value={ext[key] || ''} onChange={(e) => setExt(key, e.target.value)}
      style={{ width: '100%', padding: '6px 8px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', textAlign: 'center', background: 'var(--background)', color: 'var(--text)', outline: 'none', fontFamily: 'DM Sans, sans-serif' }}
      onFocus={e => (e.target as HTMLElement).style.borderColor = '#c9a84c'}
      onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'} />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <p style={S.title}>Examen Externo</p>
        <p style={S.subtitle}>Evaluación del segmento anterior</p>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr>
              <th style={S.th}>Examen</th>
              <th style={S.th}>OD</th>
              <th style={S.th}>OI</th>
            </tr>
          </thead>
          <tbody>
            {['1'].map((n, i) => (
              <tr key={n} style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent' }}>
                <td style={{ ...S.tdLabel, background: 'var(--primary)', color: 'white', textAlign: 'center', width: '60px' }}>{n}</td>
                <td style={{ padding: '6px 12px', borderBottom: '1px solid var(--border)' }}>{inp('od' + n)}</td>
                <td style={{ padding: '6px 12px', borderBottom: '1px solid var(--border)' }}>{inp('oi' + n)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <label style={S.label}>Observaciones</label>
        <textarea value={historia.observaciones || ''} onChange={set('observaciones')}
          rows={3} style={S.textarea} onFocus={S.onFocus} onBlur={S.onBlur} />
      </div>
    </div>
  );
};