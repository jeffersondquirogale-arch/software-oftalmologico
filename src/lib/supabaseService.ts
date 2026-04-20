import { supabase } from './supabase';
import type { Paciente, HistoriaClinica, Cita } from '../db/database';

// ── PACIENTES ──────────────────────────────────────────────────────────────
export const spGetPacientes = async (): Promise<Paciente[]> => {
  const { data, error } = await supabase.from('pacientes').select('*').order('fecha_registro', { ascending: false });
  if (error) throw error;
  return data.map(mapPaciente);
};

export const spGetPaciente = async (id: number): Promise<Paciente | null> => {
  const { data, error } = await supabase.from('pacientes').select('*').eq('id', id).single();
  if (error) return null;
  return mapPaciente(data);
};

export const spAddPaciente = async (p: Omit<Paciente, 'id'>): Promise<number> => {
  const { data, error } = await supabase.from('pacientes').insert([{
    nombres: p.nombres, apellidos: p.apellidos, di: p.di,
    fecha_nacimiento: p.fechaNacimiento, edad: p.edad, genero: p.genero,
    telefono: p.telefono, direccion: p.direccion, ocupacion: p.ocupacion,
    eps: p.eps, antecedentes: p.antecedentes, fecha_registro: p.fechaRegistro,
  }]).select('id').single();
  if (error) throw error;
  return data.id;
};

export const spUpdatePaciente = async (id: number, p: Partial<Paciente>) => {
  const { error } = await supabase.from('pacientes').update({
    nombres: p.nombres, apellidos: p.apellidos, di: p.di,
    fecha_nacimiento: p.fechaNacimiento, edad: p.edad, genero: p.genero,
    telefono: p.telefono, direccion: p.direccion, ocupacion: p.ocupacion,
    eps: p.eps, antecedentes: p.antecedentes,
  }).eq('id', id);
  if (error) throw error;
};

export const spDeletePaciente = async (id: number) => {
  const { error } = await supabase.from('pacientes').delete().eq('id', id);
  if (error) throw error;
};

export const spSearchPacientes = async (term: string): Promise<Paciente[]> => {
  const { data, error } = await supabase.from('pacientes').select('*')
    .or(`nombres.ilike.%${term}%,apellidos.ilike.%${term}%,di.ilike.%${term}%`)
    .order('fecha_registro', { ascending: false });
  if (error) throw error;
  return data.map(mapPaciente);
};

export const spCountPacientes = async (): Promise<number> => {
  const { count } = await supabase.from('pacientes').select('*', { count: 'exact', head: true });
  return count || 0;
};

// ── HISTORIAS ──────────────────────────────────────────────────────────────
export const spGetHistorias = async (pacienteId: number): Promise<HistoriaClinica[]> => {
  const { data, error } = await supabase.from('historias_clinicas').select('*').eq('paciente_id', pacienteId).order('fecha');
  if (error) throw error;
  return data.map(mapHistoria);
};

export const spGetHistoriasByFecha = async (fecha: string): Promise<HistoriaClinica[]> => {
  const { data, error } = await supabase.from('historias_clinicas').select('*').eq('fecha', fecha);
  if (error) throw error;
  return data.map(mapHistoria);
};

export const spGetHistoria = async (id: number): Promise<HistoriaClinica | null> => {
  const { data, error } = await supabase.from('historias_clinicas').select('*').eq('id', id).single();
  if (error) return null;
  return mapHistoria(data);
};

