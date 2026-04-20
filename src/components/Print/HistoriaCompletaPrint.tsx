import type { Paciente, HistoriaClinica } from '../../db/database';

interface HistoriaCompletaPrintProps {
  paciente: Paciente;
  historia: HistoriaClinica;
  numeroHistoria?: number;
}

const cell = (val?: string) => val || '';

export const HistoriaCompletaPrint = ({ paciente, historia, numeroHistoria }: HistoriaCompletaPrintProps) => {
  const fecha = new Date(historia.fecha);
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const anio = fecha.getFullYear();

  return (
    <div
      className="print-content"
      style={{
        display: 'none',
        fontFamily: 'Arial, sans-serif',
        fontSize: '10px',
        color: '#000',
        background: '#fff',
        padding: '10mm 8mm',
        width: '210mm',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        @media print {
          .print-content { display: block !important; }
          .no-print { display: none !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          @page { size: A4 portrait; margin: 0; }
          body { margin: 0; }
        }
        .hc-table { border-collapse: collapse; width: 100%; }
        .hc-table td, .hc-table th {
          border: 1px solid #1a3a5c;
          padding: 2px 4px;
          text-align: center;
          font-size: 9px;
        }
        .hc-label {
          font-size: 8px;
          font-weight: bold;
          color: #1a3a5c;
          text-transform: uppercase;
        }
        .hc-value {
          border-bottom: 1px solid #333;
          min-height: 14px;
          padding: 1px 2px;
          font-size: 9px;
        }
        .section-header {
          background: #1a3a5c;
          color: white;
          font-weight: bold;
          font-size: 9px;
          padding: 2px 6px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .field-row {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          margin-bottom: 4px;
        }
        .field-label {
          font-size: 8px;
          font-weight: bold;
          color: #1a3a5c;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .field-line {
          flex: 1;
          border-bottom: 1px solid #333;
          min-height: 13px;
          font-size: 9px;
          padding: 0 2px;
        }
      `}</style>

      {/* ── ENCABEZADO ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px', borderBottom: '2px solid #1a3a5c', paddingBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Ojo logo SVG simple */}
          <svg width="40" height="40" viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
            <circle cx="20" cy="20" r="18" fill="none" stroke="#1a3a5c" strokeWidth="2" />
            <ellipse cx="20" cy="20" rx="14" ry="9" fill="none" stroke="#1a3a5c" strokeWidth="1.5" />
            <circle cx="20" cy="20" r="5" fill="#1a3a5c" />
            <circle cx="22" cy="18" r="1.5" fill="white" />
          </svg>
          <div>
            <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#1a3a5c', fontStyle: 'italic' }}>MEJORAR TU VISIÓN ES MI MISIÓN</div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1a3a5c' }}>DR. Juan D. Lozada S.</div>
            <div style={{ fontSize: '8px', color: '#333' }}>Optómetra F.U.A.A. &nbsp;|&nbsp; TP 1.010.201.450 &nbsp;|&nbsp; RM 3945 CTNPO</div>
          </div>
        </div>
        {/* Número y fecha */}
        <div style={{ textAlign: 'right', border: '2px solid #1a3a5c', padding: '4px 10px', borderRadius: '4px' }}>
          <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#1a3a5c' }}>N°</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a3a5c', lineHeight: 1 }}>
            {numeroHistoria?.toString().padStart(4, '0') || historia.id?.toString().padStart(4, '0') || '----'}
          </div>
          <div style={{ display: 'flex', gap: '4px', marginTop: '4px', fontSize: '8px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold' }}>Día</div>
              <div style={{ border: '1px solid #333', padding: '1px 4px', minWidth: '20px' }}>{dia}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold' }}>Mes</div>
              <div style={{ border: '1px solid #333', padding: '1px 4px', minWidth: '20px' }}>{mes}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold' }}>Año</div>
              <div style={{ border: '1px solid #333', padding: '1px 4px', minWidth: '32px' }}>{anio}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── DATOS PACIENTE ── */}
      <div style={{ border: '1px solid #1a3a5c', marginBottom: '4px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', borderBottom: '1px solid #1a3a5c' }}>
          <div style={{ padding: '2px 6px', borderRight: '1px solid #1a3a5c' }}>
            <span className="field-label">Nombres: </span>
            <span style={{ fontSize: '9px' }}>{paciente.nombres}</span>
          </div>
          <div style={{ padding: '2px 6px' }}>
            <span className="field-label">Apellidos: </span>
            <span style={{ fontSize: '9px' }}>{paciente.apellidos}</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0', borderBottom: '1px solid #1a3a5c' }}>
          <div style={{ padding: '2px 6px', borderRight: '1px solid #1a3a5c' }}>
            <span className="field-label">D.I.: </span>
            <span style={{ fontSize: '9px' }}>{paciente.di}</span>
          </div>
          <div style={{ padding: '2px 6px', borderRight: '1px solid #1a3a5c' }}>
            <span className="field-label">Edad: </span>
            <span style={{ fontSize: '9px' }}>{paciente.edad} años</span>
          </div>
          <div style={{ padding: '2px 6px', borderRight: '1px solid #1a3a5c' }}>
            <span className="field-label">Género: </span>
            <span style={{ fontSize: '9px' }}>{paciente.genero}</span>
          </div>
          <div style={{ padding: '2px 6px' }}>
            <span className="field-label">Tel.: </span>
            <span style={{ fontSize: '9px' }}>{paciente.telefono}</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0', borderBottom: '1px solid #1a3a5c' }}>
          <div style={{ padding: '2px 6px', borderRight: '1px solid #1a3a5c' }}>
            <span className="field-label">EPS: </span>
            <span style={{ fontSize: '9px' }}>{paciente.eps}</span>
          </div>
          <div style={{ padding: '2px 6px', borderRight: '1px solid #1a3a5c' }}>
            <span className="field-label">Ocupación: </span>
            <span style={{ fontSize: '9px' }}>{paciente.ocupacion}</span>
          </div>
          <div style={{ padding: '2px 6px' }}>
            <span className="field-label">Dir.: </span>
            <span style={{ fontSize: '9px' }}>{paciente.direccion}</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
          <div style={{ padding: '2px 6px', borderRight: '1px solid #1a3a5c' }}>
            <span className="field-label">Acompañante: </span>
            <span style={{ fontSize: '9px' }}>{paciente.acompanante}</span>
          </div>
          <div style={{ padding: '2px 6px' }}>
            <span className="field-label">Parentesco: </span>
            <span style={{ fontSize: '9px' }}>{paciente.parentesco}</span>
          </div>
        </div>
      </div>

      {/* ── ANTECEDENTES + MOTIVO ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '4px' }}>
        <div style={{ border: '1px solid #1a3a5c' }}>
          <div className="section-header">Antecedentes</div>
          <div style={{ padding: '3px 6px', minHeight: '20px', fontSize: '9px' }}>{paciente.antecedentes}</div>
        </div>
        <div style={{ border: '1px solid #1a3a5c' }}>
          <div className="section-header">1. Motivo de Consulta</div>
          <div style={{ padding: '3px 6px', minHeight: '20px', fontSize: '9px' }}>{historia.motivoConsulta}</div>
        </div>
      </div>

      {/* ── LENSOMETRÍA + AGUDEZA VISUAL ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '4px' }}>

        {/* LENSOMETRÍA */}
        <div style={{ border: '1px solid #1a3a5c' }}>
          <div className="section-header">2. Lensometría</div>
          <table className="hc-table">
            <thead>
              <tr>
                <th></th>
                <th>ESF</th><th>CYL</th><th>EJE</th><th>ADD</th><th>DNP</th><th>PRIS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold', background: '#eef2f7' }}>OD</td>
                <td>{cell(historia.lensOD_esf)}</td>
                <td>{cell(historia.lensOD_cyl)}</td>
                <td>{cell(historia.lensOD_eje)}</td>
                <td>{cell(historia.lensOD_add)}</td>
                <td>{cell(historia.lensOD_dnp)}</td>
                <td>{cell(historia.lensOD_pris)}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', background: '#eef2f7' }}>OI</td>
                <td>{cell(historia.lensOI_esf)}</td>
                <td>{cell(historia.lensOI_cyl)}</td>
                <td>{cell(historia.lensOI_eje)}</td>
                <td>{cell(historia.lensOI_add)}</td>
                <td>{cell(historia.lensOI_dnp)}</td>
                <td>{cell(historia.lensOI_pris)}</td>
              </tr>
              <tr>
                <td colSpan={7} style={{ textAlign: 'left', padding: '2px 4px' }}>
                  <span className="field-label">RX: </span>{cell(historia.queratometria)}
                  &nbsp;&nbsp;<span className="field-label">Uso: </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* AGUDEZA VISUAL */}
        <div style={{ border: '1px solid #1a3a5c' }}>
          <div className="section-header">3. Agudeza Visual</div>
          <table className="hc-table">
            <thead>
              <tr>
                <th></th>
                <th>VLSC</th><th>PH</th><th>VPSC</th><th>VLCC</th><th>VPCC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold', background: '#eef2f7' }}>OD</td>
                <td>{cell(historia.av_od_vlsc)}</td>
                <td>{cell(historia.av_od_ph)}</td>
                <td>{cell(historia.av_od_vpsc)}</td>
                <td>{cell(historia.av_od_vlcc)}</td>
                <td>{cell(historia.av_od_vpcc)}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', background: '#eef2f7' }}>OI</td>
                <td>{cell(historia.av_oi_vlsc)}</td>
                <td>{cell(historia.av_oi_ph)}</td>
                <td>{cell(historia.av_oi_vpsc)}</td>
                <td>{cell(historia.av_oi_vlcc)}</td>
                <td>{cell(historia.av_oi_vpcc)}</td>
              </tr>
            </tbody>
          </table>
          {/* Cover Test + Hirschberg */}
          <div style={{ padding: '2px 4px', borderTop: '1px solid #1a3a5c' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              <div>
                <span className="field-label">Cover Test VL: </span>
                <span style={{ fontSize: '9px' }}>{cell(historia.coverTest_vl)}</span>
              </div>
              <div>
                <span className="field-label">VP: </span>
                <span style={{ fontSize: '9px' }}>{cell(historia.coverTest_vp)}</span>
              </div>
              <div>
                <span className="field-label">Hirschberg: </span>
                <span style={{ fontSize: '9px' }}>{cell(historia.hirschberg)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOTILIDAD + EXAMEN EXTERNO + CFTA-MOSCOPIA ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', marginBottom: '4px' }}>

        {/* MOTILIDAD */}
        <div style={{ border: '1px solid #1a3a5c' }}>
          <div className="section-header">4. Motilidad Ocular</div>
          <div style={{ padding: '3px 6px' }}>
            <div><span className="field-label">Kappa OD: </span><span style={{ fontSize: '9px' }}>{cell(historia.kappaOD)}</span></div>
            <div><span className="field-label">Kappa OI: </span><span style={{ fontSize: '9px' }}>{cell(historia.kappaOI)}</span></div>
            <div style={{ marginTop: '4px' }}><span className="field-label">5. DUC / Versiones: </span></div>
            <div style={{ fontSize: '9px', minHeight: '14px' }}>{cell(historia.versionesDUC)}</div>
          </div>
        </div>

        {/* EXAMEN EXTERNO */}
        <div style={{ border: '1px solid #1a3a5c' }}>
          <div className="section-header">7. Examen Externo</div>
          {/* Shapes like the physical form */}
          <div style={{ display: 'flex', justifyContent: 'space-around', padding: '4px', borderBottom: '1px solid #1a3a5c' }}>
            <div style={{ textAlign: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="12" fill="none" stroke="#1a3a5c" strokeWidth="1.5" /><circle cx="14" cy="14" r="6" fill="none" stroke="#1a3a5c" strokeWidth="1" /></svg>
              <div style={{ fontSize: '7px' }}>OD</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="12" fill="none" stroke="#1a3a5c" strokeWidth="1.5" /><circle cx="14" cy="14" r="6" fill="none" stroke="#1a3a5c" strokeWidth="1" /></svg>
              <div style={{ fontSize: '7px' }}>OI</div>
            </div>
          </div>
          <div style={{ padding: '2px 6px', fontSize: '9px', minHeight: '18px' }}>{cell(historia.examenExterno)}</div>
        </div>

        {/* CFTA-MOSCOPIA */}
        <div style={{ border: '1px solid #1a3a5c' }}>
          <div className="section-header">8. CFTA-Moscopia</div>
          <div style={{ display: 'flex', justifyContent: 'space-around', padding: '4px', borderBottom: '1px solid #1a3a5c' }}>
            <div style={{ textAlign: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 28 28">
                <polygon points="14,2 26,26 2,26" fill="none" stroke="#1a3a5c" strokeWidth="1.5" />
              </svg>
              <div style={{ fontSize: '7px' }}>OD</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 28 28">
                <polygon points="14,26 26,2 2,2" fill="none" stroke="#1a3a5c" strokeWidth="1.5" />
              </svg>
              <div style={{ fontSize: '7px' }}>OI</div>
            </div>
          </div>
          <div style={{ padding: '2px 6px' }}>
            <div><span className="field-label">OD: </span><span style={{ fontSize: '9px' }}>{cell(historia.cftaMoscopiaOD)}</span></div>
            <div><span className="field-label">OI: </span><span style={{ fontSize: '9px' }}>{cell(historia.cftaMoscopiaOI)}</span></div>
            <div style={{ fontSize: '9px' }}>{cell(historia.cftaObservaciones)}</div>
          </div>
        </div>
      </div>

      {/* ── SUBJETIVO + TESTS + QUERATOMETRÍA ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', marginBottom: '4px' }}>

        {/* SUBJETIVO */}
        <div style={{ border: '1px solid #1a3a5c' }}>
          <div className="section-header">11. Subjetivo</div>
          <table className="hc-table">
            <thead>
              <tr><th></th><th>AV</th><th>ADD</th></tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold', background: '#eef2f7' }}>OD</td>
                <td>{cell(historia.subjetivoOD_av)}</td>
                <td>{cell(historia.subjetivoOD_add)}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', background: '#eef2f7' }}>OI</td>
                <td>{cell(historia.subjetivoOI_av)}</td>
                <td>{cell(historia.subjetivoOI_add)}</td>
              </tr>
            </tbody>
          </table>
          <div style={{ padding: '2px 6px' }}>
            <div><span className="field-label">Refracción OD: </span><span style={{ fontSize: '9px' }}>{cell(historia.refraccionOD)}</span></div>
            <div><span className="field-label">Refracción OI: </span><span style={{ fontSize: '9px' }}>{cell(historia.refraccionOI)}</span></div>
          </div>
        </div>

        {/* TESTS */}
        <div style={{ border: '1px solid #1a3a5c' }}>
          <div className="section-header">12. Tests</div>
          <div style={{ padding: '3px 6px' }}>
            <div><span className="field-label">Test Color: </span><span style={{ fontSize: '9px' }}>{cell(historia.testColor)}</span></div>
            <div style={{ marginTop: '4px' }}><span className="field-label">13. Test Estereopsis: </span></div>
            <div style={{ fontSize: '9px' }}>{cell(historia.testEstereopsis)}</div>
          </div>
        </div>

        {/* QUERATOMETRÍA */}
        <div style={{ border: '1px solid #1a3a5c' }}>
          <div className="section-header">9. Queratometría</div>
          <div style={{ padding: '3px 6px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
              <div><span className="field-label">OD: </span><span style={{ fontSize: '9px' }}>{cell(historia.queratometria)}</span></div>
              <div><span className="field-label">OI: </span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── REFRACCIÓN (10) + FÓRMULA FINAL (14) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '4px' }}>

        {/* REFRACCIÓN */}
        <div style={{ border: '1px solid #1a3a5c' }}>
          <div className="section-header">10. Refracción</div>
          <table className="hc-table">
            <thead>
              <tr><th></th><th>Esf</th><th>Cyl</th><th>Eje</th><th>Add</th><th>DNP</th><th>AV</th></tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold', background: '#eef2f7' }}>OD</td>
                <td></td><td></td><td></td><td></td><td></td><td></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', background: '#eef2f7' }}>OI</td>
                <td></td><td></td><td></td><td></td><td></td><td></td>
              </tr>
            </tbody>
          </table>
          <div style={{ padding: '2px 4px' }}>
            <span className="field-label">Observ.: </span>
          </div>
        </div>

        {/* FÓRMULA FINAL */}
        <div style={{ border: '1px solid #1a3a5c' }}>
          <div className="section-header">14. Fórmula Final</div>
          <table className="hc-table">
            <thead>
              <tr><th></th><th>Esf</th><th>Cyl</th><th>Eje</th><th>Add</th><th>DNP</th><th>AV</th></tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold', background: '#eef2f7' }}>OD</td>
                <td>{cell(historia.formulaOD_esf)}</td>
                <td>{cell(historia.formulaOD_cyl)}</td>
                <td>{cell(historia.formulaOD_eje)}</td>
                <td>{cell(historia.formulaOD_add)}</td>
                <td>{cell(historia.formulaOD_dnp)}</td>
                <td>{cell(historia.formulaOD_av)}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold', background: '#eef2f7' }}>OI</td>
                <td>{cell(historia.formulaOI_esf)}</td>
                <td>{cell(historia.formulaOI_cyl)}</td>
                <td>{cell(historia.formulaOI_eje)}</td>
                <td>{cell(historia.formulaOI_add)}</td>
                <td>{cell(historia.formulaOI_dnp)}</td>
                <td>{cell(historia.formulaOI_av)}</td>
              </tr>
              <tr>
                <td colSpan={7} style={{ textAlign: 'left', padding: '2px 4px' }}>
                  <span className="field-label">Alt: </span>{cell(historia.formulaAlt)}
                  &nbsp;&nbsp;<span className="field-label">Uso: </span>{cell(historia.formulaUso)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── DIAGNÓSTICO (15) + TRATAMIENTO (16) + CONTROLES (17) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', marginBottom: '4px' }}>
        <div style={{ border: '1px solid #1a3a5c' }}>
          <div className="section-header">15. Diagnóstico</div>
          <div style={{ padding: '3px 6px', minHeight: '28px', fontSize: '9px' }}>{cell(historia.diagnostico)}</div>
        </div>
        <div style={{ border: '1px solid #1a3a5c' }}>
          <div className="section-header">16. Tratamiento</div>
          <div style={{ padding: '3px 6px', minHeight: '28px', fontSize: '9px' }}>{cell(historia.tratamiento)}</div>
        </div>
        <div style={{ border: '1px solid #1a3a5c' }}>
          <div className="section-header">17. Controles / Observaciones</div>
          <div style={{ padding: '3px 6px', minHeight: '28px', fontSize: '9px' }}>{cell(historia.controles)}{cell(historia.observaciones)}</div>
        </div>
      </div>

      {/* ── FIRMAS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #1a3a5c' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ borderTop: '1px solid #333', paddingTop: '4px' }}>
            <div style={{ fontSize: '9px', fontWeight: 'bold' }}>Paciente</div>
            <div style={{ fontSize: '8px', color: '#555' }}>Nombre: {paciente.nombres} {paciente.apellidos}</div>
            <div style={{ fontSize: '8px', color: '#555' }}>D.I.: {paciente.di}</div>
            <div style={{ fontSize: '7px', color: '#999', marginTop: '2px' }}>Firma</div>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ borderTop: '1px solid #333', paddingTop: '4px' }}>
            <div style={{ fontSize: '9px', fontWeight: 'bold' }}>Revisó y Aprobó</div>
            <div style={{ fontSize: '7px', color: '#999', marginTop: '2px' }}>Firma</div>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ borderTop: '1px solid #333', paddingTop: '4px' }}>
            <div style={{ fontSize: '9px', fontWeight: 'bold' }}>DR. Juan D. Lozada S.</div>
            <div style={{ fontSize: '8px' }}>Optómetra F.U.A.A.</div>
            <div style={{ fontSize: '8px' }}>TP 1.010.201.450 | RM 3945 CTNPO</div>
            <div style={{ fontSize: '7px', color: '#999', marginTop: '2px' }}>Firma y Sello Profesional</div>
          </div>
        </div>
      </div>

    </div>
  );
};
