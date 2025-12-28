// islands/IncidentsTable.tsx - Tabla de incidencias (movida a island)
"use client";

import { motion } from "motion/react";
import { AlertTriangle, ChevronRight, Clock, MapPin, User } from "lucide-react";
import type { IncidentUI } from "@/lib/mock";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface IncidentsTableProps {
  incidents: IncidentUI[];
  maxItems?: number;
}

export function IncidentsTable({ incidents, maxItems = 6 }: IncidentsTableProps) {
  const sortedIncidents = [...incidents].sort((a, b) => {
    if (a.priority === "CRITICAL" && b.priority !== "CRITICAL") return -1;
    if (a.priority !== "CRITICAL" && b.priority === "CRITICAL") return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  const displayIncidents = sortedIncidents.slice(0, maxItems);

  const getPriorityVariant = (priority: IncidentUI["priority"]) => {
    return priority === "CRITICAL" 
      ? "bg-red-100 text-red-700 border-red-200" 
      : "bg-gray-100 text-gray-600 border-gray-200";
  };

  const getStatusVariant = (status: IncidentUI["status"]) => {
    switch (status) {
      case "OPEN":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "ASSIGNED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "CLOSED":
        return "bg-green-100 text-green-700 border-green-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Hace menos de 1h";
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <Card className="rounded-3xl border-gray-200/60 shadow-sm py-0 gap-0">
      <CardHeader className="p-4 pb-3 border-b-0">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-100">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <CardTitle className="text-sm font-semibold text-gray-700">Incidencias</CardTitle>
        </div>
        <CardAction>
          <a href="/dashboard/incidencias" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-0.5">
            Ver todas <ChevronRight className="h-3 w-3" />
          </a>
        </CardAction>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0">
        <ScrollArea className="h-100 pr-2">
          <div className="space-y-1">
            {displayIncidents.map((incident, index) => (
              <HoverCard key={incident.id} openDelay={300} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <motion.a
                    href={`/dashboard/incidencias/${incident.id}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: index * 0.02 }}
                    className={`block p-2.5 rounded-lg border transition-all group cursor-pointer ${
                      incident.priority === "CRITICAL" 
                        ? "border-red-200 bg-red-50/40 hover:bg-red-50/70" 
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Avatar className="h-6 w-6 shrink-0 mt-0.5">
                        <AvatarImage src={incident.createdByAvatar} alt={incident.createdBy} />
                        <AvatarFallback className="text-[9px] bg-gray-100">{getInitials(incident.createdBy)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 group-hover:text-gray-900 line-clamp-2 leading-relaxed">
                          {incident.priority === "CRITICAL" && (
                            <span className="inline-flex items-center gap-1 text-red-600 font-medium mr-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                            </span>
                          )}
                          {incident.description}
                        </p>
                        
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] text-gray-400">{incident.projectName}</span>
                          <Badge variant="outline" className={`text-[8px] px-1.5 h-4 ${getStatusVariant(incident.status)}`}>
                            {incident.status === "OPEN" ? "Abierta" : incident.status === "ASSIGNED" ? "Asignada" : "Cerrada"}
                          </Badge>
                          <span className="text-[10px] text-gray-400 ml-auto">{formatDate(incident.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.a>
                </HoverCardTrigger>

                <HoverCardContent side="left" align="start" className="w-72 p-3">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={incident.createdByAvatar} />
                        <AvatarFallback>{getInitials(incident.createdBy)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900">{incident.createdBy}</p>
                        <p className="text-[10px] text-gray-400">{formatDate(incident.createdAt)}</p>
                      </div>
                      <Badge className={`text-[9px] ${getPriorityVariant(incident.priority)}`}>
                        {incident.priority === "CRITICAL" ? "Crítico" : "Normal"}
                      </Badge>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed">{incident.description}</p>

                    <div className="flex items-center gap-3 pt-1 border-t text-[10px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5" /> {incident.projectName}
                      </span>
                      {incident.assignedTo && (
                        <span className="flex items-center gap-1">
                          <User className="h-2.5 w-2.5" /> {incident.assignedTo}
                        </span>
                      )}
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
