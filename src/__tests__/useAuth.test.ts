import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useAuth } from '../hooks/useAuth';

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('starts unauthenticated', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('logs in successfully as doctor', () => {
    const { result } = renderHook(() => useAuth());
    act(() => {
      const ok = result.current.login('admin', 'optisalud2024');
      expect(ok).toBe(true);
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.username).toBe('admin');
    expect(result.current.user?.role).toBe('doctor');
  });

  it('logs in successfully as asistente', () => {
    const { result } = renderHook(() => useAuth());
    act(() => {
      const ok = result.current.login('asistente', 'asistente2024');
      expect(ok).toBe(true);
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.role).toBe('asistente');
  });

  it('rejects wrong password', () => {
    const { result } = renderHook(() => useAuth());
    act(() => {
      const ok = result.current.login('admin', 'wrongpass');
      expect(ok).toBe(false);
    });
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('logs out successfully', () => {
    const { result } = renderHook(() => useAuth());
    act(() => {
      result.current.login('admin', 'optisalud2024');
    });
    act(() => {
      result.current.logout();
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('persists auth in localStorage', () => {
    const { result } = renderHook(() => useAuth());
    act(() => {
      result.current.login('admin', 'optisalud2024');
    });
    const stored = localStorage.getItem('optisalud_auth');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.isAuthenticated).toBe(true);
  });
});
