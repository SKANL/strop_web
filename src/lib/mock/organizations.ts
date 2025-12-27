/**
 * Datos mock de organizaciones (tenants)
 * Basado en REQUIREMENTS_V2.md Sección 2.0
 */

import type { Organization } from "./types";

// ============================================
// ORGANIZACIONES MOCK
// ============================================

/**
 * Organización principal para demos
 */
export const mockOrganization: Organization = {
  id: "org-001",
  name: "Constructora Demo S.A.",
  subdomain: "constructora-demo",
  slug: "constructora-demo",
  logoUrl: "https://api.dicebear.com/8.x/initials/svg?seed=CD",
  billingEmail: "facturacion@constructora-demo.com",
  plan: "PROFESSIONAL",
  storageQuotaMb: 10000,
  maxUsers: 100,
  maxProjects: 50,
  trialEndsAt: undefined, // No está en trial
  isActive: true,
  createdAt: "2024-01-15T00:00:00Z",
  updatedAt: "2024-12-01T00:00:00Z",
  deletedAt: undefined,
};

/**
 * Lista de organizaciones (para admin/superadmin views)
 */
export const mockOrganizations: Organization[] = [
  mockOrganization,
  {
    id: "org-002",
    name: "Constructora XYZ S.A. de C.V.",
    subdomain: "constructora-xyz",
    slug: "constructora-xyz",
    logoUrl: "https://api.dicebear.com/8.x/initials/svg?seed=XYZ",
    billingEmail: "contabilidad@constructora-xyz.com",
    plan: "ENTERPRISE",
    storageQuotaMb: 50000,
    maxUsers: 500,
    maxProjects: 200,
    trialEndsAt: undefined,
    isActive: true,
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2024-11-15T00:00:00Z",
    deletedAt: undefined,
  },
  {
    id: "org-003",
    name: "Pequeña Constructora MX",
    subdomain: "pequena-constructora",
    slug: "pequena-constructora",
    logoUrl: undefined,
    billingEmail: "admin@pequena.mx",
    plan: "STARTER",
    storageQuotaMb: 5000,
    maxUsers: 10,
    maxProjects: 5,
    trialEndsAt: "2025-01-31T23:59:59Z", // En trial
    isActive: true,
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
    deletedAt: undefined,
  },
];

// ============================================
// HELPERS
// ============================================

/**
 * Obtiene organización por ID
 */
export function getOrganizationById(id: string): Organization | undefined {
  return mockOrganizations.find((org) => org.id === id);
}

/**
 * Obtiene organización por subdomain
 */
export function getOrganizationBySubdomain(subdomain: string): Organization | undefined {
  return mockOrganizations.find((org) => org.subdomain === subdomain);
}

/**
 * Verifica si un subdomain está disponible
 */
export function isSubdomainAvailable(subdomain: string): boolean {
  return !mockOrganizations.some(
    (org) => org.subdomain.toLowerCase() === subdomain.toLowerCase()
  );
}

/**
 * Calcula uso de cuota de una organización
 * En producción, esto vendría de Supabase Storage API
 */
export function getOrganizationStorageUsage(organizationId: string): {
  usedMb: number;
  quotaMb: number;
  percentage: number;
} {
  const org = getOrganizationById(organizationId);
  if (!org) {
    return { usedMb: 0, quotaMb: 0, percentage: 0 };
  }
  
  // Mock: simular uso aleatorio entre 10% y 80%
  const usedMb = Math.floor(org.storageQuotaMb * (0.1 + Math.random() * 0.7));
  
  return {
    usedMb,
    quotaMb: org.storageQuotaMb,
    percentage: Math.round((usedMb / org.storageQuotaMb) * 100),
  };
}
