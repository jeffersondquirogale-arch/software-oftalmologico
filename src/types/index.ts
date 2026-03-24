// Re-export all database types for centralized access
export type { Paciente, HistoriaClinica, Cita } from '../db/database';

// Role types
export type UserRole = 'doctor' | 'asistente';

// Auth types
export interface AuthUser {
  username: string;
  role: UserRole;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}