const historiaToRow = (h: Partial<HistoriaClinica>) => ({
  paciente_id: h.pacienteId, fecha: h.fecha, motivo_consulta: h.motivoConsulta,
  lens_od_esf: h.lensOD_esf, lens_od_cyl: h.lensOD_cyl, lens_od_eje: h.lensOD_eje,
  lens_od_add: h.lensOD_add, lens_od_dnp: h.lensOD_dnp, lens_od_pris: h.lensOD_pris,
  lens_oi_esf: h.lensOI_esf, lens_oi_cyl: h.lensOI_cyl, lens_oi_eje: h.lensOI_eje,
  lens_oi_add: h.lensOI_add, lens_oi_dnp: h.lensOI_dnp, lens_oi_pris: h.lensOI_pris,
  av_od_vlsc: h.av_od_vlsc, av_od_ph: h.av_od_ph, av_od_vpsc: h.av_od_vpsc,
  av_od_vlcc: h.av_od_vlcc, av_od_vpcc: h.av_od_vpcc,
  av_oi_vlsc: h.av_oi_vlsc, av_oi_ph: h.av_oi_ph, av_oi_vpsc: h.av_oi_vpsc,
  av_oi_vlcc: h.av_oi_vlcc, av_oi_vpcc: h.av_oi_vpcc,
  cover_test_vl: h.coverTest_vl, cover_test_vp: h.coverTest_vp, hirschberg: h.hirschberg,
  kappa_od: h.kappaOD, kappa_oi: h.kappaOI, versiones_duc: h.versionesDUC,
  examen_externo: h.examenExterno, cfta_moscopia_od: h.cftaMoscopiaOD,
  cfta_moscopia_oi: h.cftaMoscopiaOI, cfta_observaciones: h.cftaObservaciones,
  subjetivo_od_esf: h.subjetivoOD_esf, subjetivo_od_cyl: h.subjetivoOD_cyl,
  subjetivo_od_eje: h.subjetivoOD_eje, subjetivo_od_av: h.subjetivoOD_av,
  subjetivo_od_add: h.subjetivoOD_add,
  subjetivo_oi_esf: h.subjetivoOI_esf, subjetivo_oi_cyl: h.subjetivoOI_cyl,
  subjetivo_oi_eje: h.subjetivoOI_eje, subjetivo_oi_av: h.subjetivoOI_av,
  subjetivo_oi_add: h.subjetivoOI_add,
  refraccion_od_esf: h.refraccionOD_esf, refraccion_od_cyl: h.refraccionOD_cyl,
  refraccion_od_eje: h.refraccionOD_eje, refraccion_od_add: h.refraccionOD_add,
  refraccion_od_dnp: h.refraccionOD_dnp, refraccion_od_av: h.refraccionOD_av,
  refraccion_oi_esf: h.refraccionOI_esf, refraccion_oi_cyl: h.refraccionOI_cyl,
  refraccion_oi_eje: h.refraccionOI_eje, refraccion_oi_add: h.refraccionOI_add,
  refraccion_oi_dnp: h.refraccionOI_dnp, refraccion_oi_av: h.refraccionOI_av,
  test_color: h.testColor, test_estereopsis: h.testEstereopsis,
  queratometria_od_esf: h.queratometriaOD_esf, queratometria_od_cyl: h.queratometriaOD_cyl,
  queratometria_od_eje: h.queratometriaOD_eje,
  queratometria_oi_esf: h.queratometriaOI_esf, queratometria_oi_cyl: h.queratometriaOI_cyl,
  queratometria_oi_eje: h.queratometriaOI_eje,
  formula_od_esf: h.formulaOD_esf, formula_od_cyl: h.formulaOD_cyl, formula_od_eje: h.formulaOD_eje,
  formula_od_add: h.formulaOD_add, formula_od_dnp: h.formulaOD_dnp, formula_od_av: h.formulaOD_av,
  formula_oi_esf: h.formulaOI_esf, formula_oi_cyl: h.formulaOI_cyl, formula_oi_eje: h.formulaOI_eje,
  formula_oi_add: h.formulaOI_add, formula_oi_dnp: h.formulaOI_dnp, formula_oi_av: h.formulaOI_av,
  formula_alt: h.formulaAlt, formula_rx: h.formulaRx, formula_uso: h.formulaUso,
  diagnostico: h.diagnostico, tratamiento: h.tratamiento, controles: h.controles, observaciones: h.observaciones,
});

