import * as XLSX from 'xlsx';
import { db } from '../db/database';

export const exportToExcel = async () => {
  try {
    const pacientes = await db.pacientes.toArray();
    const historiasClinicas = await db.historiasClinicas.toArray();
    const citas = await db.citas.toArray();

    const wb = XLSX.utils.book_new();

    const wsPacientes = XLSX.utils.json_to_sheet(pacientes);
    XLSX.utils.book_append_sheet(wb, wsPacientes, 'Pacientes');

    const wsHistorias = XLSX.utils.json_to_sheet(historiasClinicas);
    XLSX.utils.book_append_sheet(wb, wsHistorias, 'Historias Clínicas');

    const wsCitas = XLSX.utils.json_to_sheet(citas);
    XLSX.utils.book_append_sheet(wb, wsCitas, 'Citas');

    const fecha = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `optisalud_backup_${fecha}.xlsx`);

    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};
