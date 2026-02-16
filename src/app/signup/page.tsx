"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { AlertCircle, Loader2, Building, User } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  const [step, setStep] = useState<"user" | "org">("user")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    orgName: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Sign Up User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      })

      if (authError) throw authError

      if (!authData.session) {
        setError("Por favor revisa tu correo para confirmar tu cuenta antes de continuar.")
        setLoading(false)
        return
      }

      // 2. Create Organization & Owner Profile (RPC)
      // Note: We cast supabase to any because the type might not be regenerated yet
      const { error: rpcError } = await (supabase as any).rpc(
        "create_organization_and_owner",
        {
          p_org_name: formData.orgName,
          p_full_name: formData.fullName,
          p_plan: "free", // Default plan
        }
      )

      if (rpcError) throw rpcError

      // 3. Redirect to Dashboard
      router.push("/")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Ocurrió un error durante el registro")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form onSubmit={handleSignup} className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Crear Cuenta</h1>
                    <p className="text-balance text-muted-foreground">
                      Comienza a gestionar tus obras hoy mismo
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 text-sm text-destructive bg-destructive/15 border border-destructive/50 rounded-md flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Nombre Completo</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                        id="fullName"
                        placeholder="Juan Pérez"
                        className="pl-9"
                        value={formData.fullName}
                        onChange={(e) =>
                            setFormData({ ...formData, fullName: e.target.value })
                        }
                        required
                        />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="juan@constructcciones.com"
                        value={formData.email}
                        onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                        }
                        required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                        }
                        required
                        minLength={6}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="orgName">Nombre de tu Constructora</Label>
                    <div className="relative">
                        <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="orgName"
                            placeholder="Construcciones Juan S.A."
                            className="pl-9"
                            value={formData.orgName}
                            onChange={(e) =>
                            setFormData({ ...formData, orgName: e.target.value })
                            }
                            required
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Se creará una organización nueva donde serás el Super Admin.
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                     {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creando Cuenta...
                        </>
                      ) : (
                        "Registrar y Crear Organización"
                      )}
                  </Button>
                  <div className="text-center text-sm">
                    ¿Ya tienes cuenta?{" "}
                    <Link href="/login" className="underline underline-offset-4">
                      Inicia Sesión
                    </Link>
                  </div>
                </div>
              </form>
              <div className="relative hidden bg-muted md:block">
                <img
                  src="/placeholder.svg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
                 {/* Fallback to a nice gradient */}
                 <div className="absolute inset-0 bg-linear-to-bl from-zinc-900 via-zinc-800 to-zinc-900 opacity-90 flex items-center justify-center text-white/20 font-bold text-4xl">
                    STROP
                 </div>
              </div>
            </CardContent>
          </Card>
           <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            Al registrarte, aceptas nuestros <a href="#">Términos de Servicio</a>{" "}
            y <a href="#">Política de Privacidad</a>.
          </div>
        </div>
      </div>
    </div>
  )
}
