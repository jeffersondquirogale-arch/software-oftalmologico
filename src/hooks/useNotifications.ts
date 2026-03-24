import { useState, useEffect, useCallback } from 'react';
import { db } from '../db/database';

export interface Notification {
  id: string;
  type: 'cita_hoy' | 'cita_proxima' | 'seguimiento';
  title: string;
  message: string;
  timestamp: string;
  link: string;
  read: boolean;
}

const DISMISSED_KEY = 'optisalud_dismissed_notifications';

function getDismissed(): Set<string> {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch {
    // ignore
  }
  return new Set();
}

function saveDismissed(ids: Set<string>) {
  localStorage.setItem(DISMISSED_KEY, JSON.stringify([...ids]));
}

const FOLLOW_UP_THRESHOLD_DAYS = 180;

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(getDismissed);

  const loadNotifications = useCallback(async () => {
    const now = new Date();
    const hoy = now.toISOString().split('T')[0];
    const manana = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const hace6meses = new Date(now.getTime() - FOLLOW_UP_THRESHOLD_DAYS * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const notifs: Notification[] = [];

    // Citas de hoy pendientes
    const citasHoy = await db.citas
      .where('fecha')
      .equals(hoy)
      .filter((c) => c.estado === 'pendiente')
      .toArray();

    for (const cita of citasHoy) {
      const paciente = await db.pacientes.get(cita.pacienteId);
      const id = `cita_hoy_${cita.id}`;
      if (!dismissed.has(id)) {
        notifs.push({
          id,
          type: 'cita_hoy',
          title: 'Cita pendiente hoy',
          message: `${paciente ? paciente.nombres + ' ' + paciente.apellidos : 'Paciente'} a las ${cita.hora}`,
          timestamp: new Date().toISOString(),
          link: '/citas',
          read: false,
        });
      }
    }

    // Citas próximas (24h)
    const citasProximas = await db.citas
      .where('fecha')
      .equals(manana)
      .filter((c) => c.estado === 'pendiente' || c.estado === 'confirmada')
      .toArray();

    for (const cita of citasProximas) {
      const paciente = await db.pacientes.get(cita.pacienteId);
      const id = `cita_proxima_${cita.id}`;
      if (!dismissed.has(id)) {
        notifs.push({
          id,
          type: 'cita_proxima',
          title: 'Cita mañana',
          message: `${paciente ? paciente.nombres + ' ' + paciente.apellidos : 'Paciente'} a las ${cita.hora}`,
          timestamp: new Date().toISOString(),
          link: '/citas',
          read: false,
        });
      }
    }

    // Pacientes sin visita en 6+ meses
    const pacientes = await db.pacientes.toArray();
    for (const paciente of pacientes.slice(0, 20)) {
      if (!paciente.id) continue;
      const ultimaHistoria = await db.historiasClinicas
        .where('pacienteId')
        .equals(paciente.id)
        .last();
      if (!ultimaHistoria || ultimaHistoria.fecha < hace6meses) {
        const id = `seguimiento_${paciente.id}`;
        if (!dismissed.has(id)) {
          notifs.push({
            id,
            type: 'seguimiento',
            title: 'Recordatorio de seguimiento',
            message: `${paciente.nombres} ${paciente.apellidos} sin visita en 6+ meses`,
            timestamp: new Date().toISOString(),
            link: `/pacientes/${paciente.id}`,
            read: false,
          });
        }
      }
    }

    setNotifications(notifs);
  }, [dismissed]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const dismiss = useCallback((id: string) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveDismissed(next);
      return next;
    });
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    const ids = new Set(notifications.map((n) => n.id));
    setDismissed((prev) => {
      const next = new Set([...prev, ...ids]);
      saveDismissed(next);
      return next;
    });
    setNotifications([]);
  }, [notifications]);

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    dismiss,
    dismissAll,
    reload: loadNotifications,
  };
}
