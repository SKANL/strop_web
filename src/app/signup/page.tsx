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
import { AlertCircle, ArrowLeft, ArrowRight, Building, Loader2, User } from "lucide-react"
import Link from "next/link"

type Step = "user" | "org"

interface FormData {
  email: string
  password: string
  fullName: string
  orgName: string
}

/** Step progress indicator */
function StepIndicator({ currentStep }: { currentStep: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: "user", label: "Tu cuenta" },
    { id: "org",  label: "Tu constructora" },
  ]
  const activeIndex = steps.findIndex((s) => s.id === currentStep)

  return (
    <div className="flex items-center gap-2 mb-6" aria-label="Progreso del registro">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                index <= activeIndex
                  ? "bg-orange-600 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
              aria-current={step.id === currentStep ? "step" : undefined}
            >
              {index + 1}
            </div>
            <span
              className={`text-xs font-medium hidden sm:inline ${
                index <= activeIndex ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-px w-8 transition-colors ${
                index < activeIndex ? "bg-orange-600" : "bg-border"
              }`}
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function SignupPage() {
  const [step, setStep] = useState<Step>("user")
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    fullName: "",
    orgName: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setStep("org")
  }

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
        // Email confirmation required — redirect to verify page
        router.push(`/signup/verify?email=${encodeURIComponent(formData.email)}`)
        return
      }

      // 2. Create Organization & Owner Profile (RPC)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: rpcError } = await (supabase as any).rpc(
        "create_organization_and_owner",
        {
          p_org_name: formData.orgName,
          p_full_name: formData.fullName,
          p_plan: "free",
        }
      )

      if (rpcError) throw rpcError

      router.push("/dashboard")
      router.refresh()
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error durante el registro"
      )
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              {/* === STEP 1: Datos personales === */}
              {step === "user" && (
                <form onSubmit={handleNextStep} className="p-6 md:p-8">
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col items-center text-center">
                      <Link href="/" className="mb-1 text-xl font-bold tracking-tighter">
                        STROP<span className="text-orange-500">.</span>
                      </Link>
                      <h1 className="text-2xl font-bold">Crea tu cuenta</h1>
                      <p className="text-balance text-muted-foreground text-sm">
                        Empieza a gestionar tus obras hoy mismo
                      </p>
                    </div>

                    <StepIndicator currentStep={step} />

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
                      <Label htmlFor="fullName">Nombre Completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                          id="fullName"
                          placeholder="Juan Pérez"
                          className="pl-9"
                          autoComplete="name"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="juan@constructora.com"
                        autoComplete="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <PasswordInput
                        id="password"
                        showStrength
                        autoComplete="new-password"
                        minLength={6}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <p className="text-xs text-muted-foreground">Mínimo 8 caracteres recomendado</p>
                    </div>

                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                      Continuar <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Button>

                    <div className="text-center text-sm">
                      ¿Ya tienes cuenta?{" "}
                      <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                        Inicia sesión
                      </Link>
                    </div>
                  </div>
                </form>
              )}

              {/* === STEP 2: Datos de organización === */}
              {step === "org" && (
                <form onSubmit={handleSignup} className="p-6 md:p-8">
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col items-center text-center">
                      <Link href="/" className="mb-1 text-xl font-bold tracking-tighter">
                        STROP<span className="text-orange-500">.</span>
                      </Link>
                      <h1 className="text-2xl font-bold">Tu constructora</h1>
                      <p className="text-balance text-muted-foreground text-sm">
                        Serás el Super Admin de tu organización
                      </p>
                    </div>

                    <StepIndicator currentStep={step} />

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
                      <Label htmlFor="orgName">Nombre de tu Constructora</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                          id="orgName"
                          placeholder="Construcciones Juan S.A."
                          className="pl-9"
                          autoComplete="organization"
                          value={formData.orgName}
                          onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Se creará una organización donde serás el Super Admin.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => { setError(null); setStep("user") }}
                        disabled={loading}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                        Atrás
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                            Creando...
                          </>
                        ) : (
                          "Crear Cuenta"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              {/* Decorative panel */}
              <div className="relative hidden md:flex flex-col items-center justify-center bg-zinc-950 p-8 gap-6">
                <div className="absolute inset-0 bg-linear-to-tl from-orange-950/40 via-zinc-950 to-zinc-950" aria-hidden="true" />
                <div className="relative z-10 text-center space-y-4">
                  <p className="text-5xl font-bold tracking-tighter text-white">
                    STROP<span className="text-orange-500">.</span>
                  </p>
                  <p className="text-sm text-zinc-400 max-w-[200px] leading-relaxed">
                    Control financiero total para tus obras de construcción.
                  </p>
                </div>
                <div className="relative z-10 flex flex-col gap-3 w-full max-w-[220px]">
                  {[
                    "Registro de incidencias en campo",
                    "Control de gastos en tiempo real",
                    "Alertas antes de que ocurran",
                    "Reportes automáticos",
                  ].map((feat) => (
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
            Al registrarte, aceptas nuestros <a href="#">Términos de Servicio</a>{" "}
            y <a href="#">Política de Privacidad</a>.
          </div>
        </div>
      </div>
    </div>
  )
}
