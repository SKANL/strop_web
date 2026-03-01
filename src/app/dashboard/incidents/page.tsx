import { GlobalFinancialHeader } from "@/components/incidents/global-financial-header"
import { fetchIncidentsAction } from "@/actions/incidents"
import { getProjects } from "@/services/projects-service"
import { GlobalIncidentsClient } from "@/components/incidents/global-incidents-client"

const PAGE_SIZE = 25

export default async function GlobalIncidentsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>
}) {
  const params = await (searchParams ?? Promise.resolve({} as { page?: string }))
  const page = Math.max(1, parseInt(params.page ?? "1", 10))

  const [incidentsResult, projects] = await Promise.all([
    fetchIncidentsAction(undefined, page, PAGE_SIZE),
    getProjects()
  ])

  const incidents = incidentsResult.data ?? []
  const totalCount = incidentsResult.count ?? 0
  
  return (
    <div className="flex flex-col h-full">
      <GlobalFinancialHeader incidents={incidents} />
      <GlobalIncidentsClient
        incidents={incidents}
        projects={projects || []}
        totalCount={totalCount}
        page={page}
        pageSize={PAGE_SIZE}
      />
    </div>
  )
}
