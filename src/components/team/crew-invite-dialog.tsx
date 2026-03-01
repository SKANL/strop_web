"use client"

import { useState, useTransition } from "react"
import { inviteCrewMember } from "@/app/actions/team"
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
import { Copy, Check, Users, ShieldAlert, Share2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function CrewInviteDialog({ projectName }: { projectName?: string }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"form" | "credentials">("form")
  const [copied, setCopied] = useState(false)
  const [isPending, startTransition] = useTransition()
  
  const [formData, setFormData] = useState({
    name: "",
    trade: "general",
    company: "",
  })

  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  })

  const buildCredentials = (name: string) => {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '')
    const suffix = Math.floor(Math.random() * 900) + 100
    const password = Array.from(crypto.getRandomValues(new Uint8Array(6)))
      .map(b => b.toString(36))
      .join('')
      .toUpperCase()
    return { username: `${cleanName}_${suffix}`, password }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const generated = buildCredentials(formData.name)
    setCredentials(generated)
    startTransition(async () => {
      const result = await inviteCrewMember({
        name: formData.name,
        trade: formData.trade,
        company: formData.company || undefined,
        username: generated.username,
        password: generated.password,
      })
      if (!result.data) {
        toast.error(result.error || 'Error al crear acceso')
        return
      }
      setStep("credentials")
    })
  }

  const getWhatsAppMessage = () => {
    return `👷‍♂️ *Acceso Strop SaaS*
    
Hola ${formData.name}, te hemos dado acceso al proyecto *${projectName || "este proyecto"}*.

🔗 *Entra aquí:* strop.app/login
👤 *Usuario:* ${credentials.username}
🔑 *Clave:* ${credentials.password}

_(Este acceso caduca al finalizar el proyecto)_`
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(getWhatsAppMessage())
    setCopied(true)
    toast.success("Credenciales copiadas", {
      description: "Listo para pegar en WhatsApp"
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setOpen(false)
    setTimeout(() => {
      setStep("form")
      setFormData({ name: "", trade: "general", company: "" })
      setCopied(false)
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleReset()}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <Button variant="outline" className="border-dashed">
          <Users className="h-4 w-4 mr-2" />
          Invitar Externo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {step === "form" ? (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Invitar Personal Externo</DialogTitle>
              <DialogDescription>
                Genera un acceso temporal de solo lectura o reporte para contratistas y cuadrillas.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre / Apodo</Label>
                <Input
                  id="name"
                  placeholder="Ej. Pedro Yesero"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="trade">Gremio / Oficio</Label>
                  <Select 
                    value={formData.trade} 
                    onValueChange={(value) => setFormData({ ...formData, trade: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">🚧 General</SelectItem>
                      <SelectItem value="masonry">🧱 Albañilería</SelectItem>
                      <SelectItem value="plumbing">🔧 Plomería</SelectItem>
                      <SelectItem value="electrical">⚡ Eléctrico</SelectItem>
                      <SelectItem value="painting">🎨 Pintura</SelectItem>
                      <SelectItem value="carpentry">🪚 Carpintería</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company">Empresa (Opcional)</Label>
                  <Input
                    id="company"
                    placeholder="Ej. Acabados del Sur"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="rounded-md bg-amber-50 p-3 border border-amber-200">
                <div className="flex gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-800">
                    <p className="font-semibold mb-1">Permisos Limitados</p>
                    Este usuario solo podrá ver tareas asignadas a su gremio y subir evidencias fotográficas.
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={handleReset}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creando acceso..." : "Generar Credenciales"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <Check className="h-5 w-5" />
                Acceso Generado
              </DialogTitle>
              <DialogDescription>
                Copia estas credenciales y envíalas por WhatsApp al contratista.
              </DialogDescription>
            </DialogHeader>

            <div className="relative rounded-lg border bg-muted/50 p-4 font-mono text-sm shadow-inner">
              <div className="space-y-1.5 text-muted-foreground whitespace-pre-wrap">
                {getWhatsAppMessage()}
              </div>
              <Button
                size="sm"
                className={cn(
                  "absolute top-2 right-2 transition-all",
                  copied ? "bg-green-600 hover:bg-green-700" : ""
                )}
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 mr-1" /> Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" /> Copiar
                  </>
                )}
              </Button>
            </div>

            <div className="flex justify-center pt-2">
               <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => {
                  window.open(`https://wa.me/?text=${encodeURIComponent(getWhatsAppMessage())}`, '_blank')
                }}
              >
                <Share2 className="h-4 w-4" />
                Abrir WhatsApp Web
              </Button>
            </div>

            <DialogFooter className="sm:justify-between">
               <Button type="button" variant="ghost" size="sm" onClick={() => setStep("form")}>
                ← Crear otro
              </Button>
              <Button onClick={handleReset}>
                Finalizar
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
