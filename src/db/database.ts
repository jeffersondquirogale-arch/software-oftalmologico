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

  // Lensometría
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

  // Agudeza Visual
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

  // Motilidad
  kappaOD?: string;
  kappaOI?: string;
  versionesDUC?: string;

  // Examen externo
  examenExterno?: string;
  cftaMoscopiaOD?: string;
  cftaMoscopiaOI?: string;
  cftaObservaciones?: string;

  // Queratometría (tabla con ESF/CYL/EJE por ojo)
  queratometriaOD_esf?: string;
  queratometriaOD_cyl?: string;
  queratometriaOD_eje?: string;
  queratometriaOI_esf?: string;
  queratometriaOI_cyl?: string;
  queratometriaOI_eje?: string;

  // Subjetivo (tabla con ESF/CYL/EJE/AV/ADD por ojo)
  subjetivoOD_esf?: string;
  subjetivoOD_cyl?: string;
  subjetivoOD_eje?: string;
  subjetivoOD_av?: string;
  subjetivoOD_add?: string;
  subjetivoOI_esf?: string;
  subjetivoOI_cyl?: string;
  subjetivoOI_eje?: string;
  subjetivoOI_av?: string;
  subjetivoOI_add?: string;

  // Refracción (tabla con ESF/CYL/EJE/ADD/DNP/AV por ojo)
  refraccionOD_esf?: string;
  refraccionOD_cyl?: string;
  refraccionOD_eje?: string;
  refraccionOD_add?: string;
  refraccionOD_dnp?: string;
  refraccionOD_av?: string;
  refraccionOI_esf?: string;
  refraccionOI_cyl?: string;
  refraccionOI_eje?: string;
  refraccionOI_add?: string;
  refraccionOI_dnp?: string;
  refraccionOI_av?: string;

  // Tests
  testColor?: string;
  testEstereopsis?: string;

  // Fórmula final
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

  // Diagnóstico
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

export interface AuditLog {
  id?: number;
  timestamp: string;
  userId: string;
  action: 'create' | 'update' | 'delete';
  entity: 'paciente' | 'historiaClinica' | 'cita';
  entityId: number;
  changes?: string;
  description: string;
}

export interface Attachment {
  id?: number;
  pacienteId: number;
  historiaId?: number;
  fileName: string;
  fileType: string;
  base64Data: string;
  description?: string;
  uploadDate: string;
}

export interface Doctor {
  id?: number;
  nombre: string;
  apellidos: string;
  tp: string;
  rm: string;
  especialidad: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  eslogan?: string;
  activo: boolean;
}

export class OptiSaludDatabase extends Dexie {
  doctores!: Table<Doctor>;
  pacientes!: Table<Paciente>;
  historiasClinicas!: Table<HistoriaClinica>;
  citas!: Table<Cita>;
  auditLog!: Table<AuditLog>;
  attachments!: Table<Attachment>;

  constructor() {
    super('OptiSaludDB');
    this.version(1).stores({
      pacientes: '++id, di, nombres, apellidos, fechaRegistro',
      historiasClinicas: '++id, pacienteId, fecha',
      citas: '++id, pacienteId, fecha, estado',
    });
    this.version(2).stores({
      pacientes: '++id, di, nombres, apellidos, fechaRegistro',
      historiasClinicas: '++id, pacienteId, fecha',
      citas: '++id, pacienteId, fecha, estado',
      auditLog: '++id, timestamp, userId, action, entity, entityId',
      attachments: '++id, pacienteId, historiaId, uploadDate',
    });
    this.version(3).stores({
      pacientes: '++id, di, nombres, apellidos, fechaRegistro',
      historiasClinicas: '++id, pacienteId, fecha',
      citas: '++id, pacienteId, fecha, estado',
      auditLog: '++id, timestamp, userId, action, entity, entityId',
      attachments: '++id, pacienteId, historiaId, uploadDate',
      doctores: '++id, activo',
    });
  }
}

export const db = new OptiSaludDatabase();

export async function logAudit(
  userId: string,
  action: AuditLog['action'],
  entity: AuditLog['entity'],
  entityId: number,
  description: string,
  changes?: string
): Promise<void> {
  try {
    await db.auditLog.add({
      timestamp: new Date().toISOString(),
      userId,
      action,
      entity,
      entityId,
      description,
      changes,
    });
  } catch {
    // don't fail main operation if audit log fails
  }
}