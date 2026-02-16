"use client"

import * as React from "react"
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
import { Edit2, Link as LinkIcon } from "lucide-react"

// --- Types ---
type Incident = {
  id: string
  evidenceUrl: string
  description: string
  location: string
  assignedTo: string
  assignedTrade: "Electricista" | "Plomero" | "Yesero" | "Albañil"
  status: "Abierto" | "En Proceso" | "Cerrado" | "Crítico"
  cost: number | null
  createdAt: string
  createdBy: string
}

// --- Mock Data ---
const data: Incident[] = [
  {
    id: "#1024",
    evidenceUrl: "/placeholder.svg",
    description: "Fuga de agua en baño principal sin reparar.",
    location: "Nivel 3 > Depto 301",
    assignedTo: "Mario Bros",
    assignedTrade: "Plomero",
    status: "Crítico",
    cost: 1500,
    createdAt: "Ayer 10:00 AM",
    createdBy: "Juan (Residente)",
  },
  {
    id: "#1025",
    evidenceUrl: "/placeholder.svg",
    description: "Cable expuesto en pasillo central.",
    location: "Nivel 2 > Pasillo",
    assignedTo: "Luigi",
    assignedTrade: "Electricista",
    status: "Abierto",
    cost: null,
    createdAt: "Hace 2 horas",
    createdBy: "Maria (Super)",
  },
   {
    id: "#1026",
    evidenceUrl: "/placeholder.svg",
    description: "Muro con humedad en colindancia.",
    location: "PB > Lobby",
    assignedTo: "Wario",
    assignedTrade: "Yesero",
    status: "En Proceso",
    cost: 5000,
    createdAt: "Hace 3 días",
    createdBy: "Juan (Residente)",
  },
   {
    id: "#1027",
    evidenceUrl: "/placeholder.svg",
    description: "Falta luminaria en escalera de emergencia.",
    location: "Nivel 5 > Escalera",
    assignedTo: "Luigi",
    assignedTrade: "Electricista",
    status: "Abierto",
    cost: 850,
    createdAt: "Hace 1 semana",
    createdBy: "Maria (Super)",
  },
]

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

// --- Components: Safe Input ---
function SafeCostInput({ value, onSave }: { value: number | null, onSave: (val: number) => void }) {
    const [open, setOpen] = React.useState(false)
    const [tempValue, setTempValue] = React.useState(value?.toString() || "")

    const handleSave = () => {
        onSave(parseFloat(tempValue))
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div 
                    className="group flex items-end justify-end gap-2 cursor-pointer py-1 px-2 rounded hover:bg-muted/50 transition-colors w-full h-full"
                >
                    <span className={`font-mono ${!value ? "text-muted-foreground" : ""}`}>
                        {value ? `$${value.toLocaleString()}` : "$ --"}
                    </span>
                    <Edit2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mb-1" />
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-3" align="end">
                <div className="space-y-3">
                    <div className="space-y-1">
                        <h4 className="font-medium leading-none text-xs text-muted-foreground">Editar Costo</h4>
                    </div>
                    <Input 
                        autoFocus
                        type="number" 
                        className="h-8 font-mono text-right"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave()
                        }}
                    />
                    <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="flex-1 h-7 text-xs" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button size="sm" className="flex-1 h-7 text-xs" onClick={handleSave}>
                            Guardar
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

