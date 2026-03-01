import { ProjectGrid } from "@/components/dashboard/project-grid"
import { PanicRoom } from "@/components/dashboard/panic-room"
import { ProjectMapView } from "@/components/dashboard/project-map-view"
import { DashboardClient } from "@/components/dashboard/dashboard-client"
import { getDashboardKPIs, getPanicRoomAlerts, getMapProjects } from "@/app/actions/dashboard"
import { EmptyState } from "@/components/ui/empty-state"
import { FolderOpen } from "lucide-react"
import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const [{ data: kpiData }, alerts, mapProjects] = await Promise.all([
    getDashboardKPIs(),
    getPanicRoomAlerts(),
    getMapProjects(),
  ])

  // Fetch onboarding flags
  const { data: { user } } = await supabase.auth.getUser()
  let teamMemberCount = 0
  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select("organization_id")
      .eq("id", user.id)
      .single()
    if (userData?.organization_id) {
      const { count } = await supabase
        .from("users")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", userData.organization_id)
      teamMemberCount = count ?? 0
    }
  }

  // First-time user: no projects yet → show welcome state
  if (kpiData?.totalProjectsCount === 0) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <EmptyState
          icon={FolderOpen}
          title="Bienvenido a Strop"
          description="Todavía no tienes proyectos. Crea tu primer proyecto para empezar a gestionar incidencias y equipos."
          action={{
            label: "Crear primer proyecto",
            href: "/dashboard/projects/new",
          }}
        />
      </div>
    )
  }
  
  return (
    <div className="flex flex-col gap-4">
      <OnboardingChecklist
        hasProject={(kpiData?.totalProjectsCount ?? 0) > 0}
        hasTeamMember={teamMemberCount > 1}
        hasIncident={(kpiData?.incidentCount ?? 0) > 0}
        hasConfiguredRoles={false}
      />
      <DashboardClient 
        projectGrid={<ProjectGrid />}
        projectMap={<ProjectMapView projects={mapProjects} />}
        panicRoom={<PanicRoom alerts={alerts} />}
        kpiData={kpiData}
      />
    </div>
  )
}
