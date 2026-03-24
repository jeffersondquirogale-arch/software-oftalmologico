import { useState } from 'react';
import { Download, Upload, AlertTriangle, CheckCircle } from 'lucide-react';
import { db } from '../db/database';

interface BackupData {
  version: string;
  exportedAt: string;
  pacientes: unknown[];
  historiasClinicas: unknown[];
  citas: unknown[];
}

export const Configuracion = () => {
  const [exportStatus, setExportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');

  const handleExport = async () => {
    setExportStatus('loading');
    try {
      const [pacientes, historiasClinicas, citas] = await Promise.all([
        db.pacientes.toArray(),
        db.historiasClinicas.toArray(),
        db.citas.toArray(),
      ]);

      const backup: BackupData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        pacientes,
        historiasClinicas,
        citas,
      };

      const json = JSON.stringify(backup, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `optisalud_backup_${date}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 3000);
    } catch (err) {
      console.error('Error al exportar:', err);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 3000);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset file input
    e.target.value = '';

    setImportStatus('loading');
    setImportMessage('');

    try {
      const text = await file.text();
      const data = JSON.parse(text) as BackupData;

      if (!data.pacientes || !data.historiasClinicas || !data.citas) {
        throw new Error('Formato de archivo inválido.');
      }

      const userConfirmed = window.confirm(
        `¿Desea restaurar el respaldo del ${new Date(data.exportedAt).toLocaleDateString('es-CO')}?\n\n` +
        `Esto reemplazará TODOS los datos actuales:\n` +
        `• ${data.pacientes.length} pacientes\n` +
        `• ${data.historiasClinicas.length} historias clínicas\n` +
        `• ${data.citas.length} citas\n\n` +
        `Esta acción no se puede deshacer.`
      );

      if (!userConfirmed) {
        setImportStatus('idle');
        return;
      }

      await db.transaction('rw', [db.pacientes, db.historiasClinicas, db.citas], async () => {
        await db.pacientes.clear();
        await db.historiasClinicas.clear();
        await db.citas.clear();
        if (data.pacientes.length > 0) {
          await db.pacientes.bulkAdd(
            data.pacientes as Parameters<typeof db.pacientes.bulkAdd>[0]
          );
        }
        if (data.historiasClinicas.length > 0) {
          await db.historiasClinicas.bulkAdd(
            data.historiasClinicas as Parameters<typeof db.historiasClinicas.bulkAdd>[0]
          );
        }
        if (data.citas.length > 0) {
          await db.citas.bulkAdd(
            data.citas as Parameters<typeof db.citas.bulkAdd>[0]
          );
        }
      });

      setImportMessage(
        `Restauración exitosa: ${data.pacientes.length} pacientes, ` +
        `${data.historiasClinicas.length} historias, ${data.citas.length} citas.`
      );
      setImportStatus('success');
      setTimeout(() => setImportStatus('idle'), 5000);
    } catch (err) {
      console.error('Error al importar:', err);
      setImportMessage(err instanceof Error ? err.message : 'Error al procesar el archivo.');
      setImportStatus('error');
      setTimeout(() => setImportStatus('idle'), 5000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-title font-bold text-primary">Configuración</h2>
        <p className="text-text-muted mt-1">Gestione los respaldos y la configuración del sistema.</p>
      </div>

      {/* Export */}
      <div className="bg-surface rounded-lg shadow-md p-6 border border-border">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Download className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-title font-semibold text-primary mb-1">
              Exportar Respaldo
            </h3>
            <p className="text-sm text-text-muted mb-4">
              Descargue todos los datos (pacientes, historias clínicas y citas) en formato JSON.
              Se recomienda hacer respaldos periódicamente.
            </p>
            <button
              onClick={handleExport}
              disabled={exportStatus === 'loading'}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exportStatus === 'loading' ? (
                <>
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Descargar Respaldo JSON
                </>
              )}
            </button>
            {exportStatus === 'success' && (
              <p className="flex items-center gap-1 text-success text-sm mt-2">
                <CheckCircle className="w-4 h-4" /> Respaldo descargado exitosamente.
              </p>
            )}
            {exportStatus === 'error' && (
              <p className="flex items-center gap-1 text-danger text-sm mt-2">
                <AlertTriangle className="w-4 h-4" /> Error al exportar los datos.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Import */}
      <div className="bg-surface rounded-lg shadow-md p-6 border border-border">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-100 rounded-lg">
            <Upload className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-title font-semibold text-primary mb-1">
              Restaurar Respaldo
            </h3>
            <p className="text-sm text-text-muted mb-2">
              Cargue un archivo de respaldo JSON para restaurar los datos del sistema.
            </p>
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                <strong>Advertencia:</strong> Esta operación reemplazará todos los datos actuales con los
                del archivo seleccionado. Esta acción no se puede deshacer.
              </p>
            </div>
            <label className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors cursor-pointer w-fit">
              <Upload className="w-4 h-4" />
              {importStatus === 'loading' ? 'Restaurando...' : 'Seleccionar Archivo JSON'}
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleImport}
                disabled={importStatus === 'loading'}
                className="hidden"
              />
            </label>
            {importStatus === 'success' && (
              <p className="flex items-center gap-1 text-success text-sm mt-2">
                <CheckCircle className="w-4 h-4" /> {importMessage}
              </p>
            )}
            {importStatus === 'error' && (
              <p className="flex items-center gap-1 text-danger text-sm mt-2">
                <AlertTriangle className="w-4 h-4" /> {importMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
        <h4 className="font-semibold text-primary mb-2">💡 Sobre el almacenamiento de datos</h4>
        <p className="text-sm text-text-muted">
          Todos los datos se almacenan localmente en su navegador usando IndexedDB. No se envía
          ninguna información a servidores externos. Se recomienda realizar respaldos periódicos
          para prevenir pérdida de datos por limpieza del navegador.
        </p>
      </div>
    </div>
  );
};
