import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/settings/profile-form"

export const metadata = {
  title: "Mi Perfil | Configuración",
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const fullName: string =
    user.user_metadata?.full_name ??
    user.email?.split("@")[0] ??
    "Usuario"

  const avatarUrl: string = user.user_metadata?.avatar_url ?? ""

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Mi Perfil</h3>
        <p className="text-sm text-muted-foreground">
          Gestiona tu información personal y contraseña.
        </p>
      </div>
      <ProfileForm
        initialName={fullName}
        email={user.email ?? ""}
        avatarUrl={avatarUrl}
      />
    </div>
  )
}
