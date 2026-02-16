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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Plus, Filter, ArrowUpDown } from "lucide-react"
import { ProjectSetupDrawer } from "./project-setup-drawer"
import { useRouter } from "next/navigation"

// --- Types ---
type Project = {
  id: string
  name: string
  code: string
  phase: string
  budget: { current: number; total: number }
  incidents: { critical: number; open: number }
  lastActivity: string
  superintendent: string
  location: string
  status: "Activo" | "Pausado" | "Finalizado"
}

// --- Mock Data ---
const data: Project[] = [
  {
    id: "1",
    name: "Torre Meriden",
    code: "TM-02",
    phase: "Acabados",
    budget: { current: 45000, total: 100000 },
    incidents: { critical: 5, open: 12 },
    lastActivity: "Hace 10 min",
    superintendent: "Ing. Juan Pérez",
    location: "Calle 60 Norte, Mérida",
    status: "Activo",
  },
  {
    id: "2",
    name: "Plaza Norte",
    code: "PN-01",
    phase: "Obra Negra",
    budget: { current: 12000, total: 500000 },
    incidents: { critical: 0, open: 3 },
    lastActivity: "Ayer",
    superintendent: "Arq. Luisa M.",
    location: "Periférico Norte",
    status: "Activo",
  },
  {
    id: "3",
    name: "Casa Playa",
    code: "CP-10",
    phase: "Cimentación",
    budget: { current: 0, total: 50000 },
    incidents: { critical: 0, open: 0 },
    lastActivity: "Hace 3 días",
    superintendent: "Ing. Juan Pérez",
    location: "Progreso, Yuc.",
    status: "Pausado",
  },
]

export function ProjectsTable() {
    const router = useRouter()
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [isSetupOpen, setIsSetupOpen] = React.useState(false)

    const columns: ColumnDef<Project>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4 h-8 text-xs font-medium"
                    >
                        PROYECTO
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <div>
                    <div className="font-semibold">{row.getValue("name")}</div>
                    <div className="text-xs text-muted-foreground font-mono">{row.original.code} • {row.original.phase}</div>
                </div>
            ),
        },
        {
            accessorKey: "location",
            header: "UBICACIÓN",
            cell: ({ row }) => <div className="text-xs text-muted-foreground">{row.getValue("location")}</div>,
        },
        {
            accessorKey: "budget",
            header: "SALUD FINANCIERA",
            cell: ({ row }) => {
                const budget = row.original.budget
                const percent = (budget.current / budget.total) * 100
                const isCritical = percent > 80
                return (
                    <div className="w-[180px] space-y-1">
                         <div className="flex justify-between text-xs font-mono">
                            <span className={isCritical ? "text-destructive font-bold" : ""}>
                                ${budget.current.toLocaleString()}
                            </span>
                            <span className="text-muted-foreground">
                                / ${budget.total.toLocaleString()}
                            </span>
                        </div>
                        <Progress value={percent} className={`h-1.5 ${isCritical ? "[&>div]:bg-destructive" : ""}`} />
                    </div>
                )
            },
        },
         {
            accessorKey: "incidents",
            header: "INCIDENCIAS",
            cell: ({ row }) => {
                const incidents = row.original.incidents
                return (
                    <div className="flex gap-2 text-xs">
                         {incidents.critical > 0 && (
                            <Badge variant="destructive" className="h-5 px-1.5">
                                {incidents.critical} Críticas
                            </Badge>
                         )}
                         <Badge variant="secondary" className="h-5 px-1.5 bg-muted text-muted-foreground border-muted-foreground/20">
                            {incidents.open} Abiertas
                         </Badge>
                    </div>
                )
            },
        },
        {
            accessorKey: "superintendent",
            header: "RESPONSABLE",
            cell: ({ row }) => (
                 <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[10px]">{row.original.superintendent.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{row.original.superintendent}</span>
                </div>
            ),
        },
         {
            accessorKey: "status",
            header: "ESTADO",
            cell: ({ row }) => (
                <Badge variant={row.getValue("status") === "Activo" ? "default" : "secondary"}>
                    {row.getValue("status")}
                </Badge>
            ),
        },
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        state: {
          sorting,
          columnFilters,
          globalFilter,
        },
        globalFilterFn: (row, columnId, filterValue) => {
            const safeValue = (() => {
                const value = row.getValue(columnId);
                return typeof value === 'number' ? String(value) : value as string;
            })();
            return safeValue?.toLowerCase().includes(filterValue.toLowerCase());
        },
      })

    return (
        <div className="h-full flex flex-col space-y-4">
             {/* Toolbar */}
             <div className="flex items-center justify-between gap-4 shrink-0 px-1">
                <div className="flex items-center gap-2 w-full max-w-sm">
                    <div className="relative w-full">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar proyectos..." 
                            className="pl-8 h-9" 
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </div>
                    {/* Placeholder for more filters */}
                    <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
                <Button size="sm" className="h-9 gap-1" onClick={() => setIsSetupOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Nuevo Proyecto
                </Button>
             </div>

             {/* Table */}
             <div className="flex-1 rounded-md border bg-background shadow-sm overflow-hidden">
                 <div className="h-full overflow-auto">
                    <Table>
                        <TableHeader className="bg-muted/50 sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="hover:bg-muted/50 border-b-border/50">
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
                                    className="cursor-pointer hover:bg-muted/50 h-16"
                                    onClick={() => router.push(`/dashboard/projects/${row.original.id}`)}
                                >
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
                                    No se encontraron proyectos.
                                </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                 </div>
             </div>

             <ProjectSetupDrawer isOpen={isSetupOpen} onClose={() => setIsSetupOpen(false)} />
        </div>
    )
}
