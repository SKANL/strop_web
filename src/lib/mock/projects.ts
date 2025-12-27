/**
 * Datos mock de proyectos/obras
 * Basado en REQUIREMENTS_V2.md Sección 2.2
 */

import type { Project, ProjectWithStats } from "./types";

// ============================================
// CONSTANTE: ID de organización por defecto
// ============================================
const DEFAULT_ORG_ID = "org-001";

// ============================================
// PROYECTOS MOCK (Datos base según schema)
// ============================================

/**
 * Proyectos base (solo campos del schema de BD)
 */
export const mockProjects: Project[] = [
  {
    id: "proj-001",
    organizationId: DEFAULT_ORG_ID,
    name: "Torre Residencial Norte",
    location: "Av. Reforma 1500, CDMX",
    description: "Desarrollo de torre residencial de 25 pisos con amenidades premium.",
    startDate: "2024-06-01",
    endDate: "2025-12-31",
    status: "ACTIVE",
    createdBy: "user-001",
    ownerId: "user-002", // Superintendente Carlos Mendoza
    createdAt: "2024-05-15T10:00:00Z",
    updatedAt: "2024-12-26T08:00:00Z",
    deletedAt: undefined,
  },
  {
    id: "proj-002",
    organizationId: DEFAULT_ORG_ID,
    name: "Centro Comercial Plaza Sur",
    location: "Blvd. Insurgentes 2300, Monterrey",
    description: "Centro comercial de 3 niveles con estacionamiento subterráneo.",
    startDate: "2024-03-15",
    endDate: "2025-09-30",
    status: "ACTIVE",
    createdBy: "user-001",
    ownerId: "user-002",
    createdAt: "2024-02-20T14:00:00Z",
    updatedAt: "2024-12-25T16:00:00Z",
    deletedAt: undefined,
  },
  {
    id: "proj-003",
    organizationId: DEFAULT_ORG_ID,
    name: "Complejo Industrial Bajío",
    location: "Parque Industrial León, Guanajuato",
    description: "Complejo de 5 naves industriales con oficinas administrativas.",
    startDate: "2024-08-01",
    endDate: "2026-02-28",
    status: "ACTIVE",
    createdBy: "user-001",
    ownerId: "user-008", // Fernando Ortiz (aunque está inactivo)
    createdAt: "2024-07-10T09:00:00Z",
    updatedAt: "2024-12-24T11:00:00Z",
    deletedAt: undefined,
  },
  {
    id: "proj-004",
    organizationId: DEFAULT_ORG_ID,
    name: "Edificio Corporativo Polanco",
    location: "Campos Elíseos 345, CDMX",
    description: "Edificio corporativo de 12 pisos con certificación LEED.",
    startDate: "2024-01-10",
    endDate: "2025-06-30",
    status: "PAUSED",
    createdBy: "user-001",
    ownerId: "user-002",
    createdAt: "2023-12-01T10:00:00Z",
    updatedAt: "2024-12-20T14:00:00Z",
    deletedAt: undefined,
  },
  {
    id: "proj-005",
    organizationId: DEFAULT_ORG_ID,
    name: "Hospital Regional Querétaro",
    location: "Av. Constituyentes 890, Querétaro",
    description: "Hospital de especialidades con 200 camas y área de urgencias.",
    startDate: "2024-09-01",
    endDate: "2026-06-30",
    status: "ACTIVE",
    createdBy: "user-001",
    ownerId: "user-002",
    createdAt: "2024-08-15T08:00:00Z",
    updatedAt: "2024-12-26T07:00:00Z",
    deletedAt: undefined,
  },
];

// ============================================
// PROYECTOS CON ESTADÍSTICAS (Para UI)
// ============================================

/**
 * Proyectos con datos calculados para el dashboard
 * Estos valores se calcularían en tiempo real con queries a BD
 */
