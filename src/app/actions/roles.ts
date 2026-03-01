"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/types/supabase'
import { roleSchema, updateRoleSchema } from '@/lib/validations/roles'
import { checkPermission } from '@/lib/auth/permissions'

type Role = Database['public']['Tables']['roles']['Row']
type RoleInsert = Database['public']['Tables']['roles']['Insert']

/**
 * Get all roles for the current user's organization
 */
export async function getRoles() {
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

  const [rolesResult, userCountsResult] = await Promise.all([
    supabase
      .from('roles')
      .select('*')
      .eq('organization_id', userData.organization_id)
      .order('created_at', { ascending: false }),
    supabase
      .from('users')
      .select('role_id')
      .eq('organization_id', userData.organization_id)
      .not('role_id', 'is', null)
  ])

  if (rolesResult.error) {
    console.error('Error fetching roles:', rolesResult.error)
    return { data: null, error: rolesResult.error.message }
  }

  const countMap = (userCountsResult.data || []).reduce((acc, u) => {
    if (u.role_id) acc[u.role_id] = (acc[u.role_id] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const data = rolesResult.data?.map(r => ({
    ...r,
    userCount: countMap[r.id] || 0
  }))

  return { data, error: null }
}

/**
 * Get a single role by ID
 */
export async function getRoleById(roleId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('id', roleId)
    .single()

  if (error) {
    console.error('Error fetching role:', error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

/**
 * Create a new role
 */
export async function createRole(formData: {
  name: string
  description?: string
  archetype: string
  permissions: string[]
}) {
  const hasPermission = await checkPermission('settings.edit') || await checkPermission('roles.create')
  if (!hasPermission) {
    return { data: null, error: 'No tienes permisos para crear roles' }
  }

  const validatedFields = roleSchema.safeParse(formData)

  if (!validatedFields.success) {
    return {
      data: null,
      error: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación. Revisa los campos.",
    }
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

  const { data, error } = await supabase
    .from('roles')
    .insert({
      organization_id: userData.organization_id,
      display_name: formData.name,
      capabilities: formData.permissions,
      is_system_role: false,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating role:', error)
    return { data: null, error: error.message }
  }

  revalidatePath('/dashboard/settings/roles')
  
  return { data, error: null }
}

/**
 * Update an existing role
 */
export async function updateRole(roleId: string, updates: {
  name?: string
  permissions?: string[]
}) {
  const hasPermission = await checkPermission('settings.edit') || await checkPermission('roles.edit')
  if (!hasPermission) {
    return { data: null, error: 'No tienes permisos para editar roles' }
  }

  const validatedFields = updateRoleSchema.safeParse(updates)

  if (!validatedFields.success) {
    return { data: null, error: "Datos inválidos" } 
  }

  const supabase = await createClient()
  
  // Check if role is system role (cannot be modified)
  const { data: role } = await supabase
    .from('roles')
    .select('is_system_role')
    .eq('id', roleId)
    .single()

  if (role?.is_system_role) {
    return { data: null, error: 'Cannot modify system role' }
  }

  const updateData: Partial<RoleInsert> = {
    updated_at: new Date().toISOString(),
  }

  if (updates.name) {
    updateData.display_name = updates.name
  }

  if (updates.permissions) {
    updateData.capabilities = updates.permissions
  }

  const { data, error } = await supabase
    .from('roles')
    .update(updateData)
    .eq('id', roleId)
    .select()
    .single()

  if (error) {
    console.error('Error updating role:', error)
    return { data: null, error: error.message }
  }

  revalidatePath('/dashboard/settings/roles')
  
  return { data, error: null }
}

/**
 * Delete a role
 */
export async function deleteRole(roleId: string) {
  const hasPermission = await checkPermission('settings.edit') || await checkPermission('roles.delete')
  if (!hasPermission) {
    return { data: null, error: 'No tienes permisos para eliminar roles' }
  }

  const supabase = await createClient()
  
  // Check if role is system role (cannot be deleted)
  const { data: role } = await supabase
    .from('roles')
    .select('is_system_role')
    .eq('id', roleId)
    .single()

  if (role?.is_system_role) {
    return { data: null, error: 'Cannot delete system role' }
  }

  // Check if role is in use
  const { data: users } = await supabase
    .from('users')
    .select('id')
    .eq('role_id', roleId)
    .limit(1)

  if (users && users.length > 0) {
    return { data: null, error: 'Cannot delete role that is assigned to users' }
  }

  const { error } = await supabase
    .from('roles')
    .delete()
    .eq('id', roleId)

  if (error) {
    console.error('Error deleting role:', error)
    return { data: null, error: error.message }
  }

  revalidatePath('/dashboard/settings/roles')
  
  return { data: { success: true }, error: null }
}

/**
 * Get role archetypes (predefined templates)
 */
export async function getRoleArchetypes() {
  return {
    data: [
      {
        id: 'MANAGER',
        name: 'Manager',
        description: 'Acceso completo a proyectos y configuración',
        icon: 'Shield',
        defaultPermissions: [
          'projects.view',
          'projects.create',
          'projects.edit',
          'incidents.view',
          'incidents.create',
          'incidents.edit',
          'incidents.close',
          'incidents.approve_cost',
          'team.view',
          'team.invite',
          'reports.view',
          'settings.view',
          'settings.edit',
        ],
      },
      {
        id: 'FIELD',
        name: 'Field',
        description: 'Acceso a proyectos asignados y creación de incidencias',
        icon: 'HardHat',
        defaultPermissions: [
          'projects.view',
          'incidents.view',
          'incidents.create',
          'incidents.edit',
          'team.view',
        ],
      },
      {
        id: 'GUEST',
        name: 'Guest',
        description: 'Solo lectura de proyectos e incidencias',
        icon: 'Eye',
        defaultPermissions: [
          'projects.view',
          'incidents.view',
        ],
      },
    ],
    error: null,
  }
}
