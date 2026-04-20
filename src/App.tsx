import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Pacientes } from './pages/Pacientes';
import { NuevaHistoria } from './pages/NuevaHistoria';
import { PerfilPaciente } from './pages/PerfilPaciente';
import { Citas } from './pages/Citas';
import { Reportes } from './pages/Reportes';
import { Login } from './pages/Login';
import { Configuracion } from './pages/Configuracion';
import { AuditLog } from './pages/AuditLog';
import { EditarPaciente } from './pages/EditarPaciente';
import { useEffect, type ReactNode } from 'react';
import { useAppStore } from './store/useAppStore';
import { useAuth } from './hooks/useAuth';

function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function DoctorRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user || user.role !== 'doctor') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { setCurrentModule } = useAppStore();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setCurrentModule('Dashboard');
  }, [setCurrentModule]);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/pacientes" element={<Pacientes />} />
                <Route path="/pacientes/:id" element={<PerfilPaciente />} />
                <Route path="/pacientes/:id/editar" element={<EditarPaciente />} />
                <Route path="/nueva-historia" element={<NuevaHistoria />} />
                <Route path="/nueva-historia/:pacienteId" element={<NuevaHistoria />} />
                <Route path="/editar-historia/:historiaId" element={<NuevaHistoria />} />
                <Route path="/citas" element={<Citas />} />
                <Route path="/reportes" element={<DoctorRoute><Reportes /></DoctorRoute>} />
                <Route path="/configuracion" element={<DoctorRoute><Configuracion /></DoctorRoute>} />
                <Route path="/audit" element={<DoctorRoute><AuditLog /></DoctorRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </MainLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
