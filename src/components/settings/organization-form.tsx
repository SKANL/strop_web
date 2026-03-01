"use client"

import { useState, useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Loader2, Building2, ImagePlus } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface OrganizationFormProps {
  orgId: string
  initialName: string
}

export function OrganizationForm({ orgId, initialName }: OrganizationFormProps) {
  const [name, setName] = useState(initialName)
  const [saving, setSaving] = useTransition()
  const supabase = createClient()
  const router = useRouter()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || trimmed === initialName) return

    setSaving(async () => {
      const { error } = await supabase
        .from("organizations")
        .update({ name: trimmed })
        .eq("id", orgId)

      if (error) {
        toast.error("No se pudo guardar el nombre de la organización")
      } else {
        toast.success("Organización actualizada")
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4" aria-hidden="true" />
            Datos de la Organización
          </CardTitle>
          <CardDescription>
            El nombre de tu organización aparece en reportes, facturas y en el portal público de resolución.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="orgName">Nombre de la Organización</Label>
              <Input
                id="orgName"
                placeholder="Constructora Ejemplo S.A."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white"
              disabled={saving || name.trim() === initialName || !name.trim()}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
              Guardar cambios
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
            Logotipo
          </CardTitle>
          <CardDescription>
            El logotipo se muestra en el portal público de resolución de incidencias.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 text-sm text-muted-foreground cursor-not-allowed select-none">
            Subida de logotipo — próximamente
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
