'use client'

import { useState } from 'react'
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
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

// Basic interface for Project, assuming we pass list of projects
interface Project {
  id: string
  name: string
}

export function CreateIncidentModal({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await createIncidentAction(null, formData)
    setLoading(false)

    if (result.success) {
      toast.success('Incidencia creada correctamente')
      setOpen(false)
    } else {
      toast.error('Error al crear incidencia', {
        description: result.message
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" suppressHydrationWarning>
          <Plus className="h-4 w-4" /> Nueva Incidencia
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nueva Incidencia</DialogTitle>
          <DialogDescription>
            Reporta una nueva incidencia en el proyecto.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Incidencia'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
