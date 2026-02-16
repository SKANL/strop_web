'use client'

import { use, useEffect, useState } from 'react'
import { Camera, CheckCircle2, Clock, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  storePhotoLocally,
  compressImage,
  uploadWithRetry,
  getStoredPhoto,
  recoverPendingUploads,
} from '@/lib/offline-storage'

// Mock data structure - will be replaced with Supabase fetch
interface IncidentData {
  incident_id: string
  project_name: string
  requester_name: string
  problem_photo_url: string
  problem_description: string
  location: string
  status: 'OPEN' | 'IN_REVIEW' | 'CLOSED'
  existing_solution_photo: string | null
}

type PageParams = Promise<{ token: string }>

export default function PublicLinkPage({ params }: { params: PageParams }) {
  const { token } = use(params)
  const [incident, setIncident] = useState<IncidentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [capturedPhoto, setCapturedPhoto] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Fetch incident data
  useEffect(() => {
    async function fetchIncident() {
      try {
        // TODO: Replace with actual Supabase RPC call
        // const { data } = await supabase.rpc('get_incident_by_token', { token })
        
        // Mock data for now
        const mockData: IncidentData = {
          incident_id: '1024',
          project_name: 'Torre Meriden',
          requester_name: 'Ing. Juan Pérez',
          problem_photo_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
          problem_description: 'Resanar grieta antes de pintar',
          location: 'Depto 301',
          status: 'OPEN',
          existing_solution_photo: null,
        }
        
        setIncident(mockData)
        
        // Check for pending uploads
        const stored = await getStoredPhoto(token)
        if (stored && stored.photo) {
          const file = new File([stored.photo], 'repair.jpg', { type: 'image/jpeg' })
          setCapturedPhoto(file)
          setPreviewUrl(URL.createObjectURL(stored.photo))
        }
      } catch (error) {
        console.error('Error fetching incident:', error)
        toast.error('No se pudo cargar la incidencia')
      } finally {
        setLoading(false)
      }
    }

    fetchIncident()

    // Recover any pending uploads
    recoverPendingUploads(async (uploadToken, photo) => {
      if (uploadToken === token) {
        return await uploadPhoto(photo)
      }
      return false
    })
  }, [token])

  // Handle photo selection
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Compress image
      const compressed = await compressImage(file)
      const compressedFile = new File([compressed], file.name, { type: 'image/jpeg' })
      
      // Store locally immediately
      await storePhotoLocally(token, compressed)
      
      setCapturedPhoto(compressedFile)
      setPreviewUrl(URL.createObjectURL(compressed))
      
      toast.success('Foto capturada')
    } catch (error) {
      console.error('Error processing photo:', error)
      toast.error('Error al procesar la foto')
    }
  }

  // Upload photo to Supabase
  const uploadPhoto = async (photoBlob: Blob): Promise<boolean> => {
    try {
      // TODO: Replace with actual Supabase upload
      // const { data, error } = await supabase.storage
      //   .from('incident-photos')
      //   .upload(`${incident?.incident_id}/repair_${Date.now()}.jpg`, photoBlob)
      
      // Mock upload with delay
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      return true
    } catch (error) {
      console.error('Upload error:', error)
      return false
    }
  }

  // Handle photo submission
  const handleSubmit = async () => {
    if (!capturedPhoto || !incident) return

    setUploading(true)
    setUploadProgress(0)

    try {
      const photoBlob = await compressImage(capturedPhoto)
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const success = await uploadWithRetry(
        token,
        photoBlob,
        uploadPhoto,
        5
      )

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (success) {
        toast.success('Evidencia enviada correctamente')
        // Update incident status
        setIncident({ ...incident, status: 'IN_REVIEW', existing_solution_photo: previewUrl })
      } else {
        toast.error('Error al enviar. Reintentando...', {
          description: 'La foto se guardó localmente y se enviará automáticamente',
        })
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Error al enviar la evidencia')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  // Handle retake photo
  const handleRetake = () => {
    setCapturedPhoto(null)
    setPreviewUrl(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!incident) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <X className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Enlace Inválido</h2>
            <p className="text-muted-foreground">
              Este enlace no es válido o ha expirado.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // STATE A: OPEN - Waiting for contractor to upload photo
  if (incident.status === 'OPEN' && !capturedPhoto) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col">
        {/* Header */}
        <div className="bg-background border-b px-4 py-3">
          <div className="max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground">Reporte en</p>
            <h1 className="text-lg font-semibold">{incident.project_name}</h1>
            <p className="text-sm text-muted-foreground">
              Solicitado por {incident.requester_name}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Problem Photo */}
            <Card>
              <CardContent className="p-0">
                <img
                  src={incident.problem_photo_url}
                  alt="Problema detectado"
                  className="w-full h-auto rounded-t-lg"
                />
                <div className="p-4 space-y-2">
                  <h2 className="text-xl font-semibold">
                    {incident.problem_description}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{incident.location}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="bg-background border-t p-4 sticky bottom-0">
          <div className="max-w-2xl mx-auto">
            <label htmlFor="photo-upload">
              <Button size="lg" className="w-full gap-2 text-lg h-14" asChild>
                <span>
                  <Camera className="h-5 w-5" />
                  Subir Foto de Reparación
                </span>
              </Button>
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhotoSelect}
            />
          </div>
        </div>
      </div>
    )
  }

  // STATE B: DRAFT - Preview before sending
  if (incident.status === 'OPEN' && capturedPhoto && previewUrl) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col">
        {/* Header */}
        <div className="bg-background border-b px-4 py-3">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-lg font-semibold">Vista Previa</h1>
            <p className="text-sm text-muted-foreground">
              Confirma antes de enviar
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-0">
                <img
                  src={previewUrl}
                  alt="Foto capturada"
                  className="w-full h-auto rounded-lg"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-background border-t p-4 sticky bottom-0">
          <div className="max-w-2xl mx-auto space-y-2">
            <Button
              size="lg"
              className="w-full gap-2 text-lg h-14"
              onClick={handleSubmit}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Upload className="h-5 w-5 animate-pulse" />
                  Enviando... {uploadProgress}%
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  ENVIAR EVIDENCIA
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="w-full"
              onClick={handleRetake}
              disabled={uploading}
            >
              <X className="h-4 w-4 mr-2" />
              Tomar otra
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // STATE C: IN_REVIEW - Waiting for approval
  if (incident.status === 'IN_REVIEW') {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center pb-4">
            <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold">Evidencia Enviada</h1>
            <p className="text-muted-foreground">
              Esperando validación del residente
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {incident.existing_solution_photo && (
              <img
                src={incident.existing_solution_photo}
                alt="Foto enviada"
                className="w-full h-auto rounded-lg"
              />
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setIncident({ ...incident, status: 'OPEN' })
                handleRetake()
              }}
            >
              ¿Te equivocaste? Subir nueva foto
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // STATE D: CLOSED - Mission complete
  if (incident.status === 'CLOSED') {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center pb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold">¡Incidencia Cerrada!</h1>
            <p className="text-muted-foreground">Gracias por tu trabajo</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {incident.existing_solution_photo && (
              <img
                src={incident.existing_solution_photo}
                alt="Reparación aprobada"
                className="w-full h-auto rounded-lg opacity-90"
              />
            )}
            <div className="text-center text-sm text-muted-foreground pt-4 border-t">
              <p>Gestionado con Strop</p>
              <a
                href="https://strop.app"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Controla tus propias obras aquí
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
