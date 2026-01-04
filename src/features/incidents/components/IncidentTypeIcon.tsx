/**
 * Icono visual para cada tipo de incidencia
 * Basado en los tipos definidos en REQUIREMENTS_V2.md
 */

import { 
  FileText, 
  MessageSquare, 
  Award, 
  AlertTriangle, 
  Package,
  type LucideIcon
} from "lucide-react";
import type { IncidentType } from "@/lib/mock/types";

interface IncidentTypeIconProps {
  type: IncidentType;
  className?: string;
  size?: number;
}

const iconMap: Record<IncidentType, LucideIcon> = {
  ORDERS_INSTRUCTIONS: FileText,
  REQUESTS_QUERIES: MessageSquare,
  CERTIFICATIONS: Award,
  INCIDENT_NOTIFICATIONS: AlertTriangle,
  MATERIAL_REQUEST: Package,
};

const colorMap: Record<IncidentType, string> = {
  ORDERS_INSTRUCTIONS: "text-primary",
  REQUESTS_QUERIES: "text-primary",
  CERTIFICATIONS: "text-success",
  INCIDENT_NOTIFICATIONS: "text-warning",
  MATERIAL_REQUEST: "text-warning",
};

export function IncidentTypeIcon({ 
  type, 
  className = "", 
  size = 16 
}: IncidentTypeIconProps) {
  const Icon = iconMap[type];
  const colorClass = colorMap[type];
  
  return (
    <Icon 
      className={`${colorClass} ${className}`} 
      size={size} 
    />
  );
}

export { iconMap, colorMap };
