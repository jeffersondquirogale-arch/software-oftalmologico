import { create } from 'zustand';

interface AppState {
  currentModule: string;
  selectedPatientId: number | null;
  setCurrentModule: (module: string) => void;
  setSelectedPatient: (patientId: number | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentModule: 'Dashboard',
  selectedPatientId: null,
  setCurrentModule: (module) => set({ currentModule: module }),
  setSelectedPatient: (patientId) => set({ selectedPatientId: patientId }),
}));
