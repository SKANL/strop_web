// ProfileSettings.tsx - Configuración del perfil personal
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Camera, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { BackLink } from "./shared/BackLink";
import { mockCurrentUser } from "@/lib/mock/users";

// Opciones de idioma
const languageOptions = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
];

// Zonas horarias principales de México
const timezoneOptions = [
  { value: "America/Mexico_City", label: "Ciudad de México (GMT-6)" },
  { value: "America/Cancun", label: "Cancún (GMT-5)" },
  { value: "America/Tijuana", label: "Tijuana (GMT-8)" },
  { value: "America/Hermosillo", label: "Hermosillo (GMT-7)" },
];

export function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    fullName: mockCurrentUser.fullName,
    email: mockCurrentUser.email,
    phone: mockCurrentUser.phone || "",
    language: mockCurrentUser.language,
    timezone: mockCurrentUser.timezone,
    profilePictureUrl: mockCurrentUser.profilePictureUrl,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Perfil actualizado", {
      description: "Tus cambios han sido guardados correctamente.",
    });

    setIsLoading(false);
  };

  const handlePhotoChange = () => {
    // Simular cambio de foto
    toast.info("Funcionalidad en desarrollo", {
      description: "La carga de fotos estará disponible próximamente.",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-6"
    >
      <BackLink href="/dashboard/configuracion" label="Volver a Configuración" />

      <Card className="bg-card/80 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle>Perfil Personal</CardTitle>
          <CardDescription>
            Administra tu información personal y preferencias de cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Foto de perfil */}
            <div className="space-y-4">
              <Label>Foto de perfil</Label>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Avatar className="h-20 w-20 border-2 border-white shadow-md">
                    <AvatarImage
                      src={formData.profilePictureUrl}
                      alt={formData.fullName}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {getInitials(formData.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
                    onClick={handlePhotoChange}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG o GIF. Máximo 2MB.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handlePhotoChange}
                    >
                      Cambiar foto
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Nombre completo */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre completo *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Tu nombre completo"
                required
              />
            </div>

            {/* Email (no editable) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-muted/50"
              />
              <p className="text-xs text-muted-foreground">
                El email no puede ser modificado. Contacta soporte para cambios.
              </p>
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+52 55 1234 5678"
              />
            </div>

            {/* Idioma y Zona horaria */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value: "es" | "en") =>
                    setFormData({ ...formData, language: value })
                  }
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Seleccionar idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Zona horaria</Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) =>
                    setFormData({ ...formData, timezone: value })
                  }
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Seleccionar zona horaria" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezoneOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Botones de acción */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" asChild>
                <a href="/dashboard/configuracion">Cancelar</a>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar cambios
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