export const spAddHistoria = async (h: Omit<HistoriaClinica, 'id'>): Promise<number> => {
  const { data, error } = await supabase.from('historias_clinicas').insert([historiaToRow(h)]).select('id').single();
  if (error) throw error;
  return data.id;
};

export const spUpdateHistoria = async (id: number, h: Partial<HistoriaClinica>): Promise<void> => {
  const { error } = await supabase.from('historias_clinicas').update(historiaToRow(h)).eq('id', id);
  if (error) throw error;
};

export const spCountHistoriasByFecha = async (fecha: string): Promise<number> => {
  const { count } = await supabase.from('historias_clinicas').select('*', { count: 'exact', head: true }).eq('fecha', fecha);
  return count || 0;
};

export const spGetAllHistorias = async (): Promise<HistoriaClinica[]> => {
  const { data, error } = await supabase.from('historias_clinicas').select('*');
  if (error) throw error;
  return data.map(mapHistoria);
};

// ── CITAS ──────────────────────────────────────────────────────────────────
export const spGetCitas = async (desde: string, hasta: string): Promise<Cita[]> => {
  const { data, error } = await supabase.from('citas').select('*').gte('fecha', desde).lte('fecha', hasta);
  if (error) throw error;
  return data.map(mapCita);
};

export const spGetCitasByFecha = async (fecha: string): Promise<Cita[]> => {
  const { data, error } = await supabase.from('citas').select('*').eq('fecha', fecha);
  if (error) throw error;
  return data.map(mapCita);
};

export const spAddCita = async (c: Omit<Cita, 'id'>): Promise<number> => {
  const { data, error } = await supabase.from('citas').insert([{
    paciente_id: c.pacienteId, fecha: c.fecha, hora: c.hora,
    motivo: c.motivo, estado: c.estado, notas: c.notas,
  }]).select('id').single();
  if (error) throw error;
  return data.id;
};

export const spUpdateCita = async (id: number, estado: string) => {
  const { error } = await supabase.from('citas').update({ estado }).eq('id', id);
  if (error) throw error;
};

export const spDeleteCitasByPaciente = async (pacienteId: number) => {
  const { error } = await supabase.from('citas').delete().eq('paciente_id', pacienteId);
  if (error) throw error;
};

export const spGetAllCitas = async (): Promise<Cita[]> => {
  const { data, error } = await supabase.from('citas').select('*');
  if (error) throw error;
  return data.map(mapCita);
};

// ── MAPPERS ────────────────────────────────────────────────────────────────
const mapPaciente = (d: any): Paciente => ({
  id: d.id, nombres: d.nombres, apellidos: d.apellidos, di: d.di,
  fechaNacimiento: d.fecha_nacimiento, edad: d.edad, genero: d.genero,
  telefono: d.telefono, direccion: d.direccion, ocupacion: d.ocupacion,
  eps: d.eps, antecedentes: d.antecedentes, fechaRegistro: d.fecha_registro,
});

