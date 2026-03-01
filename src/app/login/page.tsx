"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Correo o contraseña incorrectos"
          : error.message
      )
      setLoading(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form onSubmit={handleLogin} className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <Link href="/" className="mb-1 text-xl font-bold tracking-tighter">
                      STROP<span className="text-orange-500">.</span>
                    </Link>
                    <h1 className="text-2xl font-bold">Bienvenido de nuevo</h1>
                    <p className="text-balance text-muted-foreground">
                      Inicia sesión en tu cuenta de Strop
                    </p>
                  </div>
                  
                  {error && (
                    <div
                      role="alert"
                      className="p-3 text-sm text-destructive bg-destructive/15 border border-destructive/50 rounded-md flex items-center gap-2"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {error}
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="juan@constructora.com"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Contraseña</Label>
                      <Link
                        href="/forgot-password"
                        className="ml-auto text-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <PasswordInput
                      id="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                     {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                          Iniciando...
                        </>
                      ) : (
                        "Iniciar Sesión"
                      )}
                  </Button>
                  <div className="text-center text-sm">
                    ¿No tienes cuenta?{" "}
                    <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
                      Regístrate gratis
                    </Link>
                  </div>
                </div>
              </form>
              {/* Decorative panel */}
              <div className="relative hidden md:flex flex-col items-center justify-center bg-zinc-950 p-8 gap-6">
                <div className="absolute inset-0 bg-linear-to-br from-orange-950/40 via-zinc-950 to-zinc-950" aria-hidden="true" />
                <div className="relative z-10 text-center space-y-4">
                  <p className="text-5xl font-bold tracking-tighter text-white">
                    STROP<span className="text-orange-500">.</span>
                  </p>
                  <p className="text-sm text-zinc-400 max-w-[200px] leading-relaxed">
                    Control financiero total para tus obras de construcción.
                  </p>
                </div>
                <div className="relative z-10 flex flex-col gap-3 w-full max-w-[220px]">
                  {["Visibilidad en tiempo real", "Control de gastos", "Alertas automáticas"].map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-zinc-400">
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" aria-hidden="true" />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            Al continuar, aceptas nuestros <a href="#">Términos de Servicio</a>{" "}
            y <a href="#">Política de Privacidad</a>.
          </div>
        </div>
      </div>
    </div>
  )
}
