import { useState, useEffect, useRef } from 'react';
import { Upload, X, ZoomIn, FileText, Trash2 } from 'lucide-react';
import { db } from '../db/database';
import type { Attachment } from '../db/database';

interface ImageAttachmentProps {
  pacienteId: number;
  historiaId?: number;
  onCountChange?: (count: number) => void;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const ImageAttachment = ({ pacienteId, historiaId, onCountChange }: ImageAttachmentProps) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxName, setLightboxName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadAttachments = async () => {
    const query = db.attachments.where('pacienteId').equals(pacienteId);
    if (historiaId) {
      const all = await query.toArray();
      const filtered = all.filter((a) => a.historiaId === historiaId);
      setAttachments(filtered);
      onCountChange?.(filtered.length);
    } else {
      const all = await query.toArray();
      setAttachments(all);
      onCountChange?.(all.length);
    }
  };

  useEffect(() => {
    loadAttachments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacienteId, historiaId]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        if (file.size > MAX_FILE_SIZE_BYTES) {
          alert(`El archivo "${file.name}" supera el límite de 5MB.`);
          continue;
        }
        if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
          alert(`Tipo de archivo no permitido: ${file.name}. Solo JPG, PNG o PDF.`);
          continue;
        }
        const base64Data = await fileToBase64(file);
        await db.attachments.add({
          pacienteId,
          historiaId,
          fileName: file.name,
          fileType: file.type,
          base64Data,
          description,
          uploadDate: new Date().toISOString().split('T')[0],
        });
      }
      setDescription('');
      await loadAttachments();
    } catch {
      alert('Error al subir el archivo.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este adjunto?')) return;
    await db.attachments.delete(id);
    await loadAttachments();
  };

  return (
    <div>
      {/* Upload area */}
      <div className="mb-4 p-4 border-2 border-dashed border-border dark:border-gray-600 rounded-xl">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex-1">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción (opcional)"
              className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg text-sm bg-surface dark:bg-gray-700 text-text dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors text-sm disabled:opacity-50 min-h-[44px]"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Subiendo...' : 'Subir archivo'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <p className="text-xs text-text-muted dark:text-gray-400 mt-2">
          JPG, PNG o PDF • Máximo 5MB por archivo
        </p>
      </div>

      {/* Gallery */}
      {attachments.length === 0 ? (
        <p className="text-sm text-text-muted dark:text-gray-400 text-center py-4">
          No hay archivos adjuntos
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="relative group rounded-lg overflow-hidden border border-border dark:border-gray-600 bg-background dark:bg-gray-700"
            >
              {att.fileType.startsWith('image/') ? (
                <img
                  src={att.base64Data}
                  alt={att.fileName}
                  className="w-full h-24 object-cover cursor-pointer"
                  onClick={() => {
                    setLightboxSrc(att.base64Data);
                    setLightboxName(att.fileName);
                  }}
                />
              ) : (
                <div className="w-full h-24 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                  <FileText className="w-8 h-8 text-text-muted" />
                </div>
              )}
              <div className="p-2">
                <p className="text-xs text-text dark:text-gray-200 truncate" title={att.fileName}>
                  {att.fileName}
                </p>
                {att.description && (
                  <p className="text-xs text-text-muted dark:text-gray-400 truncate">{att.description}</p>
                )}
                <p className="text-xs text-text-muted dark:text-gray-500">{att.uploadDate}</p>
              </div>
              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {att.fileType.startsWith('image/') && (
                  <button
                    onClick={() => {
                      setLightboxSrc(att.base64Data);
                      setLightboxName(att.fileName);
                    }}
                    className="p-1 bg-black/60 text-white rounded min-w-[24px] min-h-[24px] flex items-center justify-center"
                  >
                    <ZoomIn className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => att.id && handleDelete(att.id)}
                  className="p-1 bg-danger text-white rounded min-w-[24px] min-h-[24px] flex items-center justify-center"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxSrc(null)}
        >
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxSrc(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxSrc}
              alt={lightboxName}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <p className="text-white text-center mt-2 text-sm">{lightboxName}</p>
          </div>
        </div>
      )}
    </div>
  );
};
