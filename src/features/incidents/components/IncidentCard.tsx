/**
 * Tarjeta individual de incidencia
 * Con animaciones Motion para hover y tap
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { IncidentTypeIcon } from "./IncidentTypeIcon";
import { 
  Camera, 
  MessageSquare, 
  MapPin,
  Clock
} from "lucide-react";
import { 
  type IncidentWithDetails,
  incidentTypeLabels,
  priorityLabels,
  statusLabels
} from "@/lib/mock/types";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface IncidentCardProps {
  incident: IncidentWithDetails;
  onClick?: () => void;
}

const priorityVariants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
  NORMAL: "secondary",
  CRITICAL: "destructive",
};

const statusColors: Record<string, string> = {
  OPEN: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
  ASSIGNED: "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30",
  CLOSED: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
};

export function IncidentCard({ incident, onClick }: IncidentCardProps) {
  // Use client-side only rendering for time-based values to avoid hydration mismatch
  const [timeAgo, setTimeAgo] = useState<string>("");
  
  useEffect(() => {
    setTimeAgo(
      formatDistanceToNow(new Date(incident.createdAt), {
        addSuffix: true,
        locale: es,
      })
    );
  }, [incident.createdAt]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: "spring",
        duration: 0.3,
        bounce: 0.2
      }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="hover:border-primary/50 transition-colors">
        <CardContent className="p-4">
          {/* Header: Tipo + Badges */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <IncidentTypeIcon type={incident.type} size={18} />
              <span className="text-sm font-medium text-muted-foreground">
                {incidentTypeLabels[incident.type]}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge variant={priorityVariants[incident.priority]}>
                {priorityLabels[incident.priority]}
              </Badge>
              <Badge className={statusColors[incident.status]}>
                {statusLabels[incident.status]}
              </Badge>
            </div>
          </div>

          {/* Descripción */}
          <p className="text-sm text-foreground line-clamp-2 mb-3">
            {incident.description}
          </p>

          {/* Ubicación */}
          {incident.locationName && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
              <MapPin className="size-3" />
              <span className="truncate">{incident.locationName}</span>
            </div>
          )}

          {/* Footer: Avatar + Metadata */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="size-6">
                        <AvatarImage src={incident.createdByAvatar} />
                        <AvatarFallback className="text-[10px]">
                          {getInitials(incident.createdByName)}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Creado por {incident.createdByName}</p>
                    </TooltipContent>
                  </Tooltip>
              
              {incident.assignedToName && (
                <>
                  <span className="text-muted-foreground">→</span>
                  <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="size-6">
                          <AvatarImage src={incident.assignedToAvatar} />
                          <AvatarFallback className="text-[10px]">
                            {getInitials(incident.assignedToName)}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Asignado a {incident.assignedToName}</p>
                      </TooltipContent>
                    </Tooltip>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {incident.photosCount > 0 && (
                <div className="flex items-center gap-1">
                  <Camera className="size-3" />
                  <span>{incident.photosCount}</span>
                </div>
              )}
              {incident.commentsCount > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="size-3" />
                  <span>{incident.commentsCount}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="size-3" />
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>

          {/* Project Badge */}
          <div className="mt-3">
            <Badge variant="outline" className="text-xs">
              {incident.projectName}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
