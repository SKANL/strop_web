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
  password: string
  projectIds?: string[]
}) {
  const supabase = await createClient()

  // Get current user + org
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return { data: null, error: 'No autenticado' }

  const { data: userData } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!userData?.organization_id) return { data: null, error: 'Organización no encontrada' }

  // Check duplicate
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', formData.email)
    .single()

  if (existingUser) return { data: null, error: 'Ya existe un usuario con ese correo' }

  // Create auth user with admin client
  const { createAdminClient } = await import('@/lib/supabase/admin')
  const adminSupabase = createAdminClient()

  const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    email_confirm: true,
    user_metadata: {
      full_name: formData.fullName,
      organization_id: userData.organization_id,
    },
  })

  if (authError || !authData.user) {
    return { data: null, error: authError?.message || 'Error al crear la cuenta' }
  }

  // Create user profile row
  const { error: profileError } = await adminSupabase
    .from('users')
    .insert({
      id: authData.user.id,
      email: formData.email,
      full_name: formData.fullName,
      organization_id: userData.organization_id,
      role_id: formData.roleId || null,
      is_active: true,
    } as any)

  if (profileError) {
    // Roll back auth user
    await adminSupabase.auth.admin.deleteUser(authData.user.id)
    return { data: null, error: 'Error al crear el perfil: ' + profileError.message }
  }

  revalidatePath('/dashboard/team')
  return { data: { userId: authData.user.id }, error: null }
}

/**
 * Update team member role
 */
export async function updateTeamMemberRole(userId: string, roleId: string) {
  if (!await checkPermission('org.manage_staff')) {
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
  if (!await checkPermission('project.manage_crew')) {
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
  if (!await checkPermission('org.manage_staff')) {
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
 * Invite a crew / external contractor member (generates username-based access)
 */
export async function inviteCrewMember(formData: {
  name: string
  trade: string
  company?: string
  username: string
  password: string
}) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return { data: null, error: 'No autenticado' }

  const { data: userData } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single()

  if (!userData?.organization_id) return { data: null, error: 'Organización no encontrada' }

  // Crew members use a synthetic email so Supabase Auth can accept them
  const email = `${formData.username}@crew.strop.app`

  // Check duplicate username
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (existing) return { data: null, error: 'Ya existe un usuario con ese nombre de acceso' }

  const { createAdminClient } = await import('@/lib/supabase/admin')
  const adminSupabase = createAdminClient()

  const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
    email,
    password: formData.password,
    email_confirm: true,
    user_metadata: {
      full_name: formData.name,
      trade: formData.trade,
      company: formData.company,
      organization_id: userData.organization_id,
      is_crew: true,
    },
  })

  if (authError || !authData.user) {
    return { data: null, error: authError?.message || 'Error al crear credenciales' }
  }

  const { error: profileError } = await adminSupabase
    .from('users')
    .insert({
      id: authData.user.id,
      email,
      full_name: formData.name,
      organization_id: userData.organization_id,
      user_type: 'crew',
      is_active: true,
    } as any)

  if (profileError) {
    await adminSupabase.auth.admin.deleteUser(authData.user.id)
    return { data: null, error: 'Error al crear perfil: ' + profileError.message }
  }

  revalidatePath('/dashboard/team')
  return { data: { userId: authData.user.id, email }, error: null }
}

/**
 * Reactivate team member
 */
export async function reactivateTeamMember(userId: string) {
  if (!await checkPermission('org.manage_staff')) {
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
