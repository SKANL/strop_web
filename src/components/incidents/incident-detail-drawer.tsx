import { useState, useEffect } from "react"
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
  X,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { getIncidentById, updateIncidentCost, updateIncidentStatus } from "@/app/actions/incidents"

export function IncidentDetailDrawer({
  isOpen,
  onClose,
  incidentId
}: {
  isOpen: boolean
  onClose: () => void
  incidentId?: string
}) {
  const [loading, setLoading] = useState(false)
  const [incident, setIncident] = useState<any>(null) // TODO: Type this properly
  const [chargeContractor, setChargeContractor] = useState(false)
  const [finalCost, setFinalCost] = useState("")

  useEffect(() => {
    if (isOpen && incidentId) {
      const fetchIncident = async () => {
        setLoading(true)
        const { data, error } = await getIncidentById(incidentId)
        if (error) {
          toast.error("Error al cargar la incidencia")
          console.error(error)
        } else {
          setIncident(data)
          if (data?.actual_cost) setFinalCost(data.actual_cost.toString())
        }
        setLoading(false)
      }
      fetchIncident()
    } else {
        setIncident(null)
        setFinalCost("")
    }
  }, [isOpen, incidentId])

  const handleShareWhatsApp = () => {
    if (!incident) return
    const cost = incident.actual_cost || incident.estimated_cost
    const message = `🔧 Incidencia #${incident.folio_number} - ${incident.description}\n\n📍 ${incident.location_tag || 'Sin ubicación'}\n💰 Costo: $${cost?.toLocaleString('es-MX') || '0.00'}\n\nVer detalles: ${window.location.origin}/r/${incident.public_token || 'error'}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    toast.success("Abriendo WhatsApp...")
  }

  const handleCloseIncident = async () => {
    if (!incident) return
    if (!finalCost) {
      toast.error("Debes ingresar el monto final real")
      return
    }

    const costDetails = chargeContractor ? 
        { cost: parseFloat(finalCost), note: "Cargo al contratista" } : 
        { cost: parseFloat(finalCost) }

    toast.loading("Cerrando incidencia...")
    
    // Convert to number
    const numericCost = parseFloat(finalCost)
    
    // Update cost first
    const { error: costError } = await updateIncidentCost(incident.id, numericCost)
    if (costError) {
        toast.dismiss()
        toast.error("Error al actualizar costo")
        return
    }

    // Update status to CLOSED
    const { error: statusError } = await updateIncidentStatus(incident.id, 'CLOSED')
    
    toast.dismiss()
    if (statusError) {
        toast.error("Error al cerrar incidencia " + statusError)
    } else {
        toast.success(`Incidencia #${incident.folio_number} cerrada exitosamente`)
        onClose()
    }
  }

  // Helper for timeline (simplified for now as DB structure might differ from mock)
  const renderTimeline = () => {
      // If we had a real timeline/audit log structure we would map it here.
      // For now, let's just show basic events if available or a placeholder
      if (!incident?.audit_logs || incident.audit_logs.length === 0) {
          return <p className="text-sm text-muted-foreground italic">No hay actividad registrada reciente.</p>
      }
      // TODO: Map audit_logs to timeline events
      return incident.audit_logs.map((log: any, index: number) => (
          <div key={log.id} className="flex gap-3 mb-4 last:mb-0">
               <div className="flex flex-col items-center">
                   <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                   {index !== incident.audit_logs.length - 1 && <div className="w-px h-full bg-border my-1" />}
               </div>
               <div>
                   <p className="text-sm font-medium">{log.action}</p>
                   <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</p>
                   {log.comment && <p className="text-xs text-muted-foreground mt-1">{log.comment}</p>}
               </div>
          </div>
      ))
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[600px] w-full p-0 flex flex-col h-full overflow-hidden">
        {loading || !incident ? (
           <div className="flex flex-1 items-center justify-center">
               <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
           </div>
        ) : (
           <>
            {/* Header */}
            <SheetHeader className="p-6 pb-4 shrink-0 border-b">
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <SheetTitle className="text-xl">
                    #{incident.folio_number}
                    </SheetTitle>
                    <Badge variant="outline" className="text-xs">
                    {incident.project?.name?.substring(0, 3).toUpperCase() || 'PROY'}
                    </Badge>
                </div>
                <SheetDescription className="text-base font-medium text-foreground">
                    {incident.description}
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
                <span className="font-medium">{incident.created_by_user?.full_name || 'Sistema'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{new Date(incident.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{incident.location_tag || 'Sin ubicación'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono font-bold">
                    ${(incident.actual_cost || incident.estimated_cost || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
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
                        src={incident.photos?.[0]?.photo_url || '/placeholder.svg'} 
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
                        {incident.resolution_photo_url ? (
                        <>
                            <img 
                            src={incident.resolution_photo_url} 
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
                        {incident.resolution_photo_url ? "Reparación completada" : "Esperando evidencia"}
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
                    {renderTimeline()}
                </div>
                </div>

                <Separator />

                {/* Closure Zone - Only for Open/InReview */}
                {incident.status !== 'CLOSED' && (
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
                    Costo estimado: ${(incident.estimated_cost || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
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
                )}
            </div>
            </ScrollArea>
           </>
        )}
      </SheetContent>
    </Sheet>
  )
}
