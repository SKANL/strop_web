"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/types/supabase'
import { checkPermission } from '@/lib/auth/permissions'

type Project = Database['public']['Tables']['projects']['Row']
type ProjectInsert = Database['public']['Tables']['projects']['Insert']

/**
 * Get all projects for the current user's organization
 */
export async function getProjects() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { data: null, error: 'Not authenticated' }
  }

  // Get user's organization
  const { data: userData, error: userDataError } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (userDataError || !userData) {
    return { data: null, error: 'User not found' }
  }

  // Get projects with aggregated data
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      incidents:incidents(
        id,
        status,
        priority,
        estimated_cost,
        actual_cost
      ),
      project_members:project_members(
        user:users(
          full_name,
          avatar_url,
          role:roles(display_name)
        )
      )
    `)
    .eq('organization_id', userData.organization_id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Get a single project by ID with full details
 */
export async function getProjectById(projectId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      incidents:incidents(
        id,
        folio_number,
        description,
        status,
        priority,
        estimated_cost,
        actual_cost,
        created_at,
        location_tag,
        created_by,
        assigned_to
      ),
      project_members:project_members(
        user:users(
          id,
          full_name,
          email,
          avatar_url,
          role:roles(display_name)
        )
      )
    `)
    .eq('id', projectId)
    .single()

  if (error) {
    console.error('Error fetching project:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Create a new project
 */
export async function createProject(formData: ProjectInsert & { superintendentId?: string; coverPhotoBase64?: string; coverPhotoMime?: string }) {
  if (!await checkPermission('project.create')) {
    return { data: null, error: 'No tienes permisos para crear proyectos' }
  }

  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { data: null, error: 'Not authenticated' }
  }

  // Get user's organization
  const { data: userData, error: userDataError } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (userDataError || !userData) {
    return { data: null, error: 'User not found' }
  }

  // Separate non-DB fields from project data
  const { superintendentId, coverPhotoBase64, coverPhotoMime, ...projectData } = formData

  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      ...projectData,
      organization_id: userData.organization_id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating project:', error)
    return { data: null, error: error.message }
  }

  // Upload cover photo if provided
  if (coverPhotoBase64 && coverPhotoMime) {
    try {
      const base64Data = coverPhotoBase64.replace(/^data:[^;]+;base64,/, '')
      const buffer = Buffer.from(base64Data, 'base64')
      const ext = coverPhotoMime.split('/')[1] || 'jpg'
      const path = `${project.id}/cover.${ext}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-covers')
        .upload(path, buffer, { contentType: coverPhotoMime, upsert: true })
      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabase.storage.from('project-covers').getPublicUrl(path)
        await supabase.from('projects').update({ cover_photo_url: publicUrl }).eq('id', project.id)
        project.cover_photo_url = publicUrl
      } else {
        console.error('Error uploading cover photo:', uploadError)
      }
    } catch (e) {
      console.error('Cover photo upload failed:', e)
    }
  }

  // Assign superintendent if provided
  if (superintendentId) {
    const { error: memberError } = await supabase
      .from('project_members')
      .insert({
        project_id: project.id,
        user_id: superintendentId
      })

    if (memberError) {
       console.error('Error assigning superintendent:', memberError)
       // We don't fail the whole request, but log it
    }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/projects')
  
  return { data: project, error: null }
}

/**
 * Update an existing project
 */
export async function updateProject(projectId: string, updates: Partial<ProjectInsert>) {
  if (!await checkPermission('project.create')) {
    return { data: null, error: 'No tienes permisos para editar proyectos' }
  }

  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('projects')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', projectId)
    .select()
    .single()

  if (error) {
    console.error('Error updating project:', error)
    return { data: null, error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/projects')
  revalidatePath(`/dashboard/projects/${projectId}`)
  
  return { data, error: null }
}

/**
 * Get project financial summary
 */
export async function getProjectFinancials(projectId: string) {
  const supabase = await createClient()
  
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('contingency_budget')
    .eq('id', projectId)
    .single()

  if (projectError) {
    return { data: null, error: projectError.message }
  }

  // Get incident costs
  const { data: incidents, error: incidentsError } = await supabase
    .from('incidents')
    .select('estimated_cost, actual_cost, status, priority')
    .eq('project_id', projectId)

  if (incidentsError) {
    return { data: null, error: incidentsError.message }
  }

  const totalEstimated = incidents?.reduce((sum, inc) => sum + (inc.estimated_cost || 0), 0) || 0
  // Only count CLOSED incidents as "spent" — open incidents have not confirmed actual cost
  const totalActual = incidents
    ?.filter(inc => inc.status === 'CLOSED')
    .reduce((sum, inc) => sum + (inc.actual_cost ?? 0), 0) || 0
  const openIncidents = incidents?.filter(inc => inc.status === 'OPEN').length || 0
  const criticalIncidents = incidents?.filter(inc => inc.priority === 'CRITICAL' && inc.status !== 'CLOSED').length || 0

  const budget = project.contingency_budget || 0

  return {
    data: {
      budget,
      spent: totalActual,
      atRisk: totalEstimated - totalActual,
      percentUsed: budget > 0 ? (totalActual / budget) * 100 : 0,
      openIncidents,
      criticalIncidents,
    },
    error: null,
  }
}
