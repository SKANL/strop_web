import { getSupabaseClient, handleDbError } from './base'
import { Database } from '@/types/supabase'

export type Incident = Database['public']['Tables']['incidents']['Row']
export type InsertIncidentDTO = Database['public']['Tables']['incidents']['Insert']
export type UpdateIncidentDTO = Database['public']['Tables']['incidents']['Update']

export type CreateIncidentParams = {
  project_id: string
  description: string
  priority?: 'NORMAL' | 'URGENT' | 'CRITICAL'
  location_tag?: string | null
  gps_coords?: unknown
  audio_url?: string | null
  estimated_cost?: number
}

export async function getIncidents(
  projectId?: string,
  page = 1,
  pageSize = 100
) {
  const supabase = await getSupabaseClient()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('incidents')
    .select('*, project:projects(name), created_by_user:users!incidents_created_by_fkey(full_name), assigned_to_user:users!incidents_assigned_to_fkey(full_name, email), photos:incident_photos(photo_url, photo_type)', { count: 'exact' })
  
  if (projectId) {
    query = query.eq('project_id', projectId)
  }

  const { data, error, count } = await query
    .range(from, to)
    .order('created_at', { ascending: false })

  if (error) handleDbError(error)

  return { data, count }
}

export async function getIncidentById(id: string) {
  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('incidents')
    .select(`
      *,
      project:projects(name),
      created_by_user:users!incidents_created_by_fkey(full_name),
      assigned_to_user:users!incidents_assigned_to_fkey(full_name, email),
      photos:incident_photos(photo_url, photo_type),
      audit_logs(id, action, old_value, new_value, comment, timestamp)
    `)
    .eq('id', id)
    .single()

  if (error) handleDbError(error)

  return data
}

export async function createIncident(incident: CreateIncidentParams) {
  const supabase = await getSupabaseClient()
  
  // Maps DTO to RPC parameters
  const rpcParams = {
    p_project_id: incident.project_id,
    p_description: incident.description,
    p_priority: incident.priority || 'NORMAL',
    p_location_tag: incident.location_tag || undefined,
    p_gps_coords: incident.gps_coords,
    p_audio_url: incident.audio_url || undefined,
    p_estimated_cost: incident.estimated_cost
  }

  const { data, error } = await supabase
    .rpc('create_incident', rpcParams)

  if (error) handleDbError(error)

  return data
}

export async function updateIncident(id: string, updates: UpdateIncidentDTO) {
  // Use RPC for status updates if it's a status change, otherwise use standard update
  // The 'update_incident_status' RPC handles auditing, so it's preferred for status changes.
  // For now, let's keep it simple and use standard update unless status is involved.
  
  const supabase = await getSupabaseClient()
  
  if (updates.status) {
     const { data, error } = await supabase.rpc('update_incident_status', {
        p_incident_id: id,
        p_new_status: updates.status,
        p_comment: updates.rejection_reason || undefined, 
        p_actual_cost: updates.actual_cost || undefined
     })
     if (error) handleDbError(error)
     return data
  }

  const { data, error } = await supabase
    .from('incidents')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) handleDbError(error)

  return data
}

export async function assignIncident(incidentId: string, userId: string) {
  const supabase = await getSupabaseClient()
  
  const { data, error } = await supabase.rpc('assign_incident', {
    p_incident_id: incidentId,
    p_assigned_to: userId
  })

  if (error) handleDbError(error)
  return data
}

export async function updateIncidentCost(incidentId: string, cost: number, userId: string) {
  const supabase = await getSupabaseClient()
  
  const { data: current, error: fetchError } = await supabase
    .from('incidents')
    .select('actual_cost')
    .eq('id', incidentId)
    .single()
    
  if (fetchError) handleDbError(fetchError)

  const { error: updateError } = await supabase
    .from('incidents')
    .update({ actual_cost: cost, updated_at: new Date().toISOString() })
    .eq('id', incidentId)

  if (updateError) handleDbError(updateError)

  const { error: auditError } = await supabase
    .from('audit_logs')
    .insert({
       incident_id: incidentId,
       action: 'cost_update',
       old_value: { actual_cost: current?.actual_cost },
       new_value: { actual_cost: cost },
       modified_by: userId
    })

  if (auditError) console.error('Failed to create audit log for cost update', auditError)
  
  return { success: true }
}

export async function generatePublicLink(incidentId: string) {
  const supabase = await getSupabaseClient()
  const token = crypto.randomUUID().replace(/-/g, '').substring(0, 16)
  
  const { error } = await supabase
    .from('incidents')
    .update({ 
      public_token: token,
      updated_at: new Date().toISOString()
    })
    .eq('id', incidentId)

  if (error) handleDbError(error)

  return { token }
}

export async function getIncidentByToken(token: string) {
  const supabase = await getSupabaseClient()
  // Use a SECURITY DEFINER RPC so anon users can read project/user/photo
  // data that is otherwise protected by RLS.
  const { data, error } = await supabase
    .rpc('get_incident_by_public_token', { p_token: token })

  if (error) handleDbError(error)
  return data as {
    id: string
    folio_number: number
    status: string
    description: string
    public_token: string
    location_tag: string | null
    priority: string
    gps_coords: { lat: number; lng: number } | null
    project: { name: string } | null
    created_by_user: { full_name: string } | null
    photos: { photo_url: string; photo_type: string }[]
  } | null
}

export async function getProjectMembersForIncident(incidentId: string) {
  const supabase = await getSupabaseClient()

  // Get project_id from incident
  const { data: incident, error: incError } = await supabase
    .from('incidents')
    .select('project_id')
    .eq('id', incidentId)
    .single()

  if (incError || !incident?.project_id) return []

  // Get members of that project
  const { data, error } = await supabase
    .from('project_members')
    .select(`
      user:users(
        id,
        full_name,
        email,
        role:roles(display_name)
      )
    `)
    .eq('project_id', incident.project_id)

  if (error || !data) return []

  return data
    .map((pm: any) => pm.user)
    .filter(Boolean)
    .map((u: any) => ({
      id: u.id as string,
      full_name: u.full_name as string | null,
      email: u.email as string | null,
      role_name: u.role?.display_name as string | null,
    }))
}
