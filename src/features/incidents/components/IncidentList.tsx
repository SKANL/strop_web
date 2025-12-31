/**
 * Lista principal de incidencias con animación escalonada
 * y estados vacío/cargando
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { IncidentCard } from "./IncidentCard";
import { IncidentFilters, type FilterState } from "./IncidentFilters";
import { IncidentDetail } from "./IncidentDetail";
import { AlertCircle } from "lucide-react";
import type { IncidentWithDetails } from "@/lib/mock/types";

interface IncidentListProps {
  incidents: IncidentWithDetails[];
  isLoading?: boolean;
}

// Animation variants with proper types
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      duration: 0.4,
      bounce: 0.15,
    },
  },
};

function filterIncidents(
  incidents: IncidentWithDetails[],
  filters: FilterState
): IncidentWithDetails[] {
  return incidents.filter((incident) => {
    // Filter by status
    if (filters.status.length > 0 && !filters.status.includes(incident.status)) {
      return false;
    }

    // Filter by priority
    if (filters.priority.length > 0 && !filters.priority.includes(incident.priority)) {
      return false;
    }

    // Filter by type
    if (filters.type.length > 0 && !filters.type.includes(incident.type)) {
      return false;
    }

    // Filter by project
    if (filters.project.length > 0 && !filters.project.includes(incident.projectId)) {
      return false;
    }

    // Filter by search query
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesDescription = incident.description.toLowerCase().includes(searchLower);
      const matchesProject = incident.projectName.toLowerCase().includes(searchLower);
      const matchesCreator = incident.createdByName.toLowerCase().includes(searchLower);
      if (!matchesDescription && !matchesProject && !matchesCreator) {
        return false;
      }
    }

    return true;
  });
}

// Loading skeleton
function IncidentListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="size-5 rounded" />
            <Skeleton className="h-4 w-24" />
            <div className="ml-auto flex gap-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-full mb-3" />
          <Skeleton className="h-4 w-3/4 mb-3" />
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="size-6 rounded-full" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function IncidentList({ incidents, isLoading = false }: IncidentListProps) {
  const [selectedIncident, setSelectedIncident] = useState<IncidentWithDetails | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    priority: [],
    type: [],
    project: [],
    search: "",
  });

  const filteredIncidents = filterIncidents(incidents, filters);

  const handleIncidentClick = (incident: IncidentWithDetails) => {
    setSelectedIncident(incident);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    // Delay clearing incident to allow animation to complete
    setTimeout(() => setSelectedIncident(null), 300);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full max-w-md" />
        <IncidentListSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <IncidentFilters
        filters={filters}
        onFiltersChange={setFilters}
        incidents={incidents}
      />

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredIncidents.length} incidencia{filteredIncidents.length !== 1 ? "s" : ""} encontrada{filteredIncidents.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Incidents grid */}
      <ScrollArea className="h-[calc(100vh-280px)]">
        <AnimatePresence mode="wait">
          {filteredIncidents.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Empty className="py-12">
                <EmptyMedia>
                  <AlertCircle className="size-12" />
                </EmptyMedia>
                <EmptyTitle>No hay incidencias</EmptyTitle>
                <EmptyDescription>
                  {filters.search || filters.status.length > 0 || filters.type.length > 0
                    ? "No se encontraron incidencias con los filtros aplicados."
                    : "Aún no hay incidencias registradas."}
                </EmptyDescription>
              </Empty>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pr-4"
            >
              {filteredIncidents.map((incident) => (
                <motion.div key={incident.id} variants={itemVariants}>
                  <IncidentCard
                    incident={incident}
                    onClick={() => handleIncidentClick(incident)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>

      {/* Detail Sheet */}
      <IncidentDetail
        incident={selectedIncident}
        open={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
}
