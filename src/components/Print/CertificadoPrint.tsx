import type { Paciente } from '../../db/database';

interface CertificadoPrintProps {
  paciente: Paciente;
  certificado: string;
}

export const CertificadoPrint = ({ paciente, certificado }: CertificadoPrintProps) => {
  return (
    <div className="hidden print:block bg-white p-8 text-black">
      <div className="text-center mb-8 border-b-2 border-primary pb-4">
        <h1 className="text-xl font-title font-bold text-primary mb-1">
          MEJORAR TU VISIÓN ES MI MISIÓN
        </h1>
        <h2 className="text-lg font-title font-semibold text-primary">DR. JUAN D. LOZADA S.</h2>
        <p className="text-sm mt-2">Optómetra F.U.A.A. | TP 1.010.201.450 | RM 3945 CTNPO</p>
      </div>

      <h3 className="text-center font-bold text-lg mb-6">CERTIFICADO MÉDICO</h3>

      <div className="mb-6">
        <p className="text-sm mb-4">
          El suscrito Optómetra certifica que el paciente:
        </p>
        <div className="ml-6 mb-4">
          <p className="text-sm">
            <span className="font-semibold">Nombre:</span> {paciente.nombres} {paciente.apellidos}
          </p>
          <p className="text-sm">
            <span className="font-semibold">D.I.:</span> {paciente.di}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Edad:</span> {paciente.edad} años
          </p>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-sm whitespace-pre-wrap">{certificado}</p>
      </div>

      <div className="mb-6">
        <p className="text-sm">
          Se expide el presente certificado a solicitud del interesado en la ciudad de{' '}
          _______________, a los _____ días del mes de _____________ de {new Date().getFullYear()}.
        </p>
      </div>

      <div className="mt-12 flex justify-end">
        <div className="text-center">
          <div className="border-t border-black w-48 mb-2"></div>
          <p className="font-semibold">DR. JUAN D. LOZADA S.</p>
          <p className="text-xs">Optómetra F.U.A.A.</p>
          <p className="text-xs">TP 1.010.201.450 | RM 3945 CTNPO</p>
        </div>
      </div>
    </div>
  );
};
