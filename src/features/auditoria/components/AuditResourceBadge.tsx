/**
 * Badge para mostrar tipo de recurso afectado
 * Incluye iconos para mejor identificación visual
 */

import { Badge } from "@/components/ui/badge";
import {
  FileText,
  FolderKanban,
  User,
  MessageSquare,
  Image,
  Building2,
  Route,
  Users,
  FileBarChart,
} from "lucide-react";
import type { AuditResourceType } from "@/lib/mock/types";

interface AuditResourceBadgeProps {
  type: AuditResourceType;
  id?: string;
  size?: "sm" | "default";
}

const RESOURCE_CONFIG: Record<
  AuditResourceType,
  { label: string; icon: typeof FileText; color: string }
> = {
  incident: { label: "Incidencia", icon: FileText, color: "text-warning" },
  project: { label: "Proyecto", icon: FolderKanban, color: "text-primary" },
  user: { label: "Usuario", icon: User, color: "text-primary" },
  comment: { label: "Comentario", icon: MessageSquare, color: "text-success" },
  photo: { label: "Foto", icon: Image, color: "text-primary" },
  organization: { label: "Organización", icon: Building2, color: "text-primary" },
  critical_path: { label: "Ruta Crítica", icon: Route, color: "text-warning" },
  project_member: { label: "Miembro", icon: Users, color: "text-info" },
  report: { label: "Reporte", icon: FileBarChart, color: "text-destructive" },
};

export function AuditResourceBadge({ type, id, size = "default" }: AuditResourceBadgeProps) {
  const config = RESOURCE_CONFIG[type];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={size === "sm" ? "text-xs" : ""}>
      <Icon className={`mr-1 h-3 w-3 ${config.color}`} />
      {config.label}
      {id && <span className="ml-1 text-muted-foreground">#{id.slice(-4)}</span>}
    </Badge>
  );
}
