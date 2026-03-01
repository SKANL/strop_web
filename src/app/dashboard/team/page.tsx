import { getTeamMembers } from "@/app/actions/team"
import { TeamClient } from "@/components/team/team-client"
import { createClient } from "@/lib/supabase/server"

export default async function TeamPage() {
  const [{ data: teamMembers }, supabase] = await Promise.all([
    getTeamMembers(),
    createClient(),
  ])

  // Fetch staff_limit from organization for accurate license display
  const { data: { user } } = await supabase.auth.getUser()
  let staffLimit = 10 // safe default
  let availableRoles: { id: string; display_name: string }[] = []
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('organization_id')
      .eq('id', user.id)
      .single()
    if (profile?.organization_id) {
      const [{ data: org }, { data: roles }] = await Promise.all([
        supabase
          .from('organizations')
          .select('staff_limit, subscription_plan')
          .eq('id', profile.organization_id)
          .single(),
        supabase
          .from('roles')
          .select('id, display_name')
          .eq('organization_id', profile.organization_id)
          .order('display_name'),
      ])
      if (org?.staff_limit) staffLimit = org.staff_limit
      availableRoles = roles ?? []
    }
  }

  return <TeamClient initialMembers={teamMembers || []} staffLimit={staffLimit} availableRoles={availableRoles} />
}
