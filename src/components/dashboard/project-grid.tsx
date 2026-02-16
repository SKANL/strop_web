"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const projects = [
  {
    name: "Torre Meriden",
    phase: "Acabados",
    budget: { current: 45000, total: 100000 },
    incidents: { critical: 5, open: 12 },
    lastActivity: "Hace 10 min",
    superintendent: "Ing. Juan Pérez",
    status: "Activo",
  },
  {
    name: "Plaza Norte",
    phase: "Obra Negra",
    budget: { current: 12000, total: 500000 },
    incidents: { critical: 0, open: 3 },
    lastActivity: "Ayer",
    superintendent: "Arq. Luisa M.",
    status: "Activo",
  },
  {
    name: "Casa Playa",
    phase: "Cimentación",
    budget: { current: 0, total: 50000 },
    incidents: { critical: 0, open: 0 },
    lastActivity: "Hace 3 días",
    superintendent: "Ing. Juan Pérez",
    status: "Pausado",
  },
]

export function ProjectGrid() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Proyectos Activos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proyecto</TableHead>
              <TableHead>Salud ($)</TableHead>
              <TableHead>Incidencias</TableHead>
              <TableHead>Última Actividad</TableHead>
              <TableHead>Superintendente</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => {
              const healthPercentage = (project.budget.current / project.budget.total) * 100
              const isCritical = healthPercentage > 80

              return (
                <TableRow key={project.name} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div>{project.name}</div>
                    <div className="text-xs text-muted-foreground">Fase: {project.phase}</div>
                  </TableCell>
                  <TableCell className="w-[200px]">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs">
                        <span className={isCritical ? "text-destructive font-bold" : ""}>
                          ${project.budget.current.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">
                          / ${project.budget.total.toLocaleString()}
                        </span>
                      </div>
                      <Progress 
                        value={healthPercentage} 
                        className={`h-2 ${isCritical ? "[&>div]:bg-destructive" : ""}`} 
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs">
                      {project.incidents.critical > 0 && (
                        <span className="text-destructive font-bold">
                          🔴 {project.incidents.critical} Críticas
                        </span>
                      )}
                      <span className="text-muted-foreground">
                        ⚪ {project.incidents.open} Abiertas
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{project.lastActivity}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <Avatar className="h-6 w-6">
                          <AvatarFallback>{project.superintendent.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{project.superintendent}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={project.status === "Activo" ? "default" : "secondary"}>
                      {project.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
