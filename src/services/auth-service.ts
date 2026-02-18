import { getSupabaseClient } from './base'
import { cache } from 'react'

export const getCurrentUser = cache(async () => {
  const supabase = await getSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Auth Error:', error)
    return null
  }

  return user
})

export async function isAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}
