import type { Paciente, HistoriaClinica } from '../../db/database';

interface CertificadoMedicoProps {
  paciente: Paciente;
  historia: HistoriaClinica;
  certificado?: string;
}

export const CertificadoMedico = ({ paciente, historia, certificado }: CertificadoMedicoProps) => {
  const fecha = new Date();
  const dia = fecha.getDate();
  const mes = fecha.toLocaleDateString('es-ES', { month: 'long' });
  const anio = fecha.getFullYear();

  return (
    <div className="print-content" style={{ display:'none', fontFamily:'Arial, sans-serif', fontSize:'11px', color:'#000', background:'#fff', padding:'15mm 18mm', width:'210mm', boxSizing:'border-box' }}>
      <style>{`@media print { .print-content { display:block !important; } .no-print { display:none !important; } * { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; } @page { size: A4 portrait; margin:0; } }`}</style>

      {/* Encabezado */}
      <div style={{ textAlign:'center', borderBottom:'3px double #1a3a5c', paddingBottom:'16px', marginBottom:'24px' }}>
        <svg width="56" height="56" viewBox="0 0 40 40" style={{ margin:'0 auto 8px' }}><circle cx="20" cy="20" r="18" fill="none" stroke="#1a3a5c" strokeWidth="2"/><ellipse cx="20" cy="20" rx="14" ry="9" fill="none" stroke="#1a3a5c" strokeWidth="1.5"/><circle cx="20" cy="20" r="5" fill="#1a3a5c"/><circle cx="22" cy="18" r="1.5" fill="white"/></svg>
        <div style={{ fontSize:'10px', fontStyle:'italic', color:'#1a3a5c', fontWeight:'bold', marginBottom:'4px' }}>MEJORAR TU VISIÓN ES MI MISIÓN</div>
        <div style={{ fontSize:'18px', fontWeight:'bold', color:'#1a3a5c', marginBottom:'4px' }}>DR. Juan D. Lozada S.</div>
        <div style={{ fontSize:'10px', color:'#555' }}>Optómetra F.U.A.A. | TP 1.010.201.450 | RM 3945 CTNPO</div>
      </div>

      {/* Título */}
      <div style={{ textAlign:'center', marginBottom:'28px' }}>
        <div style={{ display:'inline-block', padding:'6px 32px', border:'2px solid #1a3a5c', borderRadius:'4px' }}>
          <span style={{ fontSize:'14px', fontWeight:'bold', color:'#1a3a5c', letterSpacing:'0.1em' }}>CERTIFICADO MÉDICO</span>
        </div>
      </div>

      {/* Cuerpo */}
      <div style={{ lineHeight:'1.8', fontSize:'12px', marginBottom:'24px' }}>
        <p>El suscrito Optómetra, <strong>DR. Juan D. Lozada S.</strong>, con Tarjeta Profesional N° 1.010.201.450 y Registro de Matrícula 3945 del CTNPO, certifica que el(la) paciente:</p>
        <div style={{ margin:'20px 0', padding:'14px 20px', background:'#f8fafc', border:'1px solid #d1dce8', borderLeft:'4px solid #1a3a5c', borderRadius:'0 6px 6px 0' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
            <div><strong>Nombre:</strong> {paciente.nombres} {paciente.apellidos}</div>
            <div><strong>D.I.:</strong> {paciente.di}</div>
            <div><strong>Edad:</strong> {paciente.edad} años</div>
            <div><strong>EPS:</strong> {paciente.eps}</div>
          </div>
        </div>
        {certificado ? (
          <p style={{ whiteSpace:'pre-wrap' }}>{certificado}</p>
        ) : (
          <>
            <p>fue atendido(a) en consulta de optometría el día <strong>{new Date(historia.fecha).toLocaleDateString('es-ES', { year:'numeric', month:'long', day:'numeric' })}</strong>, presentando el siguiente diagnóstico:</p>
            {historia.diagnostico && <p style={{ margin:'12px 0', padding:'10px 14px', background:'rgba(201,168,76,0.07)', border:'1px solid rgba(201,168,76,0.3)', borderRadius:'6px', fontStyle:'italic' }}>{historia.diagnostico}</p>}
            {historia.tratamiento && <><p><strong>Tratamiento indicado:</strong></p><p>{historia.tratamiento}</p></>}
            {historia.controles && <p><strong>Controles:</strong> {historia.controles}</p>}
          </>
        )}
      </div>

      {/* Ciudad y fecha */}
      <div style={{ marginBottom:'40px', fontSize:'11px' }}>
        <p>Se expide el presente certificado a solicitud del interesado, en la ciudad de <strong>_______________</strong>, a los <strong>{dia}</strong> días del mes de <strong>{mes}</strong> de <strong>{anio}</strong>.</p>
      </div>

      {/* Firma */}
      <div style={{ display:'flex', justifyContent:'flex-end' }}>
        <div style={{ textAlign:'center', minWidth:'220px' }}>
          <div style={{ borderTop:'1px solid #333', paddingTop:'10px' }}>
            <div style={{ fontWeight:'bold', fontSize:'12px' }}>DR. Juan D. Lozada S.</div>
            <div style={{ fontSize:'10px', color:'#555' }}>Optómetra F.U.A.A.</div>
            <div style={{ fontSize:'10px', color:'#555' }}>TP 1.010.201.450 | RM 3945 CTNPO</div>
          </div>
        </div>
      </div>
    </div>
  );
};
