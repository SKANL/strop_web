import { Suspense } from "react"
import { GlobalFinancialHeader } from "@/components/incidents/global-financial-header"
import { GlobalIncidentsTable } from "@/components/incidents/global-incidents-table"
import { IncidentDetailDrawer } from "@/components/incidents/incident-detail-drawer"
import { fetchIncidentsAction } from "@/actions/incidents"
import { getProjects } from "@/services/projects-service"
import { GlobalIncidentsClient } from "@/components/incidents/global-incidents-client"

export default async function GlobalIncidentsPage() {
  const [{ data: incidents }, projects] = await Promise.all([
    fetchIncidentsAction(undefined, 1), // Fetch all incidents, page 1
    getProjects()
  ])
  
  return (
    <div className="flex flex-col h-full">
      <GlobalFinancialHeader incidents={incidents || []} />
      <GlobalIncidentsClient incidents={incidents || []} projects={projects || []} />
    </div>
  )
}
