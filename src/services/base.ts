import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/supabase'
import { PostgrestError } from '@supabase/supabase-js'

export type DbResult<T> = {
  data: T | null
  error: PostgrestError | null
}

export async function getSupabaseClient() {
  return await createClient()
}

export function handleDbError(error: PostgrestError) {
  console.error('Database Error:', error)
  throw new Error(error.message)
}
