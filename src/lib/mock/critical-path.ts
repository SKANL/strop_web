/**
 * Datos mock de ruta crítica (cronograma de obra)
 * Basado en REQUIREMENTS_V2.md Sección 2.7
 */

import type { CriticalPathItem, CriticalPathStatus } from "./types";

// ============================================
// CONSTANTE: ID de organización por defecto
// ============================================
const DEFAULT_ORG_ID = "org-001";

// ============================================
// ITEMS DE RUTA CRÍTICA MOCK
// ============================================

/**
 * Items de ruta crítica por proyecto
 * Representa el cronograma importado desde Excel
 */
export const mockCriticalPathItems: CriticalPathItem[] = [
  // ============================================
  // PROYECTO 1: Torre Residencial Norte (45% avance)
  // ============================================
  {
    id: "cpi-001",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-001",
    activityName: "Cimentación y excavación",
    plannedStart: "2024-06-01",
    plannedEnd: "2024-08-15",
    actualStart: "2024-06-01",
    actualEnd: "2024-08-20", // 5 días de retraso
    status: "COMPLETED",
    progressPercentage: 100,
    createdAt: "2024-05-15T10:00:00Z",
    updatedAt: "2024-08-20T16:00:00Z",
    updatedBy: "user-002",
    deletedAt: undefined,
  },
  {
    id: "cpi-002",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-001",
    activityName: "Estructura niveles 1-5",
    plannedStart: "2024-08-16",
    plannedEnd: "2024-10-30",
    actualStart: "2024-08-21",
    actualEnd: "2024-11-05", // 6 días de retraso acumulado
    status: "COMPLETED",
    progressPercentage: 100,
    createdAt: "2024-05-15T10:00:00Z",
    updatedAt: "2024-11-05T17:00:00Z",
    updatedBy: "user-003",
    deletedAt: undefined,
  },
  {
    id: "cpi-003",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-001",
    activityName: "Estructura niveles 6-15",
    plannedStart: "2024-11-01",
    plannedEnd: "2025-02-28",
    actualStart: "2024-11-10",
    actualEnd: undefined,
    status: "IN_PROGRESS",
    progressPercentage: 65,
    createdAt: "2024-05-15T10:00:00Z",
    updatedAt: "2024-12-26T08:00:00Z",
    updatedBy: "user-002",
    deletedAt: undefined,
  },
  {
    id: "cpi-004",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-001",
    activityName: "Estructura niveles 16-25",
    plannedStart: "2025-03-01",
    plannedEnd: "2025-06-30",
    actualStart: undefined,
    actualEnd: undefined,
    status: "PENDING",
    progressPercentage: 0,
    createdAt: "2024-05-15T10:00:00Z",
    updatedAt: "2024-05-15T10:00:00Z",
    updatedBy: undefined,
    deletedAt: undefined,
  },
  {
    id: "cpi-005",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-001",
    activityName: "Instalaciones hidráulicas y sanitarias",
    plannedStart: "2025-04-01",
    plannedEnd: "2025-08-31",
    actualStart: undefined,
    actualEnd: undefined,
    status: "PENDING",
    progressPercentage: 0,
    createdAt: "2024-05-15T10:00:00Z",
    updatedAt: "2024-05-15T10:00:00Z",
    updatedBy: undefined,
    deletedAt: undefined,
  },
  {
    id: "cpi-006",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-001",
    activityName: "Instalaciones eléctricas",
    plannedStart: "2025-05-01",
    plannedEnd: "2025-09-30",
    actualStart: undefined,
    actualEnd: undefined,
    status: "PENDING",
    progressPercentage: 0,
    createdAt: "2024-05-15T10:00:00Z",
    updatedAt: "2024-05-15T10:00:00Z",
    updatedBy: undefined,
    deletedAt: undefined,
  },
  {
    id: "cpi-007",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-001",
    activityName: "Acabados interiores",
    plannedStart: "2025-07-01",
    plannedEnd: "2025-11-30",
    actualStart: undefined,
    actualEnd: undefined,
    status: "PENDING",
    progressPercentage: 0,
    createdAt: "2024-05-15T10:00:00Z",
    updatedAt: "2024-05-15T10:00:00Z",
    updatedBy: undefined,
    deletedAt: undefined,
  },
  {
    id: "cpi-008",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-001",
    activityName: "Fachada y exteriores",
    plannedStart: "2025-08-01",
    plannedEnd: "2025-12-15",
    actualStart: undefined,
    actualEnd: undefined,
    status: "PENDING",
    progressPercentage: 0,
    createdAt: "2024-05-15T10:00:00Z",
    updatedAt: "2024-05-15T10:00:00Z",
    updatedBy: undefined,
    deletedAt: undefined,
  },

  // ============================================
  // PROYECTO 2: Centro Comercial Plaza Sur (62% avance)
  // ============================================
  {
    id: "cpi-009",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-002",
    activityName: "Excavación y cimentación",
    plannedStart: "2024-03-15",
    plannedEnd: "2024-05-31",
    actualStart: "2024-03-15",
    actualEnd: "2024-05-28",
    status: "COMPLETED",
    progressPercentage: 100,
    createdAt: "2024-02-20T14:00:00Z",
    updatedAt: "2024-05-28T18:00:00Z",
    updatedBy: "user-003",
    deletedAt: undefined,
  },
  {
    id: "cpi-010",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-002",
    activityName: "Estructura nivel sótano",
    plannedStart: "2024-06-01",
    plannedEnd: "2024-07-31",
    actualStart: "2024-05-29",
    actualEnd: "2024-07-25",
    status: "COMPLETED",
    progressPercentage: 100,
    createdAt: "2024-02-20T14:00:00Z",
    updatedAt: "2024-07-25T17:00:00Z",
    updatedBy: "user-002",
    deletedAt: undefined,
  },
  {
    id: "cpi-011",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-002",
    activityName: "Estructura niveles 1-3",
    plannedStart: "2024-08-01",
    plannedEnd: "2024-10-31",
    actualStart: "2024-07-26",
    actualEnd: "2024-10-28",
    status: "COMPLETED",
    progressPercentage: 100,
    createdAt: "2024-02-20T14:00:00Z",
    updatedAt: "2024-10-28T16:00:00Z",
    updatedBy: "user-003",
    deletedAt: undefined,
  },
  {
    id: "cpi-012",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-002",
    activityName: "Instalaciones MEP",
    plannedStart: "2024-09-01",
    plannedEnd: "2025-01-31",
    actualStart: "2024-09-05",
    actualEnd: undefined,
    status: "IN_PROGRESS",
    progressPercentage: 80,
    createdAt: "2024-02-20T14:00:00Z",
    updatedAt: "2024-12-25T10:00:00Z",
    updatedBy: "user-004",
    deletedAt: undefined,
  },
  {
    id: "cpi-013",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-002",
    activityName: "Acabados locales comerciales",
    plannedStart: "2024-12-01",
    plannedEnd: "2025-05-31",
    actualStart: "2024-12-10",
    actualEnd: undefined,
    status: "IN_PROGRESS",
    progressPercentage: 15,
    createdAt: "2024-02-20T14:00:00Z",
    updatedAt: "2024-12-25T14:00:00Z",
    updatedBy: "user-003",
    deletedAt: undefined,
  },
  {
    id: "cpi-014",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-002",
    activityName: "Áreas comunes y paisajismo",
    plannedStart: "2025-04-01",
    plannedEnd: "2025-08-31",
    actualStart: undefined,
    actualEnd: undefined,
    status: "PENDING",
    progressPercentage: 0,
    createdAt: "2024-02-20T14:00:00Z",
    updatedAt: "2024-02-20T14:00:00Z",
    updatedBy: undefined,
    deletedAt: undefined,
  },

  // ============================================
  // PROYECTO 3: Complejo Industrial Bajío (25% avance)
  // ============================================
  {
    id: "cpi-015",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-003",
    activityName: "Preparación del terreno",
    plannedStart: "2024-08-01",
    plannedEnd: "2024-09-15",
    actualStart: "2024-08-01",
    actualEnd: "2024-09-18",
    status: "COMPLETED",
    progressPercentage: 100,
    createdAt: "2024-07-10T09:00:00Z",
    updatedAt: "2024-09-18T17:00:00Z",
    updatedBy: "user-008",
    deletedAt: undefined,
  },
  {
    id: "cpi-016",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-003",
    activityName: "Cimentación naves 1-3",
    plannedStart: "2024-09-16",
    plannedEnd: "2024-11-30",
    actualStart: "2024-09-20",
    actualEnd: "2024-12-05",
    status: "COMPLETED",
    progressPercentage: 100,
    createdAt: "2024-07-10T09:00:00Z",
    updatedAt: "2024-12-05T16:00:00Z",
    updatedBy: "user-007",
    deletedAt: undefined,
  },
  {
    id: "cpi-017",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-003",
    activityName: "Estructura metálica nave 1",
    plannedStart: "2024-12-01",
    plannedEnd: "2025-02-28",
    actualStart: "2024-12-10",
    actualEnd: undefined,
    status: "IN_PROGRESS",
    progressPercentage: 35,
    createdAt: "2024-07-10T09:00:00Z",
    updatedAt: "2024-12-26T07:00:00Z",
    updatedBy: "user-006",
    deletedAt: undefined,
  },
  {
    id: "cpi-018",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-003",
    activityName: "Estructura metálica naves 2-5",
    plannedStart: "2025-01-15",
    plannedEnd: "2025-06-30",
    actualStart: undefined,
    actualEnd: undefined,
    status: "PENDING",
    progressPercentage: 0,
    createdAt: "2024-07-10T09:00:00Z",
    updatedAt: "2024-07-10T09:00:00Z",
    updatedBy: undefined,
    deletedAt: undefined,
  },
  {
    id: "cpi-019",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-003",
    activityName: "Oficinas administrativas",
    plannedStart: "2025-04-01",
    plannedEnd: "2025-09-30",
    actualStart: undefined,
    actualEnd: undefined,
    status: "PENDING",
    progressPercentage: 0,
    createdAt: "2024-07-10T09:00:00Z",
    updatedAt: "2024-07-10T09:00:00Z",
    updatedBy: undefined,
    deletedAt: undefined,
  },
  {
    id: "cpi-020",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-003",
    activityName: "Instalaciones industriales",
    plannedStart: "2025-07-01",
    plannedEnd: "2025-12-31",
    actualStart: undefined,
    actualEnd: undefined,
    status: "PENDING",
    progressPercentage: 0,
    createdAt: "2024-07-10T09:00:00Z",
    updatedAt: "2024-07-10T09:00:00Z",
    updatedBy: undefined,
    deletedAt: undefined,
  },

  // ============================================
  // PROYECTO 4: Edificio Corporativo Polanco (78% - PAUSADO)
  // ============================================
  {
    id: "cpi-021",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-004",
    activityName: "Cimentación profunda",
    plannedStart: "2024-01-10",
    plannedEnd: "2024-03-31",
    actualStart: "2024-01-10",
    actualEnd: "2024-04-05",
    status: "COMPLETED",
    progressPercentage: 100,
    createdAt: "2023-12-01T10:00:00Z",
    updatedAt: "2024-04-05T18:00:00Z",
    updatedBy: "user-002",
    deletedAt: undefined,
  },
  {
    id: "cpi-022",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-004",
    activityName: "Estructura 12 niveles",
    plannedStart: "2024-04-01",
    plannedEnd: "2024-08-31",
    actualStart: "2024-04-10",
    actualEnd: "2024-09-15",
    status: "COMPLETED",
    progressPercentage: 100,
    createdAt: "2023-12-01T10:00:00Z",
    updatedAt: "2024-09-15T17:00:00Z",
    updatedBy: "user-003",
    deletedAt: undefined,
  },
  {
    id: "cpi-023",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-004",
    activityName: "Fachada muro cortina",
    plannedStart: "2024-07-01",
    plannedEnd: "2024-11-30",
    actualStart: "2024-07-15",
    actualEnd: "2024-12-10",
    status: "COMPLETED",
    progressPercentage: 100,
    createdAt: "2023-12-01T10:00:00Z",
    updatedAt: "2024-12-10T16:00:00Z",
    updatedBy: "user-005",
    deletedAt: undefined,
  },
  {
    id: "cpi-024",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-004",
    activityName: "Acabados interiores corporativos",
    plannedStart: "2024-10-01",
    plannedEnd: "2025-03-31",
    actualStart: "2024-10-20",
    actualEnd: undefined,
    status: "IN_PROGRESS", // Pausado pero con trabajo parcial
    progressPercentage: 45,
    createdAt: "2023-12-01T10:00:00Z",
    updatedAt: "2024-12-20T14:00:00Z",
    updatedBy: "user-009",
    deletedAt: undefined,
  },
  {
    id: "cpi-025",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-004",
    activityName: "Certificación LEED",
    plannedStart: "2025-02-01",
    plannedEnd: "2025-05-31",
    actualStart: undefined,
    actualEnd: undefined,
    status: "PENDING",
    progressPercentage: 0,
    createdAt: "2023-12-01T10:00:00Z",
    updatedAt: "2023-12-01T10:00:00Z",
    updatedBy: undefined,
    deletedAt: undefined,
  },

  // ============================================
  // PROYECTO 5: Hospital Regional Querétaro (15% avance)
  // ============================================
  {
    id: "cpi-026",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-005",
    activityName: "Demolición y limpieza del sitio",
    plannedStart: "2024-09-01",
    plannedEnd: "2024-09-30",
    actualStart: "2024-09-01",
    actualEnd: "2024-10-05",
    status: "COMPLETED",
    progressPercentage: 100,
    createdAt: "2024-08-15T08:00:00Z",
    updatedAt: "2024-10-05T17:00:00Z",
    updatedBy: "user-002",
    deletedAt: undefined,
  },
  {
    id: "cpi-027",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-005",
    activityName: "Cimentación y obra negra",
    plannedStart: "2024-10-01",
    plannedEnd: "2025-02-28",
    actualStart: "2024-10-10",
    actualEnd: undefined,
    status: "IN_PROGRESS",
    progressPercentage: 55,
    createdAt: "2024-08-15T08:00:00Z",
    updatedAt: "2024-12-26T07:00:00Z",
    updatedBy: "user-005",
    deletedAt: undefined,
  },
  {
    id: "cpi-028",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-005",
    activityName: "Estructura principal",
    plannedStart: "2025-01-15",
    plannedEnd: "2025-07-31",
    actualStart: undefined,
    actualEnd: undefined,
    status: "PENDING",
    progressPercentage: 0,
    createdAt: "2024-08-15T08:00:00Z",
    updatedAt: "2024-08-15T08:00:00Z",
    updatedBy: undefined,
    deletedAt: undefined,
  },
  {
    id: "cpi-029",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-005",
    activityName: "Instalaciones hospitalarias especiales",
    plannedStart: "2025-05-01",
    plannedEnd: "2025-12-31",
    actualStart: undefined,
    actualEnd: undefined,
    status: "PENDING",
    progressPercentage: 0,
    createdAt: "2024-08-15T08:00:00Z",
    updatedAt: "2024-08-15T08:00:00Z",
    updatedBy: undefined,
    deletedAt: undefined,
  },
  {
    id: "cpi-030",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-005",
    activityName: "Equipamiento médico y pruebas",
    plannedStart: "2026-01-01",
    plannedEnd: "2026-05-31",
    actualStart: undefined,
    actualEnd: undefined,
    status: "PENDING",
    progressPercentage: 0,
    createdAt: "2024-08-15T08:00:00Z",
    updatedAt: "2024-08-15T08:00:00Z",
    updatedBy: undefined,
    deletedAt: undefined,
  },
];

