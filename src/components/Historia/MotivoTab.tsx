import type { HistoriaClinica } from '../../db/database';

interface MotivoTabProps {
  historia: Partial<HistoriaClinica>;
  setHistoria: (h: Partial<HistoriaClinica>) => void;
}

export const MotivoTab = ({ historia, setHistoria }: MotivoTabProps) => {
  return (
    <div>
      <h3 className="text-lg font-title font-semibold text-primary mb-4">Motivo de Consulta</h3>
      <textarea
        value={historia.motivoConsulta || ''}
        onChange={(e) => setHistoria({ ...historia, motivoConsulta: e.target.value })}
        rows={5}
        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Describa el motivo de la consulta..."
      />
    </div>
  );
};
