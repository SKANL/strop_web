"use client"

import { IncidentTable } from "@/components/projects/incident-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Users, AlertTriangle, Building2 } from "lucide-react"
import { use, useState } from "react"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Link from "next/link"
import { CrewInviteDialog } from "@/components/team/crew-invite-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [filter, setFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("incidents")

  // Mock project members for display
  const projectMembers = [
    { name: "Juan Pérez", role: "Superintendente", avatar: "/avatars/01.png", type: "staff" },
    { name: "Pedro Yesero", role: "Albañilería", avatar: null, type: "crew", trade: "masonry" },
  ]

  return (
    <div className="flex flex-col h-full gap-4">
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/dashboard/projects">Proyectos</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Proyecto #{id}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        {/* Project Header & Tabs */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Torre Meriden</h1>
            <p className="text-muted-foreground">Gestión de incidencias y equipo de obra</p>
          </div>
          <div className="flex items-center gap-2">
             {activeTab === 'team' && <CrewInviteDialog projectName="Torre Meriden" />}
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
                Configuración
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="incidents" className="flex-1 flex flex-col gap-4 min-h-0 pt-4 data-[state=inactive]:hidden">
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
          </TabsContent>

          <TabsContent value="team" className="flex-1 overflow-auto pt-4 data-[state=inactive]:hidden">
             <div className="grid gap-6 md:grid-cols-2">
               {/* Staff Section */}
               <Card>
                 <CardHeader>
                   <CardTitle className="text-base flex items-center justify-between">
                     Staff Asignado
                     <Badge variant="secondary">Interno</Badge>
                   </CardTitle>
                   <CardDescription>Personal de la empresa con acceso completo o supervisión.</CardDescription>
                 </CardHeader>
                 <CardContent className="grid gap-4">
                   {projectMembers.filter(m => m.type === 'staff').map((member, i) => (
                     <div key={i} className="flex items-center gap-4">
                       <Avatar>
                         <AvatarImage src={member.avatar || undefined} />
                         <AvatarFallback>{member.name[0]}</AvatarFallback>
                       </Avatar>
                       <div className="flex-1">
                         <p className="font-medium text-sm">{member.name}</p>
                         <p className="text-xs text-muted-foreground">{member.role}</p>
                       </div>
                       <Badge variant="outline">Admin</Badge>
                     </div>
                   ))}
                  <Button variant="ghost" className="w-full text-muted-foreground text-xs mt-2">
                    Gestionar en Directorio Global
                  </Button>
                 </CardContent>
               </Card>

                {/* Crew Section */}
               <Card>
                 <CardHeader>
                   <CardTitle className="text-base flex items-center justify-between">
                     Cuadrillas y Externos
                     <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">Acceso Temporal</Badge>
                   </CardTitle>
                   <CardDescription>Contratistas invitados con acceso limitado a evidencias.</CardDescription>
                 </CardHeader>
                 <CardContent className="grid gap-4">
                   {projectMembers.filter(m => m.type === 'crew').map((member, i) => (
                     <div key={i} className="flex items-center gap-4">
                        <Avatar className="h-9 w-9 bg-amber-100">
                         <AvatarFallback className="text-amber-700">{member.name[0]}</AvatarFallback>
                       </Avatar>
                       <div className="flex-1">
                         <p className="font-medium text-sm">{member.name}</p>
                         <p className="text-xs text-muted-foreground">{member.role}</p>
                       </div>
                       <Badge variant="secondary" className="text-xs">
                         Link Activo
                       </Badge>
                     </div>
                   ))}
                   
                   <div className="flex flex-col gap-2 mt-2 pt-2 border-t">
                      <p className="text-xs text-muted-foreground text-center mb-2">
                        Invita a más contratistas para que suban sus propias evidencias.
                      </p>
                      <CrewInviteDialog projectName="Torre Meriden" />
                   </div>
                 </CardContent>
               </Card>
             </div>
          </TabsContent>
          
          <TabsContent value="settings" className="pt-4 data-[state=inactive]:hidden">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Proyecto</CardTitle>
                <CardDescription>Próximamente: Editar detalles, ubicación y notificaciones.</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  )
}
