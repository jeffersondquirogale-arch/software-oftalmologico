import type { HistoriaClinica } from '../../db/database';
import { S } from './tabStyles';
interface MotivoTabProps { historia: Partial<HistoriaClinica>; setHistoria: (h: Partial<HistoriaClinica>) => void; }
export const MotivoTab = ({ historia, setHistoria }: MotivoTabProps) => (
  <div>
    <p style={S.title}>Motivo de Consulta</p>
    <p style={S.subtitle}>Describa el motivo principal de la visita</p>
    <label style={S.label}>Motivo <span style={{ color: 'var(--danger)' }}>*</span></label>
    <textarea value={historia.motivoConsulta || ''} onChange={(e) => setHistoria({ ...historia, motivoConsulta: e.target.value })} rows={6} placeholder="Ej: Paciente refiere visión borrosa..." style={S.textarea} onFocus={S.onFocus} onBlur={S.onBlur}/>
  </div>
);