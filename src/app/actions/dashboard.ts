"use server"

import { createClient } from '@/lib/supabase/server'
import { parseGpsCoords } from '@/lib/geoapify'

export interface DashboardKPIs {
  risk: number
  riskChangePercent: number // Mocked for now or calc vs last week
  incidentCount: number
  recovered: number
  velocity: number
  criticalProjectsCount: number
  totalProjectsCount: number
}

export interface PanicRoomAlert {
  id: string
  project: string
  message: string
  time: string
  type: 'security' | 'financial'
  critical: true
}

export async function getDashboardKPIs(): Promise<{ data: DashboardKPIs | null, error: string | null }> {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { data: null, error: 'Not authenticated' }
  }

  // Get organization
  const { data: userData } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!userData?.organization_id) return { data: null, error: 'No organization found' }

  const orgId = userData.organization_id

  // 1. Calculate Risk (Sum of estimated_cost of OPEN/IN_REVIEW incidents)
  const { data: riskData, error: riskError } = await supabase
    .from('incidents')
    .select('estimated_cost')
    .in('status', ['OPEN', 'IN_REVIEW'])
  
  if (riskError) console.error('Error fetching risk data:', riskError)
  
  const risk = riskData?.reduce((sum, inc) => sum + (inc.estimated_cost || 0), 0) || 0
  const incidentCount = riskData?.length || 0

  // 2. Calculate Recovered (Sum of actual_cost of CLOSED incidents charged to contractor)
  const { data: recoveredData } = await supabase
    .from('incidents')
    .select('actual_cost')
    .eq('status', 'CLOSED')
    
  const recovered = recoveredData?.reduce((sum, inc) => sum + (inc.actual_cost || 0), 0) || 0

  // 3. Calculate Velocity (Average resolution time of incidents closed in last 30 days)
  // This is complex in SQL/JS match, simplifying for now: just fetch closed incidents
  const { data: closedIncidents } = await supabase
    .from('incidents')
    .select('created_at, closed_at')
    .eq('status', 'CLOSED')
    .not('closed_at', 'is', null)
    .limit(100)

  let avgDays = 0
  if (closedIncidents && closedIncidents.length > 0) {
    const totalDurationMs = closedIncidents.reduce((sum, inc) => {
        const start = new Date(inc.created_at).getTime()
        const end = new Date(inc.closed_at!).getTime()
        return sum + (end - start)
    }, 0)
    avgDays = (totalDurationMs / closedIncidents.length) / (1000 * 60 * 60 * 24)
  }

  // 4. Critical Projects
  // Fetch active projects and check status/budget
  const { data: projects } = await supabase
    .from('projects')
    .select('id, contingency_budget')
    .eq('organization_id', orgId)
    .eq('is_active', true)

  let criticalCount = 0
  if (projects && projects.length > 0) {
      const projectIds = projects.map(p => p.id)
      
      // Fetch all critical incidents for these projects in one query
      const { data: criticalIncidents, error: incidentsError } = await supabase
          .from('incidents')
          .select('project_id')
          .in('project_id', projectIds)
          .eq('priority', 'CRITICAL')
          .neq('status', 'CLOSED')
      
      if (!incidentsError && criticalIncidents) {
          // Count unique projects that have at least one critical incident
          const criticalProjectIds = new Set(criticalIncidents.map(i => i.project_id))
          criticalCount = criticalProjectIds.size
      }
  }

  return {
    data: {
        risk,
        riskChangePercent: 0, // Placeholder until historical data is available
        incidentCount,
        recovered,
        velocity: parseFloat(avgDays.toFixed(1)),
        criticalProjectsCount: criticalCount,
        totalProjectsCount: projects?.length || 0
    },
    error: null
  }
}

export async function getPanicRoomAlerts(): Promise<PanicRoomAlert[]> {
    const supabase = await createClient()
    
    // Fetch critical open incidents
    const { data: incidents } = await supabase
        .from('incidents')
        .select(`
            id,
            description,
            created_at,
            priority,
            project:projects(name)
        `)
        .eq('priority', 'CRITICAL')
        .neq('status', 'CLOSED')
        .order('created_at', { ascending: false })
        .limit(5)

    if (!incidents) return []

    return incidents.map(inc => ({
        id: inc.id,
        project: inc.project?.name || 'Unknown Project',
        message: inc.description,
        time: getTimeAgo(inc.created_at),
        type: 'security', // Logic to determine type
        critical: true
    }))
}

function getTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 60) return `Hace ${diffMins} min`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `Hace ${diffHours} horas`
    return `Hace ${Math.floor(diffHours / 24)} días`
}

export interface MapProject {
  id: string
  name: string
  phase: string // Mocked or derived from status
  budget: { current: number, total: number }
  incidents: { critical: number, open: number }
  status: string
  coordinates: [number, number]
}

export async function getMapProjects(): Promise<MapProject[]> {
    const supabase = await createClient()
    
    // Get current user organization
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
    
    const { data: userData } = await supabase
        .from('users')
        .select('organization_id')
        .eq('id', user.id)
        .single()
        
    if (!userData?.organization_id) return []

    // Fetch projects with incidents aggregation
    // note: doing aggregation on client-side of fetch for simplicity 
    // real app should use a view or sophisticated query
    const { data: projects } = await supabase
        .from('projects')
        .select(`
            id,
            name,
            is_active,
            contingency_budget,
            location_gps,
            incidents:incidents(id, priority, status, actual_cost)
        `)
        .eq('organization_id', userData.organization_id)
        .eq('is_active', true)
        .not('location_gps', 'is', null)

    if (!projects) return []

    return projects.map(p => {
        const incidents = p.incidents || []
        const critical = incidents.filter((i: any) => i.priority === 'CRITICAL' && i.status !== 'CLOSED').length
        const open = incidents.filter((i: any) => i.status !== 'CLOSED').length
        // Only CLOSED incidents count as spent budget
        const spent = incidents
            .filter((i: any) => i.status === 'CLOSED')
            .reduce((sum: number, i: any) => sum + (i.actual_cost ?? 0), 0)
        
        // Parse coordinates
        let coords: [number, number] = [-99.1332, 19.4326] // Default to CDMX
        const parsed = parseGpsCoords(p.location_gps)
        if (parsed) coords = parsed

        return {
            id: p.id,
            name: p.name,
            phase: 'En ejecución', // Placeholder logic
            budget: { current: spent, total: p.contingency_budget ?? 0 },
            incidents: { critical, open },
            status: p.is_active ? 'Activo' : 'Inactivo',
            coordinates: coords
        }
    })
}
