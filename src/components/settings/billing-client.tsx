"use client"

import { useState, useTransition } from "react"
import { adminActivateOrg, adminSuspendOrg } from "@/app/actions/billing"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CheckCircle2, LockKeyhole, AlertTriangle, ExternalLink } from "lucide-react"
import { toast } from "sonner"

type SubscriptionStatus = "trial" | "active" | "suspended"

interface Organization {
  id: string
  name: string
  subscription_status: SubscriptionStatus
  subscription_plan: string
  trial_ends_at: string | null
  subscription_activated_at: string | null
  stripe_customer_id: string | null
  created_at: string
}

const statusConfig: Record<
  SubscriptionStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  active: { label: "✅ Activa", variant: "default" },
  trial: { label: "🔵 Trial", variant: "secondary" },
  suspended: { label: "🔴 Suspendida", variant: "destructive" },
}

export function BillingClient({
  organizations,
}: {
  organizations: Organization[]
}) {
  const [selectedPlan, setSelectedPlan] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  const handleActivate = (orgId: string) => {
    const plan = selectedPlan[orgId] || "pro"
    startTransition(async () => {
      const fd = new FormData()
      fd.append("org_id", orgId)
      fd.append("plan", plan)
      const result = await adminActivateOrg(fd)
      if (result.success) {
        toast.success("Organización activada correctamente")
      } else {
        toast.error("Error al activar: " + result.error)
      }
    })
  }

  const handleSuspend = (orgId: string) => {
    startTransition(async () => {
      const fd = new FormData()
      fd.append("org_id", orgId)
      const result = await adminSuspendOrg(fd)
      if (result.success) {
        toast.success("Organización suspendida")
      } else {
        toast.error("Error al suspender: " + result.error)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium">Facturación y Plan</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Gestiona el estado de suscripción de todas las organizaciones registradas.
          Los cambios tienen efecto inmediato en el acceso al dashboard.
        </p>
      </div>

      {/* Stripe integration notice */}
      <Card className="border-orange-200 bg-orange-50 dark:border-orange-900/50 dark:bg-orange-950/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-400 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Modo de Pago Manual Activo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-orange-700 dark:text-orange-400/80">
            Actualmente los pagos se procesan manualmente. Cuando recibas un pago,
            activa la organización desde esta tabla. Para automatizar con Stripe en el futuro,
            sólo necesitas conectar el webhook — esta interfaz seguirá funcionando igual.{" "}
            {/*
              ═══════════════════════════════════════════════════════════
              STRIPE INTEGRATION POINT:
              Reemplaza este aviso con:
              <Button onClick={() => router.push("/api/stripe/connect")}>
                Conectar Stripe
              </Button>
              ═══════════════════════════════════════════════════════════
            */}
          </p>
        </CardContent>
      </Card>

      {/* Organizations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Organizaciones registradas</CardTitle>
          <CardDescription>
            {organizations.length} organización{organizations.length !== 1 ? "es" : ""} registrada
            {organizations.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {organizations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <LockKeyhole className="h-8 w-8 mb-3 opacity-40" />
              <p className="text-sm">No hay organizaciones registradas</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organización</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Trial / Activación</TableHead>
                  <TableHead>Stripe ID</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations.map((org) => {
                  const status = (org.subscription_status as SubscriptionStatus) || "trial"
                  const config = statusConfig[status]
                  const isTrialExpired =
                    status === "trial" &&
                    org.trial_ends_at !== null &&
                    new Date() > new Date(org.trial_ends_at)

                  return (
                    <TableRow key={org.id}>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-sm">{org.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {org.id.substring(0, 8)}…
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant={config.variant} className="text-xs">
                            {config.label}
                          </Badge>
                          {isTrialExpired && (
                            <Badge variant="destructive" className="text-[10px] block w-fit">
                              Trial vencido
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm capitalize">
                          {org.subscription_plan || "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-muted-foreground space-y-0.5">
                          {org.trial_ends_at && (
                            <p>
                              Trial hasta:{" "}
                              {new Date(org.trial_ends_at).toLocaleDateString("es-MX")}
                            </p>
                          )}
                          {org.subscription_activated_at && (
                            <p className="text-green-600 dark:text-green-400">
                              Activado:{" "}
                              {new Date(org.subscription_activated_at).toLocaleDateString("es-MX")}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {org.stripe_customer_id ? (
                          <a
                            href={`https://dashboard.stripe.com/customers/${org.stripe_customer_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline"
                          >
                            {org.stripe_customer_id.slice(0, 12)}…
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">Sin Stripe</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Plan selector */}
                          <Select
                            value={selectedPlan[org.id] || "pro"}
                            onValueChange={(v) =>
                              setSelectedPlan((prev) => ({ ...prev, [org.id]: v }))
                            }
                          >
                            <SelectTrigger className="h-8 w-28 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="starter">Starter</SelectItem>
                              <SelectItem value="pro">Pro</SelectItem>
                              <SelectItem value="enterprise">Enterprise</SelectItem>
                            </SelectContent>
                          </Select>

                          {/* Activate button */}
                          <Button
                            size="sm"
                            disabled={isPending || status === "active"}
                            onClick={() => handleActivate(org.id)}
                            className="h-8 gap-1 text-xs bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Activar
                          </Button>

                          {/* Suspend button with confirmation */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                disabled={isPending || status === "suspended"}
                                className="h-8 gap-1 text-xs"
                              >
                                <LockKeyhole className="h-3 w-3" />
                                Suspender
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  ¿Suspender a &quot;{org.name}&quot;?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  El equipo de <strong>{org.name}</strong> perderá acceso al
                                  dashboard inmediatamente y será redirigido a la página de
                                  cuenta suspendida. Esta acción puede revertirse activando
                                  la organización nuevamente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleSuspend(org.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Sí, suspender acceso
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
