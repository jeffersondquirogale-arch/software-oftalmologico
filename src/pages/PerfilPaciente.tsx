import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Printer, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { db } from '../db/database';
import type { Paciente, HistoriaClinica } from '../db/database';

interface ChartDataPoint {
  visita: string;
  fecha: string;
  OD_ESF: number;
  OI_ESF: number;
  OD_CYL: number;
  OI_CYL: number;
}

export const PerfilPaciente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [historias, setHistorias] = useState<HistoriaClinica[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [trend, setTrend] = useState<'mejora' | 'empeora' | 'mantiene'>('mantiene');

  useEffect(() => {
    if (id) {
      loadData(parseInt(id));
    }
  }, [id]);

  const loadData = async (patientId: number) => {
    const patient = await db.pacientes.get(patientId);
    if (patient) {
      setPaciente(patient);
    }

    const historiasList = await db.historiasClinicas
      .where('pacienteId')
      .equals(patientId)
      .toArray();
    
    historiasList.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    setHistorias(historiasList);

    if (historiasList.length > 0) {
      const chartPoints = historiasList.map((h, index) => ({
        visita: `V${index + 1}`,
        fecha: new Date(h.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
        OD_ESF: parseFloat(h.formulaOD_esf || '0'),
        OI_ESF: parseFloat(h.formulaOI_esf || '0'),
        OD_CYL: parseFloat(h.formulaOD_cyl || '0'),
        OI_CYL: parseFloat(h.formulaOI_cyl || '0'),
      }));
      setChartData(chartPoints);

      if (historiasList.length >= 2) {
        const first = historiasList[0];
        const last = historiasList[historiasList.length - 1];
        const firstOD = Math.abs(parseFloat(first.formulaOD_esf || '0'));
        const lastOD = Math.abs(parseFloat(last.formulaOD_esf || '0'));
        
        if (lastOD < firstOD) setTrend('mejora');
        else if (lastOD > firstOD) setTrend('empeora');
        else setTrend('mantiene');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!paciente) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">Cargando información del paciente...</p>
      </div>
    );
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'mejora':
        return <TrendingUp className="w-5 h-5 text-success" />;
      case 'empeora':
        return <TrendingDown className="w-5 h-5 text-danger" />;
      default:
        return <Minus className="w-5 h-5 text-text-muted" />;
    }
  };

  const getTrendText = () => {
    switch (trend) {
      case 'mejora':
        return 'Mejoró';
      case 'empeora':
        return 'Empeoró';
      default:
        return 'Se Mantiene';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => navigate('/pacientes')}
          className="flex items-center gap-2 text-primary hover:text-primary-light transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a Pacientes
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
        >
          <Printer className="w-5 h-5" />
          Imprimir Historia Completa
        </button>
      </div>

      <div className="bg-surface rounded-lg shadow-md p-6 border border-border">
        <h2 className="text-2xl font-title font-bold text-primary mb-4">
          {paciente.nombres} {paciente.apellidos}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-semibold">D.I.:</span> {paciente.di}
          </div>
          <div>
            <span className="font-semibold">Edad:</span> {paciente.edad} años
          </div>
          <div>
            <span className="font-semibold">Género:</span> {paciente.genero}
          </div>
          <div>
            <span className="font-semibold">Teléfono:</span> {paciente.telefono}
          </div>
          <div>
            <span className="font-semibold">EPS:</span> {paciente.eps}
          </div>
          <div>
            <span className="font-semibold">Ocupación:</span> {paciente.ocupacion}
          </div>
          {paciente.direccion && (
            <div className="md:col-span-3">
              <span className="font-semibold">Dirección:</span> {paciente.direccion}
            </div>
          )}
          {paciente.antecedentes && (
            <div className="md:col-span-3">
              <span className="font-semibold">Antecedentes:</span> {paciente.antecedentes}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-surface rounded-lg shadow-md p-6 border border-border text-center">
          <p className="text-text-muted text-sm mb-2">Total de Visitas</p>
          <p className="text-4xl font-bold text-primary">{historias.length}</p>
        </div>
        <div className="bg-surface rounded-lg shadow-md p-6 border border-border text-center">
          <p className="text-text-muted text-sm mb-2">Última Visita</p>
          <p className="text-xl font-semibold text-primary">
            {historias.length > 0
              ? new Date(historias[historias.length - 1].fecha).toLocaleDateString('es-ES')
              : 'N/A'}
          </p>
        </div>
        <div className="bg-surface rounded-lg shadow-md p-6 border border-border">
          <p className="text-text-muted text-sm mb-2 text-center">Tendencia Visual</p>
          <div className="flex items-center justify-center gap-2">
            {getTrendIcon()}
            <p className="text-xl font-semibold">{getTrendText()}</p>
          </div>
        </div>
      </div>

      {chartData.length > 1 && (
        <div className="bg-surface rounded-lg shadow-md p-6 border border-border">
          <h3 className="text-lg font-title font-semibold text-primary mb-4">
            Evolución de Refracción
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="visita" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="OD_ESF" stroke="#1a3a5c" name="OD ESF" />
              <Line type="monotone" dataKey="OI_ESF" stroke="#2d6a9f" name="OI ESF" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-surface rounded-lg shadow-md p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-title font-semibold text-primary">
            Historial de Visitas
          </h3>
          <Link
            to={`/nueva-historia/${paciente.id}`}
            className="no-print flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Nueva Historia
          </Link>
        </div>

        {historias.length === 0 ? (
          <p className="text-text-muted text-center py-8">
            No hay historias clínicas registradas
          </p>
        ) : (
          <div className="space-y-4">
            {historias.map((historia, index) => (
              <div key={historia.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-primary">
                      Visita #{historias.length - index}
                    </p>
                    <p className="text-sm text-text-muted">
                      {new Date(historia.fecha).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold">Motivo:</span> {historia.motivoConsulta}
                  </div>
                  {historia.diagnostico && (
                    <div>
                      <span className="font-semibold">Diagnóstico:</span> {historia.diagnostico}
                    </div>
                  )}
                  {(historia.formulaOD_esf || historia.formulaOI_esf) && (
                    <div className="mt-3 bg-gray-50 p-3 rounded">
                      <p className="font-semibold mb-2">Fórmula:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="font-medium">OD:</span> ESF {historia.formulaOD_esf}{' '}
                          CYL {historia.formulaOD_cyl} EJE {historia.formulaOD_eje}
                        </div>
                        <div>
                          <span className="font-medium">OI:</span> ESF {historia.formulaOI_esf}{' '}
                          CYL {historia.formulaOI_cyl} EJE {historia.formulaOI_eje}
                        </div>
                      </div>
                      {historia.formulaUso && (
                        <p className="mt-2 text-xs">
                          <span className="font-medium">Uso:</span> {historia.formulaUso}
                        </p>
                      )}
                    </div>
                  )}
                  {historia.tratamiento && (
                    <div>
                      <span className="font-semibold">Tratamiento:</span> {historia.tratamiento}
                    </div>
                  )}
                  {historia.controles && (
                    <div>
                      <span className="font-semibold">Controles:</span> {historia.controles}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