export const mockProjectsWithStats: ProjectWithStats[] = [
  {
    ...mockProjects[0],
    progress: 45,
    totalIncidents: 34,
    openIncidents: 5,
    criticalIncidents: 1,
    membersCount: 12,
    budget: 15000000,
    budgetSpent: 6750000,
    coverImageUrl: undefined,
  },
  {
    ...mockProjects[1],
    progress: 62,
    totalIncidents: 45,
    openIncidents: 8,
    criticalIncidents: 0,
    membersCount: 18,
    budget: 28000000,
    budgetSpent: 17360000,
    coverImageUrl: undefined,
  },
  {
    ...mockProjects[2],
    progress: 25,
    totalIncidents: 18,
    openIncidents: 4,
    criticalIncidents: 2,
    membersCount: 8,
    budget: 45000000,
    budgetSpent: 11250000,
    coverImageUrl: undefined,
  },
  {
    ...mockProjects[3],
    progress: 78,
    totalIncidents: 52,
    openIncidents: 3,
    criticalIncidents: 0,
    membersCount: 15,
    budget: 22000000,
    budgetSpent: 17160000,
    coverImageUrl: undefined,
  },
  {
    ...mockProjects[4],
    progress: 15,
    totalIncidents: 7,
    openIncidents: 3,
    criticalIncidents: 0,
    membersCount: 10,
    budget: 85000000,
    budgetSpent: 12750000,
    coverImageUrl: undefined,
  },
];

// ============================================
// HELPERS
// ============================================

/**
 * Obtiene proyecto por ID
 */
export function getProjectById(id: string): Project | undefined {
  return mockProjects.find((project) => project.id === id);
}

/**
 * Obtiene proyecto con estadísticas por ID
 */
export function getProjectWithStatsById(id: string): ProjectWithStats | undefined {
  return mockProjectsWithStats.find((project) => project.id === id);
}

/**
 * Obtiene proyectos de una organización
 */
export function getProjectsByOrganization(organizationId: string): Project[] {
  return mockProjects.filter(
    (project) => project.organizationId === organizationId && !project.deletedAt
  );
}

/**
 * Obtiene proyectos activos de una organización
 */
export function getActiveProjectsByOrganization(organizationId: string): Project[] {
  return mockProjects.filter(
    (project) =>
      project.organizationId === organizationId &&
      project.status === "ACTIVE" &&
      !project.deletedAt
  );
}

/**
 * Obtiene proyectos por estado
 */
export function getProjectsByStatus(
  organizationId: string,
  status: Project["status"]
): Project[] {
  return mockProjects.filter(
    (project) =>
      project.organizationId === organizationId &&
      project.status === status &&
      !project.deletedAt
  );
}

/**
 * Cuenta proyectos por estado
 */
export function countProjectsByStatus(
  organizationId: string
): Record<Project["status"], number> {
  const projects = getProjectsByOrganization(organizationId);
  return {
    ACTIVE: projects.filter((p) => p.status === "ACTIVE").length,
    PAUSED: projects.filter((p) => p.status === "PAUSED").length,
    COMPLETED: projects.filter((p) => p.status === "COMPLETED").length,
  };
}

/**
 * Calcula KPIs de proyectos
 */
export function getProjectKPIs(organizationId: string): {
  total: number;
  active: number;
  paused: number;
  completed: number;
  avgProgress: number;
} {
  const projectsWithStats = mockProjectsWithStats.filter(
    (p) => p.organizationId === organizationId && !p.deletedAt
  );
  
  const active = projectsWithStats.filter((p) => p.status === "ACTIVE");
  const avgProgress = active.length > 0
    ? Math.round(active.reduce((sum, p) => sum + p.progress, 0) / active.length)
    : 0;

  return {
    total: projectsWithStats.length,
    active: active.length,
    paused: projectsWithStats.filter((p) => p.status === "PAUSED").length,
    completed: projectsWithStats.filter((p) => p.status === "COMPLETED").length,
    avgProgress,
  };
}
