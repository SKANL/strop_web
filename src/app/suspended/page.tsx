import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { LockKeyhole, Phone, Mail, ArrowRight, CheckCircle2 } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cuenta Suspendida | Strop",
  robots: { index: false, follow: false },
}

export default function SuspendedPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
      {/* Background glow */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-orange-600/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-lg space-y-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-white tracking-tight">
            STROP
          </span>
        </div>

        {/* Main Card */}
        <Card className="border-zinc-800 bg-zinc-900/80 backdrop-blur-sm shadow-2xl">
          <CardContent className="pt-8 px-8 pb-6 space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 ring-1 ring-orange-500/30">
                <LockKeyhole className="h-8 w-8 text-orange-500" />
              </div>
            </div>

            {/* Heading */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-white">
                Acceso Suspendido
              </h1>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Tu periodo de acceso ha finalizado o no hemos recibido
                confirmación de pago. Para reactivar tu cuenta, contáctanos.
              </p>
            </div>

            {/* What you get when active */}
            <div className="rounded-xl bg-zinc-800/60 p-4 space-y-2">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
                Con tu suscripción activa tendrás acceso a:
              </p>
              {[
                "Dashboard con KPIs financieros en tiempo real",
                "Gestión de incidencias y control de costos",
                "Portal de resolución para contratistas",
                "Configurador de roles y permisos (RBAC)",
                "Reportes y auditoría completa",
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-zinc-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* Contact options */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-zinc-300 text-center">
                Contáctanos para reactivar tu cuenta:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://wa.me/521XXXXXXXXXX?text=Hola,%20quiero%20activar%20mi%20cuenta%20de%20Strop"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="w-full border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white gap-2"
                    aria-label="Contactar por WhatsApp"
                  >
                    <Phone className="h-4 w-4" />
                    WhatsApp
                  </Button>
                </a>
                <a href="mailto:hola@strop.app?subject=Activar%20mi%20cuenta%20Strop">
                  <Button
                    variant="outline"
                    className="w-full border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white gap-2"
                    aria-label="Contactar por correo"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>
                </a>
              </div>

              {/*
                ═══════════════════════════════════════════════════════════════
                STRIPE INTEGRATION POINT — Replace the contact buttons above
                with a Stripe Checkout button when payments are automated:
                ───────────────────────────────────────────────────────────────
                import { createCheckoutSession } from "@/app/actions/billing"

                <form action={createCheckoutSession}>
                  <input type="hidden" name="plan" value="pro" />
                  <Button type="submit" className="w-full bg-orange-600 ...">
                    Pagar y Activar — $199/mes <ArrowRight />
                  </Button>
                </form>
                ═══════════════════════════════════════════════════════════════
              */}
            </div>
          </CardContent>

          <CardFooter className="px-8 pb-8 pt-0">
            <Button
              asChild
              className="w-full bg-orange-600 hover:bg-orange-500 text-white"
            >
              <Link href="/login">
                Volver al inicio de sesión <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Footer note */}
        <p className="text-center text-xs text-zinc-600">
          ¿Ya realizaste tu pago?{" "}
          <a
            href="mailto:hola@strop.app?subject=Confirmacion%20de%20pago"
            className="text-zinc-400 underline underline-offset-4 hover:text-zinc-300 transition-colors"
          >
            Envíanos tu comprobante
          </a>{" "}
          y activamos tu cuenta en menos de 1 hora hábil.
        </p>
      </div>
    </div>
  )
}
