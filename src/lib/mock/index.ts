/**
 * Datos mock centralizados - Strop SaaS
 * Basado en REQUIREMENTS_V2.md
 * 
 * Estructura modular:
 * - types.ts: Interfaces y tipos TypeScript
 * - organizations.ts: Datos de organizaciones (tenants)
 * - users.ts: Datos de usuarios
 * - projects.ts: Datos de proyectos/obras
 * - project-members.ts: Asignaciones de usuarios a proyectos
 * - incidents.ts: Datos de incidencias
 * - photos.ts: Fotografías/evidencia
 * - comments.ts: Comentarios de incidencias
 */

// ============================================
// TIPOS E INTERFACES
// ============================================
export * from "./types";

// ============================================
// DATOS MOCK
// ============================================
export * from "./organizations";
export * from "./users";
export * from "./projects";
export * from "./project-members";
export * from "./incidents";
export * from "./photos";
export * from "./comments";
export * from "./auth";

// ============================================
// RE-EXPORTS CON NOMBRES ESPECÍFICOS
// ============================================

// Datos principales para uso rápido
export { mockOrganization } from "./organizations";
export { mockCurrentUser, mockUsers } from "./users";
export { mockProjects, mockProjectsWithStats } from "./projects";
export { mockProjectMembers } from "./project-members";
export { mockIncidents, mockIncidentsWithDetails } from "./incidents";
export { mockPhotos } from "./photos";
export { mockComments } from "./comments";

// ============================================
// DATOS UI ADICIONALES (Notificaciones, Actividad, KPIs)
// ============================================

import type { Notification, Activity, KPIData } from "./types";
import { getProjectKPIs } from "./projects";
import { getIncidentKPIs } from "./incidents";
import { getUsersByOrganization } from "./users";

/**
 * Notificaciones mock para el dashboard
 */
export const mockNotifications: Notification[] = [
  {
    id: "notif-001",
    title: "Incidencia Crítica",
    message: "Nueva incidencia CRÍTICA en Torre Residencial Norte: Falla estructural en columna C-15",
    type: "critical",
    time: "Hace 2h",
    read: false,
    relatedId: "inc-001",
    relatedType: "incident",
  },
  {
    id: "notif-002",
    title: "Retraso en Material",
    message: "Proveedor de acero reporta retraso de 5 días para Complejo Industrial Bajío",
    type: "warning",
    time: "Hace 5h",
    read: false,
    relatedId: "inc-005",
    relatedType: "incident",
  },
  {
    id: "notif-003",
    title: "Proyecto Actualizado",
    message: "Centro Comercial Plaza Sur alcanzó 62% de avance",
    type: "info",
    time: "Hace 1d",
    read: true,
    relatedId: "proj-002",
    relatedType: "project",
  },
  {
    id: "notif-004",
    title: "Nuevo Usuario",
    message: "Laura Torres se unió al equipo de Complejo Industrial Bajío",
    type: "info",
    time: "Hace 2d",
    read: true,
    relatedId: "user-007",
    relatedType: "user",
  },
];

/**
 * Actividad reciente mock para el feed
 */
export const mockActivity: Activity[] = [
  {
    id: "act-001",
    action: "creó incidencia crítica en",
    userId: "user-002",
    userName: "Carlos Mendoza",
    userAvatar: "https://api.dicebear.com/8.x/initials/svg?seed=CM",
    target: "Torre Residencial Norte",
    targetId: "proj-001",
    timestamp: "Hace 2 horas",
    type: "incident",
  },
  {
    id: "act-002",
    action: "asignó incidencia a",
    userId: "user-003",
    userName: "María García",
    userAvatar: "https://api.dicebear.com/8.x/initials/svg?seed=MG",
    target: "Roberto Sánchez",
    targetId: "user-004",
    timestamp: "Hace 5 horas",
    type: "incident",
  },
  {
    id: "act-003",
    action: "actualizó progreso de",
    userId: "system",
    userName: "Sistema",
    target: "Centro Comercial Plaza Sur (62%)",
    targetId: "proj-002",
    timestamp: "Hace 1 día",
    type: "project",
  },
  {
    id: "act-004",
    action: "cerró incidencia",
    userId: "user-001",
    userName: "Juan Pérez García",
    userAvatar: "https://api.dicebear.com/8.x/initials/svg?seed=JPG",
    target: "Consulta de acabados - Polanco",
    targetId: "inc-006",
    timestamp: "Hace 1 día",
    type: "incident",
  },
  {
    id: "act-005",
    action: "agregó usuario",
    userId: "user-001",
    userName: "Admin",
    target: "Laura Torres (Residente)",
    targetId: "user-007",
    timestamp: "Hace 2 días",
    type: "user",
  },
  {
    id: "act-006",
    action: "subió documentación a",
    userId: "user-005",
    userName: "Ana López",
    userAvatar: "https://api.dicebear.com/8.x/initials/svg?seed=AL",
    target: "Torre Residencial Norte",
    targetId: "proj-001",
    timestamp: "Hace 2 días",
    type: "project",
  },
  {
    id: "act-007",
    action: "solicitó materiales para",
    userId: "user-006",
    userName: "Pedro Ramírez",
    userAvatar: "https://api.dicebear.com/8.x/initials/svg?seed=PR",
    target: "Complejo Industrial Bajío",
    targetId: "proj-003",
    timestamp: "Hace 3 días",
    type: "incident",
  },
];

