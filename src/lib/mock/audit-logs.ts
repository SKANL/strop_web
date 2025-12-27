/**
 * Datos mock de logs de auditoría
 * Basado en REQUIREMENTS_V2.md Sección 2.8
 */

import type { AuditLog, AuditAction, AuditResourceType } from "./types";

// ============================================
// CONSTANTE: ID de organización por defecto
// ============================================
const DEFAULT_ORG_ID = "org-001";

// ============================================
// LOGS DE AUDITORÍA MOCK
// ============================================

/**
 * Logs de auditoría del sistema
 * Registra todas las acciones importantes de usuarios
 */
export const mockAuditLogs: AuditLog[] = [
  // ============================================
  // ACCIONES DE HOY (26 Diciembre 2024)
  // ============================================
  {
    id: "audit-001",
    organizationId: DEFAULT_ORG_ID,
    userId: "user-002",
    action: "CREATE",
    resourceType: "incident",
    resourceId: "inc-001",
    details: {
      title: "Fisura en muro de carga nivel 8",
      type: "STRUCTURAL",
      priority: "URGENT",
      projectId: "proj-001",
    },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    createdAt: "2024-12-26T09:15:00Z",
  },
  {
    id: "audit-002",
    organizationId: DEFAULT_ORG_ID,
    userId: "user-005",
    action: "CREATE",
    resourceType: "photo",
    resourceId: "photo-001",
    details: {
      incidentId: "inc-001",
      fileName: "fisura_muro_n8_001.jpg",
      fileSize: "2.4MB",
      hasGps: true,
      coordinates: { lat: 19.4326, lng: -99.1332 },
    },
    ipAddress: "10.0.0.45",
    userAgent: "Strop-Mobile/2.1.0 (iOS 17.2)",
    createdAt: "2024-12-26T09:17:00Z",
  },
  {
    id: "audit-003",
    organizationId: DEFAULT_ORG_ID,
    userId: "user-003",
    action: "UPDATE",
    resourceType: "incident",
    resourceId: "inc-001",
    details: {
      field: "status",
      oldValue: "OPEN",
      newValue: "ASSIGNED",
      assignedTo: "user-005",
    },
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X) Safari/17.2",
    createdAt: "2024-12-26T10:30:00Z",
  },
  {
    id: "audit-004",
    organizationId: DEFAULT_ORG_ID,
    userId: "user-001",
    action: "LOGIN",
    resourceType: "user",
    resourceId: "user-001",
    details: {
      method: "password",
      success: true,
      mfaUsed: false,
    },
    ipAddress: "189.203.45.67",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0",
    createdAt: "2024-12-26T08:00:00Z",
  },
  {
    id: "audit-005",
    organizationId: DEFAULT_ORG_ID,
    userId: "user-002",
    action: "UPDATE",
    resourceType: "critical_path",
    resourceId: "cpi-003",
    details: {
      field: "progressPercentage",
      oldValue: 60,
      newValue: 65,
      activityName: "Estructura niveles 6-15",
    },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    createdAt: "2024-12-26T11:45:00Z",
  },

  // ============================================
  // ACCIONES DE AYER (25 Diciembre 2024)
  // ============================================
  {
    id: "audit-006",
    organizationId: DEFAULT_ORG_ID,
    userId: "user-004",
    action: "CREATE",
    resourceType: "comment",
    resourceId: "comment-001",
    details: {
      incidentId: "inc-001",
      commentType: "TEXT",
      preview: "Se requiere evaluación estructural inmediata...",
    },
    ipAddress: "10.0.0.50",
    userAgent: "Strop-Mobile/2.1.0 (Android 14)",
    createdAt: "2024-12-25T14:20:00Z",
  },
  {
    id: "audit-007",
    organizationId: DEFAULT_ORG_ID,
    userId: "user-003",
    action: "UPDATE",
    resourceType: "project",
    resourceId: "proj-002",
    details: {
      field: "status",
      oldValue: "ACTIVE",
      newValue: "ACTIVE",
      description: "Actualización de porcentaje de avance a 62%",
    },
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X) Safari/17.2",
    createdAt: "2024-12-25T16:00:00Z",
  },
  {
    id: "audit-008",
    organizationId: DEFAULT_ORG_ID,
    userId: "user-006",
    action: "CREATE",
    resourceType: "incident",
    resourceId: "inc-003",
    details: {
      title: "Retraso en suministro de acero estructural",
      type: "MATERIALS",
      priority: "NORMAL",
      projectId: "proj-003",
    },
    ipAddress: "10.0.0.60",
    userAgent: "Strop-Mobile/2.1.0 (iOS 17.1)",
    createdAt: "2024-12-25T11:30:00Z",
  },

  // ============================================
  // ACCIONES DE LA SEMANA PASADA
  // ============================================
  {
    id: "audit-009",
    organizationId: DEFAULT_ORG_ID,
    userId: "user-001",
    action: "CREATE",
    resourceType: "user",
    resourceId: "user-009",
    details: {
      email: "nuevo.residente@constructoraejemplo.com",
      role: "RESIDENT",
      projectAssigned: "proj-004",
    },
    ipAddress: "189.203.45.67",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0",
    createdAt: "2024-12-20T09:00:00Z",
  },
  {
    id: "audit-010",
    organizationId: DEFAULT_ORG_ID,
    userId: "user-001",
    action: "UPDATE",
    resourceType: "organization",
    resourceId: "org-001",
    details: {
      field: "settings",
      changes: ["logoUrl", "primaryColor"],
      description: "Actualización de branding corporativo",
    },
    ipAddress: "189.203.45.67",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0",
    createdAt: "2024-12-19T15:30:00Z",
  },
  {
    id: "audit-011",
    organizationId: DEFAULT_ORG_ID,
    userId: "user-002",
    action: "UPDATE",
    resourceType: "incident",
    resourceId: "inc-005",
    details: {
      field: "status",
      oldValue: "ASSIGNED",
      newValue: "CLOSED",
      resolution: "Problema corregido satisfactoriamente",
    },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    createdAt: "2024-12-18T17:45:00Z",
  },
  {
    id: "audit-012",
    organizationId: DEFAULT_ORG_ID,
    userId: "user-003",
    action: "CREATE",
    resourceType: "project",
    resourceId: "proj-005",
    details: {
      name: "Hospital Regional Querétaro",
      budget: 85000000,
      startDate: "2024-09-01",
      endDate: "2026-05-31",
    },
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X) Safari/17.2",
    createdAt: "2024-12-15T10:00:00Z",
  },
  {
    id: "audit-013",
    organizationId: DEFAULT_ORG_ID,
    userId: "user-007",
    action: "DELETE",
    resourceType: "photo",
    resourceId: "photo-deleted-001",
    details: {
      reason: "Imagen duplicada",
      incidentId: "inc-003",
      fileName: "acero_duplicado.jpg",
    },
    ipAddress: "10.0.0.70",
    userAgent: "Strop-Mobile/2.1.0 (Android 14)",
    createdAt: "2024-12-17T13:20:00Z",
  },

  // ============================================
  // ACCIONES DEL MES PASADO
  // ============================================
  {
    id: "audit-014",
    organizationId: DEFAULT_ORG_ID,
    userId: "user-001",
    action: "CREATE",
    resourceType: "project_member",
    resourceId: "pm-016",
    details: {
      userId: "user-008",
      projectId: "proj-003",
      role: "CABO",
    },
    ipAddress: "189.203.45.67",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0",
    createdAt: "2024-11-28T11:00:00Z",
  },
  {
    id: "audit-015",
    organizationId: DEFAULT_ORG_ID,
    userId: "user-002",
    action: "UPDATE",
    resourceType: "critical_path",
    resourceId: "cpi-002",
    details: {
      field: "status",
      oldValue: "IN_PROGRESS",
      newValue: "COMPLETED",
      activityName: "Estructura niveles 1-5",
    },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    createdAt: "2024-11-05T17:00:00Z",
  },
  {
    id: "audit-016",
    organizationId: DEFAULT_ORG_ID,
    userId: "user-003",
    action: "EXPORT",
    resourceType: "report",
    resourceId: "report-001",
    details: {
      reportType: "incidents_summary",
      format: "PDF",
      dateRange: "2024-10-01 to 2024-10-31",
      projectId: "proj-001",
    },
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X) Safari/17.2",
    createdAt: "2024-11-02T09:30:00Z",
  },
  {
    id: "audit-017",
    organizationId: DEFAULT_ORG_ID,
    userId: "user-001",
    action: "LOGIN",
    resourceType: "user",
    resourceId: "user-001",
    details: {
      method: "oauth",
      provider: "google",
      success: true,
    },
    ipAddress: "201.158.78.45",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1) Safari/605.1",
    createdAt: "2024-11-01T08:15:00Z",
  },

  // ============================================
  // INTENTOS FALLIDOS Y EVENTOS DE SEGURIDAD
  // ============================================
  {
    id: "audit-018",
    organizationId: DEFAULT_ORG_ID,
    userId: undefined,
    action: "LOGIN",
    resourceType: "user",
    resourceId: undefined,
    details: {
      method: "password",
      success: false,
      attemptedEmail: "admin@constructoraejemplo.com",
      failReason: "Invalid password",
      attemptCount: 3,
    },
    ipAddress: "45.67.89.123",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0",
    createdAt: "2024-12-24T02:30:00Z",
  },
  {
    id: "audit-019",
    organizationId: DEFAULT_ORG_ID,
    userId: "user-009",
    action: "UPDATE",
    resourceType: "user",
    resourceId: "user-009",
    details: {
      field: "password",
      description: "Cambio de contraseña por usuario",
    },
    ipAddress: "10.0.0.90",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    createdAt: "2024-12-23T16:45:00Z",
  },
  {
    id: "audit-020",
    organizationId: DEFAULT_ORG_ID,
    userId: "user-001",
    action: "DELETE",
    resourceType: "user",
    resourceId: "user-deleted-001",
    details: {
      email: "exempleado@constructoraejemplo.com",
      reason: "Terminación de contrato",
      softDelete: true,
    },
    ipAddress: "189.203.45.67",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0",
    createdAt: "2024-12-22T14:00:00Z",
  },

  // ============================================
  // OTRAS ORGANIZACIONES (org-002)
  // ============================================
  {
    id: "audit-021",
    organizationId: "org-002",
    userId: "user-ext-001",
    action: "LOGIN",
    resourceType: "user",
    resourceId: "user-ext-001",
    details: {
      method: "password",
      success: true,
      mfaUsed: true,
    },
    ipAddress: "200.45.67.89",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    createdAt: "2024-12-26T07:00:00Z",
  },
  {
    id: "audit-022",
    organizationId: "org-002",
    userId: "user-ext-001",
    action: "CREATE",
    resourceType: "incident",
    resourceId: "inc-ext-001",
    details: {
      title: "Problema eléctrico en bodega",
      type: "ELECTRICAL",
      priority: "NORMAL",
      projectId: "proj-ext-001",
    },
    ipAddress: "200.45.67.89",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    createdAt: "2024-12-26T07:30:00Z",
  },

  // ============================================
  // EVENTOS DE SISTEMA
  // ============================================
  {
    id: "audit-023",
    organizationId: DEFAULT_ORG_ID,
    userId: undefined, // Sistema
    action: "CREATE",
    resourceType: "report",
    resourceId: "report-auto-001",
    details: {
      type: "scheduled_backup",
      description: "Respaldo automático de base de datos",
      status: "success",
      sizeBytes: 15728640,
    },
    ipAddress: "127.0.0.1",
    userAgent: "Strop-System/1.0",
    createdAt: "2024-12-26T03:00:00Z",
  },
  {
    id: "audit-024",
    organizationId: DEFAULT_ORG_ID,
    userId: undefined, // Sistema
    action: "UPDATE",
    resourceType: "organization",
    resourceId: "org-001",
    details: {
      type: "subscription_renewal",
      plan: "enterprise",
      billingPeriod: "annual",
      nextRenewal: "2025-12-26",
    },
    ipAddress: "127.0.0.1",
    userAgent: "Strop-Billing/1.0",
    createdAt: "2024-12-26T00:00:01Z",
  },
  {
    id: "audit-025",
    organizationId: DEFAULT_ORG_ID,
    userId: "user-003",
    action: "EXPORT",
    resourceType: "report",
    resourceId: "report-002",
    details: {
      reportType: "critical_path_gantt",
      format: "XLSX",
      projectId: "proj-001",
      dateGenerated: "2024-12-25T10:00:00Z",
    },
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X) Safari/17.2",
    createdAt: "2024-12-25T10:00:00Z",
  },
];

