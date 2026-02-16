
import { createClient } from '@/lib/supabase/server'

/**
 * Checks if the current authenticated user has the specified permission.
 * Returns true if allowed, false otherwise.
 * 
 * @param permission The permission string to check (e.g. 'roles.create')
 */
export async function checkPermission(permission: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return false
  }

  const { data: userData, error: userDataError } = await supabase
    .from('users')
    .select('role_id')
    .eq('id', user.id)
    .single()

  if (userDataError || !userData || !userData.role_id) {
    return false
  }

  const { data: roleData, error: roleError } = await supabase
    .from('roles')
    .select('capabilities')
    .eq('id', userData.role_id)
    .single()

  if (roleError || !roleData || !roleData.capabilities) {
    return false
  }

  // Assuming capabilities is an array of strings as per validation schema
  const capabilities = Array.isArray(roleData.capabilities) 
    ? roleData.capabilities 
    : []

  return capabilities.includes(permission)
}

/**
 * Verifies if the user has the permission. If not, throws an error.
 * Useful for easy usage in Server Actions.
 */
export async function requirePermission(permission: string) {
  const hasPermission = await checkPermission(permission)
  if (!hasPermission) {
    throw new Error(`Unauthorized: Missing permission '${permission}'`)
  }
}
