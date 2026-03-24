import type { Paciente, HistoriaClinica } from '../../db/database';

interface CertificadoMedicoProps {
  paciente: Paciente;
  historia?: HistoriaClinica;
  certificado?: string;
}

export const CertificadoMedico = ({ paciente, historia, certificado }: CertificadoMedicoProps) => {
  const fecha = historia?.fecha
    ? new Date(historia.fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="hidden print:block bg-white p-8 text-black">
      <div className="text-center mb-8 border-b-2 border-primary pb-4">
        <h1 className="text-xl font-title font-bold text-primary mb-1">
          MEJORAR TU VISIÓN ES MI MISIÓN
        </h1>
        <h2 className="text-lg font-title font-semibold text-primary">DR. JUAN D. LOZADA S.</h2>
        <p className="text-sm mt-2">Optómetra F.U.A.A. | TP 1.010.201.450 | RM 3945 CTNPO</p>
      </div>

      <h3 className="text-center font-bold text-lg mb-6 tracking-widest">CERTIFICADO MÉDICO</h3>

      <div className="mb-6 text-sm leading-relaxed">
        <p className="mb-4">
          El suscrito <strong>DR. JUAN D. LOZADA S.</strong>, Optómetra matriculado{' '}
          <strong>TP 1.010.201.450</strong>, certifica que:
        </p>
        <div className="ml-6 mb-4 space-y-1">
          <p>
            El/La paciente{' '}
            <strong>
              {paciente.nombres} {paciente.apellidos}
            </strong>
            , identificado(a) con <strong>C.C. {paciente.di}</strong>, de{' '}
            <strong>{paciente.edad} años</strong> de edad, fue valorado(a) el día{' '}
            <strong>{fecha}</strong> en este consultorio.
          </p>
        </div>

        {historia && (
          <div className="mt-4">
            <p className="font-semibold mb-2">HALLAZGOS:</p>
            <ul className="ml-6 space-y-1">
              {historia.av_od_vlcc && (
                <li>Agudeza visual OD (cc): {historia.av_od_vlcc}</li>
              )}
              {historia.av_oi_vlcc && (
                <li>Agudeza visual OI (cc): {historia.av_oi_vlcc}</li>
              )}
              {historia.diagnostico && (
                <li>
                  Diagnóstico: {historia.diagnostico}
                </li>
              )}
              {historia.tratamiento && (
                <li>
                  Tratamiento: {historia.tratamiento}
                </li>
              )}
            </ul>
          </div>
        )}

        {certificado && (
          <div className="mt-4">
            <p className="whitespace-pre-wrap">{certificado}</p>
          </div>
        )}
      </div>

      <div className="mb-6 text-sm">
        <p>
          Se expide el presente certificado a solicitud del interesado en la ciudad de{' '}
          _______________, a los _____ días del mes de _____________ de{' '}
          {new Date().getFullYear()}.
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