const mapHistoria = (d: any): HistoriaClinica => ({
  id: d.id, pacienteId: d.paciente_id, fecha: d.fecha, motivoConsulta: d.motivo_consulta,
  lensOD_esf: d.lens_od_esf, lensOD_cyl: d.lens_od_cyl, lensOD_eje: d.lens_od_eje,
  lensOD_add: d.lens_od_add, lensOD_dnp: d.lens_od_dnp, lensOD_pris: d.lens_od_pris,
  lensOI_esf: d.lens_oi_esf, lensOI_cyl: d.lens_oi_cyl, lensOI_eje: d.lens_oi_eje,
  lensOI_add: d.lens_oi_add, lensOI_dnp: d.lens_oi_dnp, lensOI_pris: d.lens_oi_pris,
  av_od_vlsc: d.av_od_vlsc, av_od_ph: d.av_od_ph, av_od_vpsc: d.av_od_vpsc,
  av_od_vlcc: d.av_od_vlcc, av_od_vpcc: d.av_od_vpcc,
  av_oi_vlsc: d.av_oi_vlsc, av_oi_ph: d.av_oi_ph, av_oi_vpsc: d.av_oi_vpsc,
  av_oi_vlcc: d.av_oi_vlcc, av_oi_vpcc: d.av_oi_vpcc,
  coverTest_vl: d.cover_test_vl, coverTest_vp: d.cover_test_vp, hirschberg: d.hirschberg,
  kappaOD: d.kappa_od, kappaOI: d.kappa_oi, versionesDUC: d.versiones_duc,
  examenExterno: d.examen_externo, cftaMoscopiaOD: d.cfta_moscopia_od,
  cftaMoscopiaOI: d.cfta_moscopia_oi, cftaObservaciones: d.cfta_observaciones,
  subjetivoOD_esf: d.subjetivo_od_esf, subjetivoOD_cyl: d.subjetivo_od_cyl,
  subjetivoOD_eje: d.subjetivo_od_eje, subjetivoOD_av: d.subjetivo_od_av,
  subjetivoOD_add: d.subjetivo_od_add,
  subjetivoOI_esf: d.subjetivo_oi_esf, subjetivoOI_cyl: d.subjetivo_oi_cyl,
  subjetivoOI_eje: d.subjetivo_oi_eje, subjetivoOI_av: d.subjetivo_oi_av,
  subjetivoOI_add: d.subjetivo_oi_add,
  refraccionOD_esf: d.refraccion_od_esf, refraccionOD_cyl: d.refraccion_od_cyl,
  refraccionOD_eje: d.refraccion_od_eje, refraccionOD_add: d.refraccion_od_add,
  refraccionOD_dnp: d.refraccion_od_dnp, refraccionOD_av: d.refraccion_od_av,
  refraccionOI_esf: d.refraccion_oi_esf, refraccionOI_cyl: d.refraccion_oi_cyl,
  refraccionOI_eje: d.refraccion_oi_eje, refraccionOI_add: d.refraccion_oi_add,
  refraccionOI_dnp: d.refraccion_oi_dnp, refraccionOI_av: d.refraccion_oi_av,
  testColor: d.test_color, testEstereopsis: d.test_estereopsis,
  queratometriaOD_esf: d.queratometria_od_esf, queratometriaOD_cyl: d.queratometria_od_cyl,
  queratometriaOD_eje: d.queratometria_od_eje,
  queratometriaOI_esf: d.queratometria_oi_esf, queratometriaOI_cyl: d.queratometria_oi_cyl,
  queratometriaOI_eje: d.queratometria_oi_eje,
  formulaOD_esf: d.formula_od_esf, formulaOD_cyl: d.formula_od_cyl, formulaOD_eje: d.formula_od_eje,
  formulaOD_add: d.formula_od_add, formulaOD_dnp: d.formula_od_dnp, formulaOD_av: d.formula_od_av,
  formulaOI_esf: d.formula_oi_esf, formulaOI_cyl: d.formula_oi_cyl, formulaOI_eje: d.formula_oi_eje,
  formulaOI_add: d.formula_oi_add, formulaOI_dnp: d.formula_oi_dnp, formulaOI_av: d.formula_oi_av,
  formulaAlt: d.formula_alt, formulaRx: d.formula_rx, formulaUso: d.formula_uso,
  diagnostico: d.diagnostico, tratamiento: d.tratamiento, controles: d.controles, observaciones: d.observaciones,
});

const mapCita = (d: any): Cita => ({
  id: d.id, pacienteId: d.paciente_id, fecha: d.fecha, hora: d.hora,
  motivo: d.motivo, estado: d.estado, notas: d.notas,
});