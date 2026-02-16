"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Role } from "./role-card"
import { StepIdentity } from "./steps/step-identity"
import { StepPermissions } from "./steps/step-permissions"
import { StepPreview } from "./steps/step-preview"
import { toast } from "sonner"

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
  const [step, setStep] = useState<WizardStep>('IDENTITY')
  const [formData, setFormData] = useState<RoleFormData>(INITIAL_DATA)

  // Reset on open
  // In a real app we would populate formData from roleToEdit if it exists
  
  const handleNext = () => {
      if (step === 'IDENTITY') setStep('PERMISSIONS')
      else if (step === 'PERMISSIONS') setStep('PREVIEW')
  }

  const handleBack = () => {
      if (step === 'PREVIEW') setStep('PERMISSIONS')
      else if (step === 'PERMISSIONS') setStep('IDENTITY')
  }

  const handleSave = () => {
      // Simulate API call
      console.log("Saving Role:", formData)
      toast.success("Rol guardado correctamente")
      onOpenChange(false)
      setStep('IDENTITY')
      setFormData(INITIAL_DATA)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 border-b shrink-0">
            <DialogTitle>
                {roleToEdit ? "Editar Rol" : "Crear Nuevo Rol"}
            </DialogTitle>
            <div className="flex items-center gap-2 mt-2">
                {['Identidad', 'Permisos', 'Previsualización'].map((label, index) => {
                    const stepNames: WizardStep[] = ['IDENTITY', 'PERMISSIONS', 'PREVIEW']
                    const isActive = stepNames[index] === step
                    const isCompleted = stepNames.indexOf(step) > index
                    
                    return (
                        <div key={label} className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${isActive || isCompleted ? "bg-primary" : "bg-muted"}`} />
                            <span className={`text-xs ${isActive ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                                {label}
                            </span>
                            {index < 2 && <div className="w-8 h-px bg-muted" />}
                        </div>
                    )
                })}
            </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex">
            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
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
        </div>

        <div className="p-4 border-t bg-muted/10 flex justify-between shrink-0">
            <Button variant="outline" onClick={handleBack} disabled={step === 'IDENTITY'}>
                Atrás
            </Button>
            
            {step === 'PREVIEW' ? (
                <Button onClick={handleSave}>Guardar Rol</Button>
            ) : (
                <Button onClick={handleNext} disabled={step === 'IDENTITY' && !formData.name}>
                    Siguiente
                </Button>
            )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
