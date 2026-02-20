import { use } from "react"
import { notFound } from "next/navigation"
import { fetchIncidentByTokenAction } from "@/actions/incidents"
import { PublicLinkClient } from "@/components/public-link/public-link-client"

// ISR Configuration
export const revalidate = 60 // Revalidate every 60 seconds
export const dynamicParams = true // Allow dynamic tokens

export default async function PublicLinkPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  
  if (!token) notFound()

  // Fetch real data
  const { data: incidentData } = await fetchIncidentByTokenAction(token)

  if (!incidentData) {
      if (token === 'demo-123') {
           // Allow a specific demo token still
           return <PublicLinkClient initialIncident={{
                id: "1024",
                project_name: "Torre Meriden (Demo)",
                requester_name: "Ing. Juan Pérez",
                problem_photo_url: "/placeholder.svg",
                problem_description: "Resanar grieta antes de pintar",
                location: "Depto 301 - Nivel 3",
                status: 'OPEN',
                folio_number: 1024
           }} token={token} />
      }
      notFound()
  }

  const incident = {
      id: incidentData.id,
      project_name: incidentData.project?.name || 'Proyecto Desconocido',
      requester_name: incidentData.created_by_user?.full_name || 'Desconocido',
      problem_photo_url: incidentData.photos?.[0]?.photo_url || '/placeholder.svg',
      problem_description: incidentData.description || 'Sin descripción',
      location: incidentData.location_tag || 'Sin ubicación',
      status: incidentData.status,
      folio_number: incidentData.folio_number
  }

  return <PublicLinkClient initialIncident={incident} token={token} />
}
