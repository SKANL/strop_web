"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { inviteStaffMember } from "@/app/actions/team"
import { getRoles } from "@/app/actions/roles"

type Role = { id: string; display_name: string }

const INITIAL_FORM = {
  name: "",
  email: "",
  roleId: "",
  initialPassword: "Strop" + new Date().getFullYear(),
}

export function StaffCreationDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [formData, setFormData] = useState(INITIAL_FORM)

  // Fetch real roles when dialog opens
  useEffect(() => {
    if (!open) return
    getRoles().then(({ data }) => {
      if (data) setRoles(data as unknown as Role[])
    })
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.roleId) {
      toast.error("Selecciona un rol antes de continuar")
      return
    }
    setIsLoading(true)
    const result = await inviteStaffMember({
      email: formData.email,
      fullName: formData.name,
      roleId: formData.roleId,
      password: formData.initialPassword,
    })
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Miembro creado exitosamente", {
        description: `Cuenta creada para ${formData.email}`,
      })
      setOpen(false)
      setFormData(INITIAL_FORM)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Miembro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Miembro</DialogTitle>
            <DialogDescription>
              Crea una cuenta para personal interno. Esto consumirá una licencia disponible.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                placeholder="Ej. Juan Pérez"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="juan@empresa.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Rol en la Organización</Label>
              <Select
                value={formData.roleId}
                onValueChange={(value) => setFormData({ ...formData, roleId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.length === 0 && (
                    <SelectItem value="_loading" disabled>Cargando roles...</SelectItem>
                  )}
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña Inicial</Label>
              <div className="relative">
                <Input
                  id="password"
                  value={formData.initialPassword}
                  onChange={(e) => setFormData({ ...formData, initialPassword: e.target.value })}
                  className="font-mono bg-muted/50"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      initialPassword: Math.random().toString(36).slice(-10).toUpperCase(),
                    })
                  }
                  title="Generar nueva"
                >
                  ↺
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                El usuario podrá cambiarla en su primer inicio de sesión.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Cuenta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
