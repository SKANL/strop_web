import { Suspense } from "react"
import { GlobalFinancialHeader } from "@/components/incidents/global-financial-header"
import { GlobalIncidentsTable } from "@/components/incidents/global-incidents-table"
import { IncidentDetailDrawer } from "@/components/incidents/incident-detail-drawer"
import { getIncidents } from "@/app/actions/incidents"
import { GlobalIncidentsClient } from "@/components/incidents/global-incidents-client"

export default async function GlobalIncidentsPage() {
  const { data: incidents } = await getIncidents()
  
  return (
    <div className="flex flex-col h-full">
      <GlobalFinancialHeader incidents={incidents || []} />
      <GlobalIncidentsClient incidents={incidents || []} />
    </div>
  )
}