// ============================================
// HELPERS
// ============================================

/**
 * Obtiene item de ruta crítica por ID
 */
export function getCriticalPathItemById(id: string): CriticalPathItem | undefined {
  return mockCriticalPathItems.find((item) => item.id === id);
}

/**
 * Obtiene items de ruta crítica por proyecto
 */
export function getCriticalPathByProject(projectId: string): CriticalPathItem[] {
  return mockCriticalPathItems.filter(
    (item) => item.projectId === projectId && !item.deletedAt
  );
}

/**
 * Obtiene items de ruta crítica por organización
 */
export function getCriticalPathByOrganization(organizationId: string): CriticalPathItem[] {
  return mockCriticalPathItems.filter(
    (item) => item.organizationId === organizationId && !item.deletedAt
  );
}

/**
 * Obtiene items por estado
 */
export function getCriticalPathByStatus(
  projectId: string,
  status: CriticalPathStatus
): CriticalPathItem[] {
  return mockCriticalPathItems.filter(
    (item) =>
      item.projectId === projectId &&
      item.status === status &&
      !item.deletedAt
  );
}

/**
 * Calcula progreso general del proyecto basado en ruta crítica
 */
export function calculateProjectProgress(projectId: string): number {
  const items = getCriticalPathByProject(projectId);
  if (items.length === 0) return 0;

  const totalProgress = items.reduce((sum, item) => sum + item.progressPercentage, 0);
  return Math.round(totalProgress / items.length);
}

