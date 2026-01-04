/**
 * User status indicator component
 * Visual indicator for active/inactive status
 */

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface UserStatusIndicatorProps {
  isActive: boolean;
  showLabel?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function UserStatusIndicator({
  isActive,
  showLabel = false,
  size = "default",
  className,
}: UserStatusIndicatorProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    default: "w-2.5 h-2.5",
    lg: "w-3 h-3",
  };

  const labelSizeClasses = {
    sm: "text-xs",
    default: "text-xs",
    lg: "text-sm",
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={cn(
          "rounded-full",
          sizeClasses[size],
          isActive
            ? "bg-success shadow-sm shadow-success/50"
            : "bg-muted-foreground"
        )}
      />
      {showLabel && (
        <span
          className={cn(
            "font-medium",
            labelSizeClasses[size],
            isActive ? "text-success" : "text-muted-foreground"
          )}
        >
          {isActive ? "Activo" : "Inactivo"}
        </span>
      )}
    </div>
  );
}

/**
 * Status badge with background
 */
export function UserStatusBadge({
  isActive,
  className,
}: {
  isActive: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
        isActive
          ? "bg-success/10 text-success"
          : "bg-muted text-muted-foreground",
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          isActive ? "bg-success" : "bg-muted-foreground"
        )}
      />
      {isActive ? "Activo" : "Inactivo"}
    </span>
  );
}
