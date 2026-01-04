/**
 * Event Aggregator Service for Bitácora Operativa
 * 
 * Implements the "Centro de Verdad Única" (Single Source of Truth) concept
 * by normalizing events from multiple sources into a unified BitacoraEvent format.
 * 
 * Sources aggregated:
 * 1. SYSTEM - From mockAuditLogs (login, CRUD, exports)
 * 2. INCIDENT - From mockIncidentsWithDetails (creation, assignment, closure)
 * 3. MANUAL - From mockOperationalLogs (superintendent entries)
 * 4. MOBILE - Placeholder for future mobile app events
 * 
 * @design Based on V1/V2 design documents' "Gemelo Digital" concept
 */

import type { AuditLog } from "@/lib/mock/types";
import type { OperationalLog, EventSource } from "../types";
// TODO: When implementing full aggregation, uncomment these imports:
// import { mockAuditLogs } from "@/lib/mock/audit-logs";
// import { mockIncidentsWithDetails } from "@/lib/mock/incidents";
import { mockOperationalLogs } from "@/lib/mock/operational-logs";

/**
 * Unified event type for the Centro de Verdad Única
 * This extends OperationalLog with source tracking
 */
export interface AggregatedEvent extends OperationalLog {
  source: EventSource;
  originalId?: string; // Reference to source record (auditLogId, incidentId, etc.)
}

/**
 * Count events by source
 */
export function countEventsBySource(events: AggregatedEvent[]): Record<EventSource, number> {
  const counts: Record<EventSource, number> = {
    ALL: events.length,
    SYSTEM: 0,
    INCIDENT: 0,
    MANUAL: 0,
    MOBILE: 0,
  };

  for (const event of events) {
    if (event.source in counts && event.source !== "ALL") {
      counts[event.source]++;
    }
  }

  return counts;
}

/**
 * Filter events by source
 */
export function filterEventsBySource(
  events: AggregatedEvent[],
  source: EventSource
): AggregatedEvent[] {
  if (source === "ALL") return events;
  return events.filter((event) => event.source === source);
}

/**
 * Convert AuditLog to AggregatedEvent
 * Maps system actions to appropriate categories
 * 
 * TODO: Implement when ready to integrate system events
 */
export function auditLogToEvent(_log: AuditLog): AggregatedEvent | null {
  // Placeholder - will be implemented when we need to show system events
  // Example mapping:
  // - LOGIN action -> ADMINISTRATIVA category
  // - CREATE photo -> based on context
  // - UPDATE incident -> ADMINISTRATIVA
  return null;
}

/**
 * Main aggregation function
 * Currently returns only manual operational logs
 * 
 * TODO: Expand to include SYSTEM and INCIDENT sources when needed:
 * 1. Uncomment imports at top
 * 2. Implement auditLogToEvent() mapping
 * 3. Add incident lifecycle events (created, assigned, closed)
 * 4. Sort all events chronologically
 */
export function aggregateAllEvents(projectId?: string): AggregatedEvent[] {
  const events: AggregatedEvent[] = [];

  // 1. Manual operational logs (current implementation)
  const manualEvents = mockOperationalLogs
    .filter((log) => !projectId || log.projectId === projectId)
    .map((log) => ({
      ...log,
      source: "MANUAL" as EventSource,
      originalId: log.id,
    }));

  events.push(...manualEvents);

  // 2. System events from audit logs
  // TODO: Uncomment when ready to integrate
  // const systemEvents = mockAuditLogs
  //   .filter((log) => !projectId || log.details?.projectId === projectId)
  //   .map(auditLogToEvent)
  //   .filter((event): event is AggregatedEvent => event !== null);
  // events.push(...systemEvents);

  // 3. Incident lifecycle events
  // TODO: Uncomment when ready to integrate
  // const incidentEvents = mockIncidentsWithDetails
  //   .filter((inc) => !projectId || inc.projectId === projectId)
  //   .flatMap(incidentToEvents); // Returns created, assigned, closed events
  // events.push(...incidentEvents);

  // 4. Mobile events (future)
  // Will be added when mobile app integration is implemented

  // Sort by serverDate descending (most recent first)
  return events.sort(
    (a, b) => new Date(b.serverDate).getTime() - new Date(a.serverDate).getTime()
  );
}

/**
 * Get aggregation statistics for the header
 */
export function getAggregationStats(events: AggregatedEvent[]) {
  const counts = countEventsBySource(events);
  const today = new Date().toISOString().split("T")[0];
  
  return {
    total: events.length,
    todayCount: events.filter(
      (e) => e.serverDate.split("T")[0] === today
    ).length,
    bySource: counts,
    chainIntegrity: events.every((e) => e.integrity.verified),
  };
}
