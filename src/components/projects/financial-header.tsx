"use client"

import { useMemo } from "react"
import { Progress } from "@/components/ui/progress"
import { Lock } from "lucide-react"
import { useCapabilities } from "@/hooks/use-capabilities"
import type { Database } from "@/types/supabase"

type Incident = Database['public']['Tables']['incidents']['Row']

interface ProjectFinancialHeaderProps {
  incidents: Incident[]
  contingencyBudget: number | null
}

export function FinancialHeader({ incidents, contingencyBudget }: ProjectFinancialHeaderProps) {
  const { can } = useCapabilities()
  const canViewCosts = can('financial.view_costs')

  const kpis = useMemo(() => {
    const budget = contingencyBudget || 0

    // Riesgo activo: costs tied to open/in-review incidents
    const activeRisk = incidents
      .filter(i => i.status === 'OPEN' || i.status === 'IN_REVIEW')
      .reduce((sum, i) => sum + ((i.actual_cost as number) || (i.estimated_cost as number) || 0), 0)

    // Recuperado: actual costs on closed incidents (resolved/charged)
    const recovered = incidents
      .filter(i => i.status === 'CLOSED')
      .reduce((sum, i) => sum + ((i.actual_cost as number) || 0), 0)

    // Budget consumed (all incidents)
    const allCosts = incidents.reduce(
      (sum, i) => sum + ((i.actual_cost as number) || (i.estimated_cost as number) || 0),
      0
    )
    const budgetUsedPct = budget > 0 ? Math.min(100, (allCosts / budget) * 100) : 0

    // Operational health: % non-rejected incidents closed
    const countable = incidents.filter(i => i.status !== 'REJECTED')
    const closed = countable.filter(i => i.status === 'CLOSED')
    const healthPct = countable.length > 0 ? (closed.length / countable.length) * 100 : 100

    const criticalOpen = incidents.filter(
      i => (i.priority === 'CRITICAL' || i.priority === 'URGENT') && i.status !== 'CLOSED' && i.status !== 'REJECTED'
    ).length
    const openCount = incidents.filter(i => i.status === 'OPEN' || i.status === 'IN_REVIEW').length

    return { activeRisk, recovered, budgetUsedPct, healthPct, criticalOpen, openCount, allCosts, budget }
  }, [incidents, contingencyBudget])

  const fmtMXN = (val: number) =>
    val.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 })

  return (
    <div className="flex flex-col gap-4 border-b bg-background/95 p-4 backdrop-blur supports-backdrop-filter:bg-background/60 md:flex-row md:items-center md:justify-between shadow-sm">
      <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:gap-8">

        {/* Riesgo Activo */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Riesgo Activo</p>
          {canViewCosts ? (
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-destructive font-mono">{fmtMXN(kpis.activeRisk)}</span>
              <span className="text-xs text-muted-foreground">{kpis.openCount} activas</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span className="text-sm">Restringido</span>
            </div>
          )}
        </div>

        <div className="h-px w-full bg-border md:hidden" />
        <div className="hidden h-10 w-px bg-border md:block" />

        {/* Recuperado */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recuperado</p>
          {canViewCosts ? (
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-green-600 font-mono">{fmtMXN(kpis.recovered)}</span>
              <span className="text-xs text-muted-foreground">Costos cerrados</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span className="text-sm">Restringido</span>
            </div>
          )}
        </div>

        <div className="h-px w-full bg-border md:hidden" />
        <div className="hidden h-10 w-px bg-border md:block" />

        {/* Salud Operativa */}
        <div className="flex-1 space-y-2 min-w-[200px] max-w-xs">
          <div className="flex justify-between text-xs font-medium">
            <span>Salud Operativa</span>
            <span className="text-muted-foreground">{kpis.criticalOpen} Críticas | {kpis.openCount} Abiertas</span>
          </div>
          <Progress
            value={kpis.healthPct}
            className={`h-2 ${kpis.healthPct >= 70 ? '[&>div]:bg-green-500' : kpis.healthPct >= 40 ? '[&>div]:bg-orange-500' : '[&>div]:bg-destructive'}`}
          />
          <p className="text-xs text-muted-foreground">{Math.round(kpis.healthPct)}% resueltas</p>
        </div>

        {/* Fondo de Contingencia — solo si hay presupuesto y puede ver costos */}
        {kpis.budget > 0 && canViewCosts && (
          <>
            <div className="h-px w-full bg-border md:hidden" />
            <div className="hidden h-10 w-px bg-border md:block" />
            <div className="flex-1 space-y-2 min-w-[200px] max-w-xs">
              <div className="flex justify-between text-xs font-medium">
                <span>Fondo Contingencia</span>
                <span className="text-muted-foreground">{fmtMXN(kpis.allCosts)} / {fmtMXN(kpis.budget)}</span>
              </div>
              <Progress
                value={kpis.budgetUsedPct}
                className={`h-2 ${kpis.budgetUsedPct <= 60 ? '[&>div]:bg-green-500' : kpis.budgetUsedPct <= 85 ? '[&>div]:bg-orange-500' : '[&>div]:bg-destructive'}`}
              />
              <p className="text-xs text-muted-foreground">{Math.round(kpis.budgetUsedPct)}% del fondo consumido</p>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
