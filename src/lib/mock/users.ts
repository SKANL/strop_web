/**
 * Datos mock de usuarios
 * Basado en REQUIREMENTS_V2.md Sección 2.1
 */

import type { User } from "./types";

// ============================================
// CONSTANTE: ID de organización por defecto
// ============================================
const DEFAULT_ORG_ID = "org-001";

// ============================================
// USUARIOS MOCK
// ============================================

/**
 * Usuario actual (logueado) - para contexto de sesión
 */
export const mockCurrentUser: User = {
  id: "user-001",
  organizationId: DEFAULT_ORG_ID,
  email: "juan.perez@constructora-demo.com",
  fullName: "Juan Pérez García",
  role: "OWNER",
  isActive: true,
  phone: "+52 55 1234 5678",
  profilePictureUrl: "https://api.dicebear.com/8.x/initials/svg?seed=JPG",
  timezone: "America/Mexico_City",
  language: "es",
  invitedBy: undefined, // Es el OWNER original
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-12-20T15:30:00Z",
  deletedAt: undefined,
  lastLogin: "2024-12-26T08:00:00Z",
};

/**
 * Lista completa de usuarios de la organización demo
 */
export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: "user-002",
    organizationId: DEFAULT_ORG_ID,
    email: "carlos.mendoza@constructora-demo.com",
    fullName: "Carlos Mendoza",
    role: "SUPERINTENDENT",
    isActive: true,
    phone: "+52 81 9876 5432",
    profilePictureUrl: "https://api.dicebear.com/8.x/initials/svg?seed=CM",
    timezone: "America/Mexico_City",
    language: "es",
    invitedBy: "user-001",
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-12-25T14:00:00Z",
    deletedAt: undefined,
    lastLogin: "2024-12-26T07:30:00Z",
  },
  {
    id: "user-003",
    organizationId: DEFAULT_ORG_ID,
    email: "maria.garcia@constructora-demo.com",
    fullName: "María García",
    role: "RESIDENT",
    isActive: true,
    phone: "+52 33 5555 1234",
    profilePictureUrl: "https://api.dicebear.com/8.x/initials/svg?seed=MG",
    timezone: "America/Mexico_City",
    language: "es",
    invitedBy: "user-001",
    createdAt: "2024-02-15T11:00:00Z",
    updatedAt: "2024-12-24T10:00:00Z",
    deletedAt: undefined,
    lastLogin: "2024-12-25T16:00:00Z",
  },
  {
    id: "user-004",
    organizationId: DEFAULT_ORG_ID,
    email: "roberto.sanchez@constructora-demo.com",
    fullName: "Roberto Sánchez",
    role: "CABO",
    isActive: true,
    phone: "+52 55 7777 8888",
    profilePictureUrl: "https://api.dicebear.com/8.x/initials/svg?seed=RS",
    timezone: "America/Mexico_City",
    language: "es",
    invitedBy: "user-002",
    createdAt: "2024-03-01T08:00:00Z",
    updatedAt: "2024-12-20T09:00:00Z",
    deletedAt: undefined,
    lastLogin: "2024-12-26T06:00:00Z",
  },
  {
    id: "user-005",
    organizationId: DEFAULT_ORG_ID,
    email: "ana.lopez@constructora-demo.com",
    fullName: "Ana López",
    role: "RESIDENT",
    isActive: true,
    phone: "+52 55 3333 4444",
    profilePictureUrl: "https://api.dicebear.com/8.x/initials/svg?seed=AL",
    timezone: "America/Mexico_City",
    language: "es",
    invitedBy: "user-001",
    createdAt: "2024-03-10T14:00:00Z",
    updatedAt: "2024-12-22T11:00:00Z",
    deletedAt: undefined,
    lastLogin: "2024-12-25T18:00:00Z",
  },
  {
    id: "user-006",
    organizationId: DEFAULT_ORG_ID,
    email: "pedro.ramirez@constructora-demo.com",
    fullName: "Pedro Ramírez",
    role: "CABO",
    isActive: true,
    phone: "+52 81 2222 3333",
    profilePictureUrl: "https://api.dicebear.com/8.x/initials/svg?seed=PR",
    timezone: "America/Mexico_City",
    language: "es",
    invitedBy: "user-002",
    createdAt: "2024-04-01T07:00:00Z",
    updatedAt: "2024-12-23T16:00:00Z",
    deletedAt: undefined,
    lastLogin: "2024-12-26T05:30:00Z",
  },
  {
    id: "user-007",
    organizationId: DEFAULT_ORG_ID,
    email: "laura.torres@constructora-demo.com",
    fullName: "Laura Torres",
    role: "RESIDENT",
    isActive: true,
    phone: "+52 33 6666 7777",
    profilePictureUrl: "https://api.dicebear.com/8.x/initials/svg?seed=LT",
    timezone: "America/Mexico_City",
    language: "es",
    invitedBy: "user-001",
    createdAt: "2024-06-15T10:00:00Z",
    updatedAt: "2024-12-24T12:00:00Z",
    deletedAt: undefined,
    lastLogin: "2024-12-25T20:00:00Z",
  },
  {
    id: "user-008",
    organizationId: DEFAULT_ORG_ID,
    email: "fernando.ortiz@constructora-demo.com",
    fullName: "Fernando Ortiz",
    role: "SUPERINTENDENT",
    isActive: false, // Usuario desactivado
    phone: "+52 55 1111 2222",
    profilePictureUrl: "https://api.dicebear.com/8.x/initials/svg?seed=FO",
    timezone: "America/Mexico_City",
    language: "es",
    invitedBy: "user-001",
    createdAt: "2024-02-20T09:00:00Z",
    updatedAt: "2024-11-30T10:00:00Z",
    deletedAt: undefined, // Desactivado pero no eliminado
    lastLogin: "2024-11-28T14:00:00Z",
  },
  {
    id: "user-009",
    organizationId: DEFAULT_ORG_ID,
    email: "diana.herrera@constructora-demo.com",
    fullName: "Diana Herrera",
    role: "RESIDENT",
    isActive: true,
    phone: "+52 442 888 9999",
    profilePictureUrl: "https://api.dicebear.com/8.x/initials/svg?seed=DH",
    timezone: "America/Mexico_City",
    language: "es",
    invitedBy: "user-002",
    createdAt: "2024-05-01T08:00:00Z",
    updatedAt: "2024-12-23T13:00:00Z",
    deletedAt: undefined,
    lastLogin: "2024-12-26T07:00:00Z",
  },
];

