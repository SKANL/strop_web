"use client"

import { Button } from "@/components/ui/button"
import { KPICard } from "@/components/ui/kpi-card"
import { Skeleton } from "@/components/ui/skeleton"
import { LayoutGrid, Map, DollarSign, CheckCircle2, Clock, AlertTriangle, List } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

import type { DashboardKPIs } from "@/app/actions/dashboard"

interface DashboardClientProps {
  projectGrid: React.ReactNode
  projectMap: React.ReactNode
  panicRoom: React.ReactNode
  kpiData: DashboardKPIs | null
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount)
}

function KPISkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-3 overflow-hidden">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-4 rounded" />
      </div>
      <Skeleton className="h-7 w-36" />
      <Skeleton className="h-3 w-40" />
    </div>
  )
}

export function DashboardClient({ projectGrid, projectMap, panicRoom, kpiData }: DashboardClientProps) {
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")
  const isLoading = kpiData === null

  return (
    <div className="flex flex-col h-full gap-4">
        {/* Top Row: KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 shrink-0">
          {isLoading ? (
            <>
              <KPISkeleton />
              <KPISkeleton />
              <KPISkeleton />
              <KPISkeleton />
            </>
          ) : (
            <>
              <KPICard
                title="Dinero en Riesgo"
                value={formatCurrency(kpiData?.risk ?? 0)}
                description={`En ${kpiData?.incidentCount ?? 0} incidencias abiertas`}
                icon={DollarSign}
                variant="danger"
              />
              <KPICard
                title="Dinero Recuperado (YTD)"
                value={formatCurrency(kpiData?.recovered ?? 0)}
                description="Cobradas a contratistas"
                icon={CheckCircle2}
                variant="success"
              />
              <KPICard
                title="Velocidad Resolución"
                value={`${kpiData?.velocity ?? 0} Días`}
                description="Promedio últimos 30 días"
                icon={Clock}
              />
              <KPICard
                title="Proyectos Críticos"
                value={`${kpiData?.criticalProjectsCount ?? 0} / ${kpiData?.totalProjectsCount ?? 0}`}
                description="Requieren atención"
                icon={AlertTriangle}
                variant={(kpiData?.criticalProjectsCount ?? 0) > 0 ? "danger" : "default"}
              />
            </>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 shrink-0">
            <Button 
                variant={viewMode === "grid" ? "default" : "outline"} 
                size="sm" 
                className={cn("gap-2", viewMode === "grid" && "bg-orange-600 hover:bg-orange-700 text-white border-0")}
                onClick={() => setViewMode("grid")}
                aria-pressed={viewMode === "grid"}
            >
                <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                Cuadrícula
            </Button>
            <Button 
                variant={viewMode === "map" ? "default" : "outline"} 
                size="sm" 
                className={cn("gap-2", viewMode === "map" && "bg-orange-600 hover:bg-orange-700 text-white border-0")}
                onClick={() => setViewMode("map")}
                aria-pressed={viewMode === "map"}
            >
                <Map className="h-4 w-4" aria-hidden="true" />
                Mapa
            </Button>
        </div>

        {/* Bottom Section: Grid/Map + Panic Room */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-0">
             <div className="lg:col-span-3 h-full min-h-0">
                {viewMode === "grid" ? projectGrid : projectMap}
             </div>
             <div className="lg:col-span-1 h-full min-h-0">
                {panicRoom}
             </div>
        </div>
    </div>
  )
}
