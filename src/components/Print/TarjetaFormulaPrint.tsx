import type { Paciente, HistoriaClinica } from '../../db/database';

interface TarjetaFormulaPrintProps {
  paciente: Paciente;
  historia: HistoriaClinica;
}

const v = (val?: string) => val || '—';

export const TarjetaFormulaPrint = ({ paciente, historia }: TarjetaFormulaPrintProps) => {
  const fechaConsulta = new Date(historia.fecha);
  const fechaControl = new Date(historia.fecha);
  const meses = historia.controles?.includes("3") ? 3 : historia.controles?.includes("9") ? 9 : historia.controles?.includes("12") ? 12 : 6;
  fechaControl.setMonth(fechaControl.getMonth() + meses);

  const fmt = (d: Date) => d.toLocaleDateString("es-ES", { day:"2-digit", month:"2-digit", year:"numeric" });
  const fmtLong = (d: Date) => d.toLocaleDateString("es-ES", { weekday:"long", day:"numeric", month:"long", year:"numeric" });

  const th: React.CSSProperties = { border:"1px solid #c8d4e0", padding:"5px 8px", textAlign:"center", background:"#1a3a5c", color:"white", fontSize:"8px", fontWeight:"bold", letterSpacing:"0.04em" };
  const td: React.CSSProperties = { border:"1px solid #c8d4e0", padding:"6px 8px", textAlign:"center", fontSize:"10px" };

  return (
    <div className="print-content" style={{ display:"none" }}>
      <style>{``}</style>
      <style>{`
        @media print {
          .print-content { display: block !important; }
          .no-print { display: none !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          @page { size: A5 portrait; margin: 0; }
        }
      `}</style>

      <div style={{ fontFamily:"Arial, sans-serif", color:"#111", background:"#fff", fontSize:"10px", padding:"10mm 15mm" }}>

        {/* Encabezado */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", borderBottom:"3px solid #1a3a5c", paddingBottom:"8px", marginBottom:"10px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <svg width="44" height="44" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="none" stroke="#1a3a5c" strokeWidth="2"/><ellipse cx="20" cy="20" rx="14" ry="9" fill="none" stroke="#1a3a5c" strokeWidth="1.5"/><circle cx="20" cy="20" r="5" fill="#1a3a5c"/><circle cx="22" cy="18" r="1.5" fill="white"/></svg>
            <div>
              <div style={{ fontSize:"15px", fontWeight:"bold", color:"#1a3a5c" }}>DR. Juan D. Lozada S.</div>
              <div style={{ fontSize:"8px", color:"#555", marginTop:"1px" }}>Optómetra F.U.A.A. &nbsp;|&nbsp; TP: 1.010.201.450 &nbsp;|&nbsp; RM 3945 CTNPO</div>
              <div style={{ fontSize:"8px", color:"#c9a84c", fontWeight:"bold", fontStyle:"italic", marginTop:"2px" }}>MEJORAR TU VISIÓN ES MI MISIÓN</div>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:"7px", color:"#888", textTransform:"uppercase", letterSpacing:"0.05em" }}>Historia N°</div>
            <div style={{ fontSize:"18px", fontWeight:"bold", color:"#1a3a5c", lineHeight:1 }}>{String(historia.id || 0).padStart(5,"0")}</div>
            <div style={{ fontSize:"7px", color:"#888", textTransform:"uppercase", letterSpacing:"0.05em", marginTop:"4px" }}>Fórmula N°</div>
            <div style={{ fontSize:"18px", fontWeight:"bold", color:"#1a3a5c", lineHeight:1 }}>{String(historia.id || 0).padStart(5,"0")}</div>
          </div>
        </div>

        {/* Fecha y vigencia */}
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:"8px", color:"#555", marginBottom:"8px", borderBottom:"1px solid #e0e7ef", paddingBottom:"5px" }}>
          <div style={{ textTransform:"capitalize" }}>{fmtLong(fechaConsulta)}</div>
          <div style={{ fontWeight:"bold", color:"#1a3a5c" }}>Vigencia: {meses} meses</div>
        </div>

        {/* Título */}
        <div style={{ textAlign:"center", marginBottom:"8px" }}>
          <div style={{ display:"inline-block", background:"#1a3a5c", color:"white", padding:"4px 24px", borderRadius:"3px", fontSize:"12px", fontWeight:"bold", letterSpacing:"0.08em" }}>
            PRESCRIPCIÓN DE LENTES
          </div>
        </div>

        {/* Datos paciente */}
        <div style={{ background:"#f5f8fc", border:"1px solid #d1dce8", borderRadius:"4px", padding:"7px 10px", marginBottom:"8px", fontSize:"9px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr 0.5fr", gap:"3px", marginBottom:"3px" }}>
            <div><strong>Paciente:</strong> {paciente.nombres.toUpperCase()} {paciente.apellidos.toUpperCase()}</div>
            <div><strong>Doc:</strong> {paciente.di}</div>
            <div><strong>Edad:</strong> {paciente.edad}</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3px" }}>
            <div><strong>Celular:</strong> {paciente.telefono}</div>
            <div><strong>Salud:</strong> {paciente.eps?.toUpperCase() || "—"}</div>
            <div style={{ gridColumn:"1/-1" }}><strong>Dirección:</strong> {paciente.direccion || "—"}</div>
          </div>
        </div>

        {/* Tabla Rx */}
        <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:"8px" }}>
          <thead>
            <tr>
              <th style={{ ...th, textAlign:"left", width:"22%" }}>Rx Final</th>
              <th style={th}>Esfera</th>
              <th style={th}>Cilindro</th>
              <th style={th}>Eje</th>
              <th style={th}>Adición</th>
              <th style={th}>D.P.</th>
              <th style={th}>AV L.</th>
              <th style={th}>AV C.</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background:"#f9fbfd" }}>
              <td style={{ ...td, fontWeight:"bold", textAlign:"left", paddingLeft:"10px", background:"#eef2f7" }}>Ojo derecho</td>
              <td style={td}>{v(historia.formulaOD_esf)}</td>
              <td style={td}>{v(historia.formulaOD_cyl)}</td>
              <td style={td}>{v(historia.formulaOD_eje)}</td>
              <td style={td}>{v(historia.formulaOD_add)}</td>
              <td style={td}>{v(historia.formulaOD_dnp)}</td>
              <td style={td}>{v(historia.formulaOD_av)}</td>
              <td style={td}></td>
            </tr>
            <tr>
              <td style={{ ...td, fontWeight:"bold", textAlign:"left", paddingLeft:"10px", background:"#eef2f7" }}>Ojo izquierdo</td>
              <td style={td}>{v(historia.formulaOI_esf)}</td>
              <td style={td}>{v(historia.formulaOI_cyl)}</td>
              <td style={td}>{v(historia.formulaOI_eje)}</td>
              <td style={td}>{v(historia.formulaOI_add)}</td>
              <td style={td}>{v(historia.formulaOI_dnp)}</td>
              <td style={td}>{v(historia.formulaOI_av)}</td>
              <td style={td}></td>
            </tr>
          </tbody>
        </table>

        {/* Info clínica */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"12px", fontSize:"9px" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:"3px" }}>
            {historia.controles && <div><strong>Próximo control visual:</strong> {fmt(fechaControl)}</div>}
            {historia.diagnostico && <div><strong>Diagnósticos:</strong> {historia.diagnostico}</div>}
            {historia.tratamiento && <div><strong>Recomendación:</strong> {historia.tratamiento.toUpperCase()}</div>}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"3px" }}>
            {historia.formulaUso && <div><strong>Forma de uso:</strong> {historia.formulaUso.toUpperCase()}</div>}
            {historia.formulaAlt && <div><strong>Alternativa:</strong> {historia.formulaAlt}</div>}
            {historia.observaciones && <div><strong>Observaciones:</strong> {historia.observaciones}</div>}
          </div>
        </div>

        {/* Firma */}
        <div style={{ display:"flex", justifyContent:"flex-end", borderTop:"1px solid #d1dce8", paddingTop:"10px" }}>
          <div style={{ textAlign:"center", minWidth:"55mm" }}>
            <div style={{ height:"14mm", borderBottom:"1px solid #333", marginBottom:"4px" }} />
            <div style={{ fontSize:"10px", fontWeight:"bold" }}>DR. Juan D. Lozada S.</div>
            <div style={{ fontSize:"8px", color:"#555" }}>Optómetra F.U.A.A.</div>
            <div style={{ fontSize:"8px", color:"#555" }}>TP 1.010.201.450 &nbsp;|&nbsp; RM 3945 CTNPO</div>
            <div style={{ fontSize:"7px", color:"#999", marginTop:"2px" }}>Firma profesional</div>
          </div>
        </div>

      </div>
    </div>
  );
};
