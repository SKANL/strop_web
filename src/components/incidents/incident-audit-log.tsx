"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Clock, User, ArrowRight, MessageSquare, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { fetchAuditLogAction } from "@/actions/incidents"

// Mirror of AuditLogEntry from audit-service (type only, no server import)
export interface AuditLogEntry {
  id: string
  action: string
  old_value: Record<string, unknown> | null
  new_value: Record<string, unknown> | null
  comment: string | null
  timestamp: string
  modified_by_user: {
    full_name: string | null
    email: string | null
  } | null
}

const ACTION_LABELS: Record<string, string> = {
  status_change: "Cambio de estado",
  assignment: "Asignación",
  cost_update: "Actualización de costo",
  billable_change: "Cambio de cobrabilidad",
  created: "Incidencia creada",
  closed: "Incidencia cerrada",
  rejected: "Incidencia rechazada",
}

function getActionColor(action: string): "default" | "destructive" | "secondary" | "outline" {
  switch (action) {
    case "closed": return "default"
    case "rejected": return "destructive"
    case "assignment": return "secondary"
    default: return "outline"
  }
}

interface IncidentAuditLogProps {
  incidentId: string
}

export function IncidentAuditLog({ incidentId }: IncidentAuditLogProps) {
  const [entries, setEntries] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await fetchAuditLogAction(incidentId)
        if (mounted && result.success) setEntries(result.data as AuditLogEntry[])
      } catch {
        if (mounted) setError('No se pudo cargar el historial')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [incidentId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8" role="status" aria-label="Cargando historial">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <p className="py-4 text-sm text-destructive" role="alert">{error}</p>
    )
  }

  if (entries.length === 0) {
    return (
      <p className="py-4 text-sm text-muted-foreground">Sin historial de cambios.</p>
    )
  }

  return (
    <ScrollArea className="max-h-80 pr-2">
      <ol className="relative space-y-4 border-l border-border pl-4" aria-label="Historial de auditoría">
        {entries.map((entry) => {
          const actorName = entry.modified_by_user?.full_name
            || entry.modified_by_user?.email
            || "Sistema"
          const dateStr = format(new Date(entry.timestamp), "dd MMM yyyy, HH:mm", { locale: es })
          const label = ACTION_LABELS[entry.action] || entry.action

          return (
            <li key={entry.id} className="relative" role="listitem">
              <div className="absolute -left-5.25 top-1 h-4 w-4 rounded-full border-2 border-background bg-border" aria-hidden="true" />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={getActionColor(entry.action)} className="text-xs">
                    {label}
                  </Badge>
                  {entry.action === 'status_change' && entry.old_value && entry.new_value && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>{String((entry.old_value as Record<string, unknown>).status ?? entry.old_value)}</span>
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      <span>{String((entry.new_value as Record<string, unknown>).status ?? entry.new_value)}</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1" aria-label={`Usuario: ${actorName}`}>
                    <User className="h-3 w-3" aria-hidden="true" />
                    {actorName}
                  </span>
                  <span className="flex items-center gap-1" aria-label={`Fecha: ${dateStr}`}>
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {dateStr}
                  </span>
                </div>
                {entry.comment && (
                  <div className="flex items-start gap-1.5 rounded-md bg-muted/50 p-2">
                    <MessageSquare className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <p className="text-xs text-muted-foreground">{entry.comment}</p>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </ScrollArea>
  )
}
