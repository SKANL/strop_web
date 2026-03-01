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
import { LinkIcon, Check, X, Pencil, Inbox } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { updateIncidentCostAction, generatePublicLinkAction } from "@/actions/incidents"
import { getLabelForPriority } from "@/lib/enum-labels"

// Real data types derived from Supabase result
// We can treat this as "any" for now or define a proper interface matching the query
interface IncidentRow {
  id: string
  folio_number: number
  description: string
  location_detail: string | null
  status: "OPEN" | "IN_REVIEW" | "CLOSED" | "REJECTED" | "DRAFT"
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  actual_cost: number | null
  created_at: string
  project: { name: string } | null
  created_by_user: { full_name: string | null } | null
  assigned_to_user: { full_name: string | null } | null
  photos: { photo_url: string }[]
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
      accessorKey: "location_detail",
      header: "UBICACIÓN",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs font-normal max-w-[150px] truncate">
          {row.original.location_detail || 'N/A'}
        </Badge>
      ),
      size: 150,
    },
    {
        id: "priority",
        header: "PRIORIDAD",
        accessorKey: "priority",
        cell: ({ row }) => (
            <Badge variant="secondary" className={cn("text-xs font-normal", {
                "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400": row.original.priority === 'CRITICAL',
                "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400": row.original.priority === 'HIGH',
                "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400": row.original.priority === 'MEDIUM',
                "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400": row.original.priority === 'LOW',
            })}>
                {getLabelForPriority(row.original.priority)}
            </Badge>
        ),
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
        const cost = row.original.actual_cost || 0
        
        return (
          <div className="text-right">
            {!isEditing ? (
              <div 
                className="flex items-center justify-end gap-2 group cursor-pointer"
                onClick={() => handleCostEdit(row.original.id, cost)}
              >
                <span className="font-mono font-bold text-sm">
                  ${cost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
                <Pencil className="h-3 w-3 text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity" />
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={tempCost}
                  onChange={(e) => setTempCost(e.target.value)}
                  className="h-7 w-24 text-right font-mono text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCostSave(row.original.id)
                    if (e.key === 'Escape') handleCostCancel()
                  }}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => handleCostSave(row.original.id)}
                >
                  <Check className="h-3 w-3 text-green-600" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={handleCostCancel}
                >
                  <X className="h-3 w-3 text-destructive" />
                </Button>
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
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              copyPublicLink()
            }}
          >
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </Button>
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
        passesTabFilter = incident.priority === 'CRITICAL' || incident.priority === 'HIGH'
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
      incident.location_detail?.toLowerCase().includes(searchLower) ||
      incident.assigned_to_user?.full_name?.toLowerCase().includes(searchLower)

    return passesTabFilter && passesSearchFilter
  }), [activeTab, searchQuery, incidents])

  const table = useReactTable({
    data: filteredIncidents,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  return (
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
  )
}
