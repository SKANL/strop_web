"use client"

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
import { useCapabilities } from "@/hooks/use-capabilities"
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
  Loader2,
  Copy,
  MessageSquare,
  XCircle,
  Volume2,
  AlertOctagon,
  RefreshCw,
  RotateCcw
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { fetchIncidentByIdAction, updateIncidentCostAction, updateIncidentStatusAction, assignIncidentAction, fetchProjectMembersAction } from "@/actions/incidents"
import { getStaticMapUrl, parseGpsCoords } from "@/lib/geoapify"
import { IncidentAuditLog } from "@/components/incidents/incident-audit-log"

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
  const [assignedUserId, setAssignedUserId] = useState<string | null>(null)
  const [projectMembers, setProjectMembers] = useState<{ id: string; full_name: string | null; email: string | null; role_name: string | null }[]>([])
  const [isAssigning, setIsAssigning] = useState(false)
  const [showWhatsAppCopy, setShowWhatsAppCopy] = useState(false)
  const [showAuditLog, setShowAuditLog] = useState(false)
  const [showRejectConfirm, setShowRejectConfirm] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [isRejecting, setIsRejecting] = useState(false)
  const { can } = useCapabilities()

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
          if (data?.assigned_to) setAssignedUserId(data.assigned_to)
          // Fetch project members for assignment via server action
          const membersResult = await fetchProjectMembersAction(incidentId)
          if (membersResult.success) setProjectMembers(membersResult.data)
        }
        setLoading(false)
      }
      fetchIncident()
    } else {
        setIncident(null)
        setFinalCost("")
        setShowWhatsAppCopy(false)
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

  const handleRejectIncident = async () => {
    if (!incident) return
    if (!rejectReason.trim()) {
      toast.error('Debes indicar el motivo del rechazo')
      return
    }
    setIsRejecting(true)
    toast.loading('Rechazando...')
    const result = await updateIncidentStatusAction(incident.id, 'REJECTED', rejectReason.trim())
    toast.dismiss()
    setIsRejecting(false)
    if (result.success) {
      toast.success(`Incidencia #${incident.folio_number} rechazada`)
      setShowRejectConfirm(false)
      setRejectReason('')
      onClose()
    } else {
      toast.error(result.message || 'Error al rechazar')
    }
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

  const handleReopenIncident = async () => {
    if (!incident) return
    toast.loading("Reabriendo incidencia...")
    const result = await updateIncidentStatusAction(incident.id, 'OPEN')
    toast.dismiss()
    if (!result.success) {
      toast.error("Error al reabrir incidencia: " + result.message)
    } else {
      toast.success(`Incidencia #${incident.folio_number} reabierta — pendiente de nueva reparación`)
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

  // WhatsApp assignment message
  const assignedMemberName = projectMembers.find(m => m.id === assignedUserId)?.full_name ?? null
  const whatsAppMsg = showWhatsAppCopy && incident
    ? [
        `\uD83D\uDD27 *Incidencia #${incident.folio_number}* te ha sido asignada`,
        `\uD83D\uDCCB *Proyecto:* ${incident.project?.name ?? '\u2014'}`,
        incident.location_tag ? `\uD83D\uDCCD *Ubicaci\u00F3n:* ${incident.location_tag}` : null,
        `\uD83D\uDEA8 *Prioridad:* ${incident.priority === 'CRITICAL' ? '\uD83D\uDD34 Cr\u00EDtica' : incident.priority === 'URGENT' ? '\uD83D\uDFE0 Urgente' : '\uD83D\uDFE1 Normal'}`,
        '',
        `Ver detalles: ${typeof window !== 'undefined' ? window.location.origin : 'https://constructora.zentyar.com'}/r/${incident.public_token}`,
      ].filter(Boolean).join('\n')
    : null

  return (
    <>
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-150 w-full p-0 flex flex-col h-full overflow-hidden">
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
                {can('comm.share_public_link') && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShareWhatsApp}
                  title="Compartir vía WhatsApp"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              )}
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
                {can('financial.view_costs') && (
                <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono font-bold">
                    ${(incident.actual_cost || incident.estimated_cost || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
                </div>
                )}
            </div>
            </SheetHeader>

            {/* Static Map Preview */}
            {(() => {
              const coords = parseGpsCoords(incident.gps_coords)
              if (!coords) return null
              return (
                <div className="shrink-0 relative overflow-hidden border-b">
                  <img
                    src={getStaticMapUrl(coords[0], coords[1], { width: 800, height: 200, zoom: 16 })}
                    alt="Ubicación de la incidencia"
                    className="w-full h-35 object-cover"
                  />
                  <div className="absolute bottom-2 right-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${coords[1]},${coords[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] bg-white/90 hover:bg-white px-2 py-1 rounded shadow text-foreground font-medium transition-colors"
                    >
                      Abrir en Maps ↗
                    </a>
                  </div>
                </div>
              )
            })()}

            {/* REJECTED Banner */}
            {incident.status === 'REJECTED' && incident.rejection_reason && (
              <div className="mx-6 my-3 flex items-start gap-3 rounded-lg border-2 border-destructive/40 bg-destructive/8 px-4 py-3">
                <AlertOctagon className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-destructive">Reparación Rechazada</p>
                  <p className="text-sm text-destructive/80 mt-0.5">{incident.rejection_reason}</p>
                </div>
              </div>
            )}

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

                {/* Audio Player */}
                {incident.audio_url && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Nota de Voz</h3>
                    <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                      <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
                      <audio
                        controls
                        src={incident.audio_url}
                        className="flex-1 h-8"
                        style={{ minWidth: 0 }}
                      />
                    </div>
                  </div>
                )}

                {/* Assign Section */}
                {can('incident.assign') && (
                  <div className="space-y-2">
                    <Label htmlFor="assign-select">Asignar a</Label>
                    <div className="flex gap-2">
                      <select
                        id="assign-select"
                        value={assignedUserId || ""}
                        onChange={(e) => setAssignedUserId(e.target.value || null)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        disabled={isAssigning}
                        aria-label="Seleccionar responsable"
                      >
                        <option value="">Sin asignar</option>
                        {projectMembers.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.full_name || member.email}{member.role_name ? ` (${member.role_name})` : ''}
                          </option>
                        ))}
                      </select>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isAssigning || !assignedUserId}
                        aria-label="Confirmar asignación"
                        onClick={async () => {
                          if (!assignedUserId || !incident) return
                          setIsAssigning(true)
                          const result = await assignIncidentAction(incident.id, assignedUserId)
                          if (result.success) {
                            toast.success("Incidencia asignada correctamente")
                            setShowWhatsAppCopy(true)
                          } else {
                            toast.error("Error al asignar")
                          }
                          setIsAssigning(false)
                        }}
                      >
                        {isAssigning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>

                    {/* WhatsApp Assignment Message */}
                    {whatsAppMsg && (
                      <div className="mt-1 rounded-lg border border-green-200 bg-green-50 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-green-800 flex items-center gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5" />
                            Mensaje para WhatsApp
                            {assignedMemberName && <span className="font-normal text-green-700">— {assignedMemberName}</span>}
                          </p>
                          <button onClick={() => setShowWhatsAppCopy(false)} className="text-green-600 hover:text-green-800">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <pre className="text-xs text-green-900 whitespace-pre-wrap font-sans leading-relaxed">{whatsAppMsg}</pre>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-green-300 text-green-800 hover:bg-green-100 text-xs h-8"
                          onClick={() => {
                            navigator.clipboard.writeText(whatsAppMsg)
                            toast.success('Mensaje copiado al portapapeles')
                          }}
                        >
                          <Copy className="h-3.5 w-3.5 mr-1.5" />
                          Copiar mensaje
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <Separator />

                {/* Closure Zone - Only for non-CLOSED incidents where user has actions */}
                {incident.status !== 'CLOSED' && (
                  can('incident.close_final') || can('incident.close_operational') ||
                  can('financial.edit_costs') || can('financial.manage_chargebacks')
                ) && (
                <div className="space-y-4 p-4 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                    Zona de Cierre
                    </h3>
                </div>

                {/* Charge Contractor Switch */}
                {can('financial.manage_chargebacks') && (
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
                )}

                {/* Final Cost Input */}
                {can('financial.edit_costs') && (
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
                )}

                {/* Close Button — hidden for REJECTED (use Reabrir instead) */}
                {incident.status !== 'REJECTED' && (can('incident.close_final') || can('incident.close_operational')) && (
                <Button 
                    className="w-full h-12 text-base font-semibold"
                    onClick={() => setShowConfirmClose(true)}
                >
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Cerrar Incidencia
                </Button>
                )}

                {/* Reabrir Button — only for REJECTED incidents */}
                {incident.status === 'REJECTED' && can('incident.close_operational') && (
                <Button
                    variant="outline"
                    className="w-full h-12 text-base font-semibold border-amber-500/50 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                    onClick={handleReopenIncident}
                >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Reabrir Incidencia
                </Button>
                )}

                {/* Reject Button - only for IN_REVIEW incidents */}
                {incident.status === 'IN_REVIEW' && can('incident.close_operational') && (
                  <div className="mt-3 space-y-2">
                    {!showRejectConfirm ? (
                      <Button
                        variant="outline"
                        className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
                        onClick={() => setShowRejectConfirm(true)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar Reparación
                      </Button>
                    ) : (
                      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-3">
                        <p className="text-sm font-semibold text-destructive">Motivo del rechazo</p>
                        <Textarea
                          placeholder="Ej: La fuga sigue activa, se requiere nueva intervención..."
                          className="text-sm"
                          rows={3}
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => { setShowRejectConfirm(false); setRejectReason('') }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex-1"
                            disabled={isRejecting || !rejectReason.trim()}
                            onClick={handleRejectIncident}
                          >
                            {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirmar rechazo'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                </div>
                )}
            </div>
                <Separator />

                {/* Audit Log Collapsible */}
                <div className="space-y-2">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-1 text-sm font-medium hover:text-foreground text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                    onClick={() => setShowAuditLog(prev => !prev)}
                    aria-expanded={showAuditLog}
                    aria-controls="audit-log-section"
                  >
                    <span>Historial de cambios</span>
                    <span className="text-xs">{showAuditLog ? '▲' : '▼'}</span>
                  </button>
                  {showAuditLog && incident && (
                    <div id="audit-log-section">
                      <IncidentAuditLog incidentId={incident.id} />
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
