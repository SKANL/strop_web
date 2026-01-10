// components/dashboard/projects/detail/ProjectIncidentsTab.tsx - Tab de incidencias del proyecto
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  MapPin,
  Camera,
  MessageSquare,
  ChevronRight,
  Plus
} from "lucide-react";
import type { IncidentWithDetails, IncidentStatus, IncidentPriority } from "@/lib/mock/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProjectIncidentsTabProps {
  incidents: IncidentWithDetails[];
}

const typeLabels: Record<string, string> = {
  ORDERS_INSTRUCTIONS: "Órdenes e Instrucciones",
  REQUESTS_QUERIES: "Solicitudes y Consultas",
  CERTIFICATIONS: "Certificaciones",
  INCIDENT_NOTIFICATIONS: "Notificaciones",
  // MATERIAL_REQUEST eliminado del MVP
};

const statusConfig: Record<IncidentStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  OPEN: { 
    label: "Abierta", 
    color: "text-warning", 
    bg: "bg-warning/10",
    icon: AlertTriangle 
  },
  ASSIGNED: { 
    label: "Asignada", 
    color: "text-info", 
    bg: "bg-info/10",
    icon: User 
  },
  CLOSED: { 
    label: "Cerrada", 
    color: "text-success", 
    bg: "bg-success/10",
    icon: CheckCircle2 
  },
};

