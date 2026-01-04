// components/dashboard/projects/ProjectsEmptyState.tsx - Estado vacío de proyectos
"use client";

import { motion } from "motion/react";
import { FolderOpen, Plus, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectsEmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
  onCreateProject: () => void;
}

export function ProjectsEmptyState({
  hasFilters,
  onClearFilters,
  onCreateProject,
}: ProjectsEmptyStateProps) {
  if (hasFilters) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center py-16 px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-6"
        >
          <Search className="h-10 w-10 text-muted-foreground" />
        </motion.div>
        
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No se encontraron proyectos
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
          No hay proyectos que coincidan con los filtros aplicados. 
          Intenta modificar tu búsqueda o limpiar los filtros.
        </p>
        
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="rounded-xl gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Limpiar filtros
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="relative mb-6"
      >
        <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center shadow-xl shadow-primary/30">
          <FolderOpen className="h-12 w-12 text-primary-foreground" />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-success flex items-center justify-center shadow-lg"
        >
          <Plus className="h-5 w-5 text-primary-foreground" />
        </motion.div>
      </motion.div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Crea tu primer proyecto
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
        Comienza agregando un nuevo proyecto de construcción. 
        Podrás asignar equipo, registrar incidencias y dar seguimiento al avance.
      </p>
      
      <Button
        onClick={onCreateProject}
        size="lg"
        className="shadow-lg shadow-primary/25 gap-2"
      >
        <Plus className="h-4 w-4" />
        Crear Proyecto
      </Button>

      {/* Ilustración decorativa */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 grid grid-cols-3 gap-3 opacity-30"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="w-24 h-32 rounded-2xl bg-muted border-2 border-dashed border-border"
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
