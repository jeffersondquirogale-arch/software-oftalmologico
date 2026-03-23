import ExcelJS from 'exceljs';
import { db } from '../db/database';

const addSheetFromObjects = (
  workbook: ExcelJS.Workbook,
  sheetName: string,
  rows: Record<string, unknown>[]
) => {
  const worksheet = workbook.addWorksheet(sheetName);
  if (rows.length === 0) {
    return;
  }
  worksheet.columns = Object.keys(rows[0]).map((key) => ({
    header: key,
    key,
    width: 20,
  }));
  worksheet.addRows(rows);
};

export const exportToExcel = async () => {
  try {
    const pacientes = await db.pacientes.toArray();
    const historiasClinicas = await db.historiasClinicas.toArray();
    const citas = await db.citas.toArray();

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'OptiSalud';
    workbook.created = new Date();

    addSheetFromObjects(workbook, 'Pacientes', pacientes as unknown as Record<string, unknown>[]);
    addSheetFromObjects(workbook, 'Historias Clínicas', historiasClinicas as unknown as Record<string, unknown>[]);
    addSheetFromObjects(workbook, 'Citas', citas as unknown as Record<string, unknown>[]);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const fecha = new Date().toISOString().split('T')[0];
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `optisalud_backup_${fecha}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};
