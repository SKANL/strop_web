/**
 * Datos mock de asignaciones de usuarios a proyectos
 * Basado en REQUIREMENTS_V2.md Sección 2.3
 */

import type { ProjectMember, ProjectRole } from "./types";
import { getUserById } from "./users";
import { getProjectById } from "./projects";

// ============================================
// CONSTANTE: ID de organización por defecto
// ============================================
const DEFAULT_ORG_ID = "org-001";

// ============================================
// ASIGNACIONES MOCK
// ============================================

/**
 * Asignaciones de usuarios a proyectos
 * Nota: OWNER (user-001) tiene acceso a todos los proyectos automáticamente
 */
export const mockProjectMembers: ProjectMember[] = [
  // ============================================
  // PROYECTO 1: Torre Residencial Norte
  // ============================================
  {
    id: "pm-001",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-001",
    userId: "user-002", // Carlos Mendoza
    assignedRole: "SUPERINTENDENT",
    assignedAt: "2024-05-20T10:00:00Z",
    assignedBy: "user-001",
    removedAt: undefined,
  },
  {
    id: "pm-002",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-001",
    userId: "user-003", // María García
    assignedRole: "RESIDENT",
    assignedAt: "2024-05-21T09:00:00Z",
    assignedBy: "user-002",
    removedAt: undefined,
  },
  {
    id: "pm-003",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-001",
    userId: "user-004", // Roberto Sánchez
    assignedRole: "CABO",
    assignedAt: "2024-05-22T08:00:00Z",
    assignedBy: "user-003",
    removedAt: undefined,
  },
  {
    id: "pm-004",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-001",
    userId: "user-005", // Ana López
    assignedRole: "RESIDENT",
    assignedAt: "2024-06-01T10:00:00Z",
    assignedBy: "user-002",
    removedAt: undefined,
  },

  // ============================================
  // PROYECTO 2: Centro Comercial Plaza Sur
  // ============================================
  {
    id: "pm-005",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-002",
    userId: "user-002", // Carlos Mendoza
    assignedRole: "SUPERINTENDENT",
    assignedAt: "2024-03-01T10:00:00Z",
    assignedBy: "user-001",
    removedAt: undefined,
  },
  {
    id: "pm-006",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-002",
    userId: "user-003", // María García
    assignedRole: "RESIDENT",
    assignedAt: "2024-03-05T09:00:00Z",
    assignedBy: "user-002",
    removedAt: undefined,
  },
  {
    id: "pm-007",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-002",
    userId: "user-004", // Roberto Sánchez
    assignedRole: "CABO",
    assignedAt: "2024-03-10T08:00:00Z",
    assignedBy: "user-003",
    removedAt: undefined,
  },
  {
    id: "pm-008",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-002",
    userId: "user-006", // Pedro Ramírez
    assignedRole: "CABO",
    assignedAt: "2024-04-15T07:00:00Z",
    assignedBy: "user-003",
    removedAt: undefined,
  },

  // ============================================
  // PROYECTO 3: Complejo Industrial Bajío
  // ============================================
  {
    id: "pm-009",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-003",
    userId: "user-008", // Fernando Ortiz (inactivo)
    assignedRole: "SUPERINTENDENT",
    assignedAt: "2024-07-15T10:00:00Z",
    assignedBy: "user-001",
    removedAt: undefined, // Aún asignado aunque el usuario está inactivo
  },
  {
    id: "pm-010",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-003",
    userId: "user-007", // Laura Torres
    assignedRole: "RESIDENT",
    assignedAt: "2024-07-20T09:00:00Z",
    assignedBy: "user-008",
    removedAt: undefined,
  },
  {
    id: "pm-011",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-003",
    userId: "user-006", // Pedro Ramírez
    assignedRole: "CABO",
    assignedAt: "2024-08-01T08:00:00Z",
    assignedBy: "user-007",
    removedAt: undefined,
  },

  // ============================================
  // PROYECTO 4: Edificio Corporativo Polanco
  // ============================================
  {
    id: "pm-012",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-004",
    userId: "user-002", // Carlos Mendoza
    assignedRole: "SUPERINTENDENT",
    assignedAt: "2023-12-15T10:00:00Z",
    assignedBy: "user-001",
    removedAt: undefined,
  },
  {
    id: "pm-013",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-004",
    userId: "user-009", // Diana Herrera
    assignedRole: "RESIDENT",
    assignedAt: "2024-01-05T09:00:00Z",
    assignedBy: "user-002",
    removedAt: undefined,
  },

  // ============================================
  // PROYECTO 5: Hospital Regional Querétaro
  // ============================================
  {
    id: "pm-014",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-005",
    userId: "user-002", // Carlos Mendoza
    assignedRole: "SUPERINTENDENT",
    assignedAt: "2024-08-20T10:00:00Z",
    assignedBy: "user-001",
    removedAt: undefined,
  },
  {
    id: "pm-015",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-005",
    userId: "user-005", // Ana López
    assignedRole: "RESIDENT",
    assignedAt: "2024-08-25T09:00:00Z",
    assignedBy: "user-002",
    removedAt: undefined,
  },
  {
    id: "pm-016",
    organizationId: DEFAULT_ORG_ID,
    projectId: "proj-005",
    userId: "user-007", // Laura Torres
    assignedRole: "RESIDENT",
    assignedAt: "2024-09-01T09:00:00Z",
    assignedBy: "user-002",
    removedAt: undefined,
  },
];

