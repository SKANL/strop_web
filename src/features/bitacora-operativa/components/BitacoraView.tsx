/**
 * Main orchestrator view for Bitácora Operativa
 * Implements the "Centro de Verdad Única" (Single Source of Truth) UI
 * 
 * @design Based on L-Layout from "Diseño y Flujo Web Administrativa Intuitiva.md"
 * @pattern Uses Motion stagger animations for progressive reveal
 */

"use client";

import { useState, useMemo } from "react";
import { useStore } from "@nanostores/react";
import { motion } from "motion/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

// Feature components
import { BitacoraHeader } from "./BitacoraHeader";
import { BitacoraStats } from "./BitacoraStats";
import { SourceTabs, type EventSource } from "./SourceTabs";
import { BitacoraFilters } from "./BitacoraFilters";
import { DailyTimeline } from "./DailyTimeline";
import { OfficialComposer } from "./OfficialComposer";
import { LogDetailSheet } from "./LogDetailSheet";

// Stores
import { $isComposerOpen } from "../stores/bitacoraStore";

// Services
import {
  aggregateAllEvents,
  countEventsBySource,
  filterEventsBySource,
  getAggregationStats,
} from "../services/eventAggregator";

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

interface BitacoraViewProps {
  projectId?: string;
}

export function BitacoraView({ projectId }: BitacoraViewProps) {
  // State for source filtering
  const [activeSource, setActiveSource] = useState<EventSource>("ALL");
  
  // Composer panel state (from store)
  const isComposerOpen = useStore($isComposerOpen);

  // Aggregate and filter events
  const allEvents = useMemo(() => aggregateAllEvents(projectId), [projectId]);
  const stats = useMemo(() => getAggregationStats(allEvents), [allEvents]);
  const sourceCounts = useMemo(() => countEventsBySource(allEvents), [allEvents]);
  const filteredEvents = useMemo(
    () => filterEventsBySource(allEvents, activeSource),
    [allEvents, activeSource]
  );

  // Extract logs for timeline (converting AggregatedEvent back to OperationalLog format)
  const timelineLogs = useMemo(
    () =>
      filteredEvents.map((event) => ({
        ...event,
        // Remove source-specific fields to match OperationalLog type
      })),
    [filteredEvents]
  );

  return (
    <TooltipProvider>
      <div className="p-6 flex gap-6">
        {/* Main Content Area - Expands when composer is collapsed */}
        <motion.div
          className="space-y-6"
          style={{ flex: 1 }}
          layout
          transition={{ duration: 0.3, ease: "easeInOut" }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header with title and integrity badge */}
          <motion.div variants={itemVariants}>
            <BitacoraHeader chainIntegrity={stats.chainIntegrity} />
          </motion.div>

          {/* Stats cards */}
          <motion.div variants={itemVariants}>
            <BitacoraStats projectId={projectId} />
          </motion.div>

          {/* Source tabs for CVU filtering */}
          <motion.div variants={itemVariants}>
            <SourceTabs
              activeSource={activeSource}
              onSourceChange={setActiveSource}
              counts={sourceCounts}
            />
          </motion.div>

          {/* Advanced filters */}
          <motion.div variants={itemVariants}>
            <BitacoraFilters />
          </motion.div>

          {/* Timeline with events */}
          <motion.div variants={itemVariants} className="min-h-[400px]">
            {timelineLogs.length > 0 ? (
              <DailyTimeline logs={timelineLogs} />
            ) : (
              <EmptyTimeline activeSource={activeSource} />
            )}
          </motion.div>
        </motion.div>

        {/* Right Panel - Composer (animated width) */}
        {isComposerOpen ? (
          <motion.div
            layout
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="shrink-0"
          >
            <div className="w-80 sticky top-6">
              <OfficialComposer />
            </div>
          </motion.div>
        ) : (
          /* Toggle button when panel is collapsed */
          <OfficialComposer />
        )}

        {/* Detail Sheet (overlay) */}
        <LogDetailSheet />
      </div>
    </TooltipProvider>
  );
}

/**
 * Empty state component for timeline
 * Shows different messages based on active filter
 */
function EmptyTimeline({ activeSource }: { activeSource: EventSource }) {
  const messages: Record<EventSource, { title: string; description: string }> = {
    ALL: {
      title: "Sin eventos registrados",
      description: "No hay eventos en este proyecto todavía.",
    },
    SYSTEM: {
      title: "Sin eventos del sistema",
      description: "Las acciones del sistema aparecerán aquí automáticamente.",
    },
    INCIDENT: {
      title: "Sin incidencias",
      description: "Las incidencias del proyecto se mostrarán aquí.",
    },
    MANUAL: {
      title: "Sin notas manuales",
      description: "Usa el botón 'Nuevo Evento' para registrar una nota.",
    },
    MOBILE: {
      title: "Sin eventos móviles",
      description: "Los check-ins y reportes de campo aparecerán aquí.",
    },
  };

  const { title, description } = messages[activeSource];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Skeleton className="w-8 h-8 rounded" />
      </div>
      <h3 className="text-lg font-medium text-muted-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground/70 max-w-xs mt-1">
        {description}
      </p>
    </motion.div>
  );
}
