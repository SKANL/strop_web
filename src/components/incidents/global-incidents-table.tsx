"use client"

import * as React from "react"
import { useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { LinkIcon, Check, X, Pencil, Inbox, Lock, Download, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { updateIncidentCostAction, generatePublicLinkAction, updateIncidentStatusAction } from "@/actions/incidents"
import { useCapabilities } from "@/hooks/use-capabilities"

// Real data types derived from Supabase result
// We can treat this as "any" for now or define a proper interface matching the query
interface IncidentRow {
  id: string
  folio_number: number
  description: string
  location_detail: string | null
  status: "OPEN" | "IN_REVIEW" | "CLOSED" | "REJECTED" | "DRAFT"
  priority: "NORMAL" | "URGENT" | "CRITICAL"
  actual_cost: number | null
  created_at: string
  project: { name: string } | null
  created_by_user: { full_name: string | null } | null
  assigned_to_user: { full_name: string | null; email?: string | null } | null
  photos: { photo_url: string }[]
  location_tag: string | null
}

// Helper to estimate time ago
function getTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 60) return `Hace ${diffMins} min`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `Hace ${diffHours} horas`
    return `Hace ${Math.floor(diffHours / 24)} días`
}

export function GlobalIncidentsTable({
  incidents,
  searchQuery,
  activeTab,
  onIncidentClick
}: {
  incidents: any[] // Using any for now to avoid strict type duplication, ideal is to import from actions
  searchQuery: string
  activeTab: string
  onIncidentClick: (incidentId: string) => void
}) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [editingCost, setEditingCost] = useState<string | null>(null)
  const [tempCost, setTempCost] = useState<string>("")
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [bulkLoading, setBulkLoading] = useState(false)
  const { can } = useCapabilities()
  const canViewCosts = can('financial.view_costs')
  const canEditCosts = can('financial.edit_costs')
  const canShareLink = can('comm.share_public_link')
  const canBulkUpdate = can('incident.close_operational') || can('incident.close_final')

  const selectedIds = Object.keys(rowSelection).filter(k => rowSelection[k])

  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedIds.length === 0) return
    setBulkLoading(true)
    try {
      await Promise.all(
        selectedIds.map(idx => {
          const incident = filteredIncidents[parseInt(idx)]
          return incident
            ? updateIncidentStatusAction(incident.id, newStatus as any)
            : Promise.resolve()
        })
      )
      toast.success(`${selectedIds.length} incidencia(s) actualizadas a "${newStatus}"`)
      setRowSelection({})
    } catch {
      toast.error('Error al actualizar algunas incidencias')
    } finally {
      setBulkLoading(false)
    }
  }

  const handleExportCSV = () => {
    const selected = selectedIds.length > 0
      ? selectedIds.map(idx => filteredIncidents[parseInt(idx)]).filter(Boolean)
      : filteredIncidents

    const header = ['Folio', 'Proyecto', 'Descripción', 'Ubicación', 'Estado', 'Prioridad', 'Costo', 'Asignado a', 'Fecha']
    const rows = selected.map(i => [
      `#${i.folio_number}`,
      i.project?.name || '',
      `"${(i.description || '').replace(/"/g, '""')}"`,
      i.location_tag || '',
      i.status,
      i.priority,
      i.actual_cost?.toString() || '',
      i.assigned_to_user?.full_name || '',
      new Date(i.created_at).toLocaleDateString('es-MX'),
    ])
    const csv = [header, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `incidencias_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`${selected.length} fila(s) exportadas`)
  }

  const handleCostEdit = (incidentId: string, currentCost: number) => {
    setEditingCost(incidentId)
    setTempCost(currentCost.toString())
  }

  const handleCostSave = (incidentId: string) => {
    toast.promise(
      updateIncidentCostAction(incidentId, parseFloat(tempCost)).then(() => {
        setEditingCost(null)
      }),
      {
        loading: 'Actualizando costo...',
        success: `Costo actualizado a $${parseFloat(tempCost || '0').toLocaleString('es-MX')}`,
        error: 'Error al actualizar el costo',
      }
    )
  }

  const handleCostCancel = () => {
    setEditingCost(null)
    setTempCost("")
  }

  const columns: ColumnDef<IncidentRow>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Seleccionar todos"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Seleccionar fila"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      size: 40,
      enableSorting: false,
    },
    {
      accessorKey: "id", // Using ID for key but displaying folio
      header: "ID",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-mono">
          #{row.original.folio_number}
        </span>
      ),
      size: 60,
    },
    {
      id: "project",
      header: "PROYECTO",
      accessorFn: (row) => row.project?.name,
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">{row.original.project?.name || 'Sin Proyecto'}</span>
        </div>
      ),
      size: 150,
    },
    {
      id: "evidence",
      header: "EVIDENCIA",
      cell: ({ row }) => {
        const photoUrl = row.original.photos?.[0]?.photo_url || '/placeholder.svg'
        return (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <div className="h-10 w-10 rounded border overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all">
              <img 
                src={photoUrl} 
                alt="Evidence" 
                className="w-full h-full object-cover"
              />
            </div>
          </HoverCardTrigger>
          <HoverCardContent side="right" className="w-80">
            <img 
              src={photoUrl} 
              alt="Evidence preview" 
              className="w-full rounded"
            />
          </HoverCardContent>
        </HoverCard>
      )},
      size: 80,
    },
    {
      accessorKey: "description",
      header: "DESCRIPCIÓN",
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5 max-w-xs">
          <span className="text-sm font-medium truncate">
            {row.original.description}
          </span>
          <span className="text-xs text-muted-foreground">
            Creado por {row.original.created_by_user?.full_name || 'Desconocido'}
          </span>
           <span className="text-[10px] text-muted-foreground/70">
            {getTimeAgo(row.original.created_at)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "location_tag",
      header: "UBICACIÓN",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs font-normal max-w-[150px] truncate">
          {row.original.location_tag || 'N/A'}
        </Badge>
      ),
      size: 150,
    },
    {
        id: "priority",
        header: "PRIORIDAD",
        accessorKey: "priority",
        cell: ({ row }) => {
            const priorityConfig: Record<string, { label: string; className: string }> = {
                CRITICAL: { label: 'Crítica', className: 'bg-destructive/10 text-destructive border-destructive/20' },
                URGENT:   { label: 'Urgente', className: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400' },
                NORMAL:   { label: 'Normal',  className: 'bg-muted text-muted-foreground border-border' },
            }
            const cfg = priorityConfig[row.original.priority] ?? { label: row.original.priority, className: '' }
            return (
                <Badge variant="outline" className={cn("text-xs font-normal", cfg.className)}>
                    {cfg.label}
                </Badge>
            )
        },
        size: 100
    },
    {
      accessorKey: "status",
      header: "ESTADO",
      cell: ({ row }) => (
        <StatusBadge status={row.original.status} showDot />
      ),
      size: 140,
    },
    {
      accessorKey: "actual_cost",
      header: () => <div className="text-right">COSTO ($)</div>,
      cell: ({ row }) => {
        const isEditing = editingCost === row.original.id
        const cost = row.original.actual_cost  // null = not set; 0 = explicitly zero

        if (!canViewCosts) {
          return (
            <div className="text-right flex items-center justify-end gap-1 text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span className="text-xs">—</span>
            </div>
          )
        }

        if (cost == null) {
          return (
            <div className="text-right">
              <span className="text-sm text-muted-foreground font-mono">—</span>
            </div>
          )
        }

        return (
          <div className="text-right">
            {!isEditing ? (
              <div 
                className={cn("flex items-center justify-end gap-2", canEditCosts && "group cursor-pointer")}
                onClick={() => canEditCosts && handleCostEdit(row.original.id, cost)}
              >
                <span className="font-mono font-bold text-sm">
                  ${cost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
                {canEditCosts && <Pencil className="h-3 w-3 text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity" />}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={tempCost}
                  onChange={(e) => setTempCost(e.target.value)}
                  className="h-7 w-24 text-right font-mono text-sm rounded border border-input px-2"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCostSave(row.original.id)
                    if (e.key === 'Escape') handleCostCancel()
                  }}
                />
                <button
                  className="h-7 w-7 flex items-center justify-center hover:bg-muted rounded"
                  onClick={() => handleCostSave(row.original.id)}
                >
                  <Check className="h-3 w-3 text-green-600" />
                </button>
                <button
                  className="h-7 w-7 flex items-center justify-center hover:bg-muted rounded"
                  onClick={handleCostCancel}
                >
                  <X className="h-3 w-3 text-destructive" />
                </button>
              </div>
            )}
          </div>
        )
      },
      size: 160,
    },
    {
      id: "actions",
      header: "ACCIONES",
      cell: ({ row }) => {
        const copyPublicLink = async () => {
          const result = await generatePublicLinkAction(row.original.id)
          if (!result.success || !result.url) {
            toast.error("No se pudo generar el enlace")
          } else {
            await navigator.clipboard.writeText(result.url)
            toast.success("Enlace copiado al portapapeles", {
              description: result.url
            })
          }
        }

        return (
          canShareLink ? (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            title="Copiar enlace público"
            onClick={(e) => {
              e.stopPropagation()
              copyPublicLink()
            }}
          >
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </Button>
          ) : null
        )
      },
      size: 100
    },
  ]

  // Filter incidents based on active tab and search query
  const filteredIncidents = React.useMemo(() => incidents.filter(incident => {
    // Tab filtering
    let passesTabFilter = true
    switch (activeTab) {
      case "urgent":
        passesTabFilter = incident.priority === 'CRITICAL' || incident.priority === 'URGENT'
        break
      case "pending":
        passesTabFilter = incident.status === "IN_REVIEW"
        break
      case "with-cost":
        passesTabFilter = (incident.actual_cost || 0) > 0
        break
      case "closed":
        passesTabFilter = incident.status === "CLOSED"
        break
      case "all":
      default:
        passesTabFilter = true
    }

    // Search filtering
    const searchLower = searchQuery.toLowerCase()
    const passesSearchFilter = searchQuery === "" || 
      incident.folio_number?.toString().includes(searchLower) ||
      incident.description?.toLowerCase().includes(searchLower) ||
      incident.project?.name?.toLowerCase().includes(searchLower) ||
      incident.location_tag?.toLowerCase().includes(searchLower) ||
      incident.assigned_to_user?.full_name?.toLowerCase().includes(searchLower)

    return passesTabFilter && passesSearchFilter
  }), [activeTab, searchQuery, incidents])

  const table = useReactTable({
    data: filteredIncidents,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  })

  return (
    <div className="space-y-2">
      {/* Floating bulk action bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border bg-primary text-primary-foreground px-4 py-2.5 shadow-lg animate-in slide-in-from-bottom-2">
          <span className="text-sm font-semibold shrink-0">{selectedIds.length} seleccionada(s)</span>
          <div className="flex-1" />
          {canBulkUpdate && (
            <Select onValueChange={handleBulkStatusChange} disabled={bulkLoading}>
              <SelectTrigger className="h-8 w-44 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground text-xs">
                <SelectValue placeholder="Cambiar estado…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Abrir</SelectItem>
                <SelectItem value="IN_REVIEW">En Revisión</SelectItem>
                <SelectItem value="CLOSED">Cerrar</SelectItem>
                <SelectItem value="REJECTED">Rechazar</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Button
            variant="secondary"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={handleExportCSV}
            disabled={bulkLoading}
          >
            {bulkLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
            Exportar CSV
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setRowSelection({})}
          >
            Deseleccionar
          </Button>
        </div>
      )}

      <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead 
                  key={header.id}
                  className="h-10 text-xs font-semibold uppercase tracking-wider"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="h-12 cursor-pointer hover:bg-muted/50"
                onClick={() => {
                  onIncidentClick(row.original.id)
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell 
                    key={cell.id}
                    className="py-2"
                    onClick={(e) => {
                      // Prevent row click when clicking on interactive elements
                      if ((e.target as HTMLElement).closest('button, input, select')) {
                        e.stopPropagation()
                      }
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-40">
                <div className="flex flex-col items-center justify-center gap-3 py-8 text-muted-foreground">
                  <Inbox className="h-10 w-10 opacity-30" aria-hidden="true" />
                  <p className="text-sm font-medium">Sin incidencias</p>
                  <p className="text-xs opacity-70">
                    No hay incidencias que coincidan con los filtros aplicados.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    </div>
  )
}
