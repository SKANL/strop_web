"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Role } from "./role-card"
import { StepIdentity } from "./steps/step-identity"
import { StepPermissions } from "./steps/step-permissions"
import { StepPreview } from "./steps/step-preview"
import { toast } from "sonner"
import { createRole, updateRole } from '@/app/actions/roles'

interface RoleWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roleToEdit: Role | null
}

export type WizardStep = 'IDENTITY' | 'PERMISSIONS' | 'PREVIEW'

export interface RoleFormData {
    name: string
    description: string
    archetype: Role['archetype']
    permissions: string[]
}

const INITIAL_DATA: RoleFormData = {
    name: "",
    description: "",
    archetype: 'FIELD',
    permissions: []
}

export function RoleWizard({ open, onOpenChange, roleToEdit }: RoleWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState<WizardStep>('IDENTITY')
  const [formData, setFormData] = useState<RoleFormData>(INITIAL_DATA)
  const [isSaving, setIsSaving] = useState(false)

  // Populate form when editing an existing role
  useEffect(() => {
    if (open && roleToEdit) {
      setFormData({
        name: roleToEdit.name,
        description: roleToEdit.description ?? "",
        archetype: roleToEdit.archetype ?? 'FIELD',
        permissions: roleToEdit.permissions ?? [],
      })
      setStep('IDENTITY')
    } else if (open && !roleToEdit) {
      setFormData(INITIAL_DATA)
      setStep('IDENTITY')
    }
  }, [open, roleToEdit])

  const handleNext = () => {
    if (step === 'IDENTITY') setStep('PERMISSIONS')
    else if (step === 'PERMISSIONS') setStep('PREVIEW')
  }

  const handleBack = () => {
    if (step === 'PREVIEW') setStep('PERMISSIONS')
    else if (step === 'PERMISSIONS') setStep('IDENTITY')
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      let result: { data: unknown; error: unknown }

      if (roleToEdit) {
        // EDIT mode
        result = await updateRole(roleToEdit.id, {
          name: formData.name,
          permissions: formData.permissions,
        })
      } else {
        // CREATE mode
        result = await createRole({
          name: formData.name,
          description: formData.description,
          archetype: formData.archetype,
          permissions: formData.permissions,
        })
      }

      if (result.error) {
        const errorMsg = typeof result.error === 'string'
          ? result.error
          : 'Error al guardar el rol'
        toast.error(errorMsg)
      } else {
        toast.success(roleToEdit ? "Rol actualizado correctamente" : "Rol creado correctamente")
        onOpenChange(false)
        setStep('IDENTITY')
        setFormData(INITIAL_DATA)
        router.refresh()
      }
    } finally {
      setIsSaving(false)
    }
  }

  const stepIndex = step === 'IDENTITY' ? 0 : step === 'PERMISSIONS' ? 1 : 2

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 border-b shrink-0">
          <DialogTitle>
            {roleToEdit ? "Editar Rol" : "Crear Nuevo Rol"}
          </DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            {['Identidad', 'Permisos', 'Previsualización'].map((label, index) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    index < stepIndex
                      ? 'bg-primary text-primary-foreground'
                      : index === stepIndex
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index < stepIndex ? '✓' : index + 1}
                </div>
                <span
                  className={`text-xs ${
                    index === stepIndex
                      ? 'font-semibold text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {label}
                </span>
                {index < 2 && (
                  <div className={`h-px w-8 ${index < stepIndex ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6">
          {step === 'IDENTITY' && (
            <StepIdentity
              data={formData}
              updateData={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
            />
          )}
          {step === 'PERMISSIONS' && (
            <StepPermissions
              data={formData}
              updateData={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
            />
          )}
          {step === 'PREVIEW' && (
            <StepPreview data={formData} />
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t shrink-0">
          <Button
            variant="outline"
            onClick={step === 'IDENTITY' ? () => onOpenChange(false) : handleBack}
            disabled={isSaving}
          >
            {step === 'IDENTITY' ? 'Cancelar' : 'Atrás'}
          </Button>
          {step !== 'PREVIEW' ? (
            <Button onClick={handleNext} disabled={!formData.name && step === 'IDENTITY'}>
              Siguiente
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={isSaving} className="min-w-24">
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Guardando...
                </span>
              ) : roleToEdit ? 'Actualizar Rol' : 'Crear Rol'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
