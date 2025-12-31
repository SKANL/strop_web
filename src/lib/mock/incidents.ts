/**
 * Datos mock de incidencias
 * Basado en REQUIREMENTS_V2.md Sección 2.4
 */

import type { Incident, IncidentWithDetails } from "./types";
import { getUserById } from "./users";
import { getProjectById } from "./projects";
import { getPhotosByIncident } from "./photos";
import { getCommentsByIncident } from "./comments";

// ============================================
// CONSTANTE: ID de organización por defecto
// ============================================
const DEFAULT_ORG_ID = "org-001";

// ============================================
// INCIDENCIAS MOCK (Datos base según schema)
// ============================================

/**
 * Incidencias base (solo campos del schema de BD)
 */
export const mockIncidents: Incident[] = [
  {
    id: "inc-001",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-001",
    createdBy: "user-002", // Carlos Mendoza
    type: "INCIDENT_NOTIFICATIONS",
    description: "Falla estructural detectada en columna C-15 del nivel 3. Se requiere evaluación inmediata por parte del ingeniero estructural.",
    priority: "CRITICAL",
    status: "OPEN",
    assignedTo: undefined,
    createdAt: "2024-12-26T08:30:00Z",
    updatedAt: "2024-12-26T08:30:00Z",
    closedAt: undefined,
    closedBy: undefined,
    locationName: "Nivel 3, Zona A, Columna C-15",
    gpsLat: 19.4326,
    gpsLng: -99.1332,
    closedNotes: undefined,
    isImmutable: false,
    deletedAt: undefined,
  },
  {
    id: "inc-002",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-002",
    createdBy: "user-003", // María García
    type: "MATERIAL_REQUEST",
    description: "Solicitud de 500 sacos de cemento Portland para cimentación zona B. Urgente para continuar con el avance programado.",
    priority: "NORMAL",
    status: "ASSIGNED",
    assignedTo: "user-004", // Roberto Sánchez
    createdAt: "2024-12-25T14:15:00Z",
    updatedAt: "2024-12-25T16:00:00Z",
    closedAt: undefined,
    closedBy: undefined,
    locationName: "Zona B, Área de cimentación",
    gpsLat: 25.6866,
    gpsLng: -100.3161,
    closedNotes: undefined,
    isImmutable: false,
    deletedAt: undefined,
  },
  {
    id: "inc-003",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-001",
    createdBy: "user-005", // Ana López
    type: "ORDERS_INSTRUCTIONS",
    description: "Modificación en planos de instalación eléctrica nivel 5. Actualizar antes de continuar con el cableado según nueva especificación del cliente.",
    priority: "NORMAL",
    status: "OPEN",
    assignedTo: undefined,
    createdAt: "2024-12-25T11:45:00Z",
    updatedAt: "2024-12-25T11:45:00Z",
    closedAt: undefined,
    closedBy: undefined,
    locationName: "Nivel 5, Instalaciones eléctricas",
    gpsLat: 19.4328,
    gpsLng: -99.1330,
    closedNotes: undefined,
    isImmutable: false,
    deletedAt: undefined,
  },
  {
    id: "inc-004",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-003",
    createdBy: "user-006", // Pedro Ramírez
    type: "CERTIFICATIONS",
    description: "Certificación de calidad de concreto f'c=250 requerida para losa nivel 8. Laboratorio debe realizar pruebas antes del colado.",
    priority: "NORMAL",
    status: "ASSIGNED",
    assignedTo: "user-007", // Laura Torres
    createdAt: "2024-12-24T16:00:00Z",
    updatedAt: "2024-12-24T18:30:00Z",
    closedAt: undefined,
    closedBy: undefined,
    locationName: "Nave Industrial 3, Losa nivel 8",
    gpsLat: 21.1619,
    gpsLng: -101.6860,
    closedNotes: undefined,
    isImmutable: false,
    deletedAt: undefined,
  },
  {
    id: "inc-005",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-003",
    createdBy: "user-008", // Fernando Ortiz
    type: "INCIDENT_NOTIFICATIONS",
    description: "Retraso en entrega de acero estructural. Proveedor reporta 5 días de demora por problemas logísticos. Afecta cronograma de armado.",
    priority: "CRITICAL",
    status: "OPEN",
    assignedTo: undefined,
    createdAt: "2024-12-24T09:20:00Z",
    updatedAt: "2024-12-24T09:20:00Z",
    closedAt: undefined,
    closedBy: undefined,
    locationName: "Almacén de materiales",
    gpsLat: 21.1620,
    gpsLng: -101.6855,
    closedNotes: undefined,
    isImmutable: false,
    deletedAt: undefined,
  },
  {
    id: "inc-006",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-004",
    createdBy: "user-009", // Diana Herrera
    type: "REQUESTS_QUERIES",
    description: "Consulta sobre especificaciones de acabados para área de recepción. Cliente solicita cambio de material en piso.",
    priority: "NORMAL",
    status: "CLOSED",
    assignedTo: "user-001", // Juan Pérez (OWNER)
    createdAt: "2024-12-23T13:30:00Z",
    updatedAt: "2024-12-24T10:00:00Z",
    closedAt: "2024-12-24T10:00:00Z",
    closedBy: "user-001",
    locationName: "Planta baja, Área de recepción",
    gpsLat: 19.4362,
    gpsLng: -99.1945,
    closedNotes: "Especificaciones enviadas por correo electrónico al cliente. Se aprueba cambio de porcelanato por mármol según cotización adjunta.",
    isImmutable: true,
    deletedAt: undefined,
  },
  {
    id: "inc-007",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-001",
    createdBy: "user-004", // Roberto Sánchez
    type: "MATERIAL_REQUEST",
    description: "Solicitud de 200 varillas de acero corrugado #4 para armado de columnas del nivel 4.",
    priority: "NORMAL",
    status: "CLOSED",
    assignedTo: "user-002",
    createdAt: "2024-12-22T10:00:00Z",
    updatedAt: "2024-12-23T14:00:00Z",
    closedAt: "2024-12-23T14:00:00Z",
    closedBy: "user-002",
    locationName: "Nivel 4, Zona de columnas",
    gpsLat: 19.4325,
    gpsLng: -99.1333,
    closedNotes: "Material entregado en sitio. Verificada cantidad y calidad por almacenista.",
    isImmutable: true,
    deletedAt: undefined,
  },
  {
    id: "inc-008",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-005",
    createdBy: "user-007", // Laura Torres
    type: "ORDERS_INSTRUCTIONS",
    description: "Instrucción para modificar trazo de ductos de aire acondicionado en quirófanos según nueva normativa hospitalaria.",
    priority: "CRITICAL",
    status: "ASSIGNED",
    assignedTo: "user-005", // Ana López
    createdAt: "2024-12-25T08:00:00Z",
    updatedAt: "2024-12-25T10:30:00Z",
    closedAt: undefined,
    closedBy: undefined,
    locationName: "Segundo piso, Área de quirófanos",
    gpsLat: 20.5888,
    gpsLng: -100.3899,
    closedNotes: undefined,
    isImmutable: false,
    deletedAt: undefined,
  },
];

