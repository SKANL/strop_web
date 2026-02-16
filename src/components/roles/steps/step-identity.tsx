"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Shield, HardHat, Eye } from "lucide-react"
import { RoleFormData } from "../role-wizard"

interface StepIdentityProps {
  data: RoleFormData
  updateData: (updates: Partial<RoleFormData>) => void
}

export function StepIdentity({ data, updateData }: StepIdentityProps) {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="name">Nombre del Rol</Label>
            <Input 
                id="name" 
                placeholder="Ej. Residente Jr." 
                value={data.name}
                onChange={(e) => updateData({ name: e.target.value })}
            />
        </div>
        <div className="space-y-2">
            <Label htmlFor="desc">Descripción</Label>
            <Textarea 
                id="desc" 
                placeholder="Describe qué hace este rol puntualmente..." 
                value={data.description}
                onChange={(e) => updateData({ description: e.target.value })}
            />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Basado en Plantilla (Arquetipo)</Label>
        <RadioGroup 
            value={data.archetype} 
            onValueChange={(val) => updateData({ archetype: val as any })}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
            <label className={`cursor-pointer border-2 rounded-lg p-4 flex flex-col gap-2 hover:bg-muted/50 ${data.archetype === 'MANAGER' ? 'border-primary bg-primary/5' : 'border-muted'}`}>
                <RadioGroupItem value="MANAGER" className="sr-only" />
                <Shield className={`h-6 w-6 ${data.archetype === 'MANAGER' ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="font-semibold">Nivel Gerencia</span>
                <span className="text-xs text-muted-foreground">Tiene acceso a costos, contratos y gestión de personas.</span>
            </label>

            <label className={`cursor-pointer border-2 rounded-lg p-4 flex flex-col gap-2 hover:bg-muted/50 ${data.archetype === 'FIELD' ? 'border-amber-500 bg-amber-50' : 'border-muted'}`}>
                <RadioGroupItem value="FIELD" className="sr-only" />
                <HardHat className={`h-6 w-6 ${data.archetype === 'FIELD' ? 'text-amber-600' : 'text-muted-foreground'}`} />
                <span className="font-semibold">Nivel Campo</span>
                <span className="text-xs text-muted-foreground">Enfocado en reportes, incidencias y supervisión visual.</span>
            </label>

            <label className={`cursor-pointer border-2 rounded-lg p-4 flex flex-col gap-2 hover:bg-muted/50 ${data.archetype === 'GUEST' ? 'border-gray-500 bg-gray-50' : 'border-muted'}`}>
                <RadioGroupItem value="GUEST" className="sr-only" />
                <Eye className={`h-6 w-6 ${data.archetype === 'GUEST' ? 'text-gray-600' : 'text-muted-foreground'}`} />
                <span className="font-semibold">Nivel Invitado</span>
                <span className="text-xs text-muted-foreground">Solo lectura estricta. Ideal para inversionistas o externos.</span>
            </label>
        </RadioGroup>
      </div>
    </div>
  )
}
