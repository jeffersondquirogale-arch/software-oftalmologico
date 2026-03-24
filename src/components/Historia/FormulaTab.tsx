import type { HistoriaClinica } from '../../db/database';

interface FormulaTabProps {
  historia: Partial<HistoriaClinica>;
  setHistoria: (h: Partial<HistoriaClinica>) => void;
}

const inputClass =
  'w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary';
const inputLgClass =
  'w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary';

export const FormulaTab = ({ historia, setHistoria }: FormulaTabProps) => {
  const set = (field: keyof HistoriaClinica) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setHistoria({ ...historia, [field]: e.target.value });

  return (
    <div>
      <h3 className="text-lg font-title font-semibold text-primary mb-4">Fórmula Final</h3>
      <div className="space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-border p-2 text-sm font-semibold">Ojo</th>
                <th className="border border-border p-2 text-sm font-semibold">ESF</th>
                <th className="border border-border p-2 text-sm font-semibold">CYL</th>
                <th className="border border-border p-2 text-sm font-semibold">EJE</th>
                <th className="border border-border p-2 text-sm font-semibold">ADD</th>
                <th className="border border-border p-2 text-sm font-semibold">DNP</th>
                <th className="border border-border p-2 text-sm font-semibold">AV</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-2 font-medium bg-gray-50">OD</td>
                {(['formulaOD_esf', 'formulaOD_cyl', 'formulaOD_eje', 'formulaOD_add', 'formulaOD_dnp', 'formulaOD_av'] as const).map((f) => (
                  <td key={f} className="border border-border p-2">
                    <input type="text" value={historia[f] || ''} onChange={set(f)} className={inputClass} />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-border p-2 font-medium bg-gray-50">OI</td>
                {(['formulaOI_esf', 'formulaOI_cyl', 'formulaOI_eje', 'formulaOI_add', 'formulaOI_dnp', 'formulaOI_av'] as const).map((f) => (
                  <td key={f} className="border border-border p-2">
                    <input type="text" value={historia[f] || ''} onChange={set(f)} className={inputClass} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">ALT</label>
            <input type="text" value={historia.formulaAlt || ''} onChange={set('formulaAlt')} className={inputLgClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">RX</label>
            <input type="text" value={historia.formulaRx || ''} onChange={set('formulaRx')} className={inputLgClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Uso</label>
            <input
              type="text"
              value={historia.formulaUso || ''}
              onChange={set('formulaUso')}
              className={inputLgClass}
              placeholder="Ej: Uso permanente, Solo para lejos, etc."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
