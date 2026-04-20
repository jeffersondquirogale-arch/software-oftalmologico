import type { HistoriaClinica } from '../../db/database';
import { S } from './tabStyles';

interface TestsTabProps {
  historia: Partial<HistoriaClinica>;
  setHistoria: (h: Partial<HistoriaClinica>) => void;
}

export const TestsTab = ({ historia, setHistoria }: TestsTabProps) => {
  const set = (field: keyof HistoriaClinica) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setHistoria({ ...historia, [field]: e.target.value });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <p style={S.title}>Tests</p>
        <p style={S.subtitle}>Pruebas complementarias de visión</p>
      </div>

      {/* Test de Color */}
      <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ background: 'var(--primary)', color: 'white', padding: '8px 16px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Test de Color
        </div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={S.label}>OD</label>
              <input type="text" value={historia.testColorOD || ''} onChange={set('testColorOD')}
                style={S.input} onFocus={S.onFocus} onBlur={S.onBlur} />
            </div>
            <div>
              <label style={S.label}>OI</label>
              <input type="text" value={historia.testColorOI || ''} onChange={set('testColorOI')}
                style={S.input} onFocus={S.onFocus} onBlur={S.onBlur} />
            </div>
          </div>
          <div>
            <label style={S.label}>Observaciones</label>
            <textarea value={historia.testColorObservaciones || ''} onChange={set('testColorObservaciones')}
              rows={2} style={S.textarea} onFocus={S.onFocus} onBlur={S.onBlur} />
          </div>
        </div>
      </div>

      {/* Test Estereopsis */}
      <div style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ background: 'var(--primary)', color: 'white', padding: '8px 16px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Test Estereopsis
        </div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={S.label}>Resultado</label>
            <input type="text" value={historia.testEstereopsisResultado || ''} onChange={set('testEstereopsisResultado')}
              style={S.input} onFocus={S.onFocus} onBlur={S.onBlur} />
          </div>
          <div>
            <label style={S.label}>Observaciones</label>
            <textarea value={historia.testEstereopsisObservaciones || ''} onChange={set('testEstereopsisObservaciones')}
              rows={2} style={S.textarea} onFocus={S.onFocus} onBlur={S.onBlur} />
          </div>
        </div>
      </div>
    </div>
  );
};
