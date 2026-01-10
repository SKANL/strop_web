import { atom, computed } from 'nanostores';

export type NotificationType = 
  | 'MENTION' 
  | 'PROJECT_UPDATE' 
  | 'SYSTEM' 
  | 'ASSIGNMENT' 
  | 'CRITICAL';
  // 'DEVIATION' eliminado del MVP - relacionado con materiales

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
  projectId?: string;
  actor?: {
    name: string;
    avatar?: string;
  };
}

// Mock initial data
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'MENTION',
    title: 'Nueva mención',
    message: '@JuanP Perez te mencionó en "Incidencia #123 - Grieta en muro"',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
    isRead: false,
    link: '/incidents/123',
    projectId: 'p1',
    actor: {
      name: 'Juan Perez',
      avatar: 'JP'
    }
  },
  {
    id: '2',
    type: 'ASSIGNMENT',
    title: 'Nueva asignación',
    message: 'Se te ha asignado la tarea "Revisión de planos estructurales"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    isRead: false,
    link: '/projects/p1/tasks/t456',
    projectId: 'p1'
  },
  {
    id: '3',
    type: 'PROJECT_UPDATE',
    title: 'Actualización de Proyecto',
    message: 'El proyecto "Torre Reforma" ha cambiado de estado a "En Progreso"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isRead: true,
    projectId: 'p2'
  },
  {
    id: '4',
    type: 'SYSTEM',
    title: 'Bienvenido',
    message: 'Bienvenido al sistema de administración de Strop',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    isRead: true
  },
  // Example critical notifications for demo
  {
    id: '5',
    type: 'CRITICAL',
    title: '⚠️ Incidencia Crítica',
    message: 'Nueva incidencia crítica reportada en proyecto "Torre Norte" - Falla estructural',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    isRead: false,
    link: '/dashboard/incidencias',
    projectId: 'p1'
  }
  // Notificación DEVIATION eliminada del MVP - relacionada con materiales
];

// Atoms
export const $notifications = atom<Notification[]>(INITIAL_NOTIFICATIONS);

// Computed - All unread
export const $unreadCount = computed($notifications, notifications => 
  notifications.filter(n => !n.isRead).length
);

export const $unreadNotifications = computed($notifications, notifications => 
  notifications.filter(n => !n.isRead)
);

// Computed - Urgent (CRITICAL type)
export const $urgentNotifications = computed($notifications, notifications =>
  notifications.filter(n => 
    n.type === 'CRITICAL' && !n.isRead
    // DEVIATION removido del MVP
  )
);

export const $urgentCount = computed($urgentNotifications, urgent => urgent.length);

// Actions
export function markAsRead(id: string) {
  $notifications.set(
    $notifications.get().map(n => 
      n.id === id ? { ...n, isRead: true } : n
    )
  );
}

export function markAllAsRead() {
  $notifications.set(
    $notifications.get().map(n => ({ ...n, isRead: true }))
  );
}

export function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) {
  const newNotification: Notification = {
    ...notification,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    isRead: false
  };
  
  $notifications.set([newNotification, ...$notifications.get()]);
}

export function removeNotification(id: string) {
  $notifications.set(
    $notifications.get().filter(n => n.id !== id)
  );
}

/**
 * Add a critical incident/delay alert notification
 */
export function addCriticalAlert(
  title: string,
  message: string,
  projectId: string,
  link?: string
) {
  addNotification({
    type: 'CRITICAL',
    title: `⚠️ ${title}`,
    message,
    link: link ?? `/dashboard/proyectos/${projectId}`,
    projectId,
  });
}

// addDeviationAlert eliminado del MVP - relacionado con materiales
