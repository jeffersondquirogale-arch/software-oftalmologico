import Dexie, { type Table } from 'dexie';

export interface Paciente {
  id?: number;
  nombres: string;
  apellidos: string;
  di: string;
  fechaNacimiento: string;
  edad: number;
  genero: string;
  telefono: string;
  direccion: string;
  ocupacion: string;
  eps: string;
  acompanante?: string;
  parentesco?: string;
  antecedentes?: string;
  fechaRegistro: string;
}

export interface HistoriaClinica {
  id?: number;
  pacienteId: number;
  fecha: string;
  motivoConsulta: string;
  lensOD_esf?: string;
  lensOD_cyl?: string;
  lensOD_eje?: string;
  lensOD_add?: string;
  lensOD_dnp?: string;
  lensOD_pris?: string;
  lensOI_esf?: string;
  lensOI_cyl?: string;
  lensOI_eje?: string;
  lensOI_add?: string;
  lensOI_dnp?: string;
  lensOI_pris?: string;
  av_od_vlsc?: string;
  av_od_ph?: string;
  av_od_vpsc?: string;
  av_od_vlcc?: string;
  av_od_vpcc?: string;
  av_oi_vlsc?: string;
  av_oi_ph?: string;
  av_oi_vpsc?: string;
  av_oi_vlcc?: string;
  av_oi_vpcc?: string;
  coverTest_vl?: string;
  coverTest_vp?: string;
  hirschberg?: string;
  kappaOD?: string;
  kappaOI?: string;
  versionesDUC?: string;
  examenExterno?: string;
  cftaMoscopiaOD?: string;
  cftaMoscopiaOI?: string;
  cftaObservaciones?: string;
  subjetivoOD_av?: string;
  subjetivoOD_add?: string;
  subjetivoOI_av?: string;
  subjetivoOI_add?: string;
  refraccionOD?: string;
  refraccionOI?: string;
  testColor?: string;
  testEstereopsis?: string;
  queratometria?: string;
  formulaOD_esf?: string;
  formulaOD_cyl?: string;
  formulaOD_eje?: string;
  formulaOD_add?: string;
  formulaOD_dnp?: string;
  formulaOD_av?: string;
  formulaOI_esf?: string;
  formulaOI_cyl?: string;
  formulaOI_eje?: string;
  formulaOI_add?: string;
  formulaOI_dnp?: string;
  formulaOI_av?: string;
  formulaAlt?: string;
  formulaRx?: string;
  formulaUso?: string;
  diagnostico?: string;
  tratamiento?: string;
  controles?: string;
  observaciones?: string;
}

export interface Cita {
  id?: number;
  pacienteId: number;
  fecha: string;
  hora: string;
  motivo: string;
  estado: 'pendiente' | 'confirmada' | 'atendida' | 'cancelada';
  notas?: string;
}

export class OptiSaludDatabase extends Dexie {
  pacientes!: Table<Paciente>;
  historiasClinicas!: Table<HistoriaClinica>;
  citas!: Table<Cita>;

  constructor() {
    super('OptiSaludDB');
    this.version(1).stores({
      pacientes: '++id, di, nombres, apellidos, fechaRegistro',
      historiasClinicas: '++id, pacienteId, fecha',
      citas: '++id, pacienteId, fecha, estado',
    });
  }
}

export const db = new OptiSaludDatabase();
