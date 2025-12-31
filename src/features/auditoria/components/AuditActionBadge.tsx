/**
 * Badge para mostrar tipo de acción de auditoría
 * Componente reutilizable con colores semánticos
 */

import { Badge } from "@/components/ui/badge";
import type { AuditAction } from "@/lib/mock/types";

interface AuditActionBadgeProps {
  action: AuditAction;
  size?: "sm" | "default";
}

const ACTION_CONFIG: Record<
  AuditAction,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  CREATE: { label: "Crear", variant: "default" },
  UPDATE: { label: "Actualizar", variant: "secondary" },
  DELETE: { label: "Eliminar", variant: "destructive" },
  LOGIN: { label: "Login", variant: "outline" },
  LOGOUT: { label: "Logout", variant: "outline" },
  EXPORT: { label: "Exportar", variant: "secondary" },
  IMPORT: { label: "Importar", variant: "secondary" },
  VIEW: { label: "Ver", variant: "outline" },
};

export function AuditActionBadge({ action, size = "default" }: AuditActionBadgeProps) {
  const config = ACTION_CONFIG[action];

  return (
    <Badge variant={config.variant} className={size === "sm" ? "text-xs" : ""}>
      {config.label}
    </Badge>
  );
}
