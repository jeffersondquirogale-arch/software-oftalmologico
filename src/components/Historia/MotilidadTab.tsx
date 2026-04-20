import type { HistoriaClinica } from '../../db/database';
import { S } from './tabStyles';

interface MotilidadTabProps {
  historia: Partial<HistoriaClinica>;
  setHistoria: (h: Partial<HistoriaClinica>) => void;
}

export const MotilidadTab = ({ historia, setHistoria }: MotilidadTabProps) => {
  const set = (field: keyof HistoriaClinica) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setHistoria({ ...historia, [field]: e.target.value });

  const parseDUC = () => {
    try { return JSON.parse(historia.versionesDUC || "{}"); } catch { return {}; }
  };
  const duc = parseDUC();
  const setDUC = (key: string, val: string) => {
    const current = parseDUC();
    current[key] = val;
    setHistoria({ ...historia, versionesDUC: JSON.stringify(current) });
  };

  const inp = (key: string) => (
    <input type="text" value={duc[key] || ""} onChange={(e) => setDUC(key, e.target.value)}
      style={{ width: "100%", padding: "6px 8px", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "13px", textAlign: "center", background: "var(--background)", color: "var(--text)", outline: "none", fontFamily: "DM Sans, sans-serif" }}
      onFocus={e => (e.target as HTMLElement).style.borderColor = "#c9a84c"}
      onBlur={e => (e.target as HTMLElement).style.borderColor = "var(--border)"} />
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <p style={S.title}>Motilidad Ocular</p>
        <p style={S.subtitle}>Evaluación de los movimientos oculares</p>
      </div>

      <div>
        <label style={S.label}>Hirschberg</label>
        <input type="text" value={historia.hirschberg || ""} onChange={set("hirschberg")} style={S.input} onFocus={S.onFocus} onBlur={S.onBlur} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div><label style={S.label}>Kappa OD</label><input type="text" value={historia.kappaOD || ""} onChange={set("kappaOD")} style={S.input} onFocus={S.onFocus} onBlur={S.onBlur} /></div>
        <div><label style={S.label}>Kappa OI</label><input type="text" value={historia.kappaOI || ""} onChange={set("kappaOI")} style={S.input} onFocus={S.onFocus} onBlur={S.onBlur} /></div>
      </div>

      <div>
        <label style={S.label}>5. DUC / Versiones</label>
        <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr>
                <th style={S.th}>DUC</th>
                <th style={S.th}>OD</th>
                <th style={S.th}>OI</th>
              </tr>
            </thead>
            <tbody>
              {["1"].map((n, i) => (
                <tr key={n} style={{ background: i % 2 === 0 ? "rgba(0,0,0,0.02)" : "transparent" }}>
                  <td style={{ ...S.tdLabel, background: "var(--primary)", color: "white", textAlign: "center", width: "60px" }}>{n}</td>
                  <td style={{ padding: "6px 12px", borderBottom: "1px solid var(--border)" }}>{inp("od" + n)}</td>
                  <td style={{ padding: "6px 12px", borderBottom: "1px solid var(--border)" }}>{inp("oi" + n)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
