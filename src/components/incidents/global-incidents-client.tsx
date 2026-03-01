"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { GlobalIncidentsTable } from "@/components/incidents/global-incidents-table"
import { IncidentDetailDrawer } from "@/components/incidents/incident-detail-drawer"
import { CreateIncidentModal } from "@/components/incidents/create-incident-modal"

interface Project {
  id: string
  name: string
}

export function GlobalIncidentsClient({ incidents, projects }: { incidents: any[], projects: Project[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null)

  // Calculate counts for tabs
  const counts = {
      all: incidents.length,
      urgent: incidents.filter(i => i.priority === 'CRITICAL' || i.priority === 'HIGH').length,
      pending: incidents.filter(i => i.status === 'IN_REVIEW').length,
      "with-cost": incidents.filter(i => (i.actual_cost || 0) > 0).length,
      closed: incidents.filter(i => i.status === 'CLOSED').length
  }

  return (
    <>
      {/* Filters Section */}
      <div className="px-6 py-4 border-b bg-background/95 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between gap-4 mb-4">
           {/* Filters will go here or below, organizing layout */}
        </div>

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
            <CreateIncidentModal projects={projects} />
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

          {/* Search Bar - Removed as it is now above */}
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

      {/* Incident Detail Drawer */}
      <IncidentDetailDrawer
        isOpen={selectedIncidentId !== null}
        onClose={() => setSelectedIncidentId(null)}
        incidentId={selectedIncidentId || undefined}
      />
    </>
  )
}
