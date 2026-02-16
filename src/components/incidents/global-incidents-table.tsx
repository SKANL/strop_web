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
import { LinkIcon, Check, X, Pencil } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Mock data type
type GlobalIncident = {
  id: string
  project: string
  projectCode: string
  evidence: string
  description: string
  createdBy: string
  location: string
  assignedTo: string
  tradeType: "plumbing" | "electrical" | "masonry" | "painting" | "carpentry"
  status: "open" | "in_review" | "closed"
  cost: number
  lastUpdate: string
}

// Mock data
const mockIncidents: GlobalIncident[] = [
  {
    id: "#1024",
    project: "Torre Meriden",
    projectCode: "TM-02",
    evidence: "/placeholder.svg",
    description: "Grieta en muro de carga",
    createdBy: "Juan (Residente)",
    location: "Nivel 3 > Depto 301",
    assignedTo: "Yesero",
    tradeType: "masonry",
    status: "open",
    cost: 1500,
    lastUpdate: "Hace 2 horas"
  },
  {
    id: "#1025",
    project: "Plaza Altabrisa",
    projectCode: "PA-01",
    evidence: "/placeholder.svg",
    description: "Fuga de agua en baño principal",
    createdBy: "María (Residente)",
    location: "Nivel 2 > Local 205",
    assignedTo: "Plomero",
    tradeType: "plumbing",
    status: "in_review",
    cost: 2300,
    lastUpdate: "Hace 1 día"
  },
  {
    id: "#1026",
    project: "Torre Meriden",
    projectCode: "TM-02",
    evidence: "/placeholder.svg",
    description: "Instalación eléctrica incorrecta",
    createdBy: "Pedro (Superintendente)",
    location: "Nivel 5 > Depto 502",
    assignedTo: "Electricista",
    tradeType: "electrical",
    status: "open",
    cost: 3200,
    lastUpdate: "Hace 3 horas"
  },
  {
    id: "#1027",
    project: "Residencial Los Pinos",
    projectCode: "RP-03",
    evidence: "/placeholder.svg",
    description: "Pintura con burbujas por humedad",
    createdBy: "Ana (Residente)",
    location: "Casa 12 > Sala",
    assignedTo: "Pintor",
    tradeType: "painting",
    status: "closed",
    cost: 800,
    lastUpdate: "Hace 5 días"
  },
]

const tradeColors = {
  plumbing: "bg-blue-100 text-blue-800 border-blue-200",
  electrical: "bg-yellow-100 text-yellow-800 border-yellow-200",
  masonry: "bg-gray-100 text-gray-800 border-gray-200",
  painting: "bg-purple-100 text-purple-800 border-purple-200",
  carpentry: "bg-amber-100 text-amber-800 border-amber-200",
}

const tradeLabels = {
  plumbing: "🔧 Plomería",
  electrical: "⚡ Eléctrico",
  masonry: "🧱 Yesero",
  painting: "🎨 Pintura",
  carpentry: "🪚 Carpintería",
}

const statusColors = {
  open: "destructive",
  in_review: "default",
  closed: "secondary",
}

const statusLabels = {
  open: "🔴 Abierto",
  in_review: "🟡 En Revisión",
  closed: "🟢 Cerrado",
}

export function GlobalIncidentsTable({
  searchQuery,
  activeTab,
  onIncidentClick
}: {
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
      new Promise((resolve) => setTimeout(resolve, 500)),
      {
        loading: 'Actualizando costo...',
        success: () => {
          setEditingCost(null)
          return `Costo actualizado a $${parseFloat(tempCost).toLocaleString('es-MX')}`
        },
        error: 'Error al actualizar'
      }
    )
  }

  const handleCostCancel = () => {
    setEditingCost(null)
    setTempCost("")
  }

  const columns: ColumnDef<GlobalIncident>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground font-mono">
          {row.original.id}
        </span>
      ),
      size: 60,
    },
    {
      accessorKey: "project",
      header: "PROYECTO",
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">{row.original.project}</span>
          <span className="text-xs text-muted-foreground font-mono">
            {row.original.projectCode}
          </span>
        </div>
      ),
      size: 150,
    },
    {
      accessorKey: "evidence",
      header: "EVIDENCIA",
      cell: ({ row }) => (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <div className="h-10 w-10 rounded border overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all">
              <img 
                src={row.original.evidence} 
                alt="Evidence" 
                className="w-full h-full object-cover"
              />
            </div>
          </HoverCardTrigger>
          <HoverCardContent side="right" className="w-80">
            <img 
              src={row.original.evidence} 
              alt="Evidence preview" 
              className="w-full rounded"
            />
          </HoverCardContent>
        </HoverCard>
      ),
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
            Creado por {row.original.createdBy}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "UBICACIÓN",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs font-normal">
          {row.original.location}
        </Badge>
      ),
      size: 150,
    },
    {
      accessorKey: "assignedTo",
      header: "ASIGNADO",
      cell: ({ row }) => (
        <Badge 
          variant="outline"
          className={cn("text-xs", tradeColors[row.original.tradeType])}
        >
          {tradeLabels[row.original.tradeType]}
        </Badge>
      ),
      size: 140,
    },
    {
      accessorKey: "status",
      header: "ESTADO",
      cell: ({ row }) => (
        <Select defaultValue={row.original.status}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">🔴 Abierto</SelectItem>
            <SelectItem value="in_review">🟡 En Revisión</SelectItem>
            <SelectItem value="closed">🟢 Cerrado</SelectItem>
          </SelectContent>
        </Select>
      ),
      size: 140,
    },
    {
      accessorKey: "cost",
      header: () => <div className="text-right">COSTO ($)</div>,
      cell: ({ row }) => {
        const isEditing = editingCost === row.original.id
        
        return (
          <div className="text-right">
            {!isEditing ? (
              <div 
                className="flex items-center justify-end gap-2 group cursor-pointer"
                onClick={() => handleCostEdit(row.original.id, row.original.cost)}
              >
                <span className="font-mono font-bold text-sm">
                  ${row.original.cost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
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
          const mockToken = `${row.original.id.replace('#', '')}-${Date.now().toString(36)}`
          const publicUrl = `${window.location.origin}/r/${mockToken}`
          
          try {
            await navigator.clipboard.writeText(publicUrl)
            toast.success("Enlace copiado al portapapeles", {
              description: publicUrl
            })
          } catch (err) {
            toast.error("No se pudo copiar el enlace")
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
  const filteredIncidents = React.useMemo(() => mockIncidents.filter(incident => {
    // Tab filtering
    let passesTabFilter = true
    switch (activeTab) {
      case "urgent":
        // Mock: incidents with cost > 3000 are urgent
        passesTabFilter = incident.cost > 3000
        break
      case "pending":
        passesTabFilter = incident.status === "in_review"
        break
      case "with-cost":
        passesTabFilter = incident.cost > 0
        break
      case "closed":
        passesTabFilter = incident.status === "closed"
        break
      case "all":
      default:
        passesTabFilter = true
    }

    // Search filtering
    const passesSearchFilter = searchQuery === "" || 
      incident.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())

    return passesTabFilter && passesSearchFilter
  }), [activeTab, searchQuery])

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
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No se encontraron incidencias.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
