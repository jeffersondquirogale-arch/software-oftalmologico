import type { HistoriaClinica } from '../../db/database';

interface LensometriaTabProps {
  historia: Partial<HistoriaClinica>;
  setHistoria: (h: Partial<HistoriaClinica>) => void;
}

const inputClass =
  'w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary';

export const LensometriaTab = ({ historia, setHistoria }: LensometriaTabProps) => {
  const set = (field: keyof HistoriaClinica) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setHistoria({ ...historia, [field]: e.target.value });

  return (
    <div>
      <h3 className="text-lg font-title font-semibold text-primary mb-4">Lensometría</h3>
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
              <th className="border border-border p-2 text-sm font-semibold">PRIS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-border p-2 font-medium bg-gray-50">OD</td>
              {(['lensOD_esf', 'lensOD_cyl', 'lensOD_eje', 'lensOD_add', 'lensOD_dnp', 'lensOD_pris'] as const).map((f) => (
                <td key={f} className="border border-border p-2">
                  <input type="text" value={historia[f] || ''} onChange={set(f)} className={inputClass} />
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-border p-2 font-medium bg-gray-50">OI</td>
              {(['lensOI_esf', 'lensOI_cyl', 'lensOI_eje', 'lensOI_add', 'lensOI_dnp', 'lensOI_pris'] as const).map((f) => (
                <td key={f} className="border border-border p-2">
                  <input type="text" value={historia[f] || ''} onChange={set(f)} className={inputClass} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
