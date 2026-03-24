import { useState, useEffect } from 'react';
import { Download, FileText, Calendar, Users } from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
  type PieLabelRenderProps,
} from 'recharts';
import { exportToExcel } from '../utils/exportExcel';
import { db } from '../db/database';
import type { Paciente, Cita } from '../db/database';

const COLORS = ['#1a3a5c', '#c9a84c', '#4caf50', '#ef4444'];

interface MonthData {
  mes: string;
  historias: number;
  citas: number;
}

interface GenderData {
  name: string;
  value: number;
}

interface CitaStatusData {
  name: string;
  value: number;
}

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const pieLabel = ({ name, percent }: PieLabelRenderProps) =>
  `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`;

export const Reportes = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [genderData, setGenderData] = useState<GenderData[]>([]);
  const [citaStatusData, setCitaStatusData] = useState<CitaStatusData[]>([]);
  const [monthData, setMonthData] = useState<MonthData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pacientes, historias, citas] = await Promise.all([
          db.pacientes.toArray() as Promise<Paciente[]>,
          db.historiasClinicas.toArray(),
          db.citas.toArray() as Promise<Cita[]>,
        ]);

        // Gender distribution
        const genderCount: Record<string, number> = {};
        pacientes.forEach((p) => {
          const g = p.genero || 'No especificado';
          genderCount[g] = (genderCount[g] || 0) + 1;
        });
        setGenderData(Object.entries(genderCount).map(([name, value]) => ({ name, value })));

        // Citas status distribution
        const statusCount: Record<string, number> = {
          pendiente: 0, confirmada: 0, atendida: 0, cancelada: 0,
        };
        citas.forEach((c) => { statusCount[c.estado] = (statusCount[c.estado] || 0) + 1; });
        setCitaStatusData(
          Object.entries(statusCount)
            .filter(([, v]) => v > 0)
            .map(([name, value]) => ({
              name: name.charAt(0).toUpperCase() + name.slice(1),
              value,
            }))
        );

        // Monthly activity for current year
        const currentYear = new Date().getFullYear();
        const monthly: Record<number, MonthData> = {};
        for (let i = 0; i < 12; i++) {
          monthly[i] = { mes: MONTH_NAMES[i], historias: 0, citas: 0 };
        }
        historias.forEach((h) => {
          const d = new Date(h.fecha);
          if (d.getFullYear() === currentYear) {
            monthly[d.getMonth()].historias += 1;
          }
        });
        citas.forEach((c) => {
          const d = new Date(c.fecha);
          if (d.getFullYear() === currentYear) {
            monthly[d.getMonth()].citas += 1;
          }
        });
        setMonthData(Object.values(monthly));
      } catch (err) {
        console.error('Error loading report data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    const success = await exportToExcel();
    setIsExporting(false);
    if (success) {
      alert('Exportación completada exitosamente');
    } else {
      alert('Error al exportar los datos');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-title font-bold text-primary">Reportes</h2>
        <p className="text-text-muted mt-1">Estadísticas y exportación de datos.</p>
      </div>

      {/* Charts */}
      {loading ? (
        <div className="text-center py-10 text-text-muted">Cargando estadísticas...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Género PieChart */}
          <div className="bg-surface rounded-lg shadow-md p-6 border border-border">
            <h3 className="text-lg font-title font-semibold text-primary mb-4">
              Distribución por Género
            </h3>
            {genderData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={pieLabel}
                    labelLine={false}
                  >
                    {genderData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-text-muted text-sm text-center py-10">
                No hay datos de pacientes.
              </p>
            )}
          </div>

          {/* Citas Status PieChart */}
          <div className="bg-surface rounded-lg shadow-md p-6 border border-border">
            <h3 className="text-lg font-title font-semibold text-primary mb-4">
              Estado de Citas
            </h3>
            {citaStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={citaStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={pieLabel}
                    labelLine={false}
                  >
                    {citaStatusData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-text-muted text-sm text-center py-10">No hay datos de citas.</p>
            )}
          </div>

          {/* Monthly BarChart */}
          <div className="bg-surface rounded-lg shadow-md p-6 border border-border lg:col-span-2">
            <h3 className="text-lg font-title font-semibold text-primary mb-4">
              Actividad Mensual ({new Date().getFullYear()})
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="historias" name="Historias Clínicas" fill="#1a3a5c" radius={[3, 3, 0, 0]} />
                <Bar dataKey="citas" name="Citas" fill="#c9a84c" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Export */}
      <div className="bg-surface rounded-lg shadow-md p-6 border border-border">
        <h3 className="text-lg font-title font-semibold text-primary mb-4">
          Exportar Datos a Excel
        </h3>
        <p className="text-text-muted mb-6">
          Descargue una copia completa de todos sus datos en formato Excel. El archivo incluirá
          tres hojas: Pacientes, Historias Clínicas y Citas.
        </p>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-6 py-3 bg-success text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          {isExporting ? 'Exportando...' : 'Exportar a Excel'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-primary">Pacientes</h4>
          </div>
          <p className="text-sm text-text-muted">
            Información completa de todos los pacientes registrados en el sistema.
          </p>
        </div>

        <div className="bg-surface rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="text-lg font-semibold text-primary">Historias Clínicas</h4>
          </div>
          <p className="text-sm text-text-muted">
            Todas las historias clínicas con datos completos de exámenes y diagnósticos.
          </p>
        </div>

        <div className="bg-surface rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-primary">Citas</h4>
          </div>
          <p className="text-sm text-text-muted">
            Registro de todas las citas programadas con sus estados y notas.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-primary mb-2">📊 Nota sobre los Datos</h4>
        <p className="text-sm text-text-muted">
          Todos los datos se almacenan localmente en su navegador usando IndexedDB. Es
          recomendable realizar respaldos periódicos exportando los datos a Excel. No se envía
          ninguna información a servidores externos.
        </p>
      </div>
    </div>
  );
};
