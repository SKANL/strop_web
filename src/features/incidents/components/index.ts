/**
 * Incident Components - Feature Module Exports
 * 
 * This barrel file exports all incident-related UI components
 * following Astro's feature-first architecture.
 */

// Core Components
export { IncidentTypeIcon } from "./IncidentTypeIcon";
export { IncidentCard } from "./IncidentCard";
export { IncidentList } from "./IncidentList";
export { IncidentDetail } from "./IncidentDetail";

// Filter Components
export { IncidentFilters, type FilterState } from "./IncidentFilters";

// Timeline & Gallery
export { IncidentTimeline } from "./IncidentTimeline";
export { IncidentPhotosGallery } from "./IncidentPhotosGallery";

// Action Dialogs
export { IncidentAssignDialog } from "./IncidentAssignDialog";
export { IncidentCloseDialog } from "./IncidentCloseDialog";
export { IncidentForm } from "./IncidentForm";
