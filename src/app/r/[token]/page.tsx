"use client"

import { use, useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Camera, CheckCircle2, RefreshCw } from "lucide-react"
import { useEvidencePersistence } from "@/hooks/use-evidence-persistence"
import { CameraCapture } from "@/components/public-link/camera-capture"
import { toast } from "sonner"

// Mock Data Types
type IncidentStatus = 'OPEN' | 'DRAFT' | 'IN_REVIEW' | 'CLOSED'

interface PublicIncident {
  id: string
  project_name: string
  requester_name: string
  problem_photo_url: string
  problem_description: string
  location: string
  status: IncidentStatus
  solution_photo_url?: string | null
}

export default function PublicLinkPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [status, setStatus] = useState<IncidentStatus>('OPEN')
  const [loading, setLoading] = useState(true)
  const [incident, setIncident] = useState<PublicIncident | null>(null)
  
  // Custom Hook for IDB Persistence
  const { draftPhoto, saveDraft, clearDraft } = useEvidencePersistence(token)

  // Mock Data Fetching
  useEffect(() => {
    setTimeout(() => {
        if (token === 'not-found') {
            notFound()
        }
        
        const mockData: PublicIncident = {
            id: "1024",
            project_name: "Torre Meriden",
            requester_name: "Ing. Juan Pérez",
            problem_photo_url: "/placeholder.svg",
            problem_description: "Resanar grieta antes de pintar",
            location: "Depto 301 - Nivel 3",
            status: token === 'closed' ? 'CLOSED' : token === 'review' ? 'IN_REVIEW' : 'OPEN',
            solution_photo_url: token === 'review' ? '/placeholder.svg' : null
        }
        
        setIncident(mockData)
        
        // If we have a local draft and status is OPEN, switch to DRAFT
        if (draftPhoto && mockData.status === 'OPEN') {
            setStatus('DRAFT')
            toast("Borrador recuperado", { description: "Restauramos la foto que no enviaste." })
        } else {
             setStatus(mockData.status)
        }
        
        setLoading(false)
    }, 1000)
  }, [token, draftPhoto])

  const handleCapture = (base64: string) => {
      saveDraft(base64)
      setStatus('DRAFT')
  }

  const handleSend = () => {
      // Simulate API call
      setLoading(true)
      setTimeout(() => {
          clearDraft()
          setStatus('IN_REVIEW')
          setLoading(false)
          toast.success("Evidencia enviada correctamente")
      }, 1500)
  }

  const handleRetake = () => {
      clearDraft()
      setStatus('OPEN')
  }

  if (loading) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Cargando reporte...</p>
        </div>
    )
  }

  if (!incident) return null

  return (
    <div className="flex-1 flex flex-col">
        {/* Header - Always visible */}
        <div className="p-4 border-b flex items-start justify-between bg-white sticky top-0 z-10 shrink-0">
            <div>
                <h1 className="text-sm font-semibold text-gray-900">{incident.project_name}</h1>
                <p className="text-xs text-muted-foreground">Solicitado por {incident.requester_name}</p>
            </div>
            {/* Logo placeholder */}
            <div className="h-6 w-6 bg-primary/20 rounded-full" /> 
        </div>

        {/* Dynamic Content based on State */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* Status OPEN: Show Context & Request */}
            {status === 'OPEN' && (
                <>
                   <div className="space-y-4">
                        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border">
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted/50">
                                <img src={incident.problem_photo_url} alt="Problem" className="object-cover w-full h-full opacity-50" />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                                    Pendiente
                                </Badge>
                                <span className="text-xs text-muted-foreground font-mono">#{incident.id}</span>
                            </div>
                            <h2 className="text-xl font-bold leading-tight">{incident.problem_description}</h2>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                📍 {incident.location}
                            </p>
                        </div>
                   </div>
                </>
            )}
            
            {/* Status DRAFT */}
            {status === 'DRAFT' && draftPhoto && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="relative aspect-3/4 bg-black rounded-lg overflow-hidden border shadow-lg">
                        <img src={draftPhoto} alt="Draft" className="w-full h-full object-contain" />
                     </div>
                     <p className="text-center text-sm text-muted-foreground">Verifica que la foto sea clara antes de enviar.</p>
                </div>
            )}

            {/* Status IN_REVIEW or CLOSED */}
            {(status === 'IN_REVIEW' || status === 'CLOSED') && (
                <div className="flex flex-col items-center text-center space-y-6 pt-8 animate-in zoom-in duration-300">
                     <div className={`h-20 w-20 rounded-full flex items-center justify-center ${status === 'CLOSED' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                        {status === 'CLOSED' ? <CheckCircle2 className="h-10 w-10" /> : <RefreshCw className="h-10 w-10" />}
                     </div>
                     <div className="space-y-2">
                        <h2 className="text-2xl font-bold">
                            {status === 'CLOSED' ? '¡Misión Cumplida!' : 'En Revisión'}
                        </h2>
                        <p className="text-muted-foreground">
                            {status === 'CLOSED' 
                                ? 'La incidencia ha sido aprobada y cerrada.' 
                                : 'Tu evidencia ha sido enviada. Esperando validación.'}
                        </p>
                     </div>
                </div>
            )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-white sticky bottom-0 z-10 pb-8 shrink-0">
            {status === 'OPEN' && (
                <CameraCapture onCapture={handleCapture} />
            )}
            
            {status === 'DRAFT' && (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" size="lg" className="h-12" onClick={handleRetake}>
                            Reintentar
                        </Button>
                        <Button size="lg" className="h-12 bg-green-600 hover:bg-green-700 gap-2" onClick={handleSend}>
                            <CheckCircle2 className="h-5 w-5" />
                            Enviar Evidencia
                        </Button>
                    </div>
                </div>
            )}

            {status === 'IN_REVIEW' && (
                <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={handleRetake}>
                    ¿Te equivocaste? Subir nueva foto
                </Button>
            )}
            
            <div className="mt-6 text-center">
                <p className="text-[10px] text-muted-foreground/50">
                    Gestionado con <span className="font-bold">Strop</span>
                </p>
            </div>
        </div>
    </div>
  )
}
