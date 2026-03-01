import { getTeamMembers } from "@/app/actions/team"
import { NewProjectClient } from "@/components/projects/new-project-client"

export default async function NewProjectPage() {
  const { data: teamMembers } = await getTeamMembers()

  return <NewProjectClient staff={teamMembers || []} />
}
