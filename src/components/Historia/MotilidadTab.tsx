import type { HistoriaClinica } from '../../db/database';

interface MotilidadTabProps {
  historia: Partial<HistoriaClinica>;
  setHistoria: (h: Partial<HistoriaClinica>) => void;
}

const inputClass =
  'w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary';

export const MotilidadTab = ({ historia, setHistoria }: MotilidadTabProps) => {
  const set = (field: keyof HistoriaClinica) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setHistoria({ ...historia, [field]: e.target.value });

  return (
    <div>
      <h3 className="text-lg font-title font-semibold text-primary mb-4">Motilidad Ocular</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1">Hirschberg</label>
          <input type="text" value={historia.hirschberg || ''} onChange={set('hirschberg')} className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Kappa OD</label>
            <input type="text" value={historia.kappaOD || ''} onChange={set('kappaOD')} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Kappa OI</label>
            <input type="text" value={historia.kappaOI || ''} onChange={set('kappaOI')} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Versiones y DUC</label>
          <textarea
            value={historia.versionesDUC || ''}
            onChange={set('versionesDUC')}
            rows={4}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
};