export function ProjectIncidentsTab({ incidents }: ProjectIncidentsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<IncidentPriority | "ALL">("ALL");

  const filteredIncidents = useMemo(() => {
    let result = [...incidents];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(i => 
        i.description.toLowerCase().includes(query) ||
        i.createdByName.toLowerCase().includes(query) ||
        i.locationName?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter(i => i.status === statusFilter);
    }

    if (priorityFilter !== "ALL") {
      result = result.filter(i => i.priority === priorityFilter);
    }

    // Ordenar por fecha, más recientes primero
    result.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return result;
  }, [incidents, searchQuery, statusFilter, priorityFilter]);

  const stats = useMemo(() => ({
    total: incidents.length,
    open: incidents.filter(i => i.status === "OPEN").length,
    assigned: incidents.filter(i => i.status === "ASSIGNED").length,
    closed: incidents.filter(i => i.status === "CLOSED").length,
    critical: incidents.filter(i => i.priority === "CRITICAL" && i.status !== "CLOSED").length,
  }), [incidents]);

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Hace menos de 1 hora";
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
    
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats pills con ToggleGroup */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-2"
      >
        <ToggleGroup 
          type="single" 
          value={priorityFilter === "CRITICAL" ? "CRITICAL" : statusFilter}
          onValueChange={(value) => {
            if (value === "CRITICAL") {
              setPriorityFilter("CRITICAL");
              setStatusFilter("ALL");
            } else if (value) {
              setStatusFilter(value as IncidentStatus | "ALL");
              setPriorityFilter("ALL");
            }
          }}
          className="flex flex-wrap gap-2"
        >
          <ToggleGroupItem 
            value="ALL" 
            className="px-4 py-2 h-auto rounded-xl text-sm font-medium data-[state=on]:bg-foreground data-[state=on]:text-background data-[state=on]:shadow-lg bg-muted text-muted-foreground hover:bg-muted/80 border-0"
          >
            Todas ({stats.total})
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="OPEN" 
            className="px-4 py-2 h-auto rounded-xl text-sm font-medium gap-2 data-[state=on]:bg-warning data-[state=on]:text-warning-foreground data-[state=on]:shadow-lg bg-warning/10 text-warning hover:bg-warning/20 border-0"
          >
            <AlertTriangle className="h-4 w-4" />
            Abiertas ({stats.open})
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="ASSIGNED" 
            className="px-4 py-2 h-auto rounded-xl text-sm font-medium gap-2 data-[state=on]:bg-info data-[state=on]:text-info-foreground data-[state=on]:shadow-lg bg-info/10 text-info hover:bg-info/20 border-0"
          >
            <User className="h-4 w-4" />
            Asignadas ({stats.assigned})
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="CLOSED" 
            className="px-4 py-2 h-auto rounded-xl text-sm font-medium gap-2 data-[state=on]:bg-success data-[state=on]:text-success-foreground data-[state=on]:shadow-lg bg-success/10 text-success hover:bg-success/20 border-0"
          >
            <CheckCircle2 className="h-4 w-4" />
            Cerradas ({stats.closed})
          </ToggleGroupItem>
          {stats.critical > 0 && (
            <ToggleGroupItem 
              value="CRITICAL" 
              className="px-4 py-2 h-auto rounded-xl text-sm font-medium gap-2 data-[state=on]:bg-destructive data-[state=on]:text-destructive-foreground data-[state=on]:shadow-lg data-[state=on]:animate-pulse bg-destructive/10 text-destructive hover:bg-destructive/20 border-0"
            >
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              Críticas ({stats.critical})
            </ToggleGroupItem>
          )}
        </ToggleGroup>
      </motion.div>

      {/* Filtros y búsqueda */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar incidencias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            inputSize="lg"
            className="pl-10"
          />
        </div>
        
        <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Nueva Incidencia
        </Button>
      </motion.div>

      {/* Lista de incidencias */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredIncidents.length > 0 ? (
            filteredIncidents.map((incident, index) => {
              const config = statusConfig[incident.status];
              const Icon = config.icon;

              return (
                <motion.div
                  key={incident.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  <Card className={`rounded-2xl border-border hover:shadow-md transition-all cursor-pointer group ${
                    incident.priority === "CRITICAL" && incident.status !== "CLOSED"
                      ? "border-l-4 border-l-destructive"
                      : ""
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Avatar del creador */}
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={incident.createdByAvatar} />
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {getInitials(incident.createdByName)}
                          </AvatarFallback>
                        </Avatar>

                        {/* Contenido */}
                        <div className="flex-1 min-w-0">
                          {/* Header con tipo y prioridad */}
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge variant="outline" size="sm" className="bg-muted">
                              {typeLabels[incident.type] || incident.type}
                            </Badge>
                            {incident.priority === "CRITICAL" && (
                              <Badge size="sm" className="bg-destructive text-destructive-foreground animate-pulse">
                                CRÍTICA
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground ml-auto">
                              {formatDate(incident.createdAt)}
                            </span>
                          </div>

                          {/* Descripción */}
                          <p className="text-sm text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {incident.description}
                          </p>

                          {/* Meta info */}
                          <div className="flex items-center flex-wrap gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {incident.createdByName}
                            </span>
                            {incident.locationName && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {incident.locationName}
                              </span>
                            )}
                            {incident.photosCount > 0 && (
                              <span className="flex items-center gap-1">
                                <Camera className="h-3 w-3" />
                                {incident.photosCount}
                              </span>
                            )}
                            {incident.commentsCount > 0 && (
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {incident.commentsCount}
                              </span>
                            )}
                            
                            {/* Asignado a */}
                            {incident.assignedToName && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="flex items-center gap-1 text-primary">
                                    <ChevronRight className="h-3 w-3" />
                                    <Avatar className="h-5 w-5">
                                      <AvatarImage src={incident.assignedToAvatar} />
                                      <AvatarFallback className="text-xs">
                                        {getInitials(incident.assignedToName)}
                                      </AvatarFallback>
                                    </Avatar>
                                    {incident.assignedToName.split(" ")[0]}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Asignada a {incident.assignedToName}
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </div>

                        {/* Estado */}
                        <div className="shrink-0 flex flex-col items-end gap-2">
                          <Badge 
                            variant="outline" 
                            className={`${config.bg} ${config.color} border-0 gap-1`}
                          >
                            <Icon className="h-3 w-3" />
                            {config.label}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <EmptyState
              icon={Search}
              title="No se encontraron incidencias"
              description={
                searchQuery || statusFilter !== "ALL" || priorityFilter !== "ALL"
                  ? "Intenta modificar los filtros de búsqueda"
                  : "Este proyecto aún no tiene incidencias registradas"
              }
              secondaryAction={
                (searchQuery || statusFilter !== "ALL" || priorityFilter !== "ALL")
                  ? {
                      label: "Limpiar filtros",
                      onClick: () => {
                        setSearchQuery("");
                        setStatusFilter("ALL");
                        setPriorityFilter("ALL");
                      },
                      variant: "outline",
                    }
                  : undefined
              }
              className="py-16"
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Contador */}
      {filteredIncidents.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-muted-foreground"
        >
          Mostrando {filteredIncidents.length} de {incidents.length} incidencias
        </motion.div>
      )}
    </div>
  );
}
