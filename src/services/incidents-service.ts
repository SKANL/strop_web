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
  projectId: string,
  page = 1,
  pageSize = 10
) {
  const supabase = await getSupabaseClient()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('incidents')
    .select('*', { count: 'exact' })
    .eq('project_id', projectId)
    .range(from, to)
    .order('created_at', { ascending: false })

  if (error) handleDbError(error)

  return { data, count }
}

export async function getIncidentById(id: string) {
  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
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
