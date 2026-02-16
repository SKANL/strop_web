import { getIncidents } from '@/app/actions/incidents'
import { IncidentTableClient } from './incident-table-client'

interface IncidentTableProps {
  projectId?: string
  activeFilter?: string
}

export async function IncidentTable({ projectId, activeFilter }: IncidentTableProps) {
  const { data: incidents, error } = await getIncidents(projectId)

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-muted-foreground">Error loading incidents: {error}</p>
      </div>
    )
  }

  // Filter on server side or pass to client? 
  // For now, let's pass all to client and let it filter, or pre-filter here if simple.
  // The 'activeFilter' from UI seems to be 'all', 'open', 'critical'.
  
  let filteredIncidents = incidents || []
  if (activeFilter && activeFilter !== 'all') {
    if (activeFilter === 'critical') {
      filteredIncidents = filteredIncidents.filter(i => i.status === 'CRITICAL')
    } else if (activeFilter === 'open') {
      filteredIncidents = filteredIncidents.filter(i => i.status === 'OPEN' || i.status === 'IN_REVIEW')
    }
  }

  return <IncidentTableClient incidents={filteredIncidents} />
}
