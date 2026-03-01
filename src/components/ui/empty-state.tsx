import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"
import { buttonVariants } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  /** Lucide icon to display */
  icon?: LucideIcon
  /** Main heading text */
  title: string
  /** Supporting description */
  description?: string
  /** Optional call-to-action button */
  action?: {
    label: string
    onClick?: () => void
    href?: string
    variant?: VariantProps<typeof buttonVariants>["variant"]
  }
  /** Additional className */
  className?: string
}

/**
 * EmptyState — Shown when a section has no data.
 *
 * @example
 * <EmptyState
 *   icon={FolderOpen}
 *   title="Sin proyectos"
 *   description="Crea tu primer proyecto para comenzar"
 *   action={{ label: "Crear proyecto", onClick: () => setOpen(true) }}
 * />
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 px-6 text-center",
        className
      )}
      role="status"
      aria-label={title}
    >
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <Icon className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
        </div>
      )}

      <div className="space-y-1.5 max-w-sm">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && (
        <Button
          variant={action.variant ?? "default"}
          onClick={action.onClick}
          asChild={!!action.href}
          // Minimum 44px touch target — padding already ensures this
          className="min-h-[44px]"
        >
          {action.href ? (
            <Link href={action.href}>{action.label}</Link>
          ) : (
            action.label
          )}
        </Button>
      )}
    </div>
  )
}
