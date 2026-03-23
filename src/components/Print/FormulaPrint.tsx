import type { Paciente, HistoriaClinica } from '../../db/database';

interface FormulaPrintProps {
  paciente: Paciente;
  historia: HistoriaClinica;
}

export const FormulaPrint = ({ paciente, historia }: FormulaPrintProps) => {
  return (
    <div className="hidden print:block bg-white p-8 text-black">
      <div className="text-center mb-6 border-b-2 border-primary pb-4">
        <h1 className="text-xl font-title font-bold text-primary mb-1">
          MEJORAR TU VISIÓN ES MI MISIÓN
        </h1>
        <h2 className="text-lg font-title font-semibold text-primary">DR. JUAN D. LOZADA S.</h2>
        <p className="text-sm mt-2">Optómetra F.U.A.A. | TP 1.010.201.450 | RM 3945 CTNPO</p>
        <div className="border-t border-gray-400 mt-2 pt-2">
          <p className="text-xs">Consultorio de Optometría - Atención Especializada</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Paciente:</span> {paciente.nombres}{' '}
            {paciente.apellidos}
          </div>
          <div>
            <span className="font-semibold">D.I.:</span> {paciente.di}
          </div>
          <div>
            <span className="font-semibold">Fecha:</span>{' '}
            {new Date(historia.fecha).toLocaleDateString('es-ES')}
          </div>
          <div>
            <span className="font-semibold">Edad:</span> {paciente.edad} años
          </div>
        </div>
      </div>

      <div className="border-t border-b border-gray-400 py-4 mb-6">
        <h3 className="text-center font-bold text-lg mb-4">FÓRMULA ÓPTICA</h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 p-2">Ojo</th>
              <th className="border border-gray-400 p-2">ESF</th>
              <th className="border border-gray-400 p-2">CYL</th>
              <th className="border border-gray-400 p-2">EJE</th>
              <th className="border border-gray-400 p-2">ADD</th>
              <th className="border border-gray-400 p-2">DNP</th>
              <th className="border border-gray-400 p-2">AV</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 p-2 font-semibold">OD</td>
              <td className="border border-gray-400 p-2">{historia.formulaOD_esf || '-'}</td>
              <td className="border border-gray-400 p-2">{historia.formulaOD_cyl || '-'}</td>
              <td className="border border-gray-400 p-2">{historia.formulaOD_eje || '-'}</td>
              <td className="border border-gray-400 p-2">{historia.formulaOD_add || '-'}</td>
              <td className="border border-gray-400 p-2">{historia.formulaOD_dnp || '-'}</td>
              <td className="border border-gray-400 p-2">{historia.formulaOD_av || '-'}</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2 font-semibold">OI</td>
              <td className="border border-gray-400 p-2">{historia.formulaOI_esf || '-'}</td>
              <td className="border border-gray-400 p-2">{historia.formulaOI_cyl || '-'}</td>
              <td className="border border-gray-400 p-2">{historia.formulaOI_eje || '-'}</td>
              <td className="border border-gray-400 p-2">{historia.formulaOI_add || '-'}</td>
              <td className="border border-gray-400 p-2">{historia.formulaOI_dnp || '-'}</td>
              <td className="border border-gray-400 p-2">{historia.formulaOI_av || '-'}</td>
            </tr>
          </tbody>
        </table>
        {historia.formulaUso && (
          <p className="mt-3 text-sm">
            <span className="font-semibold">Uso:</span> {historia.formulaUso}
          </p>
        )}
      </div>

      {historia.diagnostico && (
        <div className="mb-4">
          <p className="text-sm">
            <span className="font-semibold">Diagnóstico:</span> {historia.diagnostico}
          </p>
        </div>
      )}

      {historia.controles && (
        <div className="mb-4">
          <p className="text-sm">
            <span className="font-semibold">Controles:</span> {historia.controles}
          </p>
        </div>
      )}

      <div className="border-t border-gray-400 pt-6 mt-8">
        <div className="flex justify-end">
          <div className="text-center">
            <div className="border-t border-black w-48 mb-2"></div>
            <p className="font-semibold">DR. JUAN D. LOZADA S.</p>
            <p className="text-xs">Optómetra F.U.A.A.</p>
            <p className="text-xs">TP 1.010.201.450 | RM 3945 CTNPO</p>
          </div>
        </div>
      </div>
    </div>
  );
};
