"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle2,
  Clock,
  LockKeyhole,
  Zap,
  AlertTriangle,
} from "lucide-react"
import { getLabelForSubscriptionStatus, getLabelForPlan } from "@/lib/enum-labels"

type SubscriptionStatus = "trial" | "active" | "suspended"

interface UserBillingClientProps {
  org: {
    id: string
    name: string
    subscription_status: string
    subscription_plan: string
    trial_ends_at: string | null
    subscription_activated_at: string | null
    created_at: string
  }
}

const planFeatures: Record<string, string[]> = {
  starter: ["Hasta 3 proyectos", "10 usuarios", "Soporte por correo"],
  pro: ["Proyectos ilimitados", "50 usuarios", "Soporte prioritario", "Portal público de resolución"],
  enterprise: ["Proyectos ilimitados", "Usuarios ilimitados", "SLA garantizado", "Onboarding dedicado", "API acceso completo"],
}

function trialDaysLeft(trialEndsAt: string | null): number | null {
  if (!trialEndsAt) return null
  const diff = new Date(trialEndsAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function UserBillingClient({ org }: UserBillingClientProps) {
  const status = org.subscription_status as SubscriptionStatus
  const plan = org.subscription_plan || "starter"
  const daysLeft = trialDaysLeft(org.trial_ends_at)
  const features = planFeatures[plan] ?? []

  const statusBadge = {
    active: { label: "Activa", variant: "default" as const, icon: CheckCircle2, className: "bg-green-600 hover:bg-green-600 text-white" },
    trial: { label: "Prueba gratuita", variant: "secondary" as const, icon: Clock, className: "" },
    suspended: { label: "Suspendida", variant: "destructive" as const, icon: LockKeyhole, className: "" },
  }[status] ?? { label: status, variant: "outline" as const, icon: Zap, className: "" }

  const StatusIcon = statusBadge.icon

  return (
    <div className="space-y-6">
      {/* Trial warning banner */}
      {status === "trial" && daysLeft !== null && daysLeft <= 7 && (
        <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900/40 dark:bg-orange-950/20">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-orange-600" aria-hidden="true" />
          <div className="text-sm">
            <p className="font-medium text-orange-900 dark:text-orange-100">
              Tu período de prueba {daysLeft === 0 ? "vence hoy" : `vence en ${daysLeft} día${daysLeft !== 1 ? "s" : ""}`}
            </p>
            <p className="mt-0.5 text-orange-700/80 dark:text-orange-300/80">
              Contacta a tu administrador de Strop para activar tu suscripción y no perder el acceso.
            </p>
          </div>
        </div>
      )}

      {/* Suspended banner */}
      {status === "suspended" && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4">
          <LockKeyhole className="h-4 w-4 shrink-0 mt-0.5 text-destructive" aria-hidden="true" />
          <div className="text-sm">
            <p className="font-medium text-destructive">Cuenta suspendida</p>
            <p className="mt-0.5 text-muted-foreground">
              El acceso al dashboard está restringido. Contacta a soporte para reactivar tu cuenta.
            </p>
          </div>
        </div>
      )}

      {/* Current plan card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">Plan Actual</CardTitle>
              <CardDescription>{org.name}</CardDescription>
            </div>
            <Badge variant={statusBadge.variant} className={statusBadge.className}>
              <StatusIcon className="mr-1 h-3 w-3" aria-hidden="true" />
              {statusBadge.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold capitalize">{getLabelForPlan(plan)}</span>
            {status === "trial" && daysLeft !== null && (
              <span className="text-sm text-muted-foreground">
                · {daysLeft > 0 ? `${daysLeft} días restantes` : "Trial vencido"}
              </span>
            )}
            {status === "active" && org.subscription_activated_at && (
              <span className="text-sm text-muted-foreground">
                · Activo desde {new Date(org.subscription_activated_at).toLocaleDateString("es-MX")}
              </span>
            )}
          </div>

          <Separator />

          <ul className="grid gap-2 sm:grid-cols-2" role="list">
            {features.map((feat) => (
              <li key={feat} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />
                {feat}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Upgrade CTA */}
      {status !== "active" || plan !== "enterprise" ? (
        <Card className="border-orange-200 dark:border-orange-900/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-4 w-4 text-orange-600" aria-hidden="true" />
              Mejorar Plan
            </CardTitle>
            <CardDescription>
              Desbloquea más proyectos, usuarios y funcionalidades avanzadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Para activar o cambiar tu plan, contacta al equipo de Strop. Estamos procesando
              pagos manualmente hasta que la integración con Stripe esté lista.
            </p>
            <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white">
              <Link href="mailto:hola@strop.com?subject=Quiero activar mi suscripción">
                Contactar para activar
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
