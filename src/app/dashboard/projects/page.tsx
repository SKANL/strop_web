
import { ProjectsTable } from "@/components/dashboard/projects-table"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { getProjects } from "@/app/actions/projects"

export default async function ProjectsPage() {
  const { data: projectsData } = await getProjects()

  // Map DB projects to Table format
  const projects = projectsData?.map((p: any) => {
      const activeIncidents = p.incidents || []
      const criticalCount = activeIncidents.filter((i: any) => i.priority === 'CRITICAL' && i.status !== 'CLOSED').length
      const openCount = activeIncidents.filter((i: any) => i.status === 'OPEN').length
      
      // Calculate budget spent from closed incidents
      const totalBudget = p.contingency_budget || 0
      const spent = activeIncidents
        .filter((i: any) => i.status === 'CLOSED')
        .reduce((sum: number, i: any) => sum + (i.actual_cost || i.estimated_cost || 0), 0)

      // Find superintendent
      const superInt = p.project_members?.find((m: any) => m.user?.role?.display_name === 'Superintendente' || m.user?.role?.name === 'Superintendente')
      const superName = superInt?.user?.full_name || 'Sin Asignar'

      return {
          id: p.id,
          name: p.name,
          code: p.id.substring(0, 4).toUpperCase(),
          phase: p.is_active ? "En Progreso" : "Finalizado",
          budget: { current: spent, total: totalBudget },
          incidents: { critical: criticalCount, open: openCount },
          lastActivity: new Date(p.created_at).toLocaleDateString('es-MX'),
          superintendent: superName,
          location: p.location || "Sin ubicación",
          status: (p.is_active ? "Activo" : "Finalizado") as "Activo" | "Pausado" | "Finalizado"
      }
  }) || []

  return (
    <div className="flex flex-col h-full space-y-4">
        <PageHeader
          title="Directorio de Proyectos"
          subtitle="Gestiona, monitorea y crea nuevos proyectos inmobiliarios."
          actions={
            <Button asChild>
              <Link href="/dashboard/projects/new">
                <PlusCircle className="h-4 w-4 mr-2" />
                Nuevo Proyecto
              </Link>
            </Button>
          }
        />
        <div className="flex-1 min-h-0">
             <ProjectsTable projects={projects} />
        </div>
    </div>
  )
}
