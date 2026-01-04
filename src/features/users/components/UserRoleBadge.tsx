/**
 * User role badge component with color coding
 * Displays user role with appropriate styling
 */

import { Badge } from "@/components/ui/badge";
import type { UserRole } from "@/lib/mock/types";
import { roleLabels } from "@/lib/mock/types";
import { cn } from "@/lib/utils";

interface UserRoleBadgeProps {
  role: UserRole;
  size?: "sm" | "default" | "lg";
  className?: string;
}

const roleStyles: Record<UserRole, string> = {
  OWNER: "bg-warning/10 text-warning border-warning/20 hover:bg-warning/15",
  SUPERINTENDENT: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15",
  RESIDENT: "bg-info/10 text-info border-info/20 hover:bg-info/15",
  CABO: "bg-success/10 text-success border-success/20 hover:bg-success/15",
};

const roleIcons: Record<UserRole, string> = {
  OWNER: "👑",
  SUPERINTENDENT: "🏗️",
  RESIDENT: "📋",
  CABO: "🔧",
};

export function UserRoleBadge({ role, size = "default", className }: UserRoleBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    default: "text-xs px-2 py-0.5",
    lg: "text-sm px-3 py-1",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border",
        roleStyles[role],
        sizeClasses[size],
        className
      )}
    >
      <span className="mr-1">{roleIcons[role]}</span>
      {roleLabels[role]}
    </Badge>
  );
}

/**
 * Simple role indicator (just the icon)
 */
export function UserRoleIcon({ role, className }: { role: UserRole; className?: string }) {
  return (
    <span className={cn("text-sm", className)} title={roleLabels[role]}>
      {roleIcons[role]}
    </span>
  );
}
