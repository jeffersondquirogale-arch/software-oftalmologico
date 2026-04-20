import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = login(username, password);
    setLoading(false);
    if (ok) navigate('/', { replace: true });
    else setError('Usuario o contraseña incorrectos.');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Eye style={{ width: '36px', height: '36px', color: '#c9a84c' }} />
          </div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: 'var(--primary)' }}>
            Biodesccion
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>
            Sistema de Gestión Oftalmológica
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--surface)', borderRadius: '20px', border: '1px solid var(--border)', padding: '36px', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
          <h2 style={{ margin: '0 0 28px', fontSize: '20px', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: 'var(--primary)', textAlign: 'center' }}>
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Usuario
              </label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingrese su usuario"
                  autoComplete="username"
                  required
                  style={{ width: '100%', padding: '12px 14px 12px 42px', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '14px', color: 'var(--text)', background: 'var(--background)', outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif', transition: 'border-color 0.15s' }}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = '#c9a84c'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  autoComplete="current-password"
                  required
                  style={{ width: '100%', padding: '12px 42px 12px 42px', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '14px', color: 'var(--text)', background: 'var(--background)', outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif', transition: 'border-color 0.15s' }}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = '#c9a84c'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                  {showPassword
                    ? <EyeOff style={{ width: '16px', height: '16px' }} />
                    : <Eye style={{ width: '16px', height: '16px' }} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: '10px', fontSize: '13px', color: 'var(--danger)', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ padding: '13px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', opacity: loading ? 0.7 : 1, transition: 'opacity 0.15s', marginTop: '4px' }}
            >
              {loading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
          Biodesccion © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};