// --- Columns ---
export const columns: ColumnDef<Incident>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
        <span className="text-muted-foreground text-xs font-mono">{row.getValue("id")}</span>
    ),
    size: 60,
  },
  {
    accessorKey: "evidenceUrl",
    header: "EVIDENCIA",
    cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
            <HoverCard>
                <HoverCardTrigger asChild>
                    <div className="h-8 w-8 rounded-md bg-muted overflow-hidden flex items-center justify-center cursor-pointer border hover:border-sidebar-primary/50 transition-colors">
                        <img src={row.getValue("evidenceUrl")} alt="Evidence thumbnail" className="h-full w-full object-cover opacity-80 hover:opacity-100" />
                    </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80" side="right">
                    <div className="space-y-2">
                        <img src={row.getValue("evidenceUrl")} alt="Evidence full" className="w-full rounded-md object-cover" />
                        <p className="text-xs text-muted-foreground">Subida el {row.original.createdAt}</p>
                    </div>
                </HoverCardContent>
            </HoverCard>
        </div>
    ),
    size: 80,
  },
  {
    accessorKey: "description",
    header: "DESCRIPCIÓN",
    cell: ({ row }) => (
        <div className="flex flex-col max-w-[300px]">
            <span className="font-semibold text-sm truncate">{row.getValue("description")}</span>
            <span className="text-xs text-muted-foreground truncate">Creado por {row.original.createdBy}</span>
        </div>
    ),
  },
  {
    accessorKey: "location",
    header: "UBICACIÓN",
    cell: ({ row }) => (
        <div className="flex items-center">
            <Badge variant="outline" className="font-normal text-xs text-muted-foreground bg-muted/50">
                {row.getValue("location")}
            </Badge>
        </div>
    ),
     size: 150,
  },
  {
    accessorKey: "assignedTrade",
    header: "ASIGNADO",
    cell: ({ row }) => {
        const trade = row.original.assignedTrade
        // Map trades to colors
        const colors: Record<string, string> = {
            "Electricista": "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
            "Plomero": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
            "Yesero": "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
            "Albañil": "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
        }
        return (
            <Badge variant="outline" className={`font-normal ${colors[trade] || ""}`}>
                {trade}
            </Badge>
        )
    },
    size: 140,
  },
    {
    accessorKey: "status",
    header: "ESTADO",
    cell: ({ row }) => {
        const status = row.original.status as string
         const colors: Record<string, string> = {
            "Abierto": "bg-red-100 text-red-800 border-red-200", // Standard open
            "Crítico": "bg-destructive text-destructive-foreground hover:bg-destructive/90", // Critical
            "En Proceso": "bg-amber-100 text-amber-800 border-amber-200",
             "Cerrado": "bg-green-100 text-green-800 border-green-200",
        }
        return (
             <Badge variant={status === "Crítico" ? "destructive" : "outline"} className={status !== "Crítico" ? colors[status] : ""}>
                {status}
            </Badge>
        )
    },
    size: 120,
  },
  {
    accessorKey: "cost",
    header: () => <div className="text-right">COSTO ($)</div>,
    cell: ({ row }) => {
        return (
            <div onClick={(e) => e.stopPropagation()}>
                <SafeCostInput 
                    value={row.getValue("cost")} 
                    onSave={(val) => {
                        console.log(`Updating cost for ${row.original.id} to ${val}`)
                        toast.success("Costo actualizado", {
                            description: `El nuevo monto es $${val.toLocaleString()}`
                        })
                    }} 
                />
            </div>
        )
    },
    size: 140,
  },
   {
    id: "actions",
    header: "ACCIONES",
    cell: ({ row }) => (
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8"
        onClick={(e) => {
            e.stopPropagation()
            toast.success("Enlace copiado al portapapeles")
        }}
      >
        <LinkIcon className="h-4 w-4 text-muted-foreground" />
      </Button>
    ),
    size: 100
  },
]


import { IncidentDrawer } from "@/components/projects/incident-drawer"
import { toast } from "sonner"

// ... existing imports


export function IncidentTable({ activeFilter = "all" }: { activeFilter?: string }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [selectedIncident, setSelectedIncident] = React.useState<Incident | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  // Filter data based on activeFilter
  const filteredData = React.useMemo(() => {
      if (activeFilter === "all") return data
      if (activeFilter === "urgent") return data.filter(d => d.status === "Crítico")
      if (activeFilter === "approval") return data.filter(d => d.status === "En Proceso") // Mock logic
      if (activeFilter === "cost") return data.filter(d => d.cost !== null)
      return data
  }, [activeFilter])

  const handleRowClick = (incident: Incident) => {
    setSelectedIncident(incident)
    setIsDrawerOpen(true)
  }



  // OLD cols logic removed since we moved it to main columns definition



  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <>
        <div className="rounded-md border bg-background shadow-sm overflow-hidden">
        <Table>
            <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-muted/50">
                {headerGroup.headers.map((header) => {
                    return (
                    <TableHead key={header.id} style={{ width: header.getSize() }}>
                        {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                            )}
                    </TableHead>
                    )
                })}
                </TableRow>
            ))}
            </TableHeader>
            <TableBody>
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="h-10 hover:bg-muted/30 cursor-pointer"
                    onClick={() => handleRowClick(row.original)}
                >
                    {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-1">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    ))}
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>

        <IncidentDrawer 
            isOpen={isDrawerOpen} 
            onClose={() => setIsDrawerOpen(false)} 
            incident={selectedIncident} 
        />
    </>
  )
}
