"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Shield, Lock, MoreHorizontal, User, HardHat, Eye, Copy, Trash2, Edit2 } from "lucide-react"

export type RoleArchetype = 'MANAGER' | 'FIELD' | 'GUEST'

export interface Role {
  id: string
  name: string
  description: string
  isSystem: boolean
  archetype: RoleArchetype
  userCount: number
}

interface RoleCardProps {
  role: Role
  onEdit: (role: Role) => void
}

const ArchetypeIcon = ({ type }: { type: RoleArchetype }) => {
  switch (type) {
    case 'MANAGER': return <Shield className="h-4 w-4 text-indigo-600" />
    case 'FIELD': return <HardHat className="h-4 w-4 text-amber-600" />
    case 'GUEST': return <Eye className="h-4 w-4 text-emerald-600" />
  }
}

export function RoleCard({ role, onEdit }: RoleCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg hover:border-primary/20 transition-all duration-300 group">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors">
             <ArchetypeIcon type={role.archetype} />
           </div>
           {role.isSystem && (
               <Badge variant="outline" className="gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                   <Lock className="h-2.5 w-2.5" /> Sistema
               </Badge>
           )}
        </div>
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground opacity-50 group-hover:opacity-100">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(role)}>
                    <Edit2 className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" /> Duplicar
                </DropdownMenuItem>
                {!role.isSystem && (
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-3">
        <div>
            <CardTitle className="text-base font-semibold leading-none tracking-tight mb-1.5">{role.name}</CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {role.description}
            </p>
        </div>
      </CardContent>

      <CardFooter className="pt-3 pb-4 border-t bg-muted/20 flex justify-between items-center text-xs text-muted-foreground">
         <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span className="font-medium">{role.userCount} usuarios activos</span>
         </div>
         {role.isSystem ? (
             <span className="text-[10px] uppercase font-semibold text-muted-foreground/50 tracking-wider">Lectura</span>
         ) : (
            <span className="text-[10px] uppercase font-semibold text-primary/80 tracking-wider">Personalizado</span>
         )}
      </CardFooter>
    </Card>
  )
}
