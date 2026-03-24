import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, FileText, Calendar, X } from 'lucide-react';
import { db } from '../db/database';

interface SearchResult {
  id: string;
  type: 'paciente' | 'historia' | 'cita';
  title: string;
  subtitle: string;
  link: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const SEARCH_DEBOUNCE_MS = 300;

export const GlobalSearch = ({ isOpen, onClose }: GlobalSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);

  const search = useCallback(async (q: string) => {
    if (!q.trim() || q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const term = q.toLowerCase();
    const all: SearchResult[] = [];

    try {
      const pacientes = await db.pacientes.toArray();
      for (const p of pacientes) {
        if (
          p.nombres.toLowerCase().includes(term) ||
          p.apellidos.toLowerCase().includes(term) ||
          p.di.toLowerCase().includes(term) ||
          p.telefono.toLowerCase().includes(term)
        ) {
          all.push({
            id: `p_${p.id}`,
            type: 'paciente',
            title: `${p.nombres} ${p.apellidos}`,
            subtitle: `DI: ${p.di} | Tel: ${p.telefono}`,
            link: `/pacientes/${p.id}`,
          });
        }
      }

      const historias = await db.historiasClinicas.toArray();
      for (const h of historias) {
        if (
          (h.diagnostico && h.diagnostico.toLowerCase().includes(term)) ||
          (h.tratamiento && h.tratamiento.toLowerCase().includes(term)) ||
          (h.motivoConsulta && h.motivoConsulta.toLowerCase().includes(term))
        ) {
          const paciente = await db.pacientes.get(h.pacienteId);
          all.push({
            id: `h_${h.id}`,
            type: 'historia',
            title: `Historia: ${h.diagnostico || h.motivoConsulta || 'Sin diagnóstico'}`,
            subtitle: `Paciente: ${paciente ? paciente.nombres + ' ' + paciente.apellidos : '?'} | ${h.fecha}`,
            link: `/pacientes/${h.pacienteId}`,
          });
        }
      }

      const citas = await db.citas.toArray();
      for (const c of citas) {
        const paciente = await db.pacientes.get(c.pacienteId);
        const nombrePaciente = paciente ? `${paciente.nombres} ${paciente.apellidos}` : '';
        if (
          nombrePaciente.toLowerCase().includes(term) ||
          c.fecha.includes(term) ||
          c.estado.includes(term) ||
          c.motivo.toLowerCase().includes(term)
        ) {
          all.push({
            id: `c_${c.id}`,
            type: 'cita',
            title: `Cita: ${nombrePaciente}`,
            subtitle: `${c.fecha} ${c.hora} | ${c.estado}`,
            link: '/citas',
          });
        }
      }
    } catch {
      // ignore
    }

    setResults(all.slice(0, 20));
    setLoading(false);
  }, []);

  useEffect(() => {
    search(debouncedQuery);
  }, [debouncedQuery, search]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  const handleSelect = (result: SearchResult) => {
    navigate(result.link);
    onClose();
  };

  const iconForType = (type: SearchResult['type']) => {
    if (type === 'paciente') return <Users className="w-4 h-4 text-primary dark:text-blue-400" />;
    if (type === 'historia') return <FileText className="w-4 h-4 text-success dark:text-green-400" />;
    return <Calendar className="w-4 h-4 text-accent" />;
  };

  const labelForType = (type: SearchResult['type']) => {
    if (type === 'paciente') return 'Paciente';
    if (type === 'historia') return 'Historia';
    return 'Cita';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-surface dark:bg-gray-800 rounded-xl shadow-2xl border border-border dark:border-gray-600 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border dark:border-gray-600">
          <Search className="w-5 h-5 text-text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar pacientes, historias, citas..."
            className="flex-1 bg-transparent outline-none text-text dark:text-gray-100 placeholder-text-muted"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-text-muted dark:text-gray-400">
            Esc
          </kbd>
            <button
              onClick={onClose}
              aria-label="Cerrar búsqueda"
              className="text-text-muted hover:text-text dark:hover:text-gray-200"
            >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-4 text-center text-text-muted dark:text-gray-400 text-sm">Buscando...</div>
          )}
          {!loading && query.length > 1 && results.length === 0 && (
            <div className="p-4 text-center text-text-muted dark:text-gray-400 text-sm">
              No se encontraron resultados para "{query}"
            </div>
          )}
          {!loading && results.length > 0 && (
            <ul>
              {results.map((result) => (
                <li key={result.id}>
                  <button
                    onClick={() => handleSelect(result)}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-background dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <span className="mt-0.5">{iconForType(result.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text dark:text-gray-100 truncate">{result.title}</p>
                      <p className="text-xs text-text-muted dark:text-gray-400 truncate">{result.subtitle}</p>
                    </div>
                    <span className="text-xs text-text-muted dark:text-gray-500 whitespace-nowrap">
                      {labelForType(result.type)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {!query && (
            <div className="p-6 text-center text-text-muted dark:text-gray-400 text-sm">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>Escribe para buscar pacientes, historias y citas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
