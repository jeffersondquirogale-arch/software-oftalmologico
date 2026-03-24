import type { HistoriaClinica } from '../../db/database';

interface DiagnosticoTabProps {
  historia: Partial<HistoriaClinica>;
  setHistoria: (h: Partial<HistoriaClinica>) => void;
}

const inputClass =
  'w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary';

export const DiagnosticoTab = ({ historia, setHistoria }: DiagnosticoTabProps) => {
  const set = (field: keyof HistoriaClinica) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setHistoria({ ...historia, [field]: e.target.value });

  return (
    <div>
      <h3 className="text-lg font-title font-semibold text-primary mb-4">
        Diagnóstico y Tratamiento
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1">Diagnóstico</label>
          <textarea value={historia.diagnostico || ''} onChange={set('diagnostico')} rows={4} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Tratamiento</label>
          <textarea value={historia.tratamiento || ''} onChange={set('tratamiento')} rows={4} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Controles</label>
          <input
            type="text"
            value={historia.controles || ''}
            onChange={set('controles')}
            className={inputClass}
            placeholder="Ej: Control en 6 meses"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-1">Observaciones</label>
          <textarea value={historia.observaciones || ''} onChange={set('observaciones')} rows={3} className={inputClass} />
        </div>
      </div>
    </div>
  );
};
