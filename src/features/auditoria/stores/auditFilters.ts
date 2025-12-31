/**
 * Nano Store para gestión de filtros de auditoría
 * Incluye persistencia en localStorage
 */

import { atom, computed } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";
import type { AuditAction, AuditResourceType, AuditLog } from "@/lib/mock/types";

export interface AuditFilters {
  dateRange?: { from: Date; to: Date };
  actions: AuditAction[];
  resources: AuditResourceType[];
  userId: string | "all";
  searchQuery: string;
}

/**
 * Store persistente de filtros
 */
export const auditFiltersStore = persistentAtom<AuditFilters>(
  "audit-filters",
  {
    dateRange: undefined,
    actions: [],
    resources: [],
    userId: "all",
    searchQuery: "",
  },
  {
    encode: (value) => JSON.stringify({
      ...value,
      dateRange: value.dateRange ? {
        from: value.dateRange.from.toISOString(),
        to: value.dateRange.to.toISOString(),
      } : undefined,
    }),
    decode: (str) => {
      const parsed = JSON.parse(str);
      return {
        ...parsed,
        dateRange: parsed.dateRange ? {
          from: new Date(parsed.dateRange.from),
          to: new Date(parsed.dateRange.to),
        } : undefined,
      };
    },
  }
);

/**
 * Store de todos los logs (se carga desde el servidor)
 */
export const allLogsStore = atom<AuditLog[]>([]);

/**
 * Computed store: logs filtrados
 */
export const filteredLogsStore = computed(
  [auditFiltersStore, allLogsStore],
  (filters, allLogs) => {
    return allLogs.filter((log) => {
      // Filtro por rango de fechas
      if (filters.dateRange) {
        const logDate = new Date(log.createdAt);
        if (
          logDate < filters.dateRange.from ||
          logDate > filters.dateRange.to
        ) {
          return false;
        }
      }

      // Filtro por acciones
      if (filters.actions.length > 0 && !filters.actions.includes(log.action)) {
        return false;
      }

      // Filtro por recursos
      if (
        filters.resources.length > 0 &&
        !filters.resources.includes(log.resourceType)
      ) {
        return false;
      }

      // Filtro por usuario
      if (filters.userId !== "all" && log.userId !== filters.userId) {
        return false;
      }

      // Filtro por búsqueda
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText = JSON.stringify(log).toLowerCase();
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }
);

/**
 * Actualiza filtros parcialmente
 */
export function updateFilters(partial: Partial<AuditFilters>) {
  auditFiltersStore.set({
    ...auditFiltersStore.get(),
    ...partial,
  });
}

/**
 * Resetea todos los filtros
 */
export function resetFilters() {
  auditFiltersStore.set({
    dateRange: undefined,
    actions: [],
    resources: [],
    userId: "all",
    searchQuery: "",
  });
}

/**
 * Toggle acción en filtros
 */
export function toggleActionFilter(action: AuditAction, checked: boolean) {
  const current = auditFiltersStore.get();
  const actions = checked
    ? [...current.actions, action]
    : current.actions.filter((a) => a !== action);
  updateFilters({ actions });
}

/**
 * Toggle recurso en filtros
 */
export function toggleResourceFilter(resource: AuditResourceType, checked: boolean) {
  const current = auditFiltersStore.get();
  const resources = checked
    ? [...current.resources, resource]
    : current.resources.filter((r) => r !== resource);
  updateFilters({ resources });
}

/**
 * Carga logs iniciales
 */
export function loadLogs(logs: AuditLog[]) {
  allLogsStore.set(logs);
}
