import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Lock, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const ok = login(username, password);
    setLoading(false);

    if (ok) {
      navigate('/', { replace: true });
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-2xl shadow-xl border border-border overflow-hidden">
          <div className="bg-primary p-8 text-center">
            <div className="flex justify-center mb-3">
              <Eye className="w-12 h-12 text-accent" />
            </div>
            <h1 className="text-3xl font-title font-bold text-accent">OptiSalud</h1>
            <p className="text-gray-300 mt-1 text-sm">Dr. Juan D. Lozada S.</p>
            <p className="text-gray-400 text-xs">Optómetra F.U.A.A.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <h2 className="text-xl font-title font-semibold text-primary text-center mb-6">
              Iniciar Sesión
            </h2>

            <div>
              <label className="block text-sm font-medium text-text mb-1">Usuario</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ingrese su usuario"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ingrese su contraseña"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-danger text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>

          <div className="pb-6 text-center">
            <p className="text-xs text-text-muted">
              TP 1.010.201.450 | RM 3945 CTNPO
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
