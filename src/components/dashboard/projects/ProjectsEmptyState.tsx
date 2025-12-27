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
          className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-6"
        >
          <Search className="h-10 w-10 text-gray-400" />
        </motion.div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No se encontraron proyectos
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
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
        <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/30">
          <FolderOpen className="h-12 w-12 text-white" />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg"
        >
          <Plus className="h-5 w-5 text-white" />
        </motion.div>
      </motion.div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Crea tu primer proyecto
      </h3>
      <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
        Comienza agregando un nuevo proyecto de construcción. 
        Podrás asignar equipo, registrar incidencias y dar seguimiento al avance.
      </p>
      
      <Button
        onClick={onCreateProject}
        className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 gap-2"
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
            className="w-24 h-32 rounded-2xl bg-gray-200 border-2 border-dashed border-gray-300"
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
