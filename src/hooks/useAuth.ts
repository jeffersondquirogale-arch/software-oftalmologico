import { useState, useCallback } from 'react';
import type { AuthState, UserRole } from '../types';

const AUTH_KEY = 'optisalud_auth';

interface UserCredential {
  password: string;
  role: UserRole;
}

const VALID_USERS: Record<string, UserCredential> = {
  admin: { password: 'optisalud2024', role: 'doctor' },
  asistente: { password: 'asistente2024', role: 'asistente' },
};

function readAuthFromStorage(): AuthState {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AuthState;
      if (parsed.isAuthenticated && parsed.user) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return { isAuthenticated: false, user: null };
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>(readAuthFromStorage);

  const login = useCallback((username: string, password: string): boolean => {
    const cred = VALID_USERS[username];
    if (cred && cred.password === password) {
      const newAuth: AuthState = {
        isAuthenticated: true,
        user: { username, role: cred.role },
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(newAuth));
      setAuth(newAuth);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setAuth({ isAuthenticated: false, user: null });
  }, []);

  return { ...auth, login, logout };
}

export function isAuthenticated(): boolean {
  return readAuthFromStorage().isAuthenticated;
}

export function getCurrentUserRole(): UserRole | null {
  return readAuthFromStorage().user?.role ?? null;
}
