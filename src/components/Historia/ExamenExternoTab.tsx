import type { HistoriaClinica } from '../../db/database';

interface ExamenExternoTabProps {
  historia: Partial<HistoriaClinica>;
  setHistoria: (h: Partial<HistoriaClinica>) => void;
}

const textareaClass =
  'w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary';

export const ExamenExternoTab = ({ historia, setHistoria }: ExamenExternoTabProps) => {
  const set = (field: keyof HistoriaClinica) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      setHistoria({ ...historia, [field]: e.target.value });

  return (
    <div>
      <h3 className="text-lg font-title font-semibold text-primary mb-4">
        Examen Externo y CFTA-Moscopia
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1">Examen Externo</label>
          <textarea value={historia.examenExterno || ''} onChange={set('examenExterno')} rows={4} className={textareaClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">CFTA-Moscopia OD</label>
            <textarea value={historia.cftaMoscopiaOD || ''} onChange={set('cftaMoscopiaOD')} rows={3} className={textareaClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">CFTA-Moscopia OI</label>
            <textarea value={historia.cftaMoscopiaOI || ''} onChange={set('cftaMoscopiaOI')} rows={3} className={textareaClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Observaciones CFTA</label>
          <textarea value={historia.cftaObservaciones || ''} onChange={set('cftaObservaciones')} rows={3} className={textareaClass} />
        </div>
      </div>
    </div>
  );
};
