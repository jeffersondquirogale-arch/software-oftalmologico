import { useState } from 'react';
import { Download, FileText, Calendar, Users } from 'lucide-react';
import { exportToExcel } from '../utils/exportExcel';

export const Reportes = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    const success = await exportToExcel();
    setIsExporting(false);
    
    if (success) {
      alert('Exportación completada exitosamente');
    } else {
      alert('Error al exportar los datos');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-lg shadow-md p-6 border border-border">
        <h3 className="text-lg font-title font-semibold text-primary mb-4">
          Exportar Datos a Excel
        </h3>
        <p className="text-text-muted mb-6">
          Descargue una copia completa de todos sus datos en formato Excel. El archivo incluirá
          tres hojas: Pacientes, Historias Clínicas y Citas.
        </p>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-6 py-3 bg-success text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          {isExporting ? 'Exportando...' : 'Exportar a Excel'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-primary">Pacientes</h4>
          </div>
          <p className="text-sm text-text-muted">
            Información completa de todos los pacientes registrados en el sistema.
          </p>
        </div>

        <div className="bg-surface rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="text-lg font-semibold text-primary">Historias Clínicas</h4>
          </div>
          <p className="text-sm text-text-muted">
            Todas las historias clínicas con datos completos de exámenes y diagnósticos.
          </p>
        </div>

        <div className="bg-surface rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-primary">Citas</h4>
          </div>
          <p className="text-sm text-text-muted">
            Registro de todas las citas programadas con sus estados y notas.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-primary mb-2">📊 Nota sobre los Datos</h4>
        <p className="text-sm text-text-muted">
          Todos los datos se almacenan localmente en su navegador usando IndexedDB. Es
          recomendable realizar respaldos periódicos exportando los datos a Excel. No se envía
          ninguna información a servidores externos.
        </p>
      </div>
    </div>
  );
};
