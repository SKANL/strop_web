// UrgentIncidentCards.tsx - Cards minimalistas de incidencias urgentes
"use client";

import { motion } from "motion/react";
import { ChevronRight, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IncidentUI } from "@/lib/mock";

interface UrgentIncidentCardsProps {
  incidents: IncidentUI[];
  maxItems?: number;
}

export function UrgentIncidentCards({ incidents, maxItems = 3 }: UrgentIncidentCardsProps) {
  // Filtrar y ordenar: primero críticas, luego abiertas sin asignar
  const urgentIncidents = incidents
    .filter(i => i.status !== "CLOSED")
    .sort((a, b) => {
      // Primero por prioridad (CRITICAL primero)
      if (a.priority === "CRITICAL" && b.priority !== "CRITICAL") return -1;
      if (a.priority !== "CRITICAL" && b.priority === "CRITICAL") return 1;
      // Luego por estado (OPEN antes que ASSIGNED)
      if (a.status === "OPEN" && b.status !== "OPEN") return -1;
      if (a.status !== "OPEN" && b.status === "OPEN") return 1;
      return 0;
    })
    .slice(0, maxItems);

  if (urgentIncidents.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8 text-muted-foreground"
      >
        <p className="text-sm">No hay incidencias pendientes 🎉</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2 max-w-xl mx-auto">
      {urgentIncidents.map((incident, index) => (
        <motion.div
          key={incident.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 * index }}
          className={`
            group flex items-center justify-between gap-3 p-3 rounded-xl
            border border-border bg-card/50 backdrop-blur-sm
            hover:bg-muted/50 hover:border-border transition-all duration-200
            ${incident.priority === "CRITICAL" ? "border-l-2 border-l-destructive" : ""}
          `}
        >
          {/* Left: Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {incident.priority === "CRITICAL" && (
                <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
              )}
              <span className="text-sm font-medium text-foreground truncate">
                {incident.projectName}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {incident.description.slice(0, 50)}...
            </p>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
            {incident.status === "OPEN" && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-xs gap-1"
              >
                <UserPlus className="h-3 w-3" />
                <span className="hidden sm:inline">Asignar</span>
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs"
              asChild
            >
              <a href={`/dashboard/incidencias/${incident.id}`}>
                <span className="hidden sm:inline">Ver</span>
                <ChevronRight className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </motion.div>
      ))}
      
      {/* Ver todas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center pt-2"
      >
        <a 
          href="/dashboard/incidencias" 
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Ver todas las incidencias →
        </a>
      </motion.div>
    </div>
  );
}
