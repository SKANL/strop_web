import { getRoles } from "@/app/actions/roles"
import { RolesClient } from "@/components/roles/roles-client"
import { Role } from "@/components/roles/role-card"

export default async function RolesPage() {
    const { data: rolesData } = await getRoles()

    // Map DB roles to UI format
    const roles: Role[] = rolesData?.map((r: any) => ({
        id: r.id,
        name: r.display_name,
        description: r.description || "Sin descripción",
        isSystem: r.is_system_role,
        archetype: "GUEST", // Todo: Add archetype to DB or derive it
        userCount: 0 // Todo: Fetch user count
    })) || []

    return <RolesClient initialRoles={roles} />
}
