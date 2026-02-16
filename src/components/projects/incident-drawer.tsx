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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, MessageCircle, Clock, CheckCircle2, Upload, Camera } from "lucide-react"
import { toast } from "sonner"
import React from "react"

type Incident = {
    id: string
    evidenceUrl: string
    description: string
    location: string
    assignedTo: string
    status: string
    cost: number | null
    createdAt: string
    createdBy: string
}

export function IncidentDrawer({ 
    isOpen, 
    onClose, 
    incident 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    incident: Incident | null 
}) {
    if (!incident) return null

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-md w-full p-0 flex flex-col h-full">
                <SheetHeader className="p-6 border-b shrink-0 space-y-4">
                    <div className="flex items-center justify-between">
                        <Badge variant="outline" className="font-mono text-xs">{incident.id}</Badge>
                        <Button 
                            size="sm" 
                            variant="outline" 
                            className="gap-2 text-green-600 border-green-200 bg-green-50 hover:bg-green-100"
                            onClick={() => toast.success("Enlace de WhatsApp generado")}
                        >
                            <Share2 className="h-3 w-3" />
                            WhatsApp Link
                        </Button>
                    </div>
                    <div>
                        <SheetTitle className="text-xl font-bold leading-tight">{incident.description}</SheetTitle>
                         <SheetDescription className="flex items-center gap-2 mt-1">
                            <span>{incident.location}</span>
                            <span>•</span>
                            <span className="font-medium text-foreground">{incident.assignedTo}</span>
                        </SheetDescription>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Galería Comparativa */}
                    <div className="space-y-3">
                         <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Evidencia</h4>
                            <Button variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={() => toast.info("Abriendo cámara...")}>
                                <Camera className="h-3 w-3" /> Nueva Foto
                            </Button>
                         </div>
                        
                        <Tabs defaultValue="compare" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="compare">Comparativa</TabsTrigger>
                                <TabsTrigger value="gallery">Galería (3)</TabsTrigger>
                            </TabsList>
                            <TabsContent value="compare" className="mt-2 space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <span className="text-xs text-muted-foreground block text-center">Antes</span>
                                        <div className="aspect-square rounded-md overflow-hidden bg-muted border relative group cursor-pointer" onClick={() => toast.info("Zoom imagen 'Antes'")}>
                                            <img src={incident.evidenceUrl} alt="Before" className="object-cover w-full h-full transition-transform group-hover:scale-105" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs text-muted-foreground block text-center">Después</span>
                                        <div className="aspect-square rounded-md overflow-hidden bg-muted/50 border border-dashed flex flex-col items-center justify-center relative cursor-pointer hover:bg-muted/80 transition-colors" onClick={() => toast.success("Foto 'Despúes' subida")}>
                                            <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                                            <span className="text-xs text-muted-foreground">Subir solución</span>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="gallery" className="min-h-[150px] flex items-center justify-center text-muted-foreground text-xs bg-muted/20 rounded-md border border-dashed">
                                Galería completa en desarrollo...
                            </TabsContent>
                        </Tabs>
                    </div>

                    <Separator />

                    {/* Timeline / Bitácora */}
                    <div className="space-y-3">
                         <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Clock className="h-3 w-3" /> Bitácora
                         </h4>
                         <div className="pl-2 border-l-2 border-muted space-y-6 relative ml-1">
                            {/* Event 1 */}
                            <div className="relative pl-6">
                                <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-muted-foreground ring-4 ring-background" />
                                <p className="text-sm"><span className="font-semibold">{incident.createdBy}</span> creó la incidencia.</p>
                                <span className="text-xs text-muted-foreground">{incident.createdAt}</span>
                            </div>
                            {/* Event 2 */}
                             <div className="relative pl-6">
                                <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-blue-500 ring-4 ring-background" />
                                <p className="text-sm">Asignado a <span className="font-semibold">{incident.assignedTo}</span>.</p>
                                <span className="text-xs text-muted-foreground">Hace 1 hora</span>
                            </div>
                         </div>
                         
                         {/* Add Note Input */}
                         <div className="pt-2 flex gap-2">
                            <Textarea placeholder="Agregar nota o actualización..." className="min-h-[60px] text-xs resize-none" />
                            <Button size="icon" className="h-[60px] w-[60px] shrink-0" onClick={() => toast.success("Nota agregada a la bitácora")}>
                                <MessageCircle className="h-4 w-4" />
                            </Button>
                         </div>
                    </div>

                    <Separator />
                
                     {/* Zona de Cierre (Mock) */}
                     <div className="rounded-lg border bg-muted/40 p-4 space-y-4">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" /> Cierre Administrativo
                        </h4>
                        
                        <div className="flex items-center justify-between">
                            <Label htmlFor="charge-contractor" className="text-sm font-medium">¿Cobrar a contratista?</Label>
                            <Switch id="charge-contractor" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="final-cost" className="text-xs">Costo Final Real</Label>
                            <div className="relative">
                                <span className="absolute left-2 top-2.5 text-muted-foreground text-xs">$</span>
                                <Input id="final-cost" className="pl-6 font-mono text-right" placeholder="0.00" defaultValue={incident.cost?.toString() || ""} />
                            </div>
                        </div>

                        <Button 
                            className="w-full font-semibold" 
                            onClick={() => toast.success("Incidencia cerrada correctamente", {
                                description: "Se ha notificado a los involucrados."
                            })}
                        >
                            Cerrar Incidencia
                        </Button>
                     </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