// ============================================
// INCIDENCIAS CON DETALLES (Para UI)
// ============================================

/**
 * Simple hash function to generate deterministic pseudo-random values from a string
 * This ensures the same value is generated on SSR and client
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Genera incidencias con datos denormalizados
 */
export function getIncidentsWithDetails(): IncidentWithDetails[] {
  return mockIncidents.map((incident) => {
    const createdByUser = getUserById(incident.createdBy);
    const assignedToUser = incident.assignedTo ? getUserById(incident.assignedTo) : undefined;
    const project = getProjectById(incident.projectId);
    
    // Use deterministic values based on incident ID to avoid hydration mismatch
    const hash = simpleHash(incident.id);
    const photosCount = (hash % 5) + 1; // 1-5 fotos
    const commentsCount = (hash >> 4) % 10; // 0-9 comentarios

    return {
      ...incident,
      projectName: project?.name ?? "Proyecto desconocido",
      createdByName: createdByUser?.fullName ?? "Usuario desconocido",
      createdByAvatar: createdByUser?.profilePictureUrl,
      assignedToName: assignedToUser?.fullName,
      assignedToAvatar: assignedToUser?.profilePictureUrl,
      photosCount,
      commentsCount,
    };
  });
}

/**
 * Cache de incidencias con detalles
 */
export const mockIncidentsWithDetails: IncidentWithDetails[] = getIncidentsWithDetails();