/**
 * Obtiene items retrasados (actual_end > planned_end o en progreso pasado planned_end)
 */
export function getDelayedItems(projectId: string): CriticalPathItem[] {
  const today = new Date();
  return mockCriticalPathItems.filter((item) => {
    if (item.projectId !== projectId || item.deletedAt) return false;

    // Si está completado, verificar si terminó tarde
    if (item.status === "COMPLETED" && item.actualEnd) {
      return new Date(item.actualEnd) > new Date(item.plannedEnd);
    }

    // Si está en progreso, verificar si ya pasó la fecha planeada
    if (item.status === "IN_PROGRESS") {
      return today > new Date(item.plannedEnd);
    }

    return false;
  });
}

/**
 * Obtiene resumen de ruta crítica para un proyecto
 */
export function getCriticalPathSummary(projectId: string): {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  delayed: number;
  overallProgress: number;
} {
  const items = getCriticalPathByProject(projectId);
  const delayed = getDelayedItems(projectId);

  return {
    total: items.length,
    completed: items.filter((i) => i.status === "COMPLETED").length,
    inProgress: items.filter((i) => i.status === "IN_PROGRESS").length,
    pending: items.filter((i) => i.status === "PENDING").length,
    delayed: delayed.length,
    overallProgress: calculateProjectProgress(projectId),
  };
}

/**
 * Cuenta items por status para una organización
 */
export function countCriticalPathByStatus(
  organizationId: string
): Record<CriticalPathStatus, number> {
  const items = getCriticalPathByOrganization(organizationId);
  return {
    PENDING: items.filter((i) => i.status === "PENDING").length,
    IN_PROGRESS: items.filter((i) => i.status === "IN_PROGRESS").length,
    COMPLETED: items.filter((i) => i.status === "COMPLETED").length,
  };
}
