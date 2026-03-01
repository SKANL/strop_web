import { getRoles } from "@/app/actions/roles"
import { RolesClient } from "@/components/roles/roles-client"
import { Role, RoleArchetype } from "@/components/roles/role-card"

function deriveArchetype(name: string, description: string): RoleArchetype {
  const text = `${name} ${description}`.toLowerCase()
  if (
    text.includes('director') || text.includes('admin') || text.includes('gerente') ||
    text.includes('residente') || text.includes('superintendente') || text.includes('supervisor') ||
    text.includes('jefe') || text.includes('encargado')
  ) return 'MANAGER'
  if (
    text.includes('crew') || text.includes('contrat') || text.includes('externo') ||
    text.includes('cuadrilla') || text.includes('obrero') || text.includes('campo')
  ) return 'FIELD'
  return 'GUEST'
}

export default async function RolesPage() {
    const { data: rolesData } = await getRoles()

    const roles: Role[] = rolesData?.map((r: any) => ({
        id: r.id,
        name: r.display_name,
        description: r.description || "Sin descripción",
        isSystem: r.is_system_role,
        archetype: deriveArchetype(r.display_name || '', r.description || ''),
        userCount: r.userCount ?? 0,
        permissions: Array.isArray(r.capabilities) ? r.capabilities : [],
    })) || []

    return <RolesClient initialRoles={roles} />
}
