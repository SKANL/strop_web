import { atom, computed } from 'nanostores';

export type NotificationType = 
  | 'MENTION' 
  | 'PROJECT_UPDATE' 
  | 'SYSTEM' 
  | 'ASSIGNMENT' 
  | 'CRITICAL' 
  | 'DEVIATION';

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
  // Example critical/deviation notifications for demo
  {
    id: '5',
    type: 'CRITICAL',
    title: '⚠️ Retraso Crítico',
    message: 'La actividad "Cimentación" en proyecto "Torre Norte" tiene retraso de 5 días',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    isRead: false,
    link: '/projects/p1/timeline',
    projectId: 'p1'
  },
  {
    id: '6',
    type: 'DEVIATION',
    title: '📊 Desviación de Material',
    message: 'Cemento Portland: Solicitado 1,200 sacos vs Planeado 1,000 sacos (+20%)',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 min ago
    isRead: false,
    link: '/projects/p1/materials',
    projectId: 'p1'
  }
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

// Computed - Urgent (CRITICAL or DEVIATION type)
export const $urgentNotifications = computed($notifications, notifications =>
  notifications.filter(n => 
    (n.type === 'CRITICAL' || n.type === 'DEVIATION') && !n.isRead
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
 * Add a material deviation alert notification
 * Called when requestedQuantity > plannedQuantity for any material
 */
export function addDeviationAlert(material: {
  name: string;
  requestedQuantity: number;
  plannedQuantity: number;
  unit: string;
}, projectId: string, projectName?: string) {
  const deviationPercent = Math.round(
    ((material.requestedQuantity - material.plannedQuantity) / material.plannedQuantity) * 100
  );

  addNotification({
    type: 'DEVIATION',
    title: '📊 Desviación de Material Detectada',
    message: `${material.name}: Solicitado ${material.requestedQuantity.toLocaleString()} ${material.unit} vs Planeado ${material.plannedQuantity.toLocaleString()} ${material.unit} (+${deviationPercent}%)${projectName ? ` en ${projectName}` : ''}`,
    link: `/projects/${projectId}/materials`,
    projectId,
  });
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
    link: link ?? `/projects/${projectId}`,
    projectId,
  });
}

