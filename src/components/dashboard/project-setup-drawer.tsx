"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea" // Assuming we might need address as textarea or just input
import { CalendarIcon, UploadCloud } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar" // check if installed, otherwise use simple input type=date
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import React from "react"
import { toast } from "sonner"

export function ProjectSetupDrawer({ 
    isOpen, 
    onClose 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
}) {
    // Mock save
    const handleSave = () => {
        toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: 'Creando proyecto...',
            success: () => {
                onClose()
                return 'Proyecto "Torre Meriden - Fase 2" creado'
            },
            error: 'Error al crear proyecto'
        })
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-[500px] w-full p-0 flex flex-col h-full">
                <SheetHeader className="p-6 pb-2 shrink-0">
                    <SheetTitle>Nuevo Proyecto</SheetTitle>
                    <SheetDescription>
                        Configura la identidad y reglas financieras básicas.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="space-y-6">
                        {/* Sección A: Identidad */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Identidad</h3>
                            <div className="grid gap-2">
                                <Label htmlFor="project-name">Nombre del Proyecto <span className="text-destructive">*</span></Label>
                                <Input id="project-name" placeholder="Ej. Torre Meriden - Fase 2" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="project-code">Código / Alias</Label>
                                <Input id="project-code" placeholder="Ej. TM-02" className="uppercase font-mono" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Foto de Portada</Label>
                                <div className="h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer text-muted-foreground hover:text-foreground">
                                    <UploadCloud className="h-8 w-8" />
                                    <span className="text-xs">Arrastra una imagen o haz clic</span>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Sección B: Ubicación */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Ubicación</h3>
                            <div className="grid gap-2">
                                <Label htmlFor="address">Dirección / Coordenadas</Label>
                                <Input id="address" placeholder="Ej. Calle 60 Norte, Mérida" />
                            </div>
                        </div>

                        <Separator />

                        {/* Sección C: Financiera */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Finanzas</h3>
                                <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded border border-sky-200">KPI: Burn Rate</span>
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="budget">Fondo para Reparaciones (Estimado)</Label>
                                <div className="relative">
                                    <span className="absolute left-2 top-2.5 text-muted-foreground text-sm">$</span>
                                    <Input id="budget" className="pl-6 font-mono text-lg font-bold text-slate-700" placeholder="0.00" />
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                    Monto reservado para vicios ocultos. Strop restará incidencias de aquí.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="start-date">Inicio Obra</Label>
                                    <Input id="start-date" type="date" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="end-date">Fin Obra</Label>
                                    <Input id="end-date" type="date" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <SheetFooter className="p-6 pt-2 shrink-0 border-t mt-0 bg-background/50 backdrop-blur-sm sm:justify-between">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">Crear Proyecto</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
