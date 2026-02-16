"use client"

import { IncidentTable } from "@/components/projects/incident-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [filter, setFilter] = useState("all")

  return (
    <div className="flex flex-col h-full gap-4">
        {/* Filtros Inteligentes (Smart Filters) */}
        <div className="flex items-center justify-between gap-4 shrink-0">
            <Tabs defaultValue="all" className="w-[400px]" onValueChange={setFilter}>
                <TabsList>
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="urgent">Urgentísimas</TabsTrigger>
                    <TabsTrigger value="approval">Por Aprobar</TabsTrigger>
                    <TabsTrigger value="cost">Con Costo ($)</TabsTrigger>
                </TabsList>
            </Tabs>
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por folio, ubicación o contratista..." className="pl-8 h-9" />
            </div>
        </div>

        {/* Tabla Densidad Alta - Fill Remaining Space */}
        <div className="flex-1 min-h-0 overflow-hidden rounded-md border shadow-sm bg-background">
            <div className="h-full overflow-auto">
                 <IncidentTable activeFilter={filter} />
            </div>
        </div>
    </div>
  )
}
