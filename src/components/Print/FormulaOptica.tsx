import type { Paciente, HistoriaClinica } from '../../db/database';

interface FormulaOpticaProps {
  paciente: Paciente;
  historia: HistoriaClinica;
}

const cell = (v?: string) => v || '—';

export const FormulaOptica = ({ paciente, historia }: FormulaOpticaProps) => (
  <div className="print-content" style={{ display:'none', fontFamily:'Arial, sans-serif', fontSize:'11px', color:'#000', background:'#fff', padding:'12mm 14mm', width:'210mm', boxSizing:'border-box' }}>
    <style>{`@media print { .print-content { display:block !important; } .no-print { display:none !important; } * { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; } @page { size: A4 portrait; margin:0; } }`}</style>

    {/* Encabezado */}
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'3px solid #1a3a5c', paddingBottom:'10px', marginBottom:'16px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
        <svg width="48" height="48" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="none" stroke="#1a3a5c" strokeWidth="2"/><ellipse cx="20" cy="20" rx="14" ry="9" fill="none" stroke="#1a3a5c" strokeWidth="1.5"/><circle cx="20" cy="20" r="5" fill="#1a3a5c"/><circle cx="22" cy="18" r="1.5" fill="white"/></svg>
        <div>
          <div style={{ fontSize:'10px', fontWeight:'bold', color:'#1a3a5c', fontStyle:'italic' }}>MEJORAR TU VISIÓN ES MI MISIÓN</div>
          <div style={{ fontSize:'16px', fontWeight:'bold', color:'#1a3a5c' }}>DR. Juan D. Lozada S.</div>
          <div style={{ fontSize:'9px', color:'#555' }}>Optómetra F.U.A.A. | TP 1.010.201.450 | RM 3945 CTNPO</div>
        </div>
      </div>
      <div style={{ textAlign:'right', fontSize:'10px', color:'#555' }}>
        <div style={{ fontWeight:'bold', color:'#1a3a5c', fontSize:'11px' }}>FÓRMULA ÓPTICA</div>
        <div>{new Date(historia.fecha).toLocaleDateString('es-ES', { year:'numeric', month:'long', day:'numeric' })}</div>
      </div>
    </div>

    {/* Datos paciente */}
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'4px', marginBottom:'16px', padding:'10px 12px', background:'#f8fafc', border:'1px solid #d1dce8', borderRadius:'6px' }}>
      <div><div style={{ fontSize:'8px', fontWeight:'bold', color:'#6b7a8d', textTransform:'uppercase' }}>Paciente</div><div style={{ fontWeight:'bold', fontSize:'11px' }}>{paciente.nombres} {paciente.apellidos}</div></div>
      <div><div style={{ fontSize:'8px', fontWeight:'bold', color:'#6b7a8d', textTransform:'uppercase' }}>D.I.</div><div style={{ fontSize:'11px' }}>{paciente.di}</div></div>
      <div><div style={{ fontSize:'8px', fontWeight:'bold', color:'#6b7a8d', textTransform:'uppercase' }}>Edad</div><div style={{ fontSize:'11px' }}>{paciente.edad} años</div></div>
      <div><div style={{ fontSize:'8px', fontWeight:'bold', color:'#6b7a8d', textTransform:'uppercase' }}>EPS</div><div style={{ fontSize:'11px' }}>{paciente.eps}</div></div>
    </div>

    {/* Tabla fórmula */}
    <div style={{ marginBottom:'16px' }}>
      <div style={{ background:'#1a3a5c', color:'white', padding:'6px 12px', fontSize:'11px', fontWeight:'bold', borderRadius:'6px 6px 0 0', textTransform:'uppercase', letterSpacing:'0.05em' }}>Prescripción</div>
      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'11px' }}>
        <thead>
          <tr style={{ background:'#eef2f7' }}>
            <th style={{ padding:'8px 10px', border:'1px solid #d1dce8', textAlign:'center', fontWeight:'bold', color:'#1a3a5c' }}>Ojo</th>
            {['ESF','CYL','EJE','ADD','DNP','AV'].map(h => <th key={h} style={{ padding:'8px 10px', border:'1px solid #d1dce8', textAlign:'center', fontWeight:'bold', color:'#1a3a5c' }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding:'10px', border:'1px solid #d1dce8', fontWeight:'bold', background:'#1a3a5c', color:'white', textAlign:'center' }}>OD</td>
            {[historia.formulaOD_esf,historia.formulaOD_cyl,historia.formulaOD_eje,historia.formulaOD_add,historia.formulaOD_dnp,historia.formulaOD_av].map((v,i) => <td key={i} style={{ padding:'10px', border:'1px solid #d1dce8', textAlign:'center', fontSize:'12px' }}>{cell(v)}</td>)}
          </tr>
          <tr>
            <td style={{ padding:'10px', border:'1px solid #d1dce8', fontWeight:'bold', background:'#1a3a5c', color:'white', textAlign:'center' }}>OI</td>
            {[historia.formulaOI_esf,historia.formulaOI_cyl,historia.formulaOI_eje,historia.formulaOI_add,historia.formulaOI_dnp,historia.formulaOI_av].map((v,i) => <td key={i} style={{ padding:'10px', border:'1px solid #d1dce8', textAlign:'center', fontSize:'12px' }}>{cell(v)}</td>)}
          </tr>
        </tbody>
      </table>
    </div>

    {/* Uso / Alt / Rx */}
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px', marginBottom:'24px' }}>
      {[['Uso',historia.formulaUso],['ALT',historia.formulaAlt],['RX',historia.formulaRx]].map(([label,val]) => val ? (
        <div key={label as string} style={{ padding:'8px 12px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.3)', borderRadius:'6px' }}>
          <div style={{ fontSize:'8px', fontWeight:'bold', color:'#c9a84c', textTransform:'uppercase', marginBottom:'2px' }}>{label}</div>
          <div style={{ fontSize:'11px', fontWeight:'bold' }}>{val}</div>
        </div>
      ) : null)}
    </div>

    {/* Diagnóstico */}
    {historia.diagnostico && (
      <div style={{ marginBottom:'16px', padding:'10px 12px', border:'1px solid #d1dce8', borderRadius:'6px' }}>
        <div style={{ fontSize:'8px', fontWeight:'bold', color:'#6b7a8d', textTransform:'uppercase', marginBottom:'4px' }}>Diagnóstico</div>
        <div style={{ fontSize:'11px' }}>{historia.diagnostico}</div>
      </div>
    )}

    {/* Controles */}
    {historia.controles && (
      <div style={{ marginBottom:'24px', padding:'10px 12px', border:'1px solid #d1dce8', borderRadius:'6px' }}>
        <div style={{ fontSize:'8px', fontWeight:'bold', color:'#6b7a8d', textTransform:'uppercase', marginBottom:'4px' }}>Controles</div>
        <div style={{ fontSize:'11px' }}>{historia.controles}</div>
      </div>
    )}

    {/* Firma */}
    <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'40px' }}>
      <div style={{ textAlign:'center', minWidth:'200px' }}>
        <div style={{ borderTop:'1px solid #333', paddingTop:'8px' }}>
          <div style={{ fontWeight:'bold', fontSize:'11px' }}>DR. Juan D. Lozada S.</div>
          <div style={{ fontSize:'9px', color:'#555' }}>Optómetra F.U.A.A.</div>
          <div style={{ fontSize:'9px', color:'#555' }}>TP 1.010.201.450 | RM 3945 CTNPO</div>
        </div>
      </div>
    </div>
  </div>
);
