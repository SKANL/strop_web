// components/dashboard/projects/ProjectsPage.tsx - Island principal de la página de proyectos
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, FolderKanban, FolderOpen } from "lucide-react";
import type { ProjectWithStats, ProjectStatus } from "@/lib/mock/types";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "./ProjectCard";
import { ProjectFilters, type SortOption, type ViewMode } from "./ProjectFilters";
import { CreateProjectSheet } from "./CreateProjectSheet";
import { ProjectsEmptyState } from "./ProjectsEmptyState";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ProjectsPageProps {
  projects: ProjectWithStats[];
}

export function ProjectsPage({ projects }: ProjectsPageProps) {
  // Estados de filtrado y vista
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("created");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  
  // Estados del sheet
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithStats | null>(null);

  // Filtrado y ordenamiento
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    // Filtrar por estado
    if (statusFilter !== "ALL") {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Ordenar
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "progress":
          return b.progress - a.progress;
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "incidents":
          return b.openIncidents - a.openIncidents;
        default:
          return 0;
      }
    });

    return result;
  }, [projects, searchQuery, statusFilter, sortBy]);

  const handleEdit = (project: ProjectWithStats) => {
    setEditingProject(project);
    setSheetOpen(true);
  };

  const handleCreate = () => {
    setEditingProject(null);
    setSheetOpen(true);
  };

  const handleSheetClose = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setEditingProject(null);
    }
  };

  // Estadísticas rápidas
  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter(p => p.status === "ACTIVE").length,
    paused: projects.filter(p => p.status === "PAUSED").length,
    completed: projects.filter(p => p.status === "COMPLETED").length,
  }), [projects]);

  return (
    <TooltipProvider>
      <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary shadow-lg shadow-primary/25">
            <FolderKanban className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Proyectos</h1>
            <p className="text-sm text-muted-foreground">
              Gestiona tus obras de construcción
            </p>
          </div>
        </div>

        <Button 
          onClick={handleCreate}
          size="lg"
          className="shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proyecto
        </Button>
      </motion.div>

      {/* Filtros */}
      <ProjectFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalProjects={projects.length}
        filteredCount={filteredProjects.length}
      />

      {/* Lista de Proyectos */}
      <AnimatePresence mode="wait">
        {filteredProjects.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <ProjectsEmptyState
              hasFilters={searchQuery.length > 0 || statusFilter !== "ALL"}
              onClearFilters={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
              }}
              onCreateProject={handleCreate}
            />
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                viewMode="grid"
                onEdit={handleEdit}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                viewMode="list"
                onEdit={handleEdit}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sheet Crear/Editar */}
      <CreateProjectSheet
        open={sheetOpen}
        onOpenChange={handleSheetClose}
        editingProject={editingProject}
        onSuccess={() => {
          // Aquí se manejaría la actualización de datos
          console.log("Project saved");
        }}
      />
      </div>
    </TooltipProvider>
  );
}
