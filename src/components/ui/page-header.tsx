import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import React from "react"

interface PageHeaderProps {
  title: string
  subtitle?: string
  /** Slot for buttons/actions on the right */
  actions?: React.ReactNode
  className?: string
}

/**
 * PageHeader — Consistent page-level heading used across all dashboard sections.
 *
 * @example
 * <PageHeader
 *   title="Directorio de Proyectos"
 *   subtitle="Gestiona, monitorea y crea nuevos proyectos."
 *   actions={<Button>Crear proyecto</Button>}
 * />
 */
export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("shrink-0", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>
      <Separator className="mt-4" />
    </div>
  )
}
