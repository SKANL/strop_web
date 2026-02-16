import { getProjectById } from "@/app/actions/projects"
import { notFound } from "next/navigation"
import { ProjectClient } from "@/components/projects/project-client"

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const { data: project, error } = await getProjectById(params.id)

  if (error || !project) {
    notFound()
  }

  // Map project members
  const projectMembers = project.project_members?.map((pm: any) => ({
      name: pm.user?.full_name || "Usuario Desconocido",
      role: pm.user?.role?.display_name || "Sin Rol",
      avatar: pm.user?.avatar_url,
      type: "staff" as const, // Todo: Distinguish crew vs staff if needed
      trade: null
  })) || []

  return <ProjectClient project={project} projectMembers={projectMembers} />
}
