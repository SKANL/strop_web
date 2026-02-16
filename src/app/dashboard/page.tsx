import { ProjectGrid } from "@/components/dashboard/project-grid"
import { PanicRoom } from "@/components/dashboard/panic-room"
import { ProjectMapView } from "@/components/dashboard/project-map-view"
import { DashboardClient } from "@/components/dashboard/dashboard-client"
import { getDashboardKPIs, getPanicRoomAlerts, getMapProjects } from "@/app/actions/dashboard"

export default async function DashboardPage() {
  const { data: kpiData } = await getDashboardKPIs()
  const alerts = await getPanicRoomAlerts()
  const mapProjects = await getMapProjects()
  
  return (
    <DashboardClient 
      projectGrid={<ProjectGrid />}
      projectMap={<ProjectMapView projects={mapProjects} />}
      panicRoom={<PanicRoom alerts={alerts} />}
      kpiData={kpiData}
    />
  )
}
