"use client"

import { RoleFormData } from "../role-wizard"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, DollarSign, Users, FileText } from "lucide-react"

interface StepPreviewProps {
  data: RoleFormData
}

export function StepPreview({ data }: StepPreviewProps) {
  const hasMoney = data.permissions.includes('view_costs')
  const hasCreate = data.permissions.includes('create_incidents')
  const hasTeam = data.permissions.includes('invite_staff') || data.permissions.includes('invite_crew')

  return (
    <div className="flex flex-col h-full gap-4">
         <div className="bg-muted/10 p-4 rounded-lg mb-4 text-center">
             <h3 className="font-semibold">Modo Espejo: Así verá la App este usuario</h3>
             <p className="text-sm text-muted-foreground">Los elementos desvanecidos no serán visibles para el rol <strong>{data.name}</strong></p>
         </div>

         {/* Mock App Interface - Wireframe style */}
         <div className="border border-zinc-200 rounded-xl overflow-hidden shadow-xl bg-white flex-1 flex flex-col max-w-3xl mx-auto w-full aspect-video">
             {/* Mock Header */}
             <div className="h-14 border-b bg-gray-50 flex items-center px-4 justify-between shrink-0">
                 <div className="flex items-center gap-4">
                     <div className="h-8 w-8 bg-zinc-900 rounded-md" />
                     <div className="flex gap-4 text-sm font-medium text-gray-600">
                         <span>Proyectos</span>
                         <span>Incidencias</span>
                     </div>
                 </div>
                 <div className="h-8 w-8 rounded-full bg-gray-200" />
             </div>

             {/* Mock Content */}
             <div className="flex-1 p-6 flex gap-6 bg-gray-50/50">
                 {/* Sidebar */}
                 <div className="w-48 space-y-2 hidden md:block">
                     <div className="h-8 bg-white rounded-md border flex items-center px-3 gap-2 text-xs text-blue-600 border-blue-100">
                         <FileText className="h-3 w-3" /> Incidencias
                     </div>
                     <div className={`h-8 bg-white rounded-md border flex items-center px-3 gap-2 text-xs transition-opacity ${hasTeam ? 'opacity-100' : 'opacity-20 grayscale border-dashed'}`}>
                         <Users className="h-3 w-3" /> Equipo
                     </div>
                     <div className={`h-8 bg-white rounded-md border flex items-center px-3 gap-2 text-xs transition-opacity ${hasMoney ? 'opacity-100 text-green-600 border-green-100' : 'opacity-20 grayscale border-dashed'}`}>
                         <DollarSign className="h-3 w-3" /> Finanzas
                     </div>
                 </div>

                 {/* Main Table */}
                 <div className="flex-1 bg-white rounded-lg border shadow-sm flex flex-col">
                     <div className="h-12 border-b flex items-center px-4 justify-between">
                         <div className="w-1/3 h-8 bg-gray-100 rounded-full" />
                         {/* Create Button visualization */}
                         <div className={`h-8 w-24 rounded-md flex items-center justify-center gap-1 text-xs text-white font-medium transition-opacity ${hasCreate ? 'bg-zinc-900 opacity-100' : 'bg-gray-300 opacity-20 border-dashed border-2 border-gray-400'}`}>
                             <Plus className="h-3 w-3" /> Nueva
                         </div>
                     </div>
                     
                     {/* Rows */}
                     <div className="p-4 space-y-3">
                         {[1, 2, 3].map(i => (
                             <div key={i} className="h-10 border rounded-sm flex items-center px-4 justify-between bg-gray-50/50">
                                 <div className="w-1/2 h-3 bg-gray-200 rounded" />
                                 
                                 {/* Cost Column */}
                                 <div className={`w-16 h-4 rounded text-right flex justify-end transition-opacity ${hasMoney ? 'bg-green-100 text-green-700 opacity-100' : 'bg-gray-100 opacity-20 blur-[2px]'}`}>
                                     {hasMoney && <span className="text-[10px] font-mono">$1,200</span>}
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
             </div>
         </div>
         
         <div className="grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground max-w-2xl mx-auto">
            <div className={`flex flex-col items-center gap-1 ${hasCreate ? 'text-primary' : 'text-gray-300'}`}>
                <Plus className="h-4 w-4" />
                <span>Botón "Crear"</span>
            </div>
            <div className={`flex flex-col items-center gap-1 ${hasMoney ? 'text-green-600' : 'text-gray-300'}`}>
                <DollarSign className="h-4 w-4" />
                <span>Columnas de Costo</span>
            </div>
            <div className={`flex flex-col items-center gap-1 ${hasTeam ? 'text-blue-600' : 'text-gray-300'}`}>
                <Users className="h-4 w-4" />
                <span>Gestión de Equipo</span>
            </div>
         </div>
    </div>
  )
}
