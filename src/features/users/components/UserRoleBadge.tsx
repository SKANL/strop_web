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
  OWNER: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100/80",
  SUPERINTENDENT: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100/80",
  RESIDENT: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100/80",
  CABO: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100/80",
};

const roleIcons: Record<UserRole, string> = {
  OWNER: "👑",
  SUPERINTENDENT: "🏗️",
  RESIDENT: "📋",
  CABO: "🔧",
};

export function UserRoleBadge({ role, size = "default", className }: UserRoleBadgeProps) {
  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5",
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
