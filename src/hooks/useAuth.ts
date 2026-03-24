import { useState, useCallback } from 'react';
import type { AuthState } from '../types';

const AUTH_KEY = 'optisalud_auth';
const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'optisalud2024';

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
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      const newAuth: AuthState = { isAuthenticated: true, user: { username } };
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
