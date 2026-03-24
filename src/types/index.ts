// Re-export all database types for centralized access
export type { Paciente, HistoriaClinica, Cita } from '../db/database';

// Auth types
export interface AuthUser {
  username: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}
