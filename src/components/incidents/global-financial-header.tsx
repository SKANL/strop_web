"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from "lucide-react"

export function GlobalFinancialHeader({ incidents }: { incidents: any[] }) {
  // Calculate stats from incidents
  const stats = incidents.reduce((acc, incident) => {
    // Active Risk: Cost of open/in_review incidents
    if (incident.status === 'OPEN' || incident.status === 'IN_REVIEW') {
      acc.activeRisk += (incident.estimated_cost || 0)
    }

    // Recovered: Cost of closed incidents (assuming charged/resolved)
    // TODO: Filter by 'charged_to_contractor' flag when available
    if (incident.status === 'CLOSED') {
      acc.recovered += (incident.actual_cost || incident.estimated_cost || 0)
    }

    // Critical Incidents
    if (incident.priority === 'CRITICAL') {
      acc.criticalIncidents += 1
    }

    // Overdue Incidents (mock logic for now: created > 7 days ago and not closed)
    const daysSinceCreation = (new Date().getTime() - new Date(incident.created_at).getTime()) / (1000 * 3600 * 24)
    if (daysSinceCreation > 7 && incident.status !== 'CLOSED') {
      acc.overdueIncidents += 1
    }

    // Unique Projects
    if (incident.project_id && !acc.projectIds.has(incident.project_id)) {
      acc.projectIds.add(incident.project_id)
      acc.totalProjects += 1
    }

    return acc
  }, {
    activeRisk: 0,
    recovered: 0,
    criticalIncidents: 0,
    overdueIncidents: 0,
    totalProjects: 0,
    projectIds: new Set()
  })

  // Calculate Health Percentage based on closed vs total
  const totalIncidents = incidents.length
  const closedIncidents = incidents.filter(i => i.status === 'CLOSED').length
  const healthPercentage = totalIncidents > 0 ? Math.round((closedIncidents / totalIncidents) * 100) : 100

  return (
    <div className="border-b bg-linear-to-r from-background via-muted/20 to-background">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold">Vista Global de Incidencias</h2>
            <p className="text-sm text-muted-foreground">
              {stats.totalProjects} proyectos activos
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            Organización completa
          </Badge>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {/* Riesgo Activo */}
          <Card className="p-4 border-destructive/20 bg-destructive/5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Riesgo Activo
                </span>
                <TrendingUp className="h-4 w-4 text-destructive" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold font-mono text-destructive">
                  ${stats.activeRisk.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">
                  Suma de incidencias abiertas
                </p>
              </div>
            </div>
          </Card>

          {/* Recuperado */}
          <Card className="p-4 border-green-500/20 bg-green-500/5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Recuperado
                </span>
                <TrendingDown className="h-4 w-4 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold font-mono text-green-600">
                  ${stats.recovered.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">
                  Cargado a contratistas
                </p>
              </div>
            </div>
          </Card>

          {/* Salud Operativa */}
          <Card className="p-4 col-span-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Salud Operativa
                </span>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold text-destructive">
                        {stats.criticalIncidents}
                      </span>
                      <span className="text-xs text-muted-foreground">Críticas</span>
                    </div>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold text-amber-600">
                        {stats.overdueIncidents}
                      </span>
                      <span className="text-xs text-muted-foreground">Atrasadas</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium">
                    {healthPercentage}%
                  </span>
                </div>
                <Progress 
                  value={healthPercentage} 
                  className="h-2"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