// ============================================
// HELPERS
// ============================================

/**
 * Obtiene log de auditoría por ID
 */
export function getAuditLogById(id: string): AuditLog | undefined {
  return mockAuditLogs.find((log) => log.id === id);
}

/**
 * Obtiene logs de auditoría por organización
 */
export function getAuditLogsByOrganization(organizationId: string): AuditLog[] {
  return mockAuditLogs
    .filter((log) => log.organizationId === organizationId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Obtiene logs de auditoría por usuario
 */
export function getAuditLogsByUser(userId: string): AuditLog[] {
  return mockAuditLogs
    .filter((log) => log.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Obtiene logs de auditoría por tipo de recurso
 */
export function getAuditLogsByResourceType(
  organizationId: string,
  resourceType: AuditResourceType
): AuditLog[] {
  return mockAuditLogs
    .filter(
      (log) => log.organizationId === organizationId && log.resourceType === resourceType
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Obtiene logs de auditoría por acción
 */
export function getAuditLogsByAction(
  organizationId: string,
  action: AuditAction
): AuditLog[] {
  return mockAuditLogs
    .filter((log) => log.organizationId === organizationId && log.action === action)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Obtiene logs de auditoría por rango de fechas
 */
export function getAuditLogsByDateRange(
  organizationId: string,
  startDate: Date,
  endDate: Date
): AuditLog[] {
  return mockAuditLogs
    .filter((log) => {
      const logDate = new Date(log.createdAt);
      return (
        log.organizationId === organizationId &&
        logDate >= startDate &&
        logDate <= endDate
      );
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Obtiene logs de auditoría para un recurso específico
 */
export function getAuditLogsForResource(
  resourceType: AuditResourceType,
  resourceId: string
): AuditLog[] {
  return mockAuditLogs
    .filter((log) => log.resourceType === resourceType && log.resourceId === resourceId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Cuenta acciones por tipo para una organización
 */
export function countActionsByType(organizationId: string): Record<AuditAction, number> {
  const logs = getAuditLogsByOrganization(organizationId);
  return {
    CREATE: logs.filter((l) => l.action === "CREATE").length,
    UPDATE: logs.filter((l) => l.action === "UPDATE").length,
    DELETE: logs.filter((l) => l.action === "DELETE").length,
    LOGIN: logs.filter((l) => l.action === "LOGIN").length,
    LOGOUT: logs.filter((l) => l.action === "LOGOUT").length,
    EXPORT: logs.filter((l) => l.action === "EXPORT").length,
    IMPORT: logs.filter((l) => l.action === "IMPORT").length,
    VIEW: logs.filter((l) => l.action === "VIEW").length,
  };
}

/**
 * Obtiene resumen de actividad para dashboard
 */
export function getActivitySummary(organizationId: string): {
  totalActions: number;
  todayActions: number;
  weekActions: number;
  topUsers: Array<{ userId: string; count: number }>;
  actionBreakdown: Record<AuditAction, number>;
} {
  const logs = getAuditLogsByOrganization(organizationId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  // Contar acciones por usuario
  const userCounts: Record<string, number> = {};
  logs.forEach((log) => {
    if (log.userId) {
      userCounts[log.userId] = (userCounts[log.userId] || 0) + 1;
    }
  });

  // Top 5 usuarios más activos
  const topUsers = Object.entries(userCounts)
    .map(([userId, count]) => ({ userId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalActions: logs.length,
    todayActions: logs.filter((l) => new Date(l.createdAt) >= today).length,
    weekActions: logs.filter((l) => new Date(l.createdAt) >= weekAgo).length,
    topUsers,
    actionBreakdown: countActionsByType(organizationId),
  };
}

/**
 * Obtiene intentos de login fallidos
 */
export function getFailedLoginAttempts(
  organizationId: string,
  hours: number = 24
): AuditLog[] {
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - hours);

  return mockAuditLogs.filter(
    (log) =>
      log.organizationId === organizationId &&
      log.action === "LOGIN" &&
      log.details?.success === false &&
      new Date(log.createdAt) >= cutoff
  );
}

/**
 * Obtiene actividad reciente paginada
 */
export function getRecentActivity(
  organizationId: string,
  page: number = 1,
  limit: number = 10
): { logs: AuditLog[]; total: number; pages: number } {
  const logs = getAuditLogsByOrganization(organizationId);
  const total = logs.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;

  return {
    logs: logs.slice(start, start + limit),
    total,
    pages,
  };
}
