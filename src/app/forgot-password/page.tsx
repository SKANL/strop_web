"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCard } from "@/components/auth/auth-card"
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      })

      if (error) throw error

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "No se pudo enviar el correo de recuperación")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      tagline="Recupera el acceso a tu cuenta en segundos."
      features={["Enlace seguro por correo", "Expira en 60 minutos", "Sin acceso no autorizado"]}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="mb-1 text-xl font-bold tracking-tighter">
            STROP<span className="text-orange-500">.</span>
          </Link>
          <h1 className="text-2xl font-bold">Recuperar Contraseña</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ingresa tu correo para recibir un enlace de restablecimiento.
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center gap-4 py-4">
            <div className="rounded-full bg-emerald-500/15 p-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" aria-hidden="true" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-semibold">¡Correo Enviado!</p>
              <p className="text-sm text-balance text-muted-foreground">
                Si existe una cuenta con <strong>{email}</strong>, recibirás instrucciones en breve.
              </p>
            </div>
            <Link
              href="/login"
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/15 border border-destructive/50 rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {error}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@strop.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Enviando...
                </>
              ) : (
                "Enviar Enlace"
              )}
            </Button>
            <div className="text-center">
              <Link
                href="/login"
                className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Volver al inicio de sesión
              </Link>
            </div>
          </form>
        )}
      </div>
    </AuthCard>
  )
}
