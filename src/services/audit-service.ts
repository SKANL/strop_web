import { getSupabaseClient } from './base'

export interface AuditLogEntry {
  id: string
  action: string
  old_value: Record<string, unknown> | null
  new_value: Record<string, unknown> | null
  comment: string | null
  timestamp: string
  modified_by_user: {
    full_name: string | null
    email: string | null
  } | null
}

export async function getIncidentAuditLog(incidentId: string): Promise<AuditLogEntry[]> {
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase
    .from('audit_logs')
    .select(`
      id,
      action,
      old_value,
      new_value,
      comment,
      timestamp,
      modified_by_user:users!audit_logs_modified_by_fkey(full_name, email)
    `)
    .eq('incident_id', incidentId)
    .order('timestamp', { ascending: false })

  if (error) {
    console.error('Error fetching audit log:', error)
    return []
  }

  return (data || []) as AuditLogEntry[]
}
