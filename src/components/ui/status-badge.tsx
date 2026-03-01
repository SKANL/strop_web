import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type IncidentStatus = "OPEN" | "IN_REVIEW" | "CLOSED" | "REJECTED" | "DRAFT"

interface StatusConfig {
  label: string
  dotColor: string
  badgeClass: string
}

const STATUS_CONFIG: Record<IncidentStatus, StatusConfig> = {
  OPEN: {
    label: "Abierto",
    dotColor: "bg-red-500",
    badgeClass:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400",
  },
  IN_REVIEW: {
    label: "En Revisión",
    dotColor: "bg-amber-500",
    badgeClass:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400",
  },
  CLOSED: {
    label: "Cerrado",
    dotColor: "bg-emerald-500",
    badgeClass:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
  REJECTED: {
    label: "Rechazado",
    dotColor: "bg-zinc-500",
    badgeClass:
      "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-400",
  },
  DRAFT: {
    label: "Borrador",
    dotColor: "bg-blue-400",
    badgeClass:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400",
  },
}

interface StatusBadgeProps {
  status: IncidentStatus | string
  className?: string
  /** Show animated pulse dot for active states */
  showDot?: boolean
}

/**
 * StatusBadge — Centralised badge for incident status.
 * Single source of truth for all status labels and colours.
 *
 * @example
 * <StatusBadge status="OPEN" showDot />
 * <StatusBadge status="CLOSED" />
 */
export function StatusBadge({ status, className, showDot = false }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status as IncidentStatus] ?? {
    label: status,
    dotColor: "bg-zinc-400",
    badgeClass: "border-zinc-200 bg-zinc-50 text-zinc-700",
  }

  const isLive = status === "OPEN" || status === "IN_REVIEW"

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium",
        config.badgeClass,
        className
      )}
    >
      {showDot && (
        <span
          className={cn(
            "inline-block h-1.5 w-1.5 shrink-0 rounded-full",
            config.dotColor,
            isLive && "animate-pulse"
          )}
          aria-hidden="true"
        />
      )}
      {config.label}
    </Badge>
  )
}
