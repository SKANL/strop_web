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
  let isCrew = false
  let hasConfiguredRoles = false
  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select("organization_id, user_type")
      .eq("id", user.id)
      .single()
    isCrew = userData?.user_type === "crew"
    if (userData?.organization_id) {
      const [{ count: memberCount }, { count: roleCount }] = await Promise.all([
        supabase
          .from("users")
          .select("id", { count: "exact", head: true })
          .eq("organization_id", userData.organization_id),
        supabase
          .from("roles")
          .select("id", { count: "exact", head: true })
          .eq("organization_id", userData.organization_id)
          .eq("is_system_role", false),
      ])
      teamMemberCount = memberCount ?? 0
      hasConfiguredRoles = (roleCount ?? 0) > 0
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
      {isCrew && (
        <div className="mx-6 mt-2 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
          <span className="font-semibold">Vista Limitada</span>
          <span className="text-amber-700">— Solo ves los proyectos e incidencias de tus asignaciones.</span>
        </div>
      )}
      <OnboardingChecklist
        hasProject={(kpiData?.totalProjectsCount ?? 0) > 0}
        hasTeamMember={teamMemberCount > 1}
        hasIncident={(kpiData?.incidentCount ?? 0) > 0}
        hasConfiguredRoles={hasConfiguredRoles}
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
