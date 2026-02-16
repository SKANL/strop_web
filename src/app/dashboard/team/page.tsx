import { getTeamMembers } from "@/app/actions/team"
import { TeamClient } from "@/components/team/team-client"

export default async function TeamPage() {
  const { data: teamMembers } = await getTeamMembers()

  return <TeamClient initialMembers={teamMembers || []} />
}
