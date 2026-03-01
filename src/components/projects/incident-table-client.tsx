"use client"

import * as React from "react"
import NextImage from 'next/image'
import { updateIncidentCostAction, generatePublicLinkAction } from '@/actions/incidents'
import type { Database } from '@/types/supabase'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { Edit2, Link as LinkIcon, Lock, MapPinOff } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "sonner"
import { useCapabilities } from "@/hooks/use-capabilities"
import { parseGpsCoords, haversineMeters } from "@/lib/geoapify"

type Incident = Database['public']['Tables']['incidents']['Row'] & {
  created_by_user?: {
    full_name: string | null
  } | null
  assigned_to_user?: {
    full_name: string | null
  } | null
  photos?: Array<{
    photo_url: string
    photo_type: string
  }>
}

interface IncidentTableClientProps {
  incidents: Incident[]
  projectLocationGps?: any
  projectGeofenceRadius?: number | null
}

// Safe Cost Input Component
function SafeCostInput({ incidentId, value, canEdit, onSave }: {
  incidentId: string
  value: number | null
  canEdit: boolean
  onSave?: (newValue: number) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [tempValue, setTempValue] = React.useState(value?.toString() || "")
  const [isLoading, setIsLoading] = React.useState(false)

  if (!canEdit) {
    return (
      <span className="text-sm font-mono text-muted-foreground">
        {value != null ? `$${value.toLocaleString()}` : "—"}
      </span>
    )
  }

  const handleSave = async () => {
    setIsLoading(true)
    const result = await updateIncidentCostAction(incidentId, parseFloat(tempValue))
    setIsLoading(false)
    
    if (!result.success) {
      toast.error(result.message || 'Error updating cost')
    } else {
      toast.success("Costo actualizado")
      onSave?.(parseFloat(tempValue))
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 font-mono">
          {value != null ? `$${value.toLocaleString()}` : "—"}
          <Edit2 className="ml-2 h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Actualizar Costo</h4>
            <Input
              type="number"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder="0.00"
              className="font-mono"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function IncidentTableClient({ incidents, projectLocationGps, projectGeofenceRadius }: IncidentTableClientProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const { can } = useCapabilities()
  const canViewCosts = can('financial.view_costs')
  const canEditCosts = can('financial.edit_costs')
  const canShareLink = can('comm.share_public_link')

  // Pre-parse project center for geofencing
  const projectCenter = React.useMemo(
    () => parseGpsCoords(projectLocationGps),
    [projectLocationGps]
  )

  const isOutsideGeofence = React.useCallback(
    (incidentGps: any): boolean => {
      if (!projectCenter || !projectGeofenceRadius || projectGeofenceRadius <= 0) return false
      const incidentCoords = parseGpsCoords(incidentGps)
      if (!incidentCoords) return false
      return haversineMeters(projectCenter, incidentCoords) > projectGeofenceRadius
    },
    [projectCenter, projectGeofenceRadius]
  )

  const handleCopyLink = async (incidentId: string) => {
    const result = await generatePublicLinkAction(incidentId)
    if (!result.success) {
      toast.error(result.message || 'Error generating link')
    } else if (result.url) {
      navigator.clipboard.writeText(result.url)
      toast.success("Link copiado al portapapeles")
    }
  }

  const columns: ColumnDef<Incident>[] = [
    {
      accessorKey: "folio_number",
      header: "ID",
      cell: ({ row }) => `#${row.original.folio_number}`,
    },
    {
      accessorKey: "photos",
      header: "Evidence",
      cell: ({ row }) => {
        const photos = row.original.photos || []
        const evidencePhoto = photos.find(p => p.photo_type === 'evidence')
        
        if (!evidencePhoto) return <span className="text-muted-foreground text-xs">No photo</span>
        
        return (
          <HoverCard>
            <HoverCardTrigger>
              <NextImage 
                src={evidencePhoto.photo_url} 
                alt="Evidence" 
                width={32}
                height={32}
                className="h-8 w-8 rounded object-cover cursor-pointer"
              />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <NextImage 
                src={evidencePhoto.photo_url} 
                alt="Evidence enlarged"
                width={320}
                height={240}
                className="w-full rounded"
              />
            </HoverCardContent>
          </HoverCard>
        )
      },
    },
    {
      accessorKey: "description",
      header: "DESCRIPCIÓN",
      cell: ({ row }) => (
        <div className="max-w-md truncate">
          {row.original.description}
        </div>
      ),
    },
    {
      accessorKey: "location_tag",
      header: "UBICACIÓN",
      cell: ({ row }) => {
        const outside = isOutsideGeofence(row.original.gps_coords)
        return (
          <div className="flex items-center gap-1.5">
            <span>{row.original.location_tag || "—"}</span>
            {outside && (
              <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50 text-[10px] px-1 py-0 gap-0.5 shrink-0">
                <MapPinOff className="h-2.5 w-2.5" />
                Fuera de zona
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "assigned_to_user",
      header: "ASIGNADO A",
      cell: ({ row }) => row.original.assigned_to_user?.full_name || "Sin asignar",
    },
    {
      accessorKey: "status",
      header: "ESTADO",
      cell: ({ row }) => <StatusBadge status={row.original.status} showDot />,
    },
    {
      accessorKey: "actual_cost",
      header: "COSTO",
      cell: ({ row }) => {
        if (!canViewCosts) {
          return <Lock className="h-4 w-4 text-muted-foreground" />
        }
        return (
          <SafeCostInput
            incidentId={row.original.id}
            value={row.original.actual_cost}
            canEdit={canEditCosts}
          />
        )
      },
    },
    ...(canShareLink ? [{
      id: "actions",
      header: "Acciones",
      cell: ({ row }: { row: any }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleCopyLink(row.original.id)}
          title="Copiar enlace de resolución"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      ),
    }] : []),
  ]

  const table = useReactTable({
    data: incidents,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Buscar por descripción..."
          value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("description")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No se encontraron incidencias.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
