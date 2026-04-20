import type { HistoriaClinica } from '../../db/database';
import { S } from './tabStyles';

interface TestsTabProps {
  historia: Partial<HistoriaClinica>;
  setHistoria: (h: Partial<HistoriaClinica>) => void;
}

export const TestsTab = ({ historia, setHistoria }: TestsTabProps) => {
  const set = (field: keyof HistoriaClinica) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setHistoria({ ...historia, [field]: e.target.value });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <p style={S.title}>Tests</p>
        <p style={S.subtitle}>Pruebas complementarias de visión</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label style={S.label}>Test de Color</label>
          <input type="text" value={historia.testColor || ''} onChange={set('testColor')} style={S.input} onFocus={S.onFocus} onBlur={S.onBlur} />
        </div>
        <div>
          <label style={S.label}>Test de Estereopsis</label>
          <input type="text" value={historia.testEstereopsis || ''} onChange={set('testEstereopsis')} style={S.input} onFocus={S.onFocus} onBlur={S.onBlur} />
        </div>
      </div>
    </div>
  );
};
