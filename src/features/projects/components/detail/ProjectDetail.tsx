// components/dashboard/projects/detail/ProjectDetail.tsx - Componente principal de detalle
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Pencil,
  MoreHorizontal,
  Pause,
  Play,
  Share2,
  Download,
  Trash2,
  AlertTriangle
} from "lucide-react";
import type { 
  ProjectWithStats, 
  ProjectMemberWithDetails, 
  CriticalPathItem,
  IncidentWithDetails 
} from "@/lib/mock/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProjectOverview } from "./ProjectOverview";
import { ProjectMembersTab } from "./ProjectMembersTab";
import { ProjectTimelineTab } from "./ProjectTimelineTab";
import { ProjectIncidentsTab } from "./ProjectIncidentsTab";
import { ProjectMaterialsTab } from "./ProjectMaterialsTab";
import { mockMaterials } from "@/lib/mock/materials";
import { Package } from "lucide-react";

interface ProjectDetailProps {
  project: ProjectWithStats;
  members: ProjectMemberWithDetails[];
  criticalPath: CriticalPathItem[];
  incidents: IncidentWithDetails[];
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

export function ProjectDetail({ 
  project, 
  members, 
  criticalPath,
  incidents 
}: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const config = statusConfig[project.status];

  // Calcular stats de materiales (simulación client-side)
  const materialsWithStats: import('@/lib/mock/types').MaterialWithStats[] = useMemo(() => {
    return mockMaterials.map(m => ({
      ...m,
      availableQuantity: m.plannedQuantity - m.requestedQuantity,
      deviationPercentage: ((m.requestedQuantity - m.plannedQuantity) / m.plannedQuantity) * 100,
      hasDeviation: m.requestedQuantity > m.plannedQuantity
    }));
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header con navegación */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/proyectos">
                  Proyectos
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="truncate max-w-48">
                  {project.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header principal */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Icono del proyecto */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative shrink-0"
              >
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center shadow-xl">
                  <span className="text-2xl font-bold text-white">
                    {project.name.charAt(0)}
                  </span>
                </div>
                {project.criticalIncidents > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white animate-pulse"
                  >
                    {project.criticalIncidents}
                  </motion.span>
                )}
              </motion.div>

              {/* Info del proyecto */}
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-2 py-0.5 ${config.variant}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`} />
                    {config.label}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {project.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(project.startDate)} - {formatDate(project.endDate)}
                  </span>
                </div>
                {project.description && (
                  <p className="text-sm text-gray-600 mt-2 max-w-2xl">
                    {project.description}
                  </p>
                )}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-xl gap-2">
                <Pencil className="h-4 w-4" />
                <span className="hidden sm:inline">Editar</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-xl">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartir
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar reporte
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
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
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem 
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar proyecto
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          </div>
                          <AlertDialogTitle>Eliminar proyecto</AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-left">
                          ¿Estás seguro de que deseas eliminar <strong>"{project.name}"</strong>? 
                          Esta acción eliminará permanentemente:
                          <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                            <li>Todos los miembros asignados ({members.length})</li>
                            <li>Todas las incidencias ({incidents.length})</li>
                            <li>La ruta crítica y timeline</li>
                            <li>Fotos y documentos asociados</li>
                          </ul>
                          <p className="mt-3 font-medium text-red-600">
                            Esta acción no se puede deshacer.
                          </p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                          onClick={() => {
                            // TODO: Implementar eliminación real
                            console.log("Eliminar proyecto:", project.id);
                          }}
                        >
                          Sí, eliminar proyecto
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>

        {/* Tabs de contenido */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="h-14 w-full grid grid-cols-4 bg-gray-100/80 border border-gray-200 rounded-2xl p-1.5 gap-2">
              <TabsTrigger 
                value="overview" 
                className="h-full rounded-xl text-sm font-medium text-gray-600 data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
              >
                Resumen
              </TabsTrigger>
              <TabsTrigger 
                value="members" 
                className="h-full rounded-xl text-sm font-medium text-gray-600 data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
              >
                Equipo ({members.length})
              </TabsTrigger>
              <TabsTrigger 
                value="timeline" 
                className="h-full rounded-xl text-sm font-medium text-gray-600 data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
              >
                Ruta Crítica
              </TabsTrigger>
              <TabsTrigger 
                value="materials" 
                className="h-full rounded-xl text-sm font-medium text-gray-600 data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Package className="h-4 w-4" />
                Insumos
              </TabsTrigger>
              <TabsTrigger 
                value="incidents" 
                className="h-full rounded-xl text-sm font-medium text-gray-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                Incidencias
                {project.openIncidents > 0 && (
                  <span className="inline-flex items-center justify-center h-5 min-w-5 px-1 text-[10px] font-bold rounded-full bg-red-500 text-white">
                    {project.openIncidents}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mt-6"
              >
                <TabsContent value="overview" className="mt-0">
                  <ProjectOverview project={project} members={members} incidents={incidents} />
                </TabsContent>
                
                <TabsContent value="members" className="mt-0">
                  <ProjectMembersTab projectId={project.id} members={members} />
                </TabsContent>
                
                <TabsContent value="timeline" className="mt-0">
                  <ProjectTimelineTab items={criticalPath} />
                </TabsContent>

                <TabsContent value="materials" className="mt-0">
                  <ProjectMaterialsTab materials={materialsWithStats} />
                </TabsContent>
                
                <TabsContent value="incidents" className="mt-0">
                  <ProjectIncidentsTab incidents={incidents} />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </TooltipProvider>
  );
}
