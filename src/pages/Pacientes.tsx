import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Trash2, FileText, Eye } from 'lucide-react';
import { db } from '../db/database';
import type { Paciente } from '../db/database';

export const Pacientes = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    loadPacientes();
  }, []);

  useEffect(() => {
    filterPacientes();
  }, [searchTerm, pacientes]);

  const loadPacientes = async () => {
    const allPacientes = await db.pacientes.orderBy('fechaRegistro').reverse().toArray();
    setPacientes(allPacientes);
  };

  const filterPacientes = () => {
    if (!searchTerm) {
      setFilteredPacientes(pacientes);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = pacientes.filter(
      (p) =>
        p.nombres.toLowerCase().includes(term) ||
        p.apellidos.toLowerCase().includes(term) ||
        p.di.toLowerCase().includes(term)
    );
    setFilteredPacientes(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
    try {
      await db.pacientes.delete(id);
      await db.historiasClinicas.where('pacienteId').equals(id).delete();
      await db.citas.where('pacienteId').equals(id).delete();
      setDeleteConfirm(null);
      loadPacientes();
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('Error al eliminar el paciente');
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPacientes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPacientes.length / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-lg shadow-md p-6 border border-border">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-primary">
                  Nombre
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-primary">
                  D.I.
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-primary">
                  Teléfono
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-primary">
                  EPS
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-primary">
                  Fecha Registro
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-primary">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-text-muted">
                    No se encontraron pacientes
                  </td>
                </tr>
              ) : (
                currentItems.map((paciente) => (
                  <tr key={paciente.id} className="border-b border-border hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">
                      {paciente.nombres} {paciente.apellidos}
                    </td>
                    <td className="py-3 px-4 text-sm">{paciente.di}</td>
                    <td className="py-3 px-4 text-sm">{paciente.telefono}</td>
                    <td className="py-3 px-4 text-sm">{paciente.eps}</td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(paciente.fechaRegistro).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/pacientes/${paciente.id}`}
                          className="p-2 text-primary hover:bg-primary hover:text-white rounded transition-colors"
                          title="Ver Historial"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/nueva-historia/${paciente.id}`}
                          className="p-2 text-success hover:bg-success hover:text-white rounded transition-colors"
                          title="Nueva Historia"
                        >
                          <FileText className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(paciente.id!)}
                          className="p-2 text-danger hover:bg-danger hover:text-white rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-white transition-colors"
            >
              Anterior
            </button>
            <span className="text-sm text-text-muted">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-white transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-title font-semibold text-primary mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-text-muted mb-6">
              ¿Está seguro de eliminar este paciente? Esta acción también eliminará todas sus
              historias clínicas y citas asociadas. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
