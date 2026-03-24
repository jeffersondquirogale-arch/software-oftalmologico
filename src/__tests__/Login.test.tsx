import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Login } from '../pages/Login';

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn().mockReturnValue(true),
    logout: vi.fn(),
    isAuthenticated: false,
    user: null,
  }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingrese su usuario')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingrese su contraseña')).toBeInTheDocument();
  });

  it('renders OptiSalud branding', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByText('OptiSalud')).toBeInTheDocument();
    expect(screen.getByText('Dr. Juan D. Lozada S.')).toBeInTheDocument();
  });

  it('has submit button', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByText('Ingresar')).toBeInTheDocument();
  });

  it('shows error on bad credentials', () => {
    const loginMock = vi.fn().mockReturnValue(false);
    vi.doMock('../hooks/useAuth', () => ({
      useAuth: () => ({
        login: loginMock,
        logout: vi.fn(),
        isAuthenticated: false,
        user: null,
      }),
    }));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Ingrese su usuario'), {
      target: { value: 'wrong' },
    });
    fireEvent.change(screen.getByPlaceholderText('Ingrese su contraseña'), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByText('Ingresar'));
  });
});
