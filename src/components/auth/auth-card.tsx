import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface AuthCardProps {
  children: React.ReactNode
  /** Tagline shown in the decorative right panel */
  tagline?: string
  /** Bullet features shown in the decorative right panel */
  features?: string[]
}

/**
 * Shared 2-column card shell used by all auth pages.
 * Left column: children (form content).
 * Right column: decorative dark panel with brand identity.
 */
export function AuthCard({
  children,
  tagline = "Control financiero total para tus obras de construcción.",
  features = ["Visibilidad en tiempo real", "Control de gastos", "Alertas automáticas"],
}: AuthCardProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              {/* Form slot */}
              <div className="p-6 md:p-8">{children}</div>

              {/* Decorative panel */}
              <div className="relative hidden md:flex flex-col items-center justify-center bg-zinc-950 p-8 gap-6">
                <div
                  className="absolute inset-0 bg-linear-to-br from-orange-950/40 via-zinc-950 to-zinc-950"
                  aria-hidden="true"
                />
                <div className="relative z-10 text-center space-y-4">
                  <Link
                    href="/"
                    className="text-5xl font-bold tracking-tighter text-white hover:opacity-90 transition-opacity"
                  >
                    STROP<span className="text-orange-500">.</span>
                  </Link>
                  <p className="text-sm text-zinc-400 max-w-50 leading-relaxed">
                    {tagline}
                  </p>
                </div>
                <div className="relative z-10 flex flex-col gap-3 w-full max-w-55">
                  {features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-zinc-400">
                      <div
                        className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0"
                        aria-hidden="true"
                      />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <p className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            Al continuar, aceptas nuestros <a href="#">Términos de Servicio</a>{" "}
            y <a href="#">Política de Privacidad</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
