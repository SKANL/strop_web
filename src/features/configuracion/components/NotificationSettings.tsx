// NotificationSettings.tsx - Configuración de notificaciones
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, Bell, Mail, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { mockNotificationPreferences, type NotificationPreferences } from "@/lib/mock/configuration";

// Opciones de frecuencia
const frequencyOptions = [
  { value: "never", label: "Nunca" },
  { value: "daily", label: "Diario" },
  { value: "weekly", label: "Semanal" },
];

interface NotificationSwitchProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function NotificationSwitch({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: NotificationSwitchProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-base font-medium cursor-pointer">
          {label}
        </Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}

export function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState<NotificationPreferences>({
    ...mockNotificationPreferences,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Preferencias actualizadas", {
      description: "Tus preferencias de notificación han sido guardadas.",
    });

    setIsLoading(false);
  };

  const handleReset = () => {
    setFormData({ ...mockNotificationPreferences });
    toast.info("Preferencias restablecidas", {
      description: "Se han restaurado los valores por defecto.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-6"
    >
      <BackLink href="/dashboard/configuracion" label="Volver a Configuración" />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Alertas Críticas */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <CardTitle>Alertas Críticas</CardTitle>
            </div>
            <CardDescription>
              Notificaciones importantes que requieren atención inmediata
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y">
            <NotificationSwitch
              id="criticalIncidents"
              label="Incidencias críticas"
              description="Recibe notificación inmediata cuando se reporta una incidencia marcada como crítica"
              checked={formData.criticalIncidents}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, criticalIncidents: checked })
              }
            />
            <NotificationSwitch
              id="materialDeviations"
              label="Desviaciones en materiales"
              description="Cuando una solicitud de material supera la cantidad planeada"
              checked={formData.materialDeviations}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, materialDeviations: checked })
              }
            />
          </CardContent>
        </Card>

        {/* Actividad de Proyectos */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Actividad de Proyectos</CardTitle>
            </div>
            <CardDescription>
              Mantente al tanto de la actividad en tus proyectos asignados
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y">
            <NotificationSwitch
              id="newIncidents"
              label="Nuevas incidencias"
              description="Cuando se crea una nueva incidencia en proyectos donde eres responsable"
              checked={formData.newIncidents}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, newIncidents: checked })
              }
            />
            <NotificationSwitch
              id="incidentClosure"
              label="Cierre de incidencias"
              description="Cuando una incidencia que creaste o supervisas es cerrada"
              checked={formData.incidentClosure}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, incidentClosure: checked })
              }
            />
          </CardContent>
        </Card>

        {/* Resúmenes y Email */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle>Resúmenes por Email</CardTitle>
            </div>
            <CardDescription>
              Configura la frecuencia y destino de los resúmenes de actividad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="summaryFrequency">Frecuencia del resumen</Label>
              <Select
                value={formData.summaryFrequency}
                onValueChange={(value: "never" | "daily" | "weekly") =>
                  setFormData({ ...formData, summaryFrequency: value })
                }
              >
                <SelectTrigger id="summaryFrequency" className="w-full sm:w-64">
                  <SelectValue placeholder="Seleccionar frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Recibe un email con el resumen de actividad de tus proyectos
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="notificationEmail">Email para notificaciones</Label>
              <Input
                id="notificationEmail"
                type="email"
                value={formData.notificationEmail}
                onChange={(e) =>
                  setFormData({ ...formData, notificationEmail: e.target.value })
                }
                placeholder="tu@email.com"
                className="max-w-md"
              />
              <p className="text-sm text-muted-foreground">
                Las notificaciones se enviarán a este email
              </p>
            </div>

            <Separator />

            <NotificationSwitch
              id="pushEnabled"
              label="Notificaciones push (móvil)"
              description="Recibe notificaciones en tiempo real en la app móvil"
              checked={formData.pushEnabled}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, pushEnabled: checked })
              }
            />
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleReset}>
            Restablecer
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar preferencias
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