/**
 * Genera KPIs consolidados para el dashboard
 */
export function getMockKPIs(organizationId: string = "org-001"): KPIData {
  const projectKPIs = getProjectKPIs(organizationId);
  const incidentKPIs = getIncidentKPIs(organizationId);
  const users = getUsersByOrganization(organizationId);

  return {
    totalProjects: projectKPIs.total,
    activeProjects: projectKPIs.active,
    totalIncidents: incidentKPIs.total,
    openIncidents: incidentKPIs.open + incidentKPIs.assigned,
    criticalIncidents: incidentKPIs.critical,
    resolvedThisWeek: incidentKPIs.resolvedThisWeek,
    avgResolutionTime: "2.5 días", // Mock estático
    totalUsers: users.length,
  };
}

/**
 * KPIs estáticos para uso rápido
 */
export const mockKPIs: KPIData = getMockKPIs("org-001");

// ============================================
// DATOS TRANSFORMADOS PARA UI (Compatibilidad)
// ============================================

import type { ProjectUI, IncidentUI, UserUI, ActivityUI } from "./types";
import { mockProjectsWithStats } from "./projects";
import { mockIncidentsWithDetails } from "./incidents";
import { mockUsers as rawMockUsers, mockCurrentUser as rawMockCurrentUser } from "./users";
import { mockOrganization as rawMockOrganization } from "./organizations";

/**
 * Proyectos en formato UI
 */
export const mockProjectsUI: ProjectUI[] = mockProjectsWithStats.map((p) => ({
  id: p.id,
  name: p.name,
  location: p.location,
  status: p.status,
  startDate: p.startDate,
  endDate: p.endDate,
  progress: p.progress,
  totalIncidents: p.totalIncidents,
  openIncidents: p.openIncidents,
  criticalIncidents: p.criticalIncidents,
  membersCount: p.membersCount,
  budget: p.budget,
  budgetSpent: p.budgetSpent,
  description: p.description,
  coverImageUrl: p.coverImageUrl,
}));

/**
 * Incidencias en formato UI
 */
export const mockIncidentsUI: IncidentUI[] = mockIncidentsWithDetails.map((i) => ({
  id: i.id,
  type: i.type,
  description: i.description,
  priority: i.priority,
  status: i.status,
  projectId: i.projectId,
  projectName: i.projectName,
  createdBy: i.createdByName,
  createdByAvatar: i.createdByAvatar,
  createdAt: i.createdAt,
  assignedTo: i.assignedToName,
  assignedToAvatar: i.assignedToAvatar,
  closedAt: i.closedAt,
  closingNote: i.closedNotes,
  gpsLat: i.gpsLat,
  gpsLng: i.gpsLng,
}));

/**
 * Usuarios en formato UI
 */
export const mockUsersUI: UserUI[] = rawMockUsers.map((u) => ({
  id: u.id,
  name: u.fullName,
  email: u.email,
  role: u.role,
  avatarUrl: u.profilePictureUrl,
  isActive: u.isActive,
  phone: u.phone,
  lastActiveAt: u.lastLogin,
}));

/**
 * Usuario actual en formato UI
 */
export const mockCurrentUserUI: UserUI = {
  id: rawMockCurrentUser.id,
  name: rawMockCurrentUser.fullName,
  email: rawMockCurrentUser.email,
  role: rawMockCurrentUser.role,
  avatarUrl: rawMockCurrentUser.profilePictureUrl,
  isActive: rawMockCurrentUser.isActive,
  phone: rawMockCurrentUser.phone,
  lastActiveAt: rawMockCurrentUser.lastLogin,
};

/**
 * Actividad en formato UI
 */
export const mockActivityUI: ActivityUI[] = mockActivity.map((a) => ({
  id: a.id,
  action: a.action,
  user: a.userName,
  userAvatar: a.userAvatar,
  target: a.target,
  timestamp: a.timestamp,
  type: a.type,
}));

/**
 * Organización simplificada para UI
 */
export const mockOrganizationUI = {
  id: rawMockOrganization.id,
  name: rawMockOrganization.name,
  slug: rawMockOrganization.slug,
  plan: rawMockOrganization.plan,
  logoUrl: rawMockOrganization.logoUrl,
};
