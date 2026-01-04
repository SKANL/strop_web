/**
 * Incidencias Page Component
 * 
 * Main page for viewing and managing incidents.
 * Uses the IncidentList component with mock data.
 */

import { useState } from "react";
import { motion } from "motion/react";
import { IncidentList, IncidentForm, useIncidents } from "@/features/incidents";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Plus, AlertTriangle, Clock, CheckCircle2, UserCheck } from "lucide-react";

export function IncidenciasPage() {
  const { incidents, isLoading, counts, criticalIncidents } = useIncidents();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Incidencias</h1>
            <p className="text-muted-foreground mt-1">
              Consulta y gestiona las incidencias de todos los proyectos
            </p>
          </div>

          <Button className="gap-2" onClick={() => setIsFormOpen(true)}>
            <Plus className="size-4" />
            Nueva Incidencia
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-card border"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="size-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{counts.open}</p>
              <p className="text-xs text-muted-foreground">Abiertas</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-card border"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-info/10">
              <UserCheck className="size-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{counts.assigned}</p>
              <p className="text-xs text-muted-foreground">Asignadas</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-card border"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-success/10">
              <CheckCircle2 className="size-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{counts.closed}</p>
              <p className="text-xs text-muted-foreground">Cerradas</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-card border"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="size-5 text-destructive" />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-semibold">{counts.critical}</p>
              {counts.critical > 0 && (
                <Badge variant="destructive" size="sm">
                  ¡Atención!
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Críticas</p>
          </motion.div>
        </div>

        {/* Critical Incidents Alert */}
        {criticalIncidents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg"
          >
            <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive">
                {criticalIncidents.length} incidencia{criticalIncidents.length !== 1 ? "s" : ""} crítica{criticalIncidents.length !== 1 ? "s" : ""} requiere{criticalIncidents.length === 1 ? "" : "n"} atención
              </p>
              <p className="text-sm text-destructive/80 mt-1">
                Revisa las incidencias marcadas como críticas para atenderlas con prioridad.
              </p>
            </div>
          </motion.div>
        )}

        {/* Incident List */}
        <IncidentList incidents={incidents} isLoading={isLoading} />

        {/* Create Incident Form */}
        <IncidentForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={(data) => {
            console.log("New incident:", data);
            // In production, this would call the API
          }}
        />
      </div>
    </TooltipProvider>
  );
}
