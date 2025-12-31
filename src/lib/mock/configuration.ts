/**
 * Datos mock de configuración
 * Preferencias de notificación y sesiones activas
 */

// ============================================
// TIPOS
// ============================================

export interface NotificationPreferences {
  criticalIncidents: boolean;
  materialDeviations: boolean;
  newIncidents: boolean;
  incidentClosure: boolean;
  summaryFrequency: "never" | "daily" | "weekly";
  notificationEmail: string;
  pushEnabled: boolean;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

// ============================================
// PREFERENCIAS DE NOTIFICACIÓN
// ============================================

export const mockNotificationPreferences: NotificationPreferences = {
  criticalIncidents: true,
  materialDeviations: true,
  newIncidents: false,
  incidentClosure: true,
  summaryFrequency: "daily",
  notificationEmail: "juan.perez@constructora-demo.com",
  pushEnabled: true,
};

// ============================================
// SESIONES ACTIVAS
// ============================================

export const mockActiveSessions: ActiveSession[] = [
  {
    id: "session-001",
    device: "Desktop",
    browser: "Chrome",
    os: "Windows 11",
    location: "Ciudad de México, MX",
    lastActive: new Date().toISOString(),
    isCurrent: true,
  },
  {
    id: "session-002",
    device: "Mobile",
    browser: "Safari",
    os: "iOS 17",
    location: "Ciudad de México, MX",
    lastActive: "2024-12-24T14:30:00Z",
    isCurrent: false,
  },
  {
    id: "session-003",
    device: "Desktop",
    browser: "Chrome",
    os: "macOS Sonoma",
    location: "Guadalajara, MX",
    lastActive: "2024-12-21T09:15:00Z",
    isCurrent: false,
  },
];

// ============================================
// HELPERS
// ============================================

export function getNotificationPreferences(): NotificationPreferences {
  return { ...mockNotificationPreferences };
}

export function getActiveSessions(): ActiveSession[] {
  return [...mockActiveSessions];
}

export function getCurrentSession(): ActiveSession | undefined {
  return mockActiveSessions.find((s) => s.isCurrent);
}

export function getOtherSessions(): ActiveSession[] {
  return mockActiveSessions.filter((s) => !s.isCurrent);
}
