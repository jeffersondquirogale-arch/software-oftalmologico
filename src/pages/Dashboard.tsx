import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, TrendingUp, UserPlus, FileText, CalendarPlus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db } from '../db/database';
import type { Paciente, Cita } from '../db/database';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    pacientesHoy: 0,
    citasHoy: 0,
    totalPacientes: 0,
    nuevosEsteMes: 0,
  });
  const [chartData, setChartData] = useState<{ fecha: string; pacientes: number }[]>([]);
  const [citasHoy, setCitasHoy] = useState<(Cita & { paciente?: Paciente })[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const hoy = new Date().toISOString().split('T')[0];
    const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0];

    const totalPacientes = await db.pacientes.count();
    const nuevosEsteMes = await db.pacientes
      .where('fechaRegistro')
      .aboveOrEqual(inicioMes)
      .count();

    const todasCitas = await db.citas.where('fecha').equals(hoy).toArray();
    const citasHoyCount = todasCitas.length;

    const citasConPaciente = await Promise.all(
      todasCitas.map(async (cita) => {
        const paciente = await db.pacientes.get(cita.pacienteId);
        return { ...cita, paciente };
      })
    );
    setCitasHoy(citasConPaciente);

    const historiasHoy = await db.historiasClinicas.where('fecha').equals(hoy).count();

    setStats({
      pacientesHoy: historiasHoy,
      citasHoy: citasHoyCount,
      totalPacientes,
      nuevosEsteMes,
    });

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = await db.historiasClinicas.where('fecha').equals(dateStr).count();
      
      const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
      last7Days.push({
        fecha: dayName,
        pacientes: count,
      });
    }
    setChartData(last7Days);
  };

  const statsCards = [
    {
      title: 'Pacientes Hoy',
      value: stats.pacientesHoy,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Citas Hoy',
      value: stats.citasHoy,
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      title: 'Total Pacientes',
      value: stats.totalPacientes,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      title: 'Nuevos Este Mes',
      value: stats.nuevosEsteMes,
      icon: UserPlus,
      color: 'bg-orange-500',
    },
  ];

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'confirmada': return 'bg-blue-100 text-blue-800';
      case 'atendida': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-surface rounded-lg shadow-md p-6 border border-border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-primary mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-lg shadow-md p-6 border border-border">
          <h3 className="text-lg font-title font-semibold text-primary mb-4">
            Pacientes Últimos 7 Días
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="pacientes" fill="#1a3a5c" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface rounded-lg shadow-md p-6 border border-border">
          <h3 className="text-lg font-title font-semibold text-primary mb-4">
            Citas de Hoy
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {citasHoy.length === 0 ? (
              <p className="text-text-muted text-sm">No hay citas programadas para hoy</p>
            ) : (
              citasHoy.map((cita) => (
                <div
                  key={cita.id}
                  className="p-3 border border-border rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-primary">
                        {cita.paciente?.nombres} {cita.paciente?.apellidos}
                      </p>
                      <p className="text-xs text-text-muted mt-1">{cita.hora}</p>
                      <p className="text-xs text-text-muted">{cita.motivo}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        cita.estado
                      )}`}
                    >
                      {cita.estado}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-lg shadow-md p-6 border border-border">
        <h3 className="text-lg font-title font-semibold text-primary mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/nueva-historia"
            className="flex items-center gap-3 p-4 border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-all group"
          >
            <FileText className="w-6 h-6 text-primary group-hover:text-white" />
            <span className="font-semibold">Nueva Historia Clínica</span>
          </Link>
          <Link
            to="/citas"
            className="flex items-center gap-3 p-4 border-2 border-accent rounded-lg hover:bg-accent hover:text-white transition-all group"
          >
            <CalendarPlus className="w-6 h-6 text-accent group-hover:text-white" />
            <span className="font-semibold">Agendar Cita</span>
          </Link>
          <Link
            to="/pacientes"
            className="flex items-center gap-3 p-4 border-2 border-success rounded-lg hover:bg-success hover:text-white transition-all group"
          >
            <Users className="w-6 h-6 text-success group-hover:text-white" />
            <span className="font-semibold">Ver Pacientes</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
