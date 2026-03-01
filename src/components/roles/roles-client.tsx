"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, SlidersHorizontal } from "lucide-react"
import { RoleCard, Role } from "@/components/roles/role-card"
import { RoleWizard } from "@/components/roles/role-wizard"

export function RolesClient({ initialRoles = [] }: { initialRoles?: Role[] }) {
    const router = useRouter()
    const [roles, setRoles] = useState<Role[]>(initialRoles)
    const [isWizardOpen, setIsWizardOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState<Role | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    const handleEditRole = (role: Role) => {
        setSelectedRole(role)
        setIsWizardOpen(true)
    }

    const handleCreateRole = () => {
        setSelectedRole(null)
        setIsWizardOpen(true)
    }

    const handleWizardClose = (open: boolean) => {
        setIsWizardOpen(open)
        if (!open) {
            router.refresh()
        }
    }

    const filteredRoles = roles.filter(role => 
        (searchQuery === "" || 
         role.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
         role.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
        <div className="flex flex-col h-full space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Roles y Permisos</h2>
                    <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
                        Controla el acceso a la plataforma. Los roles de sistema protegen las funciones críticas, mientras que los personalizados te dan flexibilidad operativa.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleCreateRole} size="lg" className="shadow-lg shadow-primary/20 transition-all hover:scale-105">
                        <Plus className="mr-2 h-5 w-5" />
                        Crear Nuevo Rol
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="all" className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <TabsList className="grid w-full sm:w-auto grid-cols-3 h-10 p-1 bg-muted/50">
                        <TabsTrigger value="all" className="text-xs font-medium">Todos</TabsTrigger>
                        <TabsTrigger value="system" className="text-xs font-medium">Sistema</TabsTrigger>
                        <TabsTrigger value="custom" className="text-xs font-medium">Personalizados</TabsTrigger>
                    </TabsList>
                    
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar roles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-background/50 border-muted-foreground/20 focus:border-primary/50 transition-colors"
                        />
                    </div>
                </div>

                <TabsContent value="all" className="mt-0">
                    <RolesGrid roles={filteredRoles} onEdit={handleEditRole} onCreate={handleCreateRole} />
                </TabsContent>
                <TabsContent value="system" className="mt-0">
                    <RolesGrid roles={filteredRoles.filter(r => r.isSystem)} onEdit={handleEditRole} onCreate={handleCreateRole} />
                </TabsContent>
                <TabsContent value="custom" className="mt-0">
                     <RolesGrid roles={filteredRoles.filter(r => !r.isSystem)} onEdit={handleEditRole} onCreate={handleCreateRole} />
                </TabsContent>
            </Tabs>

            <RoleWizard 
                open={isWizardOpen} 
                onOpenChange={handleWizardClose} 
                roleToEdit={selectedRole}
            />
        </div>
    )
}

function RolesGrid({ roles, onEdit, onCreate }: { roles: Role[], onEdit: (role: Role) => void, onCreate: () => void }) {
    if (roles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl border-muted-foreground/20 bg-muted/5">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                     <SlidersHorizontal className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No se encontraron roles</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
                    Intenta ajustar tu búsqueda o crea un nuevo rol personalizado.
                </p>
                <Button variant="outline" onClick={onCreate}>
                    Crear Rol
                </Button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
            {roles.map((role) => (
                <RoleCard 
                    key={role.id} 
                    role={role} 
                    onEdit={onEdit} 
                />
            ))}
            
            <button 
                onClick={onCreate}
                className="group flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 h-full min-h-[220px]"
            >
                <div className="h-14 w-14 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors">
                    <Plus className="h-7 w-7 text-primary" />
                </div>
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">Crear Rol Personalizado</span>
                <span className="text-xs text-muted-foreground mt-2 max-w-[150px] text-center">
                    Empieza desde una plantilla segura
                </span>
            </button>
        </div>
    )
}
