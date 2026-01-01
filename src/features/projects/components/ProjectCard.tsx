// components/dashboard/projects/ProjectCard.tsx - Card individual de proyecto
"use client";

import { motion } from "motion/react";
import { 
  MapPin, 
  Users, 
  AlertTriangle, 
  Calendar,
  MoreHorizontal,
  Pencil,
  Pause,
  Play,
  Trash2,
  ExternalLink
} from "lucide-react";
import type { ProjectWithStats } from "@/lib/mock/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProjectCardProps {
  project: ProjectWithStats;
  index: number;
  viewMode: "grid" | "list";
  onEdit?: (project: ProjectWithStats) => void;
  onToggleStatus?: (project: ProjectWithStats) => void;
}

const statusConfig = {
  ACTIVE: {
    label: "Activo",
    variant: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  PAUSED: {
    label: "Pausado",
    variant: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  COMPLETED: {
    label: "Completado",
    variant: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
} as const;

export function ProjectCard({ 
  project, 
  index, 
  viewMode,
  onEdit,
  onToggleStatus 
}: ProjectCardProps) {
  const config = statusConfig[project.status];
  const progressColor = project.progress >= 75 
    ? "bg-emerald-500" 
    : project.progress >= 50 
      ? "bg-blue-500" 
      : project.progress >= 25 
        ? "bg-amber-500" 
        : "bg-gray-400";

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "—";
    // Use consistent formatting to prevent SSR/client hydration mismatch
    // Always use 0 fraction digits for compact notation
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      notation: "compact",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <a
          href={`/dashboard/proyectos/${project.id}`}
          className="block group"
        >
          <Card className="rounded-2xl border-gray-200/60 hover:border-gray-300 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Icono con progreso circular */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {project.name.charAt(0)}
                  </div>
                  {project.criticalIncidents > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-[9px] font-bold text-white">{project.criticalIncidents}</span>
                    </span>
                  )}
                </div>

                {/* Info principal */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                      {project.name}
                    </h3>
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] px-1.5 py-0 h-5 shrink-0 ${config.variant}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mr-1 ${config.dot}`} />
                      {config.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{project.location}</span>
                  </div>
                </div>

                {/* Progreso */}
                <div className="w-32 shrink-0 hidden sm:block">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Avance</span>
                    <span className="text-xs font-semibold text-gray-700">{project.progress}%</span>
                  </div>
                  <Progress 
                    value={project.progress} 
                    className="h-2 bg-gray-100"
                    indicatorClassName={
                      project.progress >= 75 
                        ? "bg-emerald-500" 
                        : project.progress >= 50 
                          ? "bg-blue-500" 
                          : project.progress >= 25 
                            ? "bg-amber-500" 
                            : "bg-gray-400"
                    }
                  />
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-4 shrink-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Users className="h-4 w-4" />
                        <span className="text-sm font-medium">{project.membersCount}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{project.membersCount} miembros asignados</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-gray-500">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">{project.openIncidents}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{project.openIncidents} incidencias abiertas</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Acciones */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 shrink-0"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/dashboard/proyectos/${project.id}`;
                    }}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver detalle
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.preventDefault();
                      onEdit?.(project);
                    }}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => {
                      e.preventDefault();
                      onToggleStatus?.(project);
                    }}>
                      {project.status === "ACTIVE" ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pausar proyecto
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Reactivar proyecto
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </a>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group"
    >
      <a href={`/dashboard/proyectos/${project.id}`} className="block h-full">
        <Card className="h-full rounded-3xl border-gray-200/60 hover:border-gray-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
          {/* Header con gradiente */}
          <div className="relative h-28 bg-linear-to-br from-slate-800 via-slate-700 to-slate-900 p-4">
            <div className="absolute inset-0 opacity-10">
              <div 
                className="absolute inset-0" 
                style={{ 
                  backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", 
                  backgroundSize: "16px 16px" 
                }} 
              />
            </div>
            
            {/* Badge de estado */}
            <Badge 
              variant="outline" 
              className={`absolute top-3 right-3 text-[10px] px-2 py-0.5 ${config.variant} border`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`} />
              {config.label}
            </Badge>

            {/* Icono del proyecto */}
            <div className="absolute -bottom-6 left-4">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center border-4 border-white">
                <span className="text-xl font-bold bg-linear-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {project.name.charAt(0)}
                </span>
              </div>
            </div>

            {/* Indicador crítico */}
            {project.criticalIncidents > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 left-3"
              >
                <Badge className="bg-red-500 text-white text-[10px] px-2 animate-pulse">
                  {project.criticalIncidents} Crítica{project.criticalIncidents > 1 ? "s" : ""}
                </Badge>
              </motion.div>
            )}

            {/* Menú de acciones */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute bottom-3 right-3 h-8 w-8 bg-white/10 hover:bg-white/20 text-white"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={(e) => {
                  e.preventDefault();
                  onEdit?.(project);
                }}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar proyecto
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={(e) => {
                  e.preventDefault();
                  onToggleStatus?.(project);
                }}>
                  {project.status === "ACTIVE" ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Reactivar
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <CardContent className="pt-10 pb-5 px-4">
            {/* Nombre y ubicación */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 line-clamp-1">
                {project.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{project.location}</span>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-500">Avance general</span>
                <span className="text-sm font-bold text-gray-900">{project.progress}%</span>
              </div>
              <Progress 
                value={project.progress} 
                className="h-2.5 bg-gray-100"
                indicatorClassName={
                  project.progress >= 75 
                    ? "bg-emerald-500" 
                    : project.progress >= 50 
                      ? "bg-blue-500" 
                      : project.progress >= 25 
                        ? "bg-amber-500" 
                        : "bg-gray-400"
                }
              />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 rounded-xl bg-gray-50">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Users className="h-3 w-3 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-900">{project.membersCount}</span>
                </div>
                <span className="text-[10px] text-gray-500">Miembros</span>
              </div>
              <div className="text-center p-2 rounded-xl bg-gray-50">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <AlertTriangle className="h-3 w-3 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-900">{project.openIncidents}</span>
                </div>
                <span className="text-[10px] text-gray-500">Abiertas</span>
              </div>
              <div className="text-center p-2 rounded-xl bg-gray-50">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <span className="text-sm font-semibold text-gray-900">{project.totalIncidents}</span>
                </div>
                <span className="text-[10px] text-gray-500">Total Inc.</span>
              </div>
            </div>

            {/* Fechas y presupuesto */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1 text-[10px] text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
              </div>
              {project.budget && (
                <span className="text-[10px] font-medium text-gray-600">
                  {formatCurrency(project.budgetSpent)} / {formatCurrency(project.budget)}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </a>
    </motion.div>
  );
}