// ============================================
// HELPERS
// ============================================

/**
 * Obtiene asignación por ID
 */
export function getProjectMemberById(id: string): ProjectMember | undefined {
  return mockProjectMembers.find((pm) => pm.id === id);
}

/**
 * Obtiene miembros de un proyecto
 */
export function getProjectMembers(projectId: string): ProjectMember[] {
  return mockProjectMembers.filter(
    (pm) => pm.projectId === projectId && !pm.removedAt
  );
}

/**
 * Obtiene miembros de un proyecto con datos de usuario
 */
export function getProjectMembersWithDetails(projectId: string): Array<{
  member: ProjectMember;
  user: ReturnType<typeof getUserById>;
}> {
  return getProjectMembers(projectId).map((member) => ({
    member,
    user: getUserById(member.userId),
  }));
}

/**
 * Obtiene proyectos de un usuario
 */
export function getUserProjects(userId: string): ProjectMember[] {
  return mockProjectMembers.filter(
    (pm) => pm.userId === userId && !pm.removedAt
  );
}

/**
 * Obtiene proyectos de un usuario con datos de proyecto
 */
export function getUserProjectsWithDetails(userId: string): Array<{
  member: ProjectMember;
  project: ReturnType<typeof getProjectById>;
}> {
  return getUserProjects(userId).map((member) => ({
    member,
    project: getProjectById(member.projectId),
  }));
}

/**
 * Verifica si un usuario tiene acceso a un proyecto
 */
export function hasProjectAccess(userId: string, projectId: string): boolean {
  const user = getUserById(userId);
  
  // OWNER tiene acceso a todos los proyectos de su organización
  if (user?.role === "OWNER") {
    const project = getProjectById(projectId);
    return project?.organizationId === user.organizationId;
  }
  
  // Otros roles solo si están asignados
  return mockProjectMembers.some(
    (pm) => pm.userId === userId && pm.projectId === projectId && !pm.removedAt
  );
}

/**
 * Obtiene el rol de un usuario en un proyecto específico
 */
export function getUserRoleInProject(
  userId: string,
  projectId: string
): ProjectRole | "OWNER" | undefined {
  const user = getUserById(userId);
  
  if (!user) return undefined;
  
  // OWNER siempre tiene rol de OWNER
  if (user.role === "OWNER") {
    return "OWNER";
  }
  
  const membership = mockProjectMembers.find(
    (pm) => pm.userId === userId && pm.projectId === projectId && !pm.removedAt
  );
  
  return membership?.assignedRole;
}

/**
 * Cuenta miembros por rol en un proyecto
 */
export function countMembersByRole(projectId: string): Record<ProjectRole, number> {
  const members = getProjectMembers(projectId);
  return {
    SUPERINTENDENT: members.filter((m) => m.assignedRole === "SUPERINTENDENT").length,
    RESIDENT: members.filter((m) => m.assignedRole === "RESIDENT").length,
    CABO: members.filter((m) => m.assignedRole === "CABO").length,
  };
}
