import { db } from '../db/database';
import type { Doctor } from '../db/database';

export const DEFAULT_DOCTOR: Doctor = {
  nombre: 'Juan D.',
  apellidos: 'Lozada S.',
  tp: '1.010.201.450',
  rm: '3945 CTNPO',
  especialidad: 'Optómetra F.U.A.A.',
  eslogan: 'MEJORAR TU VISIÓN ES MI MISIÓN',
  activo: true,
};

export async function getDoctorActivo(): Promise<Doctor> {
  try {
    const activo = await db.doctores.where('activo').equals(1).first();
    return activo || DEFAULT_DOCTOR;
  } catch {
    return DEFAULT_DOCTOR;
  }
}
