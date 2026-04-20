import { useState, useEffect } from 'react';
import { Download, FileText, Calendar, Users, TrendingUp, Activity } from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, type PieLabelRenderProps,
} from 'recharts';
import { exportToExcel } from '../utils/exportExcel';
import { spGetPacientes, spGetAllHistorias, spGetAllCitas } from '../lib/supabaseService';

const COLORS = ['#1a3a5c', '#c9a84c', '#4cc97a', '#c96b4c', '#4c9ac9'];
const MONTH_NAMES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

const pieLabel = ({ name, percent }: PieLabelRenderProps) =>
  `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`;

export const Reportes = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [genderData, setGenderData] = useState<{name:string;value:number}[]>([]);
  const [citaStatusData, setCitaStatusData] = useState<{name:string;value:number}[]>([]);
  const [monthData, setMonthData] = useState<{mes:string;historias:number;citas:number}[]>([]);
  const [stats, setStats] = useState({ pacientes: 0, historias: 0, citas: 0, esteMes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pacientes, historias, citas] = await Promise.all([
          spGetPacientes(),
          spGetAllHistorias(),
          spGetAllCitas(),
        ]);

        const currentYear = new Date().getFullYear();
        const inicioMes = new Date(currentYear, new Date().getMonth(), 1).toISOString().split("T")[0];
        const esteMes = pacientes.filter(p => p.fechaRegistro >= inicioMes).length;
        setStats({ pacientes: pacientes.length, historias: historias.length, citas: citas.length, esteMes });

        const genderCount: Record<string,number> = {};
        pacientes.forEach(p => { const g = p.genero || "No especificado"; genderCount[g] = (genderCount[g]||0)+1; });
        setGenderData(Object.entries(genderCount).map(([name,value]) => ({name,value})));

        const statusCount: Record<string,number> = { pendiente:0, confirmada:0, atendida:0, cancelada:0 };
        citas.forEach(c => { statusCount[c.estado] = (statusCount[c.estado]||0)+1; });
        setCitaStatusData(Object.entries(statusCount).filter(([,v])=>v>0).map(([name,value]) => ({ name: name.charAt(0).toUpperCase()+name.slice(1), value })));

        const monthly: Record<number,{mes:string;historias:number;citas:number}> = {};
        for (let i=0;i<12;i++) monthly[i] = {mes:MONTH_NAMES[i],historias:0,citas:0};
        historias.forEach(h => { const d=new Date(h.fecha); if(d.getFullYear()===currentYear) monthly[d.getMonth()].historias+=1; });
        citas.forEach(c => { const d=new Date(c.fecha); if(d.getFullYear()===currentYear) monthly[d.getMonth()].citas+=1; });
        setMonthData(Object.values(monthly));
      } catch(err) { console.error(err); }
      finally { setLoading(false); }
    };
    loadData();
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    const success = await exportToExcel();
    setIsExporting(false);
    alert(success ? "Exportación completada exitosamente" : "Error al exportar los datos");
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) return (
      <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"10px", padding:"10px 16px", boxShadow:"0 8px 32px rgba(0,0,0,0.1)", fontSize:"13px" }}>
        <p style={{ fontWeight:700, color:"var(--primary)", marginBottom:"4px" }}>{label}</p>
        {payload.map((p: any) => <p key={p.name} style={{ color:p.fill, margin:"2px 0" }}>{p.name}: {p.value}</p>)}
      </div>
    );
    return null;
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
      <div>
        <h1 style={{ margin:"0 0 4px", fontSize:"28px", fontWeight:700, fontFamily:"'Playfair Display', serif", color:"var(--primary)" }}>Reportes</h1>
        <p style={{ margin:0, fontSize:"14px", color:"var(--text-muted)" }}>Estadísticas y exportación de datos del sistema</p>
      </div>

      {/* Stats cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px,1fr))", gap:"16px" }}>
        {[
          { label:"Total Pacientes", value:stats.pacientes, icon:Users, color:"#4c9ac9", bg:"rgba(76,154,201,0.08)", border:"rgba(76,154,201,0.2)" },
          { label:"Historias Clínicas", value:stats.historias, icon:FileText, color:"#c9a84c", bg:"rgba(201,168,76,0.08)", border:"rgba(201,168,76,0.2)" },
          { label:"Total Citas", value:stats.citas, icon:Calendar, color:"#4cc97a", bg:"rgba(76,201,122,0.08)", border:"rgba(76,201,122,0.2)" },
          { label:"Nuevos Este Mes", value:stats.esteMes, icon:TrendingUp, color:"#c96b4c", bg:"rgba(201,107,76,0.08)", border:"rgba(201,107,76,0.2)" },
        ].map(({ label, value, icon:Icon, color, bg, border }) => (
          <div key={label} style={{ background:"var(--surface)", borderRadius:"14px", border:`1px solid ${border}`, padding:"20px", display:"flex", alignItems:"center", gap:"14px" }}>
            <div style={{ padding:"10px", borderRadius:"10px", background:bg, flexShrink:0 }}>
              <Icon style={{ width:"20px", height:"20px", color }} />
            </div>
            <div>
              <p style={{ margin:0, fontSize:"11px", fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</p>
              <p style={{ margin:"3px 0 0", fontSize:"24px", fontWeight:700, color, fontFamily:"'Playfair Display', serif" }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:"48px", color:"var(--text-muted)" }}>
          <Activity style={{ width:"32px", height:"32px", opacity:0.4, margin:"0 auto 12px" }} />
          <p style={{ margin:0 }}>Cargando estadísticas...</p>
        </div>
      ) : (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
            {/* Género */}
            <div style={{ background:"var(--surface)", borderRadius:"16px", border:"1px solid var(--border)", padding:"24px" }}>
              <h3 style={{ margin:"0 0 4px", fontSize:"16px", fontWeight:700, fontFamily:"'Playfair Display', serif", color:"var(--primary)" }}>Distribución por Género</h3>
              <p style={{ margin:"0 0 16px", fontSize:"12px", color:"var(--text-muted)" }}>{stats.pacientes} pacientes registrados</p>
              {genderData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={genderData} cx="50%" cy="50%" outerRadius={80} innerRadius={40} dataKey="value" label={pieLabel} labelLine={false}>
                      {genderData.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p style={{ textAlign:"center", padding:"32px", color:"var(--text-muted)", fontSize:"13px" }}>No hay datos de pacientes</p>}
            </div>

            {/* Estado citas */}
            <div style={{ background:"var(--surface)", borderRadius:"16px", border:"1px solid var(--border)", padding:"24px" }}>
              <h3 style={{ margin:"0 0 4px", fontSize:"16px", fontWeight:700, fontFamily:"'Playfair Display', serif", color:"var(--primary)" }}>Estado de Citas</h3>
              <p style={{ margin:"0 0 16px", fontSize:"12px", color:"var(--text-muted)" }}>{stats.citas} citas totales</p>
              {citaStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={citaStatusData} cx="50%" cy="50%" outerRadius={80} innerRadius={40} dataKey="value" label={pieLabel} labelLine={false}>
                      {citaStatusData.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p style={{ textAlign:"center", padding:"32px", color:"var(--text-muted)", fontSize:"13px" }}>No hay datos de citas</p>}
            </div>
          </div>

          {/* Actividad mensual */}
          <div style={{ background:"var(--surface)", borderRadius:"16px", border:"1px solid var(--border)", padding:"28px" }}>
            <h3 style={{ margin:"0 0 4px", fontSize:"16px", fontWeight:700, fontFamily:"'Playfair Display', serif", color:"var(--primary)" }}>Actividad Mensual</h3>
            <p style={{ margin:"0 0 20px", fontSize:"12px", color:"var(--text-muted)" }}>Historias clínicas y citas por mes — {new Date().getFullYear()}</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthData} margin={{ top:5, right:20, left:0, bottom:5 }} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize:12, fill:"var(--text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize:12, fill:"var(--text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize:"13px" }} />
                <Bar dataKey="historias" name="Historias Clínicas" fill="#1a3a5c" radius={[6,6,0,0]} />
                <Bar dataKey="citas" name="Citas" fill="#c9a84c" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Exportar */}
      <div style={{ background:"var(--surface)", borderRadius:"16px", border:"1px solid var(--border)", padding:"28px" }}>
        <h3 style={{ margin:"0 0 4px", fontSize:"16px", fontWeight:700, fontFamily:"'Playfair Display', serif", color:"var(--primary)" }}>Exportar Datos</h3>
        <p style={{ margin:"0 0 20px", fontSize:"13px", color:"var(--text-muted)" }}>
          Descarga todos los datos en Excel — incluye Pacientes, Historias Clínicas y Citas.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px,1fr))", gap:"12px", marginBottom:"20px" }}>
          {[
            { label:"Pacientes", desc:"Datos completos", icon:Users, color:"#4c9ac9", bg:"rgba(76,154,201,0.08)" },
            { label:"Historias Clínicas", desc:"Exámenes y diagnósticos", icon:FileText, color:"#c9a84c", bg:"rgba(201,168,76,0.08)" },
            { label:"Citas", desc:"Estados y notas", icon:Calendar, color:"#4cc97a", bg:"rgba(76,201,122,0.08)" },
          ].map(({ label, desc, icon:Icon, color, bg }) => (
            <div key={label} style={{ padding:"14px 16px", background:bg, borderRadius:"10px", display:"flex", alignItems:"center", gap:"12px" }}>
              <Icon style={{ width:"18px", height:"18px", color, flexShrink:0 }} />
              <div>
                <p style={{ margin:0, fontWeight:600, fontSize:"13px", color:"var(--text)" }}>{label}</p>
                <p style={{ margin:0, fontSize:"11px", color:"var(--text-muted)" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleExport} disabled={isExporting}
          style={{ display:"flex", alignItems:"center", gap:"8px", padding:"11px 24px", borderRadius:"10px", background:"var(--success)", color:"white", border:"none", fontSize:"14px", fontWeight:700, cursor:isExporting?"not-allowed":"pointer", fontFamily:"DM Sans, sans-serif", opacity:isExporting?0.6:1 }}>
          <Download style={{ width:"16px", height:"16px" }} />
          {isExporting ? "Exportando..." : "Exportar a Excel"}
        </button>
      </div>

      <div style={{ padding:"16px 20px", background:"rgba(76,154,201,0.06)", border:"1px solid rgba(76,154,201,0.2)", borderRadius:"12px", fontSize:"13px", color:"var(--text-muted)" }}>
        💡 Todos los datos se almacenan localmente en su navegador. Se recomienda exportar periódicamente como respaldo.
      </div>
    </div>
  );
};
