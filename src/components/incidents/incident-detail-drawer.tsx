"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Share2, 
  Clock, 
  User, 
  MapPin, 
  DollarSign,
  CheckCircle2,
  Eye,
  Upload,
  Send,
  X
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type IncidentDetail = {
  id: string
  project: string
  projectCode: string
  description: string
  createdBy: string
  createdAt: string
  location: string
  assignedTo: string
  tradeType: string
  status: "open" | "in_review" | "closed"
  cost: number
  evidenceBefore: string
  evidenceAfter?: string
  timeline: TimelineEvent[]
}

type TimelineEvent = {
  id: string
  type: "created" | "sent" | "viewed" | "uploaded" | "updated" | "closed"
  actor: string
  timestamp: string
  description: string
}

const mockIncident: IncidentDetail = {
  id: "#1024",
  project: "Torre Meriden",
  projectCode: "TM-02",
  description: "Grieta en muro de carga",
  createdBy: "Juan Pérez (Residente)",
  createdAt: "2026-02-15 10:30 AM",
  location: "Nivel 3 > Depto 301",
  assignedTo: "Yesero Profesional",
  tradeType: "masonry",
  status: "in_review",
  cost: 1500,
  evidenceBefore: "/placeholder.svg",
  evidenceAfter: "/placeholder.svg",
  timeline: [
    {
      id: "1",
      type: "created",
      actor: "Juan Pérez",
      timestamp: "Hace 2 días",
      description: "Creó la incidencia desde la app móvil"
    },
    {
      id: "2",
      type: "sent",
      actor: "Sistema",
      timestamp: "Hace 2 días",
      description: "Enviado link público a Yesero Profesional vía WhatsApp"
    },
    {
      id: "3",
      type: "viewed",
      actor: "Yesero Profesional",
      timestamp: "Hace 1 día",
      description: "Vio el link público y revisó la incidencia"
    },
    {
      id: "4",
      type: "uploaded",
      actor: "Yesero Profesional",
      timestamp: "Hace 12 horas",
      description: "Subió foto de evidencia de reparación"
    },
    {
      id: "5",
      type: "updated",
      actor: "María González (Superintendente)",
      timestamp: "Hace 2 horas",
      description: "Actualizó el costo estimado a $1,500.00"
    }
  ]
}

const timelineIcons = {
  created: User,
  sent: Send,
  viewed: Eye,
  uploaded: Upload,
  updated: Clock,
  closed: CheckCircle2
}

const timelineColors = {
  created: "bg-blue-100 text-blue-600",
  sent: "bg-purple-100 text-purple-600",
  viewed: "bg-amber-100 text-amber-600",
  uploaded: "bg-green-100 text-green-600",
  updated: "bg-gray-100 text-gray-600",
  closed: "bg-emerald-100 text-emerald-600"
}

export function IncidentDetailDrawer({
  isOpen,
  onClose,
  incidentId
}: {
  isOpen: boolean
  onClose: () => void
  incidentId?: string
}) {
  const [chargeContractor, setChargeContractor] = useState(false)
  const [finalCost, setFinalCost] = useState("")

  const handleShareWhatsApp = () => {
    const message = `🔧 Incidencia ${mockIncident.id} - ${mockIncident.description}\n\n📍 ${mockIncident.location}\n💰 Costo estimado: $${mockIncident.cost.toLocaleString('es-MX')}\n\nVer detalles: ${window.location.origin}/r/mock-token`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    toast.success("Abriendo WhatsApp...")
  }

  const handleCloseIncident = () => {
    if (!finalCost) {
      toast.error("Debes ingresar el monto final real")
      return
    }

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Cerrando incidencia...',
        success: () => {
          onClose()
          return `Incidencia ${mockIncident.id} cerrada exitosamente`
        },
        error: 'Error al cerrar incidencia'
      }
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[600px] w-full p-0 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <SheetHeader className="p-6 pb-4 shrink-0 border-b">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-xl">
                  {mockIncident.id}
                </SheetTitle>
                <Badge variant="outline" className="text-xs">
                  {mockIncident.projectCode}
                </Badge>
              </div>
              <SheetDescription className="text-base font-medium text-foreground">
                {mockIncident.description}
              </SheetDescription>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleShareWhatsApp}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-3 pt-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Creado por:</span>
              <span className="font-medium">{mockIncident.createdBy}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{mockIncident.createdAt}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{mockIncident.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono font-bold">
                ${mockIncident.cost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6">
            {/* Before/After Gallery */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Galería Comparativa
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Before */}
                <div className="space-y-2">
                  <div className="relative aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 overflow-hidden bg-muted/30">
                    <img 
                      src={mockIncident.evidenceBefore} 
                      alt="Antes" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-destructive/90 text-white">
                        ANTES
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Foto original del problema
                  </p>
                </div>

                {/* After */}
                <div className="space-y-2">
                  <div className="relative aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 overflow-hidden bg-muted/30">
                    {mockIncident.evidenceAfter ? (
                      <>
                        <img 
                          src={mockIncident.evidenceAfter} 
                          alt="Después" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-green-600 text-white">
                            DESPUÉS
                          </Badge>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Upload className="h-8 w-8" />
                        <span className="text-xs">Pendiente</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {mockIncident.evidenceAfter ? "Reparación completada" : "Esperando evidencia"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Timeline */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Línea de Tiempo
              </h3>
              <div className="space-y-3">
                {mockIncident.timeline.map((event, index) => {
                  const Icon = timelineIcons[event.type]
                  const isLast = index === mockIncident.timeline.length - 1
                  
                  return (
                    <div key={event.id} className="flex gap-3">
                      {/* Icon */}
                      <div className="relative flex flex-col items-center">
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                          timelineColors[event.type]
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        {!isLast && (
                          <div className="w-px h-full bg-border mt-1" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            {event.actor}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {event.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <Separator />

            {/* Closure Zone - Only for Authorizers */}
            <div className="space-y-4 p-4 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Zona de Cierre
                </h3>
              </div>

              {/* Charge Contractor Switch */}
              <div className="flex items-center justify-between p-3 rounded-lg border bg-background">
                <div className="space-y-0.5">
                  <Label htmlFor="charge-contractor" className="text-sm font-medium cursor-pointer">
                    ¿Aplicar cobro al contratista?
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    El monto será cargado a la cuenta del contratista
                  </p>
                </div>
                <Switch
                  id="charge-contractor"
                  checked={chargeContractor}
                  onCheckedChange={setChargeContractor}
                />
              </div>

              {/* Final Cost Input */}
              <div className="space-y-2">
                <Label htmlFor="final-cost" className="text-sm font-medium">
                  Monto Final Real <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="final-cost"
                    type="number"
                    placeholder="0.00"
                    className="pl-7 font-mono"
                    value={finalCost}
                    onChange={(e) => setFinalCost(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Costo estimado: ${mockIncident.cost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* Close Button */}
              <Button 
                className="w-full h-12 text-base font-semibold"
                onClick={handleCloseIncident}
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Cerrar Incidencia
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
