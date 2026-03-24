import type { HistoriaClinica } from '../../db/database';

interface TestsTabProps {
  historia: Partial<HistoriaClinica>;
  setHistoria: (h: Partial<HistoriaClinica>) => void;
}

const inputClass =
  'w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary';

export const TestsTab = ({ historia, setHistoria }: TestsTabProps) => {
  const setField = (field: keyof HistoriaClinica) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setHistoria({ ...historia, [field]: e.target.value });

  return (
    <div>
      <h3 className="text-lg font-title font-semibold text-primary mb-4">
        Tests Especializados
      </h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1">Test de Color</label>
          <input type="text" value={historia.testColor || ''} onChange={setField('testColor')} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Test de Estereopsis</label>
          <input type="text" value={historia.testEstereopsis || ''} onChange={setField('testEstereopsis')} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Queratometría</label>
          <textarea value={historia.queratometria || ''} onChange={setField('queratometria')} rows={3} className={inputClass} />
        </div>
      </div>
    </div>
  );
};
