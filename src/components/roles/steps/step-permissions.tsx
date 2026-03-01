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
        { id: 'financial.view_costs', label: 'Ver Costos Estimados ($)' },
        { id: 'financial.edit_costs', label: 'Editar/Estimar Costos', requires: 'financial.view_costs' },
        { id: 'financial.view_project_budget', label: 'Ver Totalizador de Proyecto' },
        { id: 'financial.manage_chargebacks', label: 'Gestionar Cargos a Subcontratistas', requires: 'financial.view_costs' },
    ],
    INCIDENTS: [
        { id: 'incident.create', label: 'Crear Nuevas Incidencias' },
        { id: 'incident.edit_basic', label: 'Editar Descripción y Datos Básicos', requires: 'incident.create' },
        { id: 'incident.set_priority', label: 'Cambiar Prioridad (Urgente/Crítico)' },
        { id: 'incident.assign', label: 'Asignar a un Responsable' },
        { id: 'incident.close_operational', label: 'Cierre Operativo (Residente)' },
        { id: 'incident.close_final', label: 'Cierre Definitivo / Legal', requires: 'incident.close_operational', danger: true },
        { id: 'project.view_all', label: 'Ver Todas las Incidencias (incluso ajenas)' },
    ],
    TEAM: [
        { id: 'org.manage_staff', label: 'Invitar y Gestionar Staff Interno' },
        { id: 'project.manage_crew', label: 'Gestionar Crew de Proyectos' },
        { id: 'org.manage_roles', label: 'Crear y Editar Roles', requires: 'org.manage_staff' },
        { id: 'comm.share_public_link', label: 'Enviar Link Público a Subcontratistas' },
        { id: 'comm.send_notifications', label: 'Enviar Notificaciones al Equipo' },
    ],
    PROJECTS: [
        { id: 'project.create', label: 'Crear y Editar Proyectos' },
        { id: 'project.delete', label: 'Eliminar Proyectos', requires: 'project.create', danger: true },
        { id: 'org.view_billing', label: 'Ver Facturación de la Organización' },
        { id: 'org.edit', label: 'Editar Datos de la Organización' },
    ],
}

export function StepPermissions({ data, updateData }: StepPermissionsProps) {
  
  // Handlers
  const togglePermission = (id: string, checked: boolean) => {
      let newPermissions = new Set(data.permissions)

      if (checked) {
          newPermissions.add(id)
          // Enable dependencies
          const perm = [...PERMISSIONS.FINANCIAL, ...PERMISSIONS.INCIDENTS, ...PERMISSIONS.TEAM, ...PERMISSIONS.PROJECTS].find(p => p.id === id)
          if (perm?.requires) {
              newPermissions.add(perm.requires)
          }
      } else {
          newPermissions.delete(id)
          // Disable dependent children (Reverse logic)
           const children = [...PERMISSIONS.FINANCIAL, ...PERMISSIONS.INCIDENTS, ...PERMISSIONS.TEAM, ...PERMISSIONS.PROJECTS].filter(p => p.requires === id)
           children.forEach(child => newPermissions.delete(child.id))
      }

      updateData({ permissions: Array.from(newPermissions) })
  }

  // Effect: Pre-fill based on archetype if empty
  useEffect(() => {
     if (data.permissions.length === 0) {
         let defaults: string[] = []
         if (data.archetype === 'MANAGER') defaults = ['financial.view_costs', 'financial.edit_costs', 'financial.view_project_budget', 'financial.manage_chargebacks', 'incident.create', 'incident.edit_basic', 'incident.set_priority', 'incident.assign', 'incident.close_operational', 'incident.close_final', 'project.view_all', 'org.manage_staff', 'project.manage_crew', 'comm.share_public_link', 'comm.send_notifications', 'project.create']
         if (data.archetype === 'FIELD') defaults = ['incident.create', 'incident.edit_basic', 'incident.set_priority', 'incident.close_operational', 'project.view_all', 'financial.view_costs', 'comm.share_public_link']
         if (data.archetype === 'GUEST') defaults = ['project.view_all', 'incident.create'] // Read + report only
         
         updateData({ permissions: defaults })
     }
  }, [data.archetype])

  return (
    <div className="space-y-8">
        <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm">
            Los permisos se han pre-configurado según el arquetipo <strong>{data.archetype}</strong>. Puedes ajustarlos manualmente.
        </div>

        {/* Projects & Org Block */}
        <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-blue-600">
                <span className="h-2 w-2 rounded-full bg-blue-600" /> Proyectos y Organización
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-blue-100">
                {PERMISSIONS.PROJECTS.map(p => (
                    <div key={p.id} className="flex items-start space-x-2">
                        <Checkbox
                            id={p.id}
                            checked={data.permissions.includes(p.id)}
                            onCheckedChange={(c: boolean | "indeterminate") => togglePermission(p.id, c === true)}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor={p.id} className={`cursor-pointer ${p.danger ? 'text-red-600' : ''}`}>{p.label}{p.danger && <Badge variant="destructive" className="ml-2 text-[10px] py-0">Peligroso</Badge>}</Label>
                            {p.requires && <p className="text-[10px] text-muted-foreground">Requiere: {[...PERMISSIONS.FINANCIAL, ...PERMISSIONS.INCIDENTS, ...PERMISSIONS.TEAM, ...PERMISSIONS.PROJECTS].find(pix => pix.id === p.requires)?.label}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <Separator />

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
                            {p.requires && <p className="text-[10px] text-muted-foreground">Requiere: {[...PERMISSIONS.FINANCIAL, ...PERMISSIONS.INCIDENTS, ...PERMISSIONS.TEAM, ...PERMISSIONS.PROJECTS].find(pix => pix.id === p.requires)?.label}</p>}
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
                           {p.requires && <p className="text-[10px] text-muted-foreground">Requiere: {[...PERMISSIONS.FINANCIAL, ...PERMISSIONS.INCIDENTS, ...PERMISSIONS.TEAM, ...PERMISSIONS.PROJECTS].find(pix => pix.id === p.requires)?.label}</p>}
                       </div>
                   </div>
                ))}
            </div>
        </div>
    </div>
  )
}
