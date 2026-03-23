import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Pacientes } from './pages/Pacientes';
import { NuevaHistoria } from './pages/NuevaHistoria';
import { PerfilPaciente } from './pages/PerfilPaciente';
import { Citas } from './pages/Citas';
import { Reportes } from './pages/Reportes';
import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';

function App() {
  const { setCurrentModule } = useAppStore();

  useEffect(() => {
    setCurrentModule('Dashboard');
  }, [setCurrentModule]);

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/pacientes/:id" element={<PerfilPaciente />} />
          <Route path="/nueva-historia" element={<NuevaHistoria />} />
          <Route path="/nueva-historia/:pacienteId" element={<NuevaHistoria />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