// ============================================
// HELPERS
// ============================================

/**
 * Obtiene incidencia por ID
 */
export function getIncidentById(id: string): Incident | undefined {
  return mockIncidents.find((incident) => incident.id === id);
}

/**
 * Obtiene incidencia con detalles por ID
 */
export function getIncidentWithDetailsById(id: string): IncidentWithDetails | undefined {
  return mockIncidentsWithDetails.find((incident) => incident.id === id);
}

/**
 * Obtiene incidencias de una organización
 */
export function getIncidentsByOrganization(organizationId: string): Incident[] {
  return mockIncidents.filter(
    (incident) => incident.organizationId === organizationId && !incident.deletedAt
  );
}

/**
 * Obtiene incidencias de un proyecto (solo datos base)
 */
function getIncidentsByProjectBase(projectId: string): Incident[] {
  return mockIncidents.filter(
    (incident) => incident.projectId === projectId && !incident.deletedAt
  );
}

/**
 * Obtiene incidencias por estado
 */
export function getIncidentsByStatus(
  organizationId: string,
  status: Incident["status"]
): Incident[] {
  return mockIncidents.filter(
    (incident) =>
      incident.organizationId === organizationId &&
      incident.status === status &&
      !incident.deletedAt
  );
}

/**
 * Obtiene incidencias críticas abiertas
 */
export function getCriticalOpenIncidents(organizationId: string): Incident[] {
  return mockIncidents.filter(
    (incident) =>
      incident.organizationId === organizationId &&
      incident.priority === "CRITICAL" &&
      incident.status !== "CLOSED" &&
      !incident.deletedAt
  );
}

/**
 * Obtiene incidencias asignadas a un usuario
 */
export function getIncidentsAssignedToUser(userId: string): Incident[] {
  return mockIncidents.filter(
    (incident) => incident.assignedTo === userId && !incident.deletedAt
  );
}

/**
 * Cuenta incidencias por estado
 */
export function countIncidentsByStatus(
  organizationId: string
): Record<Incident["status"], number> {
  const incidents = getIncidentsByOrganization(organizationId);
  return {
    OPEN: incidents.filter((i) => i.status === "OPEN").length,
    ASSIGNED: incidents.filter((i) => i.status === "ASSIGNED").length,
    CLOSED: incidents.filter((i) => i.status === "CLOSED").length,
  };
}

/**
 * Calcula KPIs de incidencias
 */
export function getIncidentKPIs(organizationId: string): {
  total: number;
  open: number;
  assigned: number;
  closed: number;
  critical: number;
  resolvedThisWeek: number;
} {
  const incidents = getIncidentsByOrganization(organizationId);
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const resolvedThisWeek = incidents.filter(
    (i) => i.status === "CLOSED" && i.closedAt && new Date(i.closedAt) >= oneWeekAgo
  ).length;

  return {
    total: incidents.length,
    open: incidents.filter((i) => i.status === "OPEN").length,
    assigned: incidents.filter((i) => i.status === "ASSIGNED").length,
    closed: incidents.filter((i) => i.status === "CLOSED").length,
    critical: incidents.filter((i) => i.priority === "CRITICAL" && i.status !== "CLOSED").length,
    resolvedThisWeek,
  };
}

/**
 * Obtiene incidencias de un proyecto con detalles para UI
 */
export function getIncidentsByProject(projectId: string): IncidentWithDetails[] {
  const projectIncidents = mockIncidents.filter(
    (incident) => incident.projectId === projectId && !incident.deletedAt
  );
  
  return projectIncidents.map((incident) => {
    const creator = getUserById(incident.createdBy);
    const assignee = incident.assignedTo ? getUserById(incident.assignedTo) : undefined;
    const project = getProjectById(incident.projectId);
    const photos = getPhotosByIncident(incident.id);
    const comments = getCommentsByIncident(incident.id);
    
    return {
      ...incident,
      projectName: project?.name || "Proyecto desconocido",
      createdByName: creator?.fullName || "Usuario desconocido",
      createdByAvatar: creator?.profilePictureUrl,
      assignedToName: assignee?.fullName,
      assignedToAvatar: assignee?.profilePictureUrl,
      photosCount: photos?.length || 0,
      commentsCount: comments?.length || 0,
    };
  });
}
