
import { ProjectsTable } from "@/components/dashboard/projects-table"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Link from "next/link"

import { getProjects } from "@/app/actions/projects"
import { getTeamMembers } from "@/app/actions/team"

export default async function ProjectsPage() {
  const { data: projectsData } = await getProjects()
  const { data: teamMembers } = await getTeamMembers()

  // Map DB projects to Table format
  const projects = projectsData?.map((p: any) => {
      const activeIncidents = p.incidents || []
      const criticalCount = activeIncidents.filter((i: any) => i.priority === 'CRITICAL' && i.status !== 'CLOSED').length
      const openCount = activeIncidents.filter((i: any) => i.status === 'OPEN').length
      
      // Calculate budget health (mock calculation based on incidents for now as we don't have real expense tracking linked to budget yet)
      // Real implementation would sum actual_cost of incidents
      const totalBudget = p.contingency_budget || 0
      const spent = 0 // TODO: Calculate from closed incidents cost

      // Find superintendent
      const superInt = p.project_members?.find((m: any) => m.user?.role?.display_name === 'Superintendente' || m.user?.role?.name === 'Superintendente')
      const superName = superInt?.user?.full_name || 'Sin Asignar'

      return {
          id: p.id,
          name: p.name,
          code: p.id.substring(0, 4).toUpperCase(), // Todo: Add code to DB
          phase: "En Progreso", // Todo: Add status/phase to DB
          budget: { current: spent, total: totalBudget },
          incidents: { critical: criticalCount, open: openCount },
          lastActivity: new Date(p.created_at).toLocaleDateString(),
          superintendent: superName,
          location: "Mérida, Yuc.", // Todo: Add location to DB
          status: (p.is_active ? "Activo" : "Finalizado") as "Activo" | "Pausado" | "Finalizado"
      }
  }) || []

  return (
    <div className="flex flex-col h-full space-y-4">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="shrink-0">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Proyectos</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-1 shrink-0">
             <h1 className="text-2xl font-bold tracking-tight">Directorio de Proyectos</h1>
             <p className="text-sm text-muted-foreground">
                Gestiona, monitorea y crea nuevos proyectos inmobiliarios.
             </p>
        </div>
        <Separator className="shrink-0" />
        <div className="flex-1 min-h-0">
             <ProjectsTable projects={projects} staff={teamMembers || []} />
        </div>
    </div>
  )
}
