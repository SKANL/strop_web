"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Search, Users, Shield, UserCog, MoreHorizontal, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { toast } from "sonner"

import { StaffCreationDialog } from "@/components/team/staff-dialog"
import { deactivateTeamMember, reactivateTeamMember } from "@/app/actions/team"
import { useCapabilities } from "@/hooks/use-capabilities"

interface TeamMember {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  is_active: boolean
  role: {
    display_name: string
  } | null
  projects: {
    project: {
      name: string
    } | null
  }[]
}

export function TeamClient({ initialMembers }: { initialMembers: any[] }) {
  const router = useRouter()
  const { can } = useCapabilities()
  const [activeTab, setActiveTab] = useState("staff")
  const [searchQuery, setSearchQuery] = useState("")
  const [isPending, startTransition] = useTransition()
  // Confirm dialog state for destructive toggle action
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; isActive: boolean; name: string } | null>(null)

  // Filter members based on search
  const filteredMembers = initialMembers.filter(member => 
    member.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    member.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeCount = initialMembers.filter(m => m.is_active).length

  const handleToggleAccess = (memberId: string, isCurrentlyActive: boolean) => {
    startTransition(async () => {
      const action = isCurrentlyActive ? deactivateTeamMember : reactivateTeamMember
      const result = await action(memberId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(isCurrentlyActive ? 'Acceso revocado' : 'Acceso reactivado')
        router.refresh()
      }
    })
  }

  const handleConfirmedToggle = () => {
    if (!confirmTarget) return
    handleToggleAccess(confirmTarget.id, confirmTarget.isActive)
    setConfirmTarget(null)
  }

  return (
    <div className="flex flex-col h-full bg-muted/10 overflow-hidden">
      {/* Header with License Counter */}
      <div className="border-b bg-background px-6 py-4 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Gestión de Equipo
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Administra el personal interno y accesos externos
            </p>
          </div>
          <div className="flex items-center gap-2">
            {can('org.manage_staff') && <StaffCreationDialog />}
          </div>
        </div>

        {/* License Usage Card */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-primary/5 border-primary/20 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Licencias Staff</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCount} / 10</div>
              <p className="text-xs text-muted-foreground">
                 licencias utilizadas en tu plan Enterprise
              </p>
              <div className="h-1 w-full bg-primary/20 mt-3 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${(activeCount / 10) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 min-h-0 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col space-y-4">
          <TabsList className="shrink-0">
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              Staff Interno
            </TabsTrigger>
            <TabsTrigger value="crew" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Cuadrillas Externas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="staff" className="flex-1 flex flex-col gap-4 min-h-0 data-[state=inactive]:hidden">
            {/* Filters */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Staff Table */}
            <div className="flex-1 overflow-auto rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Miembro</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Proyectos</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={member.avatar_url || ''} alt={member.full_name || ''} />
                              <AvatarFallback>{member.full_name?.charAt(0) || '?'}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{member.full_name || 'Sin nombre'}</span>
                              <span className="text-xs text-muted-foreground">{member.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal">
                              {member.role?.display_name || 'Sin Rol'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={member.is_active ? 'default' : 'secondary'}
                              className={member.is_active ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200' : ''}
                            >
                              {member.is_active ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Building2 className="h-3 w-3" />
                              {member.projects?.length || 0} asignados
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuItem>Editar perfil</DropdownMenuItem>
                                <DropdownMenuItem>Gestionar accesos</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {can('org.manage_staff') && <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  disabled={isPending}
                                  onClick={() => setConfirmTarget({
                                    id: member.id,
                                    isActive: member.is_active,
                                    name: member.full_name || 'este miembro',
                                  })}
                                >
                                  {member.is_active ? 'Revocar acceso' : 'Reactivar acceso'}
                                </DropdownMenuItem>}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            No se encontraron miembros.
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="crew" className="flex-1 overflow-auto">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Cuadrillas</CardTitle>
                <CardDescription>
                  Los miembros externos se gestionan directamente desde cada proyecto.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="max-w-md space-y-2">
                  <h3 className="font-medium">Acceso por Proyecto</h3>
                  <p className="text-sm text-muted-foreground">
                    Para invitar contratistas o cuadrillas, ve al proyecto específico y utiliza la pestaña de "Equipo" para generar enlaces de acceso rápido.
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/projects">Ir a Proyectos</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirm dialog for deactivate / reactivate */}
      <ConfirmDialog
        open={confirmTarget !== null}
        onOpenChange={(open) => { if (!open) setConfirmTarget(null) }}
        title={confirmTarget?.isActive ? `¿Revocar acceso a ${confirmTarget?.name}?` : `¿Reactivar acceso a ${confirmTarget?.name}?`}
        description={
          confirmTarget?.isActive
            ? "El usuario ya no podrá iniciar sesión en Strop. Puedes reactivarlo en cualquier momento."
            : "El usuario podrá volver a iniciar sesión y acceder a los proyectos asignados."
        }
        confirmLabel={confirmTarget?.isActive ? "Revocar acceso" : "Reactivar acceso"}
        variant={confirmTarget?.isActive ? "destructive" : "default"}
        onConfirm={handleConfirmedToggle}
      />
    </div>
  )
}
