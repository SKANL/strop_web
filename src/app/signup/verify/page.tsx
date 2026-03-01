"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, ArrowLeft, RotateCcw, CheckCircle2, Loader2, ExternalLink } from "lucide-react"
import { toast } from "sonner"

const RESEND_COOLDOWN = 60 // seconds

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? ""

  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const supabase = createClient()

  // Countdown timer after resend
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleResend = useCallback(async () => {
    if (!email || resending || cooldown > 0) return
    setResending(true)
    try {
      const { error } = await supabase.auth.resend({ type: "signup", email })
      if (error) throw error
      setCooldown(RESEND_COOLDOWN)
      toast.success("Correo reenviado", {
        description: `Enviamos un nuevo enlace a ${email}`,
      })
    } catch {
      toast.error("No se pudo reenviar el correo. Intenta de nuevo en unos minutos.")
    } finally {
      setResending(false)
    }
  }, [email, resending, cooldown, supabase])

  // Detect email provider for deep link
  const emailDomain = email.split("@")[1]?.toLowerCase() ?? ""
  const inboxHref = emailDomain.includes("gmail")
    ? "https://mail.google.com"
    : emailDomain.includes("outlook") || emailDomain.includes("hotmail") || emailDomain.includes("live")
    ? "https://outlook.live.com"
    : null
  const inboxLabel = emailDomain.includes("gmail")
    ? "Abrir Gmail"
    : emailDomain.includes("outlook") || emailDomain.includes("hotmail") || emailDomain.includes("live")
    ? "Abrir Outlook"
    : null

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">

              {/* ── Main content panel ── */}
              <div className="flex flex-col items-center justify-center p-8 gap-6">
                {/* Animated envelope */}
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500/10 ring-1 ring-orange-500/20 animate-in zoom-in-75 duration-500"
                  aria-hidden="true"
                >
                  <Mail className="h-10 w-10 text-orange-500" />
                </div>

                <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
                  <h1 className="text-2xl font-bold">Revisa tu correo</h1>
                  <p className="text-sm text-muted-foreground text-balance leading-relaxed">
                    Enviamos un enlace de confirmación a{" "}
                    {email
                      ? <strong className="text-foreground">{email}</strong>
                      : "tu correo electrónico"
                    }
                    . Puede tardar unos minutos.
                  </p>
                </div>

                {/* Actions */}
                <div className="w-full space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
                  {inboxHref && inboxLabel && (
                    <Button
                      asChild
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white border-0"
                    >
                      <a href={inboxHref} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                        {inboxLabel}
                      </a>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleResend}
                    disabled={resending || cooldown > 0}
                    aria-live="polite"
                  >
                    {resending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                        Enviando…
                      </>
                    ) : cooldown > 0 ? (
                      <>
                        <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                        Reenviar correo ({cooldown}s)
                      </>
                    ) : (
                      <>
                        <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                        Reenviar correo
                      </>
                    )}
                  </Button>

                  <Button asChild variant="ghost" className="w-full">
                    <Link href="/login">Ya confirmé — Iniciar sesión</Link>
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  <Link
                    href="/signup"
                    className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    Volver al registro
                  </Link>
                </div>
              </div>

              {/* ── Decorative / tips panel ── */}
              <div
                className="relative hidden md:flex flex-col items-center justify-center bg-zinc-950 p-8 gap-6"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-linear-to-br from-orange-950/40 via-zinc-950 to-zinc-950" />
                <div className="relative z-10 text-center space-y-4">
                  <p className="text-5xl font-bold tracking-tighter text-white">
                    STROP<span className="text-orange-500">.</span>
                  </p>
                  <p className="text-sm text-zinc-400 max-w-[200px] leading-relaxed">
                    Un solo clic y empiezas a controlar tus obras.
                  </p>
                </div>
                <div className="relative z-10 w-full max-w-[220px] space-y-3">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                    ¿No ves el correo?
                  </p>
                  {[
                    "Revisa la carpeta de Spam o Correo No Deseado",
                    "Espera 1-2 minutos antes de reenviar",
                    "Verifica que el correo sea correcto",
                  ].map((tip) => (
                    <div key={tip} className="flex items-start gap-2 text-xs text-zinc-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-orange-500 shrink-0 mt-0.5" />
                      {tip}
                    </div>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>

          <p className="text-balance text-center text-xs text-muted-foreground">
            ¿Correo equivocado?{" "}
            <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
              Volver al registro
            </Link>{" "}
            · ¿Necesitas ayuda?{" "}
            <a
              href="mailto:hola@strop.app"
              className="underline underline-offset-4 hover:text-primary"
            >
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
