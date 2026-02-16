
import { ProjectsTable } from "@/components/dashboard/projects-table"
import { Separator } from "@/components/ui/separator"

export default function ProjectsPage() {
  return (
    <div className="flex flex-col h-full space-y-4">
        <div className="space-y-1 shrink-0">
             <h1 className="text-2xl font-bold tracking-tight">Directorio de Proyectos</h1>
             <p className="text-sm text-muted-foreground">
                Gestiona, monitorea y crea nuevos proyectos inmobiliarios.
             </p>
        </div>
        <Separator className="shrink-0" />
        <div className="flex-1 min-h-0">
             <ProjectsTable />
        </div>
    </div>
  )
}
