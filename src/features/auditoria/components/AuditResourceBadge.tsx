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
  incident: { label: "Incidencia", icon: FileText, color: "text-orange-500" },
  project: { label: "Proyecto", icon: FolderKanban, color: "text-blue-500" },
  user: { label: "Usuario", icon: User, color: "text-purple-500" },
  comment: { label: "Comentario", icon: MessageSquare, color: "text-green-500" },
  photo: { label: "Foto", icon: Image, color: "text-pink-500" },
  organization: { label: "Organización", icon: Building2, color: "text-indigo-500" },
  critical_path: { label: "Ruta Crítica", icon: Route, color: "text-yellow-500" },
  project_member: { label: "Miembro", icon: Users, color: "text-teal-500" },
  report: { label: "Reporte", icon: FileBarChart, color: "text-red-500" },
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
