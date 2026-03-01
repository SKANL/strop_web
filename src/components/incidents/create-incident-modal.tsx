'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createIncidentAction } from '@/actions/incidents'
import { uploadIncidentPhotoAction } from '@/actions/storage'
import { toast } from 'sonner'
import { Camera, ImagePlus, Loader2, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Project {
  id: string
  name: string
}

export function CreateIncidentModal({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('La imagen no puede superar 10 MB')
      return
    }

    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const clearPhoto = () => {
    setPhotoPreview(null)
    setPhotoFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      clearPhoto()
    }
    setOpen(value)
  }

  async function handleSubmit(formData: FormData) {
    if (!photoFile) {
      toast.error('La foto del problema es obligatoria')
      return
    }

    setLoading(true)

    // 1. Create the incident record first
    const result = await createIncidentAction(null, formData)

    if (!result.success || !result.data) {
      setLoading(false)
      toast.error('Error al crear incidencia', { description: result.message })
      return
    }

    // 2. Upload the photo linked to the new incident
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const incidentId = (result.data as any)?.id as string
    const photoFormData = new FormData()
    photoFormData.append('file', photoFile)
    photoFormData.append('incident_id', incidentId)
    photoFormData.append('photo_type', 'PROBLEM')

    const photoResult = await uploadIncidentPhotoAction(photoFormData)

    setLoading(false)

    if (!photoResult.success) {
      // Incident was created but photo failed — show partial success warning
      toast.warning('Incidencia creada, pero la foto no pudo subirse', {
        description: 'Puedes intentar subir la foto desde el detalle de la incidencia.',
      })
    } else {
      toast.success('Incidencia creada correctamente')
    }

    clearPhoto()
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2" suppressHydrationWarning>
          <Plus className="h-4 w-4" /> Nueva Incidencia
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Nueva Incidencia</DialogTitle>
          <DialogDescription>
            Reporta una nueva incidencia en el proyecto.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">

            {/* Mandatory photo field */}
            <div className="grid gap-2">
              <Label>
                Foto del problema{' '}
                <span className="text-destructive" aria-hidden="true">*</span>
              </Label>

              {photoPreview ? (
                <div className="relative rounded-lg overflow-hidden border aspect-video bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoPreview}
                    alt="Vista previa del problema"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearPhoto}
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                    aria-label="Eliminar foto"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1.5 text-xs text-white hover:bg-black/80 transition-colors"
                  >
                    <Camera className="h-3 w-3" />
                    Cambiar
                  </button>
                </div>
              ) : (
                <label
                  className={cn(
                    'flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed',
                    'aspect-video cursor-pointer transition-colors',
                    'border-muted-foreground/25 bg-muted/40 text-muted-foreground',
                    'hover:border-primary/50 hover:bg-muted/60 hover:text-foreground'
                  )}
                  htmlFor="problem-photo"
                >
                  <ImagePlus className="h-8 w-8" />
                  <div className="text-center">
                    <span className="text-sm font-medium">Sube una foto del problema</span>
                    <p className="text-xs mt-1">Toca para abrir cámara o galería</p>
                  </div>
                </label>
              )}

              {/* Hidden input — capture="environment" prefers rear camera on mobile */}
              <input
                ref={fileInputRef}
                id="problem-photo"
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={handlePhotoChange}
                aria-required="true"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="project_id">Proyecto</Label>
              <Select name="project_id" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe la incidencia..."
                required
                minLength={10}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Prioridad</Label>
                <Select name="priority" defaultValue="NORMAL">
                  <SelectTrigger>
                    <SelectValue placeholder="Prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="URGENT">Urgente</SelectItem>
                    <SelectItem value="CRITICAL">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="estimated_cost">Costo Est. ($)</Label>
                <Input
                  id="estimated_cost"
                  name="estimated_cost"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location_tag">Ubicación (Opcional)</Label>
              <Input
                id="location_tag"
                name="location_tag"
                placeholder="Ej. Planta baja, cocina..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !photoFile}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Incidencia'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
