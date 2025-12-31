/**
 * Incident state management hook using Nanostores
 * Provides reactive state for incident data with mock data integration
 */

import { atom, computed } from "nanostores";
import { useStore } from "@nanostores/react";
import type { IncidentWithDetails, IncidentStatus, IncidentPriority } from "@/lib/mock/types";
import { mockIncidentsWithDetails } from "@/lib/mock/incidents";

// ============================================
// ATOMS (Base State)
// ============================================

/**
 * Loading state for incidents
 */
export const $incidentsLoading = atom<boolean>(false);

/**
 * Error state for incidents
 */
export const $incidentsError = atom<string | null>(null);

/**
 * Raw incidents data
 */
export const $incidents = atom<IncidentWithDetails[]>(mockIncidentsWithDetails);

/**
 * Currently selected incident ID
 */
export const $selectedIncidentId = atom<string | null>(null);

// ============================================
// COMPUTED (Derived State)
// ============================================

/**
 * Get incidents filtered by status
 */
export const $openIncidents = computed($incidents, (incidents) =>
  incidents.filter((i) => i.status === "OPEN")
);

export const $assignedIncidents = computed($incidents, (incidents) =>
  incidents.filter((i) => i.status === "ASSIGNED")
);

export const $closedIncidents = computed($incidents, (incidents) =>
  incidents.filter((i) => i.status === "CLOSED")
);

/**
 * Get critical incidents
 */
export const $criticalIncidents = computed($incidents, (incidents) =>
  incidents.filter((i) => i.priority === "CRITICAL" && i.status !== "CLOSED")
);

/**
 * Currently selected incident object
 */
export const $selectedIncident = computed(
  [$incidents, $selectedIncidentId],
  (incidents, id) => (id ? incidents.find((i) => i.id === id) ?? null : null)
);

/**
 * Incident counts by status
 */
export const $incidentCounts = computed($incidents, (incidents) => ({
  total: incidents.length,
  open: incidents.filter((i) => i.status === "OPEN").length,
  assigned: incidents.filter((i) => i.status === "ASSIGNED").length,
  closed: incidents.filter((i) => i.status === "CLOSED").length,
  critical: incidents.filter((i) => i.priority === "CRITICAL" && i.status !== "CLOSED").length,
}));

// ============================================
// ACTIONS
// ============================================

/**
 * Refresh incidents from data source
 */
export async function refreshIncidents(): Promise<void> {
  $incidentsLoading.set(true);
  $incidentsError.set(null);

  try {
    // Simulate API call - in production, this would fetch from Supabase
    await new Promise((resolve) => setTimeout(resolve, 500));
    $incidents.set(mockIncidentsWithDetails);
  } catch (error) {
    $incidentsError.set(error instanceof Error ? error.message : "Error al cargar incidencias");
  } finally {
    $incidentsLoading.set(false);
  }
}

/**
 * Select an incident by ID
 */
export function selectIncident(id: string | null): void {
  $selectedIncidentId.set(id);
}

/**
 * Optimistic update for incident status
 */
export function updateIncidentStatus(id: string, status: IncidentStatus): void {
  $incidents.set(
    $incidents.get().map((incident) =>
      incident.id === id ? { ...incident, status, updatedAt: new Date().toISOString() } : incident
    )
  );
}

/**
 * Optimistic update for incident assignment
 */
export function assignIncident(id: string, assignedTo: string, assignedToName: string): void {
  $incidents.set(
    $incidents.get().map((incident) =>
      incident.id === id
        ? {
            ...incident,
            assignedTo,
            assignedToName,
            status: "ASSIGNED" as IncidentStatus,
            updatedAt: new Date().toISOString(),
          }
        : incident
    )
  );
}

/**
 * Optimistic update for closing an incident
 */
export function closeIncident(id: string, closedNotes: string): void {
  $incidents.set(
    $incidents.get().map((incident) =>
      incident.id === id
        ? {
            ...incident,
            status: "CLOSED" as IncidentStatus,
            closedAt: new Date().toISOString(),
            closedNotes,
            isImmutable: true,
            updatedAt: new Date().toISOString(),
          }
        : incident
    )
  );
}

// ============================================
// HOOK
// ============================================

/**
 * React hook for incident state
 * Provides reactive access to incident data and actions
 */
export function useIncidents() {
  const incidents = useStore($incidents);
  const isLoading = useStore($incidentsLoading);
  const error = useStore($incidentsError);
  const selectedIncident = useStore($selectedIncident);
  const counts = useStore($incidentCounts);
  const criticalIncidents = useStore($criticalIncidents);

  return {
    // State
    incidents,
    isLoading,
    error,
    selectedIncident,
    counts,
    criticalIncidents,

    // Actions
    refresh: refreshIncidents,
    select: selectIncident,
    updateStatus: updateIncidentStatus,
    assign: assignIncident,
    close: closeIncident,
  };
}

/**
 * Hook for filtered incidents by project
 */
export function useIncidentsByProject(projectId: string) {
  const incidents = useStore($incidents);
  return incidents.filter((i) => i.projectId === projectId);
}

/**
 * Hook for filtered incidents by status
 */
export function useIncidentsByStatus(status: IncidentStatus) {
  const incidents = useStore($incidents);
  return incidents.filter((i) => i.status === status);
}

/**
 * Hook for filtered incidents by priority
 */
export function useIncidentsByPriority(priority: IncidentPriority) {
  const incidents = useStore($incidents);
  return incidents.filter((i) => i.priority === priority);
}
