"use client"

import { useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RoleFormData } from "../role-wizard"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface StepPermissionsProps {
  data: RoleFormData
  updateData: (updates: Partial<RoleFormData>) => void
}

type Permission = {
    id: string
    label: string
    requires?: string // If this permission is enabled, 'requires' must also be enabled
    danger?: boolean
}

const PERMISSIONS: Record<string, Permission[]> = {
    FINANCIAL: [
        { id: 'view_costs', label: 'Ver Costos Estimados ($)' },
        { id: 'edit_costs', label: 'Editar/Estimar Costos', requires: 'view_costs' },
        { id: 'view_total_budget', label: 'Ver Totalizador de Proyecto' },
    ],
    INCIDENTS: [
        { id: 'create_incidents', label: 'Crear Nuevas Incidencias' },
        { id: 'view_all_incidents', label: 'Ver Todas (incluso ajenas)' },
        { id: 'close_incidents', label: 'Cierre Definitivo (Legal)' },
        { id: 'delete_incidents', label: 'Borrar Incidencias', danger: true },
    ],
    TEAM: [
        { id: 'invite_staff', label: 'Invitar Staff Interno' },
        { id: 'invite_crew', label: 'Generar Links de Crew' },
    ]
}

export function StepPermissions({ data, updateData }: StepPermissionsProps) {
  
  // Handlers
  const togglePermission = (id: string, checked: boolean) => {
      let newPermissions = new Set(data.permissions)

      if (checked) {
          newPermissions.add(id)
          // Enable dependencies
          const perm = [...PERMISSIONS.FINANCIAL, ...PERMISSIONS.INCIDENTS, ...PERMISSIONS.TEAM].find(p => p.id === id)
          if (perm?.requires) {
              newPermissions.add(perm.requires)
          }
      } else {
          newPermissions.delete(id)
          // Disable dependent children (Reverse logic)
          // If I disable 'view_costs', 'edit_costs' must be disabled
           const children = [...PERMISSIONS.FINANCIAL, ...PERMISSIONS.INCIDENTS, ...PERMISSIONS.TEAM].filter(p => p.requires === id)
           children.forEach(child => newPermissions.delete(child.id))
      }

      updateData({ permissions: Array.from(newPermissions) })
  }

  // Effect: Pre-fill based on archetype if empty
  useEffect(() => {
     if (data.permissions.length === 0) {
         let defaults: string[] = []
         if (data.archetype === 'MANAGER') defaults = ['view_costs', 'edit_costs', 'view_total_budget', 'create_incidents', 'view_all_incidents', 'close_incidents', 'invite_staff', 'invite_crew']
         if (data.archetype === 'FIELD') defaults = ['create_incidents', 'view_all_incidents', 'invite_crew']
         if (data.archetype === 'GUEST') defaults = ['view_all_incidents'] // Read only
         
         updateData({ permissions: defaults })
     }
  }, [data.archetype])

  return (
    <div className="space-y-8">
        <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm">
            Los permisos se han pre-configurado según el arquetipo <strong>{data.archetype}</strong>. Puedes ajustarlos manualmente.
        </div>

        {/* Financial Block */}
        <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-red-600">
                <span className="h-2 w-2 rounded-full bg-red-600" /> Dinero y Presupuesto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-red-100">
                {PERMISSIONS.FINANCIAL.map(p => (
                    <div key={p.id} className="flex items-start space-x-2">
                        <Checkbox 
                            id={p.id} 
                            checked={data.permissions.includes(p.id)}
                            onCheckedChange={(c: boolean | "indeterminate") => togglePermission(p.id, c === true)}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor={p.id} className="cursor-pointer">{p.label}</Label>
                            {p.requires && <p className="text-[10px] text-muted-foreground">Requiere: {PERMISSIONS.FINANCIAL.find(pix => pix.id === p.requires)?.label}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <Separator />

        {/* Incidents Block */}
        <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-blue-600">
                <span className="h-2 w-2 rounded-full bg-blue-600" /> Gestión de Incidencias
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-blue-100">
                {PERMISSIONS.INCIDENTS.map(p => (
                    <div key={p.id} className="flex items-start space-x-2">
                         <Checkbox 
                            id={p.id} 
                            checked={data.permissions.includes(p.id)}
                            onCheckedChange={(c: boolean | "indeterminate") => togglePermission(p.id, c === true)}
                            // Prevent Field users from deleting if logic requires strict archetype check
                            disabled={p.id === 'delete_incidents' && data.archetype !== 'MANAGER'} 
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor={p.id} className={`cursor-pointer ${p.danger ? "text-destructive" : ""}`}>{p.label}</Label>
                            {p.danger && <Badge variant="outline" className="w-fit text-[10px] h-4 border-destructive text-destructive">Peligroso</Badge>}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <Separator />

        {/* Team Block */}
        <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-zinc-600">
                 <span className="h-2 w-2 rounded-full bg-zinc-600" /> Equipo y Accesos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-zinc-100">
                {PERMISSIONS.TEAM.map(p => (
                   <div key={p.id} className="flex items-start space-x-2">
                        <Checkbox 
                           id={p.id} 
                           checked={data.permissions.includes(p.id)}
                           onCheckedChange={(c: boolean | "indeterminate") => togglePermission(p.id, c === true)}
                       />
                       <div className="grid gap-1.5 leading-none">
                           <Label htmlFor={p.id} className="cursor-pointer">{p.label}</Label>
                       </div>
                   </div>
                ))}
            </div>
        </div>
    </div>
  )
}
