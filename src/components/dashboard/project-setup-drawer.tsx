"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UploadCloud, X, MapPin, Users } from "lucide-react"
import React, { useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { createProject } from "@/app/actions/projects"
import { AddressAutocomplete } from "@/components/ui/address-autocomplete"
import type { GeoSuggestion } from "@/lib/geoapify"

// Mock data removed - using passed 'staff' prop

export function ProjectSetupDrawer({ 
    isOpen, 
    onClose,
    staff = []
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    staff?: any[];
}) {
    // Form state
    const [projectName, setProjectName] = useState("")
    const [projectCode, setProjectCode] = useState("")
    const [address, setAddress] = useState("")
    const [gpsCoords, setGpsCoords] = useState<[number, number] | null>(null) // [lng, lat]
    const [budget, setBudget] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [geofencingEnabled, setGeofencingEnabled] = useState(false)
    const [superintendent, setSuperintendent] = useState("")
    const [residents, setResidents] = useState<string[]>([])
    const [coverPhoto, setCoverPhoto] = useState<File | null>(null)
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)

    // Handle photo upload
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setCoverPhoto(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const removePhoto = () => {
        setCoverPhoto(null)
        setPhotoPreview(null)
    }

    // Handle resident selection
    const toggleResident = (residentId: string) => {
        setResidents(prev => 
            prev.includes(residentId) 
                ? prev.filter(id => id !== residentId)
                : [...prev, residentId]
        )
    }

    // Validation and save
    const handleSave = async () => {
        // Validate required fields
        if (!projectName.trim()) {
            toast.error("El nombre del proyecto es obligatorio")
            return
        }
        if (!superintendent) {
            toast.error("Debes asignar un superintendente")
            return
        }

        toast.promise(
            createProject({
                name: projectName,
                contingency_budget: budget ? parseFloat(budget) : 0,
                start_date: startDate || undefined,
                end_date: endDate || undefined,
                geofence_radius_meters: geofencingEnabled ? 100 : null,
                superintendentId: superintendent,
                is_active: true,
                organization_id: '', // Will be overridden by server action
                location_gps: gpsCoords ? `POINT(${gpsCoords[0]} ${gpsCoords[1]})` : null,
                location_address: address.trim() || null,
            } as any),
            {
                loading: 'Creando proyecto...',
                success: (result: any) => {
                    if (result.error) throw new Error(result.error)
                    
                    // Reset form
                    setProjectName("")
                    setProjectCode("")
                    setAddress("")
                    setGpsCoords(null)
                    setBudget("")
                    setStartDate("")
                    setEndDate("")
                    setGeofencingEnabled(false)
                    setSuperintendent("")
                    setResidents([])
                    setCoverPhoto(null)
                    setPhotoPreview(null)
                    onClose()
                    return `Proyecto "${projectName}" creado exitosamente`
                },
                error: (err) => `Error: ${err.message}`
            }
        )
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-150 w-full p-0 flex flex-col h-full overflow-hidden">
                <SheetHeader className="p-6 pb-4 shrink-0 border-b">
                    <SheetTitle>Nuevo Proyecto</SheetTitle>
                    <SheetDescription>
                        Configura la identidad, ubicación y reglas financieras básicas.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="space-y-6">
                        {/* Sección A: Identidad */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <div className="h-1 w-1 rounded-full bg-primary" />
                                Identidad del Proyecto
                            </h3>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="project-name">
                                    Nombre del Proyecto <span className="text-destructive">*</span>
                                </Label>
                                <Input 
                                    id="project-name" 
                                    placeholder="Ej. Torre Meriden - Fase 2" 
                                    maxLength={50}
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    {projectName.length}/50 caracteres
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="project-code">Código / Alias</Label>
                                <Input 
                                    id="project-code" 
                                    placeholder="Ej. TM-02" 
                                    className="uppercase font-mono"
                                    value={projectCode}
                                    onChange={(e) => setProjectCode(e.target.value.toUpperCase())}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Foto de Portada</Label>
                                {!photoPreview ? (
                                    <label 
                                        htmlFor="cover-photo"
                                        className="h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer text-muted-foreground hover:text-foreground hover:border-primary/50"
                                    >
                                        <UploadCloud className="h-10 w-10" />
                                        <span className="text-sm font-medium">Sube una foto o render de la fachada</span>
                                        <span className="text-xs">Arrastra una imagen o haz clic</span>
                                        <input 
                                            id="cover-photo" 
                                            type="file" 
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handlePhotoChange}
                                        />
                                    </label>
                                ) : (
                                    <div className="relative h-40 rounded-lg overflow-hidden border">
                                        <img 
                                            src={photoPreview} 
                                            alt="Cover preview" 
                                            className="w-full h-full object-cover"
                                        />
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="absolute top-2 right-2 h-6 w-6"
                                            onClick={removePhoto}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Sección B: Ubicación */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                Ubicación Geográfica
                            </h3>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="address">Dirección</Label>
                                <AddressAutocomplete
                                    id="address"
                                    value={address}
                                    onChange={(val) => {
                                        setAddress(val)
                                        // Clear coords if user manually edits
                                        if (gpsCoords) setGpsCoords(null)
                                    }}
                                    onSelect={(suggestion: GeoSuggestion) => {
                                        setAddress(suggestion.label)
                                        setGpsCoords([suggestion.lng, suggestion.lat])
                                    }}
                                    placeholder="Ej. Calle 60 Norte, Mérida, Yucatán"
                                />
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    {gpsCoords 
                                        ? <><span className="text-green-600 font-medium">📍 Coordenadas capturadas</span> ({gpsCoords[1].toFixed(5)}, {gpsCoords[0].toFixed(5)})</>
                                        : 'Escribe para buscar y seleccionar la dirección exacta'
                                    }
                                </p>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                                <div className="space-y-0.5">
                                    <Label htmlFor="geofencing" className="text-sm font-medium cursor-pointer">
                                        Geofencing Activo
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        ¿Requerir estar en sitio para crear incidencias?
                                    </p>
                                </div>
                                <Switch 
                                    id="geofencing"
                                    checked={geofencingEnabled}
                                    onCheckedChange={setGeofencingEnabled}
                                />
                            </div>
                        </div>

                        <Separator />

                        {/* Sección C: Financiera */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <div className="h-1 w-1 rounded-full bg-primary" />
                                    Configuración Financiera
                                </h3>
                                <Badge variant="secondary" className="text-[10px] h-5">
                                    KPI: Burn Rate
                                </Badge>
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="budget">Fondo para Reparaciones (Estimado)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">$</span>
                                    <Input 
                                        id="budget" 
                                        type="number"
                                        className="pl-7 font-mono text-lg font-bold" 
                                        placeholder="0.00"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Monto reservado para vicios ocultos. Strop restará incidencias de aquí.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="start-date">Inicio Obra</Label>
                                    <Input 
                                        id="start-date" 
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="end-date">Fin Obra</Label>
                                    <Input 
                                        id="end-date" 
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Las fechas permiten calcular la velocidad de gasto (Burn Rate)
                            </p>
                        </div>

                        <Separator />

                        {/* Sección D: Asignación de Mando */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" />
                                Asignación de Mando
                            </h3>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="superintendent">
                                    Superintendente (Responsable) <span className="text-destructive">*</span>
                                </Label>
                                <Select value={superintendent} onValueChange={setSuperintendent}>
                                    <SelectTrigger id="superintendent">
                                        <SelectValue placeholder="Selecciona un superintendente" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {staff
                                            .filter((s:any) => s.role?.display_name === "Superintendente" || s.role?.name === "Superintendente")
                                            .map((s:any) => (
                                                <SelectItem key={s.id} value={s.id}>
                                                    {s.full_name}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Recibirá notificación de asignación automáticamente
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label>Residentes (Operativos)</Label>
                                <div className="border rounded-lg p-3 space-y-2 bg-muted/20">
                                    {staff
                                        .filter((s:any) => s.role?.display_name === "Superintendente" || s.role?.name === "Superintendente") // Adapting to DB role
                                        .map((s:any) => (
                                            <div 
                                                key={s.id}
                                                className="flex items-center gap-2"
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={`resident-${s.id}`}
                                                    checked={residents.includes(s.id)}
                                                    onChange={() => toggleResident(s.id)}
                                                    className="h-4 w-4 rounded border-gray-300"
                                                />
                                                <Label 
                                                    htmlFor={`resident-${s.id}`}
                                                    className="text-sm font-normal cursor-pointer flex-1"
                                                >
                                                    {s.full_name}
                                                </Label>
                                            </div>
                                        ))
                                    }
                                </div>
                                {residents.length > 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        {residents.length} residente{residents.length > 1 ? 's' : ''} seleccionado{residents.length > 1 ? 's' : ''}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <SheetFooter className="p-6 pt-4 shrink-0 border-t bg-background/95 backdrop-blur-sm flex-row justify-between gap-2">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} className="flex-1">
                        Crear Proyecto
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
