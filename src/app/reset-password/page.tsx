"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { AuthCard } from "@/components/auth/auth-card"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [tokenExpired, setTokenExpired] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        // Detect expired / invalid token errors
        if (
          error.message?.toLowerCase().includes('expired') ||
          error.message?.toLowerCase().includes('invalid') ||
          error.status === 401 || error.status === 403
        ) {
          setTokenExpired(true)
        }
        throw error
      }

      setSuccess(true)
      
      // Redirect after short delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "No se pudo actualizar la contraseña. Es posible que el enlace haya expirado.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      tagline="Casi listo. Elige una contraseña segura."
      features={["Mínimo 6 caracteres", "Enlace de un solo uso", "Cifrado de extremo a extremo"]}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="mb-1 text-xl font-bold tracking-tighter">
            STROP<span className="text-orange-500">.</span>
          </Link>
          <h1 className="text-2xl font-bold">Nueva Contraseña</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ingresa tu nueva contraseña para asegurar tu cuenta.
          </p>
        </div>
          {/* ── Token expired state ── */}
          {tokenExpired ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              <div className="rounded-full bg-destructive/15 p-3">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">Enlace Expirado</h3>
                <p className="text-sm text-balance text-muted-foreground">
                  Este enlace ya no es válido. Solicita uno nuevo desde la pantalla de recuperación.
                </p>
              </div>
              <Button asChild className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                <Link href="/forgot-password">Solicitar nuevo enlace</Link>
              </Button>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              <div className="rounded-full bg-emerald-500/15 p-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">¡Contraseña Actualizada!</h3>
                <p className="text-sm text-balance text-muted-foreground">
                  Tu contraseña ha sido cambiada exitosamente. Redirigiendo...
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/15 border border-destructive/50 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Nueva Contraseña</Label>
                <PasswordInput
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <PasswordInput
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  "Actualizar Contraseña"
                )}
              </Button>
            </form>
          )}
      </div>
    </AuthCard>
  )
}
