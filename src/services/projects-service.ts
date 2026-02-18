import { getSupabaseClient, handleDbError } from './base'
import { Database } from '@/types/supabase'

export type Project = Database['public']['Tables']['projects']['Row']

export async function getProjects() {
  const supabase = await getSupabaseClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) handleDbError(error)

  return data
}

export async function getProjectStats(projectId: string) {
  const supabase = await getSupabaseClient()
  
  // This is a placeholder for more complex queries or a dedicated RPC function
  // For now, we'll just fetch a simple count as an example
  const { count, error } = await supabase
    .from('incidents')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId)

  if (error) handleDbError(error)

  return { totalIncidents: count || 0 }
}
