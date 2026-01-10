// IncidentsDashboard.tsx - Dashboard minimalista centrado en incidencias
"use client";

import { useState } from "react";
import { HeroIncidentCount } from "./HeroIncidentCount";
import { IncidentStatusBar } from "./IncidentStatusBar";
import { UrgentIncidentCards } from "./UrgentIncidentCards";
import { MiniActivityFeed } from "./MiniActivityFeed";
import { mockIncidentsUI, mockActivityUI } from "@/lib/mock";

type StatusFilter = "critical" | "open" | "assigned" | "closed" | null;

export function IncidentsDashboard() {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>(null);

  // Calcular conteos
  const counts = {
    critical: mockIncidentsUI.filter(i => i.priority === "CRITICAL" && i.status !== "CLOSED").length,
    open: mockIncidentsUI.filter(i => i.status === "OPEN").length,
    assigned: mockIncidentsUI.filter(i => i.status === "ASSIGNED").length,
    closed: mockIncidentsUI.filter(i => i.status === "CLOSED").length,
  };

  // Filtrar incidencias según filtro activo
  const filteredIncidents = activeFilter 
    ? mockIncidentsUI.filter(i => {
        switch (activeFilter) {
          case "critical": return i.priority === "CRITICAL" && i.status !== "CLOSED";
          case "open": return i.status === "OPEN";
          case "assigned": return i.status === "ASSIGNED";
          case "closed": return i.status === "CLOSED";
          default: return true;
        }
      })
    : mockIncidentsUI;

  return (
    <div className="space-y-6 py-4">
      {/* Hero: Número de incidencias críticas */}
      <HeroIncidentCount criticalCount={counts.critical} />

      {/* Status Bar: Filtros clickables */}
      <IncidentStatusBar 
        counts={counts} 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Cards de incidencias urgentes */}
      <div className="py-4">
        <UrgentIncidentCards incidents={filteredIncidents} maxItems={3} />
      </div>

      {/* Mini feed de actividad */}
      <MiniActivityFeed activities={mockActivityUI} maxItems={3} />
    </div>
  );
}
