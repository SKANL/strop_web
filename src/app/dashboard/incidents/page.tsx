"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { GlobalFinancialHeader } from "@/components/incidents/global-financial-header"
import { GlobalIncidentsTable } from "@/components/incidents/global-incidents-table"
import { IncidentDetailDrawer } from "@/components/incidents/incident-detail-drawer"

export default function GlobalIncidentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null)

  return (
    <div className="flex flex-col h-full">
      {/* Global Financial Header */}
      <GlobalFinancialHeader />

      {/* Filters Section */}
      <div className="px-6 py-4 border-b bg-background/95 backdrop-blur-sm z-10">
        <div className="flex flex-col gap-4">
          {/* Tab Filters */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex h-auto w-full gap-2 bg-transparent p-0 justify-start overflow-x-auto pb-2">
              <TabsTrigger 
                value="all" 
                className="flex items-center gap-2 rounded-full border bg-muted/30 px-4 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                Todas
                <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-background/20 text-xs px-1.5">
                  145
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="urgent" 
                className="flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground transition-all"
              >
                Urgentísimas
                <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive/20 text-xs font-bold px-1.5 data-[state=active]:bg-background/20">
                  8
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 data-[state=active]:bg-amber-500 data-[state=active]:text-white transition-all"
              >
                Por Aprobar
                <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-200/50 text-xs font-bold px-1.5 data-[state=active]:bg-white/20">
                  12
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="with-cost" 
                className="flex items-center gap-2 rounded-full border bg-muted/30 px-4 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                Con Costo
                <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-background/20 text-xs px-1.5">
                  87
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="closed" 
                className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all"
              >
                Cerradas
                <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-200/50 text-xs px-1.5 data-[state=active]:bg-white/20">
                  38
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por folio, ubicación, proyecto o contratista..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <GlobalIncidentsTable 
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
    </div>
  )
}
