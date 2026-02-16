"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/types/supabase'
import { checkPermission } from '@/lib/auth/permissions'

type Incident = Database['public']['Tables']['incidents']['Row']
type IncidentInsert = Database['public']['Tables']['incidents']['Insert']
type IncidentUpdate = Database['public']['Tables']['incidents']['Update']

/**
 * Get all incidents for a project
 */
export async function getIncidents(projectId?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('incidents')
    .select(`
      *,
      project:projects(
        id,
        name
      ),
      created_by_user:users!incidents_created_by_fkey(
        id,
        full_name,
        email,
        avatar_url
      ),
      assigned_to_user:users!incidents_assigned_to_fkey(
        id,
        full_name,
        email
      ),
      photos:incident_photos(
        id,
        photo_url,
        photo_type
      )
    `)
    .order('created_at', { ascending: false })

  if (projectId) {
    query = query.eq('project_id', projectId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching incidents:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Get a single incident by ID
 */
export async function getIncidentById(incidentId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('incidents')
    .select(`
      *,
      project:projects(
        id,
        name
      ),
      created_by_user:users!incidents_created_by_fkey(
        id,
        full_name,
        email,
        avatar_url
      ),
      assigned_to_user:users!incidents_assigned_to_fkey(
        id,
        full_name,
        email
      ),
      photos:incident_photos(
        id,
        photo_url,
        photo_type,
        uploaded_at
      ),
      audit_logs:audit_logs(
        id,
        action,
        old_value,
        new_value,
        comment,
        timestamp,
        modified_by_user:users(full_name)
      )
    `)
    .eq('id', incidentId)
    .single()

  if (error) {
    console.error('Error fetching incident:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Create a new incident
 */
export async function createIncident(formData: IncidentInsert) {
  if (!await checkPermission('incidents.create')) {
    return { data: null, error: 'No tienes permisos para crear incidencias' }
  }

  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { data: null, error: 'Not authenticated' }
  }

  // Get next folio number for this project
  const { data: maxFolio } = await supabase
    .from('incidents')
    .select('folio_number')
    .eq('project_id', formData.project_id)
    .order('folio_number', { ascending: false })
    .limit(1)
    .single()

  const nextFolio = (maxFolio?.folio_number || 0) + 1

  const { data, error } = await supabase
    .from('incidents')
    .insert({
      ...formData,
      folio_number: nextFolio,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating incident:', error)
    return { data: null, error: error.message }
  }

  revalidatePath('/dashboard/incidents')
  revalidatePath(`/dashboard/projects/${formData.project_id}`)
  
  return { data, error: null }
}

/**
 * Update incident cost (with audit trail)
 */
export async function updateIncidentCost(incidentId: string, cost: number) {
  if (!await checkPermission('incidents.approve_cost')) {
    return { data: null, error: 'No tienes permisos para aprobar costos' }
  }

  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { data: null, error: 'Not authenticated' }
  }

  // Get current incident for audit
  const { data: currentIncident } = await supabase
    .from('incidents')
    .select('actual_cost, project_id')
    .eq('id', incidentId)
    .single()

  // Update cost
  const { error: updateError } = await supabase
    .from('incidents')
    .update({
      actual_cost: cost,
      updated_at: new Date().toISOString(),
    })
    .eq('id', incidentId)

  if (updateError) {
    console.error('Error updating cost:', updateError)
    return { data: null, error: updateError.message }
  }

  // Create audit log
  await supabase
    .from('audit_logs')
    .insert({
      incident_id: incidentId,
      action: 'cost_update',
      old_value: { actual_cost: currentIncident?.actual_cost },
      new_value: { actual_cost: cost },
      modified_by: user.id,
    })

  revalidatePath('/dashboard/incidents')
  if (currentIncident?.project_id) {
    revalidatePath(`/dashboard/projects/${currentIncident.project_id}`)
  }
  
  return { data: { success: true }, error: null }
}

/**
 * Update incident status
 */
export async function updateIncidentStatus(
  incidentId: string,
  status: 'OPEN' | 'IN_REVIEW' | 'CLOSED' | 'REJECTED',
  comment?: string
) {
  if (status === 'CLOSED') {
    if (!await checkPermission('incidents.close')) {
      return { data: null, error: 'No tienes permisos para cerrar incidencias' }
    }
  } else {
    if (!await checkPermission('incidents.edit')) {
      return { data: null, error: 'No tienes permisos para editar incidencias' }
    }
  }

  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { data: null, error: 'Not authenticated' }
  }

  // Get current incident
  const { data: currentIncident } = await supabase
    .from('incidents')
    .select('status, project_id')
    .eq('id', incidentId)
    .single()

  const updates: IncidentUpdate = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === 'CLOSED') {
    updates.closed_by = user.id
    updates.closed_at = new Date().toISOString()
  }

  if (status === 'REJECTED' && comment) {
    updates.rejection_reason = comment
  }

  // Update status
  const { error: updateError } = await supabase
    .from('incidents')
    .update(updates)
    .eq('id', incidentId)

  if (updateError) {
    console.error('Error updating status:', updateError)
    return { data: null, error: updateError.message }
  }

  // Create audit log
  await supabase
    .from('audit_logs')
    .insert({
      incident_id: incidentId,
      action: 'status_change',
      old_value: { status: currentIncident?.status },
      new_value: { status },
      modified_by: user.id,
      comment,
    })

  revalidatePath('/dashboard/incidents')
  if (currentIncident?.project_id) {
    revalidatePath(`/dashboard/projects/${currentIncident.project_id}`)
  }
  
  return { data: { success: true }, error: null }
}

/**
 * Assign incident to user
 */
export async function assignIncident(incidentId: string, userId: string) {
  if (!await checkPermission('incidents.edit')) {
    return { data: null, error: 'No tienes permisos para asignar incidencias' }
  }

  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { data: null, error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('incidents')
    .update({
      assigned_to: userId,
      assigned_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', incidentId)

  if (error) {
    console.error('Error assigning incident:', error)
    return { data: null, error: error.message }
  }

  // Create audit log
  await supabase
    .from('audit_logs')
    .insert({
      incident_id: incidentId,
      action: 'assignment',
      new_value: { assigned_to: userId },
      modified_by: user.id,
    })

  revalidatePath('/dashboard/incidents')
  
  return { data: { success: true }, error: null }
}

/**
 * Generate public link for incident (WhatsApp)
 */
export async function generatePublicLink(incidentId: string) {
  if (!await checkPermission('incidents.edit')) {
    return { data: null, error: 'No tienes permisos para compartir incidencias' }
  }

  const supabase = await createClient()
  
  // Generate unique token
  const token = crypto.randomUUID().replace(/-/g, '').substring(0, 16)
  
  const { error } = await supabase
    .from('incidents')
    .update({
      public_token: token,
      updated_at: new Date().toISOString(),
    })
    .eq('id', incidentId)

  if (error) {
    console.error('Error generating public link:', error)
    return { data: null, error: error.message }
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/r/${token}`
  
  return { data: { token, url: publicUrl }, error: null }
}

/**
 * Get incident by public token
 */
export async function getIncidentByToken(token: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('incidents')
    .select(`
      id,
      description,
      location_tag,
      status,
      folio_number,
      project:projects(name),
      created_by_user:users!incidents_created_by_fkey(full_name),
      photos:incident_photos(photo_url)
    `)
    .eq('public_token', token)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}
