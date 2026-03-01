import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react"

interface KPICardProps {
  /** Card title */
  title: string
  /** Main value to display */
  value: string | number
  /** Supporting description below the value */
  description?: string
  /** Lucide icon */
  icon?: LucideIcon
  /** Optional trend indicator (positive = green, negative = red) */
  trend?: {
    value: number
    label?: string
  }
  /**
   * Visual variant.
   * - default: neutral card
   * - danger: red accent (for risk/critical KPIs)
   * - success: green accent (for recovered/positive KPIs)
   */
  variant?: "default" | "danger" | "success"
  className?: string
}

/**
 * KPICard — Standardised Key Performance Indicator card.
 *
 * @example
 * <KPICard
 *   title="Dinero en Riesgo"
 *   value="$1,200,000"
 *   description="En 12 incidencias abiertas"
 *   icon={DollarSign}
 *   variant="danger"
 *   trend={{ value: -5, label: "vs semana pasada" }}
 * />
 */
export function KPICard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: KPICardProps) {
  const valueClass = cn("text-2xl font-bold font-mono tabular-nums", {
    "text-destructive": variant === "danger",
    "text-emerald-600 dark:text-emerald-500": variant === "success",
  })

  const trendPositive = trend && trend.value >= 0
  const TrendIcon = trendPositive ? TrendingUp : TrendingDown
  const trendClass = trendPositive
    ? "text-emerald-600 dark:text-emerald-500"
    : "text-destructive"

  const iconClass = cn("h-4 w-4", {
    "text-destructive": variant === "danger",
    "text-emerald-600 dark:text-emerald-500": variant === "success",
    "text-muted-foreground": variant === "default",
  })

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon
            className={iconClass}
            aria-hidden="true"
          />
        )}
      </CardHeader>
      <CardContent>
        <div className={valueClass}>{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className={cn("flex items-center gap-1 mt-2 text-xs", trendClass)}>
            <TrendIcon className="h-3 w-3" aria-hidden="true" />
            <span>
              {trendPositive ? "+" : ""}
              {trend.value}%{trend.label ? ` ${trend.label}` : ""}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
