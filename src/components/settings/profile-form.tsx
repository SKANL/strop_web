"use client"

import { useState, useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, User, Lock, AlertCircle, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ProfileFormProps {
  initialName: string
  email: string
  avatarUrl: string
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export function ProfileForm({ initialName, email, avatarUrl }: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialName)
  const [saving, setSaving] = useTransition()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [changingPassword, setChangingPassword] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = fullName.trim()
    if (!trimmed) return

    setSaving(async () => {
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: trimmed },
      })
      const { error: dbError } = await supabase
        .from("users")
        .update({ full_name: trimmed })
        .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "")

      if (authError || dbError) {
        toast.error("No se pudo guardar el perfil")
      } else {
        toast.success("Perfil actualizado")
        router.refresh()
      }
    })
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas nuevas no coinciden")
      return
    }
    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres")
      return
    }
    setChangingPassword(true)
    try {
      // Re-authenticate first with current password
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user?.email) throw new Error("Sin sesión")

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.user.email,
        password: currentPassword,
      })
      if (signInError) {
        toast.error("Contraseña actual incorrecta")
        return
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      toast.success("Contraseña actualizada correctamente")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch {
      toast.error("No se pudo actualizar la contraseña")
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Identity card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" aria-hidden="true" />
            Información Personal
          </CardTitle>
          <CardDescription>
            Tu nombre aparece en incidencias, reportes y en el portal de contratistas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Avatar preview */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 rounded-xl">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={initialName} />}
                <AvatarFallback className="rounded-xl text-lg font-semibold">
                  {getInitials(initialName || "U")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{initialName}</p>
                <p className="text-xs text-muted-foreground">{email}</p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fullName">Nombre Completo</Label>
              <Input
                id="fullName"
                placeholder="Juan Pérez"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                aria-description="El correo no puede cambiarse desde aquí"
              />
              <p className="text-xs text-muted-foreground">
                Para cambiar el correo, contacta a soporte.
              </p>
            </div>

            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white"
              disabled={saving || fullName.trim() === initialName}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
              Guardar cambios
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="h-4 w-4" aria-hidden="true" />
            Cambiar Contraseña
          </CardTitle>
          <CardDescription>
            Usa una contraseña segura de al menos 8 caracteres.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Contraseña Actual</Label>
              <PasswordInput
                id="currentPassword"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <Separator />

            <div className="grid gap-2">
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <PasswordInput
                id="newPassword"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
              <PasswordInput
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              variant="outline"
              disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
            >
              {changingPassword && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              Actualizar contraseña
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
