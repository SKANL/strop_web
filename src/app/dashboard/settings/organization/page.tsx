import { getMyOrganization } from "@/app/actions/billing"
import { OrganizationForm } from "@/components/settings/organization-form"
import { AlertCircle } from "lucide-react"

export const metadata = {
  title: "Organización | Configuración",
}

export default async function OrganizationPage() {
  const { data, error } = await getMyOrganization()

  if (!data) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
        <AlertCircle className="h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
        <span className="text-destructive">
          No se encontró ninguna organización asociada a tu cuenta.
          {error ? ` (${error})` : ""}
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Organización</h3>
        <p className="text-sm text-muted-foreground">
          Configura el nombre y la identidad visual de tu empresa.
        </p>
      </div>
      <OrganizationForm orgId={data.id} initialName={data.name} />
    </div>
  )
}
