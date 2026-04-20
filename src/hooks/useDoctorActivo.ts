import { useState, useEffect } from 'react';
import { db } from '../db/database';
import type { Doctor } from '../db/database';

const DEFAULT_DOCTOR: Doctor = {
  nombre: 'Juan D.',
  apellidos: 'Lozada S.',
  tp: '1.010.201.450',
  rm: '3945 CTNPO',
  especialidad: 'Optómetra F.U.A.A.',
  eslogan: 'MEJORAR TU VISIÓN ES MI MISIÓN',
  activo: true,
};

export function useDoctorActivo() {
  const [doctor, setDoctor] = useState<Doctor>(DEFAULT_DOCTOR);

  useEffect(() => {
    loadDoctor();
  }, []);

  const loadDoctor = async () => {
    try {
      const activo = await db.doctores.where('activo').equals(1).first();
      if (activo) setDoctor(activo);
      else {
        // Si no hay doctor, crear el default
        const id = await db.doctores.add(DEFAULT_DOCTOR);
        setDoctor({ ...DEFAULT_DOCTOR, id: id as number });
      }
    } catch {
      setDoctor(DEFAULT_DOCTOR);
    }
  };

  return { doctor, reloadDoctor: loadDoctor };
}
