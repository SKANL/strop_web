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
    sm: "text-[10px]",
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
            ? "bg-emerald-500 shadow-sm shadow-emerald-500/50"
            : "bg-gray-400"
        )}
      />
      {showLabel && (
        <span
          className={cn(
            "font-medium",
            labelSizeClasses[size],
            isActive ? "text-emerald-700" : "text-gray-500"
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
          ? "bg-emerald-100 text-emerald-700"
          : "bg-gray-100 text-gray-600",
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          isActive ? "bg-emerald-500" : "bg-gray-400"
        )}
      />
      {isActive ? "Activo" : "Inactivo"}
    </span>
  );
}
