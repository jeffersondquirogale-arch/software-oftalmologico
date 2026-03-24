import type { HistoriaClinica } from '../../db/database';

interface SubjetivoTabProps {
  historia: Partial<HistoriaClinica>;
  setHistoria: (h: Partial<HistoriaClinica>) => void;
}

const inputClass =
  'w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary';

export const SubjetivoTab = ({ historia, setHistoria }: SubjetivoTabProps) => {
  const setField = (field: keyof HistoriaClinica) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setHistoria({ ...historia, [field]: e.target.value });

  return (
    <div>
      <h3 className="text-lg font-title font-semibold text-primary mb-4">
        Subjetivo y Refracción
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Subjetivo OD - AV</label>
            <input type="text" value={historia.subjetivoOD_av || ''} onChange={setField('subjetivoOD_av')} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Subjetivo OD - ADD</label>
            <input type="text" value={historia.subjetivoOD_add || ''} onChange={setField('subjetivoOD_add')} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Subjetivo OI - AV</label>
            <input type="text" value={historia.subjetivoOI_av || ''} onChange={setField('subjetivoOI_av')} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Subjetivo OI - ADD</label>
            <input type="text" value={historia.subjetivoOI_add || ''} onChange={setField('subjetivoOI_add')} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Refracción OD</label>
            <textarea value={historia.refraccionOD || ''} onChange={setField('refraccionOD')} rows={2} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Refracción OI</label>
            <textarea value={historia.refraccionOI || ''} onChange={setField('refraccionOI')} rows={2} className={inputClass} />
          </div>
        </div>
      </div>
    </div>
  );
};
