/**
 * Incident Hooks - Feature Module Exports
 */

export {
  // Atoms
  $incidents,
  $incidentsLoading,
  $incidentsError,
  $selectedIncidentId,
  
  // Computed
  $openIncidents,
  $assignedIncidents,
  $closedIncidents,
  $criticalIncidents,
  $selectedIncident,
  $incidentCounts,
  
  // Actions
  refreshIncidents,
  selectIncident,
  updateIncidentStatus,
  assignIncident,
  closeIncident,
  
  // Hooks
  useIncidents,
  useIncidentsByProject,
  useIncidentsByStatus,
  useIncidentsByPriority,
} from "./useIncidents";