// ============================================
// HELPERS
// ============================================

/**
 * Obtiene usuario por ID
 */
export function getUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id);
}

/**
 * Obtiene usuario por email
 */
export function getUserByEmail(email: string): User | undefined {
  return mockUsers.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
}

/**
 * Obtiene usuarios de una organización
 */
export function getUsersByOrganization(organizationId: string): User[] {
  return mockUsers.filter(
    (user) => user.organizationId === organizationId && !user.deletedAt
  );
}

/**
 * Obtiene usuarios activos de una organización
 */
export function getActiveUsersByOrganization(organizationId: string): User[] {
  return mockUsers.filter(
    (user) =>
      user.organizationId === organizationId &&
      user.isActive &&
      !user.deletedAt
  );
}

/**
 * Obtiene usuarios por rol
 */
export function getUsersByRole(
  organizationId: string,
  role: User["role"]
): User[] {
  return mockUsers.filter(
    (user) =>
      user.organizationId === organizationId &&
      user.role === role &&
      user.isActive &&
      !user.deletedAt
  );
}

/**
 * Cuenta usuarios por rol en una organización
 */
export function countUsersByRole(organizationId: string): Record<User["role"], number> {
  const users = getUsersByOrganization(organizationId);
  return {
    OWNER: users.filter((u) => u.role === "OWNER").length,
    SUPERINTENDENT: users.filter((u) => u.role === "SUPERINTENDENT").length,
    RESIDENT: users.filter((u) => u.role === "RESIDENT").length,
    CABO: users.filter((u) => u.role === "CABO").length,
  };
}
