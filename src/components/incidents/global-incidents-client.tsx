"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { GlobalIncidentsTable } from "@/components/incidents/global-incidents-table"
import { IncidentDetailDrawer } from "@/components/incidents/incident-detail-drawer"
import { CreateIncidentModal } from "@/components/incidents/create-incident-modal"
import { useCapabilities } from "@/hooks/use-capabilities"
import { useRealtimeIncidents } from "@/hooks/use-realtime-incidents"

interface Project {
  id: string
  name: string
}

export function GlobalIncidentsClient({
  incidents,
  projects,
  totalCount = 0,
  page = 1,
  pageSize = 25,
}: {
  incidents: any[]
  projects: Project[]
  totalCount?: number
  page?: number
  pageSize?: number
}) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null)
  const { can } = useCapabilities()

  // Subscribe to realtime incident changes
  useRealtimeIncidents()

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  const navigatePage = (newPage: number) => {
    const params = new URLSearchParams()
    params.set("page", String(newPage))
    router.push(`/dashboard/incidents?${params.toString()}`)
  }

  // Calculate counts for tabs (from current page data)
  const counts = {
      all: totalCount,
      urgent: incidents.filter(i => i.priority === 'CRITICAL' || i.priority === 'URGENT').length,
      pending: incidents.filter(i => i.status === 'IN_REVIEW').length,
      "with-cost": incidents.filter(i => (i.actual_cost || 0) > 0).length,
      closed: incidents.filter(i => i.status === 'CLOSED').length
  }

  return (
    <>
      {/* Filters Section */}
      <div className="px-6 py-4 border-b bg-background/95 backdrop-blur-sm z-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                placeholder="Buscar por folio, ubicación, proyecto o contratista..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Create Button */}
            {can('incident.create') && <CreateIncidentModal projects={projects} />}
          </div>

          {/* Tab Filters */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50">
              <TabsTrigger value="all" className="text-xs font-medium">
                Todas
                <span className="ml-2 text-[10px] text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded-full">{counts.all}</span>
              </TabsTrigger>
              <TabsTrigger value="urgent" className="text-xs font-medium">
                Urgentísimas
                <span className="ml-2 text-[10px] text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded-full">{counts.urgent}</span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs font-medium">
                Por Aprobar
                <span className="ml-2 text-[10px] text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded-full">{counts.pending}</span>
              </TabsTrigger>
              <TabsTrigger value="with-cost" className="text-xs font-medium">
                Con Costo
                <span className="ml-2 text-[10px] text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded-full">{counts["with-cost"]}</span>
              </TabsTrigger>
              <TabsTrigger value="closed" className="text-xs font-medium">
                Cerradas
                <span className="ml-2 text-[10px] text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded-full">{counts.closed}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <GlobalIncidentsTable 
          incidents={incidents}
          searchQuery={searchQuery}
          activeTab={activeTab}
          onIncidentClick={(incidentId) => setSelectedIncidentId(incidentId)}
        />
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="border-t px-6 py-3 flex items-center justify-between shrink-0 bg-background/95">
          <p className="text-sm text-muted-foreground">
            Página {page} de {totalPages} · {totalCount} incidencias
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => navigatePage(page - 1)}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => navigatePage(page + 1)}
              className="gap-1"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Incident Detail Drawer */}
      <IncidentDetailDrawer
        isOpen={selectedIncidentId !== null}
        onClose={() => setSelectedIncidentId(null)}
        incidentId={selectedIncidentId || undefined}
      />
    </>
  )
}
