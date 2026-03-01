import { getMyOrganization } from "@/app/actions/billing"
import { UserBillingClient } from "@/components/settings/user-billing-client"
import { AlertCircle } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Facturación y Plan",
}

export default async function BillingPage() {
  const { data: org, error } = await getMyOrganization()

  if (!org) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
        <AlertCircle className="h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
        <span className="text-destructive">
          No se pudo cargar la información de facturación.
          {error ? ` (${error})` : ""}
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Facturación y Plan</h3>
        <p className="text-sm text-muted-foreground">
          Revisa el estado de tu suscripción y las funcionalidades incluidas en tu plan.
        </p>
      </div>
      <UserBillingClient org={org} />
    </div>
  )
}
