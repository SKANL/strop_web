"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Camera, Upload } from "lucide-react"
import { toast } from "sonner"

interface CameraCaptureProps {
  onCapture: (base64: string) => void
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate type
    if (!file.type.startsWith('image/')) {
        toast.error("Por favor sube solo imágenes")
        return
    }

    setIsProcessing(true)
    
    // Convert to Base64
    const reader = new FileReader()
    reader.onload = (event) => {
        const result = event.target?.result as string
        onCapture(result)
        setIsProcessing(false)
    }
    reader.onerror = () => {
        toast.error("Error al procesar la imagen")
        setIsProcessing(false)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="w-full">
        <input 
            type="file" 
            accept="image/*" 
            capture="environment" // Prefer rear camera on mobile
            className="hidden" 
            ref={inputRef} 
            onChange={handleFileChange}
        />
        
        <Button 
            size="lg" 
            className="w-full h-14 text-lg gap-2 shadow-lg transition-transform active:scale-95" 
            onClick={() => inputRef.current?.click()}
            disabled={isProcessing}
        >
            {isProcessing ? (
                <span>Procesando...</span>
            ) : (
                <>
                    <Camera className="h-6 w-6" />
                    Subir Foto de Reparación
                </>
            )}
        </Button>
    </div>
  )
}
