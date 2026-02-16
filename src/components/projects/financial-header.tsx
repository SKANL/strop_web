"use client"

import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Filter } from "lucide-react"

export function FinancialHeader() {
  return (
    <div className="sticky top-0 z-30 flex flex-col gap-4 border-b bg-background/95 p-4 backdrop-blur supports-backdrop-filter:bg-background/60 md:flex-row md:items-center md:justify-between shadow-sm">
      <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:gap-8">
        {/* Bloque 1: Dinero en Riesgo (KPI Principal) */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Riesgo Activo</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-destructive font-mono">$45,200.00</span>
          </div>
        </div>

        {/* Separator for mobile */}
        <div className="h-px w-full bg-border md:hidden" />
        <div className="hidden h-10 w-px bg-border md:block" />

        {/* Bloque 2: Dinero Recuperado */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recuperado</p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-green-600 font-mono">$12,500.00</span>
            <span className="text-xs text-muted-foreground">Cargado a contratistas</span>
          </div>
        </div>

         {/* Separator for mobile */}
         <div className="h-px w-full bg-border md:hidden" />
         <div className="hidden h-10 w-px bg-border md:block" />

        {/* Bloque 3: Salud Operativa */}
        <div className="flex-1 space-y-2 min-w-[200px] max-w-xs">
           <div className="flex justify-between text-xs font-medium">
              <span>Salud Operativa</span>
              <span className="text-muted-foreground">8 Críticas | 15 Atrasadas</span>
           </div>
           {/* Segmented Progress Bar concept - handled with CSS gradient or multiple divs. Using simple Progress for MVP */}
           <Progress value={65} className="h-2 [&>div]:bg-orange-500" />
        </div>
      </div>

      {/* Bloque 4: Filtros Globales y Acciones */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Select defaultValue="project">
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Vista" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="project">Todo el Proyecto</SelectItem>
            <SelectItem value="assigned">Mis Asignaciones</SelectItem>
          </SelectContent>
        </Select>
        
        <Button size="sm" className="h-9 gap-1 font-semibold">
           <Plus className="h-4 w-4" />
           Nueva Incidencia
        </Button>
      </div>
    </div>
  )
}
