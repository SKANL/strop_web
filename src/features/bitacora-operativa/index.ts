/**
 * Component barrel export for Bitácora Operativa
 */

// Main view
export { BitacoraView } from "./components/BitacoraView";

// Layout components
export { BitacoraHeader } from "./components/BitacoraHeader";
export { BitacoraStats } from "./components/BitacoraStats";
export { BitacoraFilters } from "./components/BitacoraFilters";
export { SourceTabs } from "./components/SourceTabs";

// Timeline components
export { DailyTimeline } from "./components/DailyTimeline";
export { LogItemCard } from "./components/LogItemCard";

// Panels
export { OfficialComposer } from "./components/OfficialComposer";
export { LogDetailSheet } from "./components/LogDetailSheet";

// Types
export * from "./types";

// Stores
export * from "./stores/bitacoraStore";

// Services
export * from "./services/eventAggregator";

