"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from "lucide-react"

export function GlobalFinancialHeader() {
  // Mock data - will be replaced with Supabase queries
  const stats = {
    activeRisk: 145200,
    recovered: 42500,
    criticalIncidents: 8,
    overdueIncidents: 15,
    totalProjects: 12,
    healthPercentage: 68
  }

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
                    {stats.healthPercentage}%
                  </span>
                </div>
                <Progress 
                  value={stats.healthPercentage} 
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
