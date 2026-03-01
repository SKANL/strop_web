"use client"

import { useState, useMemo } from "react"
import type { Database } from "@/types/supabase"
import { IncidentTableClient } from "@/components/projects/incident-table-client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Users, AlertTriangle, Building2 } from "lucide-react"
import { CrewInviteDialog } from "@/components/team/crew-invite-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type Project = Database['public']['Tables']['projects']['Row']
type Incident = Database['public']['Tables']['incidents']['Row'] & {
  created_by_user?: { full_name: string | null } | null
  assigned_to_user?: { full_name: string | null } | null
  photos?: Array<{ photo_url: string; photo_type: string }>
}

type ProjectMember = {
    name: string
    role: string
    avatar?: string | null
    type: "staff" | "crew"
    trade?: string | null
}

export function ProjectClient({
    project,
    projectMembers,
    incidents: allIncidents = [],
}: {
    project: Project
    projectMembers: ProjectMember[]
    incidents?: Incident[]
}) {
    const [activeFilter, setActiveFilter] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState("incidents")

    const incidents = useMemo(() => {
        let filtered = allIncidents

        if (activeFilter === "urgent") {
            filtered = filtered.filter(i => i.priority === "URGENT" || i.priority === "CRITICAL")
        } else if (activeFilter === "approval") {
            filtered = filtered.filter(i => i.status === "IN_REVIEW")
        } else if (activeFilter === "cost") {
            filtered = filtered.filter(i => i.actual_cost != null && (i.actual_cost as number) > 0)
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            filtered = filtered.filter(i =>
                String(i.folio_number).includes(q) ||
                i.description?.toLowerCase().includes(q) ||
                i.location_tag?.toLowerCase().includes(q)
            )
        }

        return filtered
    }, [allIncidents, activeFilter, searchQuery])

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {(project as any).location || "Merida, Yuc."} - {project.is_active ? "Activo" : "Finalizado"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                 {activeTab === "team" && <CrewInviteDialog projectName={project.name} />}
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
              <div className="border-b">
                <TabsList>
                  <TabsTrigger value="incidents" className="gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Incidencias
                  </TabsTrigger>
                  <TabsTrigger value="team" className="gap-2">
                    <Users className="h-4 w-4" />
                    Equipo y Accesos
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="gap-2">
                    <Building2 className="h-4 w-4" />
                    Configuracion
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="incidents" className="flex-1 flex flex-col gap-4 min-h-0 pt-4 data-[state=inactive]:hidden">
                <div className="flex items-center justify-between gap-4 shrink-0">
                    <Tabs defaultValue="all" className="w-[500px]" onValueChange={setActiveFilter}>
                        <TabsList className="grid w-full grid-cols-4 h-9 p-1 bg-muted/50">
                            <TabsTrigger value="all" className="text-xs font-medium">Todas</TabsTrigger>
                            <TabsTrigger value="urgent" className="text-xs font-medium">Urgentisimas</TabsTrigger>
                            <TabsTrigger value="approval" className="text-xs font-medium">Por Aprobar</TabsTrigger>
                            <TabsTrigger value="cost" className="text-xs font-medium">Con Costo ($)</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar por folio, ubicacion o descripcion..."
                          className="pl-8 h-9"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 min-h-0 overflow-hidden rounded-md border shadow-sm bg-background">
                    <div className="h-full overflow-auto">
                         <IncidentTableClient incidents={incidents} />
                    </div>
                </div>
              </TabsContent>

              <TabsContent value="team" className="flex-1 overflow-auto pt-4 data-[state=inactive]:hidden">
                 <div className="grid gap-6 md:grid-cols-2">
                   <Card>
                     <CardHeader>
                       <CardTitle className="text-base flex items-center justify-between">
                         Staff Asignado
                         <Badge variant="secondary">Interno</Badge>
                       </CardTitle>
                       <CardDescription>Personal de la empresa con acceso completo o supervision.</CardDescription>
                     </CardHeader>
                     <CardContent className="grid gap-4">
                       {projectMembers.filter(m => m.type === "staff").map((member, i) => (
                         <div key={i} className="flex items-center gap-4">
                           <Avatar>
                             <AvatarImage src={member.avatar || undefined} />
                             <AvatarFallback>{member.name[0]}</AvatarFallback>
                           </Avatar>
                           <div className="flex-1">
                             <p className="font-medium text-sm">{member.name}</p>
                             <p className="text-xs text-muted-foreground">{member.role}</p>
                           </div>
                           <Badge variant="outline">{member.role}</Badge>
                         </div>
                       ))}
                      <Button variant="ghost" className="w-full text-muted-foreground text-xs mt-2" asChild>
                        <Link href="/dashboard/team">Gestionar en Directorio Global</Link>
                      </Button>
                     </CardContent>
                   </Card>

                   <Card>
                     <CardHeader>
                       <CardTitle className="text-base flex items-center justify-between">
                         Cuadrillas y Externos
                         <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">Acceso Temporal</Badge>
                       </CardTitle>
                       <CardDescription>Contratistas invitados con acceso limitado a evidencias.</CardDescription>
                     </CardHeader>
                     <CardContent className="grid gap-4">
                       {projectMembers.filter(m => m.type === "crew").map((member, i) => (
                         <div key={i} className="flex items-center gap-4">
                            <Avatar className="h-9 w-9 bg-amber-100">
                             <AvatarFallback className="text-amber-700">{member.name[0]}</AvatarFallback>
                           </Avatar>
                           <div className="flex-1">
                             <p className="font-medium text-sm">{member.name}</p>
                             <p className="text-xs text-muted-foreground">{member.role}</p>
                           </div>
                           <Badge variant="secondary" className="text-xs">Link Activo</Badge>
                         </div>
                       ))}
                       {projectMembers.filter(m => m.type === "crew").length === 0 && (
                         <p className="text-xs text-muted-foreground text-center py-2">Sin externos asignados.</p>
                       )}
                       <div className="flex flex-col gap-2 mt-2 pt-2 border-t">
                          <p className="text-xs text-muted-foreground text-center mb-2">
                            Invita contratistas para que suban sus propias evidencias.
                          </p>
                          <CrewInviteDialog projectName={project.name} />
                       </div>
                     </CardContent>
                   </Card>
                 </div>
              </TabsContent>

              <TabsContent value="settings" className="pt-4 data-[state=inactive]:hidden">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuracion del Proyecto</CardTitle>
                    <CardDescription>Proximamente: Editar detalles, ubicacion y notificaciones.</CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>
        </div>
    )
}
