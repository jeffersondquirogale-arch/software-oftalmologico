import { useState, useEffect } from 'react';
import { Download, Upload, AlertTriangle, CheckCircle, Plus, Edit2, Trash2, UserCheck, Eye } from 'lucide-react';
import { db } from '../db/database';
import type { Doctor } from '../db/database';

interface BackupData {
  version: string;
  exportedAt: string;
  pacientes: unknown[];
  historiasClinicas: unknown[];
  citas: unknown[];
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid var(--border)',
  borderRadius: '10px', fontSize: '14px', color: 'var(--text)',
  background: 'var(--background)', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '12px', fontWeight: 600,
  color: 'var(--text-muted)', letterSpacing: '0.06em',
  textTransform: 'uppercase', marginBottom: '6px',
};

const EMPTY_DOCTOR: Omit<Doctor, 'id'> = {
  nombre: '', apellidos: '', tp: '', rm: '',
  especialidad: 'Optómetra', telefono: '', email: '',
  direccion: '', eslogan: 'MEJORAR TU VISIÓN ES MI MISIÓN', activo: false,
};

export const Configuracion = () => {
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editDoctor, setEditDoctor] = useState<Partial<Doctor>>(EMPTY_DOCTOR);
  const [isEditing, setIsEditing] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [importStatus, setImportStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [importMessage, setImportMessage] = useState('');

  useEffect(() => { loadDoctores(); }, []);

  const loadDoctores = async () => {
    const list = await db.doctores.toArray();
    setDoctores(list);
  };

  const handleSaveDoctor = async () => {
    if (!editDoctor.nombre || !editDoctor.tp) {
      alert('Nombre y TP son obligatorios');
      return;
    }
    if (isEditing && editDoctor.id) {
      await db.doctores.update(editDoctor.id, editDoctor);
    } else {
      await db.doctores.add(editDoctor as Doctor);
    }
    setShowModal(false);
    setEditDoctor(EMPTY_DOCTOR);
    loadDoctores();
  };

  const handleSetActivo = async (doctor: Doctor) => {
    // Desactivar todos
    await Promise.all(doctores.map(d => db.doctores.update(d.id!, { activo: false })));
    // Activar el seleccionado
    await db.doctores.update(doctor.id!, { activo: true });
    loadDoctores();
    alert(`Perfil de ${doctor.nombre} ${doctor.apellidos} activado. Los documentos usarán este perfil.`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este perfil?')) return;
    await db.doctores.delete(id);
    loadDoctores();
  };

  const handleExport = async () => {
    setExportStatus('loading');
    try {
      const [pacientes, historiasClinicas, citas] = await Promise.all([
        db.pacientes.toArray(), db.historiasClinicas.toArray(), db.citas.toArray(),
      ]);
      const backup: BackupData = { version: '1.0', exportedAt: new Date().toISOString(), pacientes, historiasClinicas, citas };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `optisalud_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 3000);
    } catch { setExportStatus('error'); setTimeout(() => setExportStatus('idle'), 3000); }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    e.target.value = ''; setImportStatus('loading');
    try {
      const data = JSON.parse(await file.text()) as BackupData;
      if (!data.pacientes || !data.historiasClinicas || !data.citas) throw new Error('Formato inválido');
      if (!confirm(`¿Restaurar respaldo del ${new Date(data.exportedAt).toLocaleDateString('es-CO')}? Esto reemplazará todos los datos.`)) { setImportStatus('idle'); return; }
      await db.transaction('rw', [db.pacientes, db.historiasClinicas, db.citas], async () => {
        await db.pacientes.clear(); await db.historiasClinicas.clear(); await db.citas.clear();
        if (data.pacientes.length > 0) await db.pacientes.bulkAdd(data.pacientes as any);
        if (data.historiasClinicas.length > 0) await db.historiasClinicas.bulkAdd(data.historiasClinicas as any);
        if (data.citas.length > 0) await db.citas.bulkAdd(data.citas as any);
      });
      setImportMessage(`Restauración exitosa: ${data.pacientes.length} pacientes, ${data.historiasClinicas.length} historias, ${data.citas.length} citas.`);
      setImportStatus('success'); setTimeout(() => setImportStatus('idle'), 5000);
    } catch (err) {
      setImportMessage(err instanceof Error ? err.message : 'Error al procesar el archivo.');
      setImportStatus('error'); setTimeout(() => setImportStatus('idle'), 5000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: 'var(--primary)' }}>Configuración</h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>Gestione perfiles de doctores y respaldos del sistema</p>
      </div>

      {/* PERFILES DE DOCTORES */}
      <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: 'var(--primary)' }}>Perfiles de Doctores</h3>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>El perfil activo aparece en todos los documentos impresos</p>
          </div>
          <button onClick={() => { setEditDoctor(EMPTY_DOCTOR); setIsEditing(false); setShowModal(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', background: 'var(--primary)', color: 'white', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            <Plus style={{ width: '16px', height: '16px' }} /> Nuevo Perfil
          </button>
        </div>

        {doctores.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Eye style={{ width: '32px', height: '32px', opacity: 0.4, margin: '0 auto 12px' }} />
            <p style={{ margin: 0 }}>No hay perfiles creados. Crea el primero.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {doctores.map((doc, idx) => (
              <div key={doc.id} style={{ padding: '16px 24px', borderBottom: idx < doctores.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', background: doc.activo ? 'rgba(76,201,122,0.05)' : 'transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: doc.activo ? 'rgba(76,201,122,0.15)' : 'rgba(26,58,92,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Eye style={{ width: '20px', height: '20px', color: doc.activo ? '#4cc97a' : 'var(--primary)' }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '15px', color: 'var(--text)' }}>Dr. {doc.nombre} {doc.apellidos}</p>
                      {doc.activo && <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: 'rgba(76,201,122,0.15)', color: '#4cc97a' }}>ACTIVO</span>}
                    </div>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                      {doc.especialidad} &nbsp;|&nbsp; TP: {doc.tp} &nbsp;|&nbsp; RM: {doc.rm}
                    </p>
                    {doc.eslogan && <p style={{ margin: '1px 0 0', fontSize: '11px', color: '#c9a84c', fontStyle: 'italic' }}>{doc.eslogan}</p>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  {!doc.activo && (
                    <button onClick={() => handleSetActivo(doc)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(76,201,122,0.4)', background: 'transparent', color: '#4cc97a', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                      <UserCheck style={{ width: '14px', height: '14px' }} /> Activar
                    </button>
                  )}
                  <button onClick={() => { setEditDoctor(doc); setIsEditing(true); setShowModal(true); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                    <Edit2 style={{ width: '14px', height: '14px' }} /> Editar
                  </button>
                  <button onClick={() => handleDelete(doc.id!)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(192,57,43,0.3)', background: 'transparent', color: 'var(--danger)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                    <Trash2 style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RESPALDOS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(76,154,201,0.1)' }}>
              <Download style={{ width: '20px', height: '20px', color: '#4c9ac9' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--primary)' }}>Exportar Respaldo</h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Descarga todos los datos en JSON</p>
            </div>
          </div>
          <button onClick={handleExport} disabled={exportStatus === 'loading'}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', background: '#4c9ac9', color: 'white', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', opacity: exportStatus === 'loading' ? 0.6 : 1 }}>
            <Download style={{ width: '15px', height: '15px' }} />
            {exportStatus === 'loading' ? 'Exportando...' : 'Descargar JSON'}
          </button>
          {exportStatus === 'success' && <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#4cc97a', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle style={{ width: '14px', height: '14px' }} /> Descargado exitosamente</p>}
          {exportStatus === 'error' && <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle style={{ width: '14px', height: '14px' }} /> Error al exportar</p>}
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(201,168,76,0.1)' }}>
              <Upload style={{ width: '20px', height: '20px', color: '#c9a84c' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--primary)' }}>Restaurar Respaldo</h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Carga un archivo JSON de respaldo</p>
            </div>
          </div>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', background: '#c9a84c', color: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            <Upload style={{ width: '15px', height: '15px' }} />
            {importStatus === 'loading' ? 'Restaurando...' : 'Seleccionar JSON'}
            <input type="file" accept=".json" onChange={handleImport} disabled={importStatus === 'loading'} style={{ display: 'none' }} />
          </label>
          {importStatus === 'success' && <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#4cc97a' }}>{importMessage}</p>}
          {importStatus === 'error' && <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--danger)' }}>{importMessage}</p>}
        </div>
      </div>

      {/* MODAL DOCTOR */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '32px', maxWidth: '500px', width: '100%', border: '1px solid var(--border)', boxShadow: '0 24px 64px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: 'var(--primary)' }}>
              {isEditing ? 'Editar Perfil' : 'Nuevo Perfil de Doctor'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Nombre *', field: 'nombre', placeholder: 'Juan D.' },
                { label: 'Apellidos *', field: 'apellidos', placeholder: 'Lozada S.' },
                { label: 'TP (Tarjeta Profesional) *', field: 'tp', placeholder: '1.010.201.450' },
                { label: 'RM (Registro Matrícula) *', field: 'rm', placeholder: '3945 CTNPO' },
                { label: 'Especialidad', field: 'especialidad', placeholder: 'Optómetra F.U.A.A.' },
                { label: 'Teléfono', field: 'telefono', placeholder: '601308844' },
                { label: 'Email', field: 'email', placeholder: 'doctor@email.com' },
              ].map(({ label, field, placeholder }) => (
                <div key={field} style={{ gridColumn: field === 'email' ? '1/-1' : 'auto' }}>
                  <label style={labelStyle}>{label}</label>
                  <input type="text" value={(editDoctor as any)[field] || ''} placeholder={placeholder}
                    onChange={(e) => setEditDoctor({ ...editDoctor, [field]: e.target.value })}
                    style={inputStyle}
                    onFocus={e => (e.target as HTMLElement).style.borderColor = '#c9a84c'}
                    onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'} />
                </div>
              ))}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Dirección consultorio</label>
                <input type="text" value={editDoctor.direccion || ''} placeholder="Calle 123 #45-67"
                  onChange={(e) => setEditDoctor({ ...editDoctor, direccion: e.target.value })}
                  style={inputStyle}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = '#c9a84c'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Eslogan</label>
                <input type="text" value={editDoctor.eslogan || ''} placeholder="MEJORAR TU VISIÓN ES MI MISIÓN"
                  onChange={(e) => setEditDoctor({ ...editDoctor, eslogan: e.target.value })}
                  style={inputStyle}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = '#c9a84c'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button onClick={() => setShowModal(false)}
                style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                Cancelar
              </button>
              <button onClick={handleSaveDoctor}
                style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: 'white', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                {isEditing ? 'Guardar Cambios' : 'Crear Perfil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
