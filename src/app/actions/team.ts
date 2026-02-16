"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/types/supabase'
import { checkPermission } from '@/lib/auth/permissions'

type User = Database['public']['Tables']['users']['Row']

/**
 * Get all team members for the current user's organization
 */
export async function getTeamMembers() {
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

  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      role:roles(
        id,
        display_name,
        capabilities
      ),
      projects:project_members(
        project:projects(
          id,
          name
        )
      )
    `)
    .eq('organization_id', userData.organization_id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching team members:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Invite a new staff member
 */
export async function inviteStaffMember(formData: {
  email: string
  fullName: string
  roleId: string
  projectIds?: string[]
}) {
  if (!await checkPermission('team.invite')) {
    return { data: null, error: 'No tienes permisos para invitar usuarios' }
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

  // Check if email already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', formData.email)
    .single()

  if (existingUser) {
    return { data: null, error: 'User with this email already exists' }
  }

  // Create auth user via Supabase Admin API
  // Note: This requires admin privileges, typically done via Edge Function
  // For now, we'll return instructions to invite via Supabase Dashboard
  
  return {
    data: {
      message: 'Please invite user via Supabase Dashboard Auth section',
      email: formData.email,
      roleId: formData.roleId,
      projectIds: formData.projectIds,
    },
    error: null,
  }
}

/**
 * Update team member role
 */
export async function updateTeamMemberRole(userId: string, roleId: string) {
  if (!await checkPermission('settings.edit')) {
    return { data: null, error: 'No tienes permisos para modificar roles' }
  }

  const supabase = await createClient()
  
  const { error } = await supabase
    .from('users')
    .update({
      role_id: roleId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) {
    console.error('Error updating team member role:', error)
    return { data: null, error: error.message }
  }

  revalidatePath('/dashboard/team')
  
  return { data: { success: true }, error: null }
}

/**
 * Assign team member to projects
 */
export async function assignToProjects(userId: string, projectIds: string[]) {
  if (!await checkPermission('projects.edit')) {
    return { data: null, error: 'No tienes permisos para asignar proyectos' }
  }

  const supabase = await createClient()
  
  // Remove existing assignments
  await supabase
    .from('project_members')
    .delete()
    .eq('user_id', userId)

  // Add new assignments
  const assignments = projectIds.map(projectId => ({
    user_id: userId,
    project_id: projectId,
  }))

  const { error } = await supabase
    .from('project_members')
    .insert(assignments)

  if (error) {
    console.error('Error assigning to projects:', error)
    return { data: null, error: error.message }
  }

  revalidatePath('/dashboard/team')
  
  return { data: { success: true }, error: null }
}

/**
 * Deactivate team member
 */
export async function deactivateTeamMember(userId: string) {
  if (!await checkPermission('settings.edit')) {
    return { data: null, error: 'No tienes permisos para desactivar usuarios' }
  }

  const supabase = await createClient()
  
  const { error } = await supabase
    .from('users')
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) {
    console.error('Error deactivating team member:', error)
    return { data: null, error: error.message }
  }

  revalidatePath('/dashboard/team')
  
  return { data: { success: true }, error: null }
}

/**
 * Reactivate team member
 */
export async function reactivateTeamMember(userId: string) {
  if (!await checkPermission('settings.edit')) {
    return { data: null, error: 'No tienes permisos para reactivar usuarios' }
  }

  const supabase = await createClient()
  
  const { error } = await supabase
    .from('users')
    .update({
      is_active: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) {
    console.error('Error reactivating team member:', error)
    return { data: null, error: error.message }
  }

  revalidatePath('/dashboard/team')
  
  return { data: { success: true }, error: null }
}
