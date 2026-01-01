/**
 * Individual log item card for timeline display
 * With selection checkbox, category badge, and integrity indicators
 */

"use client";

import { motion } from "motion/react";
import { useStore } from "@nanostores/react";
import {
  HardHat,
  Package,
  AlertTriangle,
  CloudRain,
  Ban,
  FileText,
  MapPin,
  Clock,
  Link2,
  AlertCircle,
  ImageIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { OperationalLog, LogCategory } from "../types";
import { categoryLabels, categoryColors } from "../types";
import { isExtemporaneous } from "@/lib/mock/operational-logs";
import { $selectedLogIds, toggleSelection, openDetail } from "../stores/bitacoraStore";

interface LogItemCardProps {
  log: OperationalLog;
  index?: number;
}

const categoryIcons: Record<LogCategory, React.ElementType> = {
  AVANCE: HardHat,
  MATERIAL: Package,
  HSE: AlertTriangle,
  CLIMA: CloudRain,
  BLOQUEO: Ban,
  ADMINISTRATIVA: FileText,
};

export function LogItemCard({ log, index = 0 }: LogItemCardProps) {
  const selectedIds = useStore($selectedLogIds);
  const isSelected = selectedIds.includes(log.id);
  const isLate = isExtemporaneous(log);
  const CategoryIcon = categoryIcons[log.category];

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      layoutId={`log-${log.id}`}
      whileHover={{ scale: 1.01 }}
      className="relative"
    >
      <Card
        className={cn(
          "p-4 cursor-pointer transition-shadow hover:shadow-md",
          isSelected && "ring-2 ring-primary bg-primary/5"
        )}
        onClick={() => openDetail(log.id)}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleSelection(log.id);
            }}
          >
            <Checkbox checked={isSelected} />
          </div>

          {/* Category Icon */}
          <div
            className={cn(
              "p-2 rounded-lg shrink-0",
              categoryColors[log.category].split(" ")[0],
              categoryColors[log.category].split(" ")[1]
            )}
          >
            <CategoryIcon className="h-4 w-4" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-1">
            {/* Header row */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className={cn("text-xs", categoryColors[log.category])}
              >
                {categoryLabels[log.category]}
              </Badge>
              <span className="text-xs text-muted-foreground">
                #{log.folio}
              </span>
              {isLate && (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="secondary" className="text-xs gap-1 bg-amber-100 text-amber-700">
                      <AlertCircle className="h-3 w-3" />
                      Extemporáneo
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    Registrado más de 24h después del evento
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Title */}
            <p className="font-medium text-sm line-clamp-2">{log.content.title}</p>

            {/* Meta row */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={log.author.avatar} />
                  <AvatarFallback className="text-[8px]">
                    {getInitials(log.author.name)}
                  </AvatarFallback>
                </Avatar>
                <span>{log.author.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(log.userDate)}
              </div>
              {log.evidence.photos.length > 0 && (
                <div className="flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" />
                  {log.evidence.photos.length}
                </div>
              )}
            </div>
          </div>

          {/* Right indicators */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            {/* Integrity badge */}
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={cn(
                    "p-1 rounded-full",
                    log.integrity.verified
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-red-100 text-red-600"
                  )}
                >
                  <Link2 className="h-3 w-3" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {log.integrity.verified ? "Cadena verificada" : "Cadena rota"}
                <br />
                <code className="text-[10px]">{log.integrity.hash}</code>
              </TooltipContent>
            </Tooltip>

            {/* Geofence badge */}
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={cn(
                    "p-1 rounded-full",
                    log.gps.inGeofence
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-amber-100 text-amber-600"
                  )}
                >
                  <MapPin className="h-3 w-3" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {log.gps.inGeofence ? "Dentro de obra" : "Fuera de geofence"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
