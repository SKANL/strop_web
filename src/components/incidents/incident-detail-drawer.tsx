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
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
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
import { fetchIncidentByIdAction, updateIncidentCostAction, updateIncidentStatusAction } from "@/actions/incidents"

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
  const [showConfirmClose, setShowConfirmClose] = useState(false)

  useEffect(() => {
    if (isOpen && incidentId) {
      const fetchIncident = async () => {
        setLoading(true)
        const { success, data, error } = await fetchIncidentByIdAction(incidentId)
        if (!success || error) {
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
    const costResult = await updateIncidentCostAction(incident.id, numericCost)
    if (!costResult.success) {
        toast.dismiss()
        toast.error("Error al actualizar costo: " + costResult.message)
        return
    }

    // Update status to CLOSED
    const statusResult = await updateIncidentStatusAction(incident.id, 'CLOSED')
    
    toast.dismiss()
    if (!statusResult.success) {
        toast.error("Error al cerrar incidencia " + statusResult.message)
    } else {
        toast.success(`Incidencia #${incident.folio_number} cerrada exitosamente`)
        onClose()
    }
  }

  const ACTION_LABELS: Record<string, string> = {
    cost_update: 'Costo actualizado',
    status_change: 'Estado cambiado',
    created: 'Incidencia creada',
    assigned: 'Asignado a responsable',
    photo_uploaded: 'Foto subida',
    closed: 'Incidencia cerrada',
    rejected: 'Incidencia rechazada',
  }

  const renderTimeline = () => {
      if (!incident?.audit_logs || incident.audit_logs.length === 0) {
          return <p className="text-sm text-muted-foreground italic">No hay actividad registrada.</p>
      }
      return incident.audit_logs.map((log: any, index: number) => {
          const label = ACTION_LABELS[log.action] || log.action
          const oldVal = log.old_value && typeof log.old_value === 'object'
              ? Object.values(log.old_value as Record<string,unknown>)[0]
              : null
          const newVal = log.new_value && typeof log.new_value === 'object'
              ? Object.values(log.new_value as Record<string,unknown>)[0]
              : null
          return (
              <div key={log.id} className="flex gap-3 mb-4 last:mb-0">
                   <div className="flex flex-col items-center">
                       <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                       {index !== incident.audit_logs.length - 1 && <div className="w-px flex-1 bg-border my-1" />}
                   </div>
                   <div className="pb-1">
                       <p className="text-sm font-medium">{label}</p>
                       {oldVal != null && newVal != null && (
                           <p className="text-xs text-muted-foreground">
                               {String(oldVal)} → {String(newVal)}
                           </p>
                       )}
                       <p className="text-xs text-muted-foreground">
                           {new Date(log.timestamp).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}
                       </p>
                       {log.comment && <p className="text-xs text-muted-foreground mt-1 italic">{log.comment}</p>}
                   </div>
              </div>
          )
      })
  }

  return (
    <>
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
                    onClick={() => setShowConfirmClose(true)}
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

    <ConfirmDialog
      open={showConfirmClose}
      onOpenChange={setShowConfirmClose}
      title="¿Cerrar incidencia?"
      description={`Esto cerrará definitivamente la incidencia #${incident?.folio_number} con un costo final de $${parseFloat(finalCost || '0').toLocaleString('es-MX', { minimumFractionDigits: 2 })}. Esta acción no se puede deshacer.`}
      confirmLabel="Sí, cerrar"
      onConfirm={handleCloseIncident}
    />
    </>
  )
}
