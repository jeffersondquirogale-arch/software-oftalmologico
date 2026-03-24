import type { HistoriaClinica } from '../../db/database';

interface AgudezaVisualTabProps {
  historia: Partial<HistoriaClinica>;
  setHistoria: (h: Partial<HistoriaClinica>) => void;
}

const inputClass =
  'w-full px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary';
const inputLgClass =
  'w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary';

export const AgudezaVisualTab = ({ historia, setHistoria }: AgudezaVisualTabProps) => {
  const set = (field: keyof HistoriaClinica) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setHistoria({ ...historia, [field]: e.target.value });

  return (
    <div>
      <h3 className="text-lg font-title font-semibold text-primary mb-4">Agudeza Visual</h3>
      <div className="space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-border p-2 text-sm font-semibold">Ojo</th>
                <th className="border border-border p-2 text-sm font-semibold">VL s/c</th>
                <th className="border border-border p-2 text-sm font-semibold">PH</th>
                <th className="border border-border p-2 text-sm font-semibold">VP s/c</th>
                <th className="border border-border p-2 text-sm font-semibold">VL c/c</th>
                <th className="border border-border p-2 text-sm font-semibold">VP c/c</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-2 font-medium bg-gray-50">OD</td>
                {(['av_od_vlsc', 'av_od_ph', 'av_od_vpsc', 'av_od_vlcc', 'av_od_vpcc'] as const).map((f) => (
                  <td key={f} className="border border-border p-2">
                    <input type="text" value={historia[f] || ''} onChange={set(f)} className={inputClass} />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-border p-2 font-medium bg-gray-50">OI</td>
                {(['av_oi_vlsc', 'av_oi_ph', 'av_oi_vpsc', 'av_oi_vlcc', 'av_oi_vpcc'] as const).map((f) => (
                  <td key={f} className="border border-border p-2">
                    <input type="text" value={historia[f] || ''} onChange={set(f)} className={inputClass} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Cover Test VL</label>
            <input
              type="text"
              value={historia.coverTest_vl || ''}
              onChange={set('coverTest_vl')}
              className={inputLgClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Cover Test VP</label>
            <input
              type="text"
              value={historia.coverTest_vp || ''}
              onChange={set('coverTest_vp')}
              className={inputLgClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
