// components/dashboard/projects/ProjectFilters.tsx - Filtros y búsqueda de proyectos
"use client";

import { motion } from "motion/react";
import { Search, SlidersHorizontal, LayoutGrid, List, X } from "lucide-react";
import type { ProjectStatus } from "@/lib/mock/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export type SortOption = "name" | "progress" | "created" | "incidents";
export type ViewMode = "grid" | "list";

interface ProjectFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: ProjectStatus | "ALL";
  onStatusChange: (status: ProjectStatus | "ALL") => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalProjects: number;
  filteredCount: number;
}

const statusOptions = [
  { value: "ALL", label: "Todos los estados" },
  { value: "ACTIVE", label: "Activos" },
  { value: "PAUSED", label: "Pausados" },
  { value: "COMPLETED", label: "Completados" },
] as const;

const sortOptions = [
  { value: "name", label: "Nombre A-Z" },
  { value: "progress", label: "Avance" },
  { value: "created", label: "Más recientes" },
  { value: "incidents", label: "Más incidencias" },
] as const;

export function ProjectFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalProjects,
  filteredCount,
}: ProjectFiltersProps) {
  const hasActiveFilters = statusFilter !== "ALL" || searchQuery.length > 0;

  const clearFilters = () => {
    onSearchChange("");
    onStatusChange("ALL");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Barra principal de filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Búsqueda */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar proyectos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 rounded-xl border-gray-200 focus:border-blue-300 focus:ring-blue-200"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-3 w-3 text-gray-400" />
            </button>
          )}
        </div>

        {/* Filtros Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as ProjectStatus | "ALL")}>
            <SelectTrigger className="w-44 h-10 rounded-xl border-gray-200">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortOption)}>
            <SelectTrigger className="w-40 h-10 rounded-xl border-gray-200">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtros Mobile (Sheet) */}
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-10 rounded-xl gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
                {hasActiveFilters && (
                  <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-blue-500">
                    !
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Estado</label>
                  <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as ProjectStatus | "ALL")}>
                    <SelectTrigger className="w-full h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Ordenar por</label>
                  <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortOption)}>
                    <SelectTrigger className="w-full h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <SheetFooter>
                <Button variant="outline" onClick={clearFilters} className="flex-1">
                  Limpiar filtros
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* Toggle Vista */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            className={`h-8 w-8 rounded-lg ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
            onClick={() => onViewModeChange("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            className={`h-8 w-8 rounded-lg ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
            onClick={() => onViewModeChange("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Contador y filtros activos */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Mostrando <span className="font-semibold text-gray-700">{filteredCount}</span> de {totalProjects} proyectos
          </span>
          
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2"
            >
              <Separator orientation="vertical" className="h-4" />
              
              {statusFilter !== "ALL" && (
                <Badge 
                  variant="secondary" 
                  className="gap-1 pr-1 bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  {statusOptions.find(s => s.value === statusFilter)?.label}
                  <button
                    onClick={() => onStatusChange("ALL")}
                    className="ml-1 p-0.5 hover:bg-blue-200 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {searchQuery && (
                <Badge 
                  variant="secondary" 
                  className="gap-1 pr-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  "{searchQuery}"
                  <button
                    onClick={() => onSearchChange("")}
                    className="ml-1 p-0.5 hover:bg-gray-300 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              <button
                onClick={clearFilters}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Limpiar todo
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
