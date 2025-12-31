// OrganizationSettings.tsx - Configuración de la organización
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Building2, Camera, Loader2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { BackLink } from "./shared/BackLink";
import { QuotaIndicator } from "./shared/QuotaIndicator";
import { mockOrganization, getOrganizationStorageUsage } from "@/lib/mock/organizations";
import { planLabels } from "@/lib/mock/types";
import { countUsersByRole } from "@/lib/mock/users";

// Datos de cuota
const storageUsage = getOrganizationStorageUsage(mockOrganization.id);
const userCount = Object.values(countUsersByRole(mockOrganization.id)).reduce((a, b) => a + b, 0);

export function OrganizationSettings() {
  const [isLoading, setIsLoading] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: mockOrganization.name,
    billingEmail: mockOrganization.billingEmail || "",
    logoUrl: mockOrganization.logoUrl,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Organización actualizada", {
      description: "Los cambios han sido guardados correctamente.",
    });

    setIsLoading(false);
  };

  const handleLogoChange = () => {
    toast.info("Funcionalidad en desarrollo", {
      description: "La carga de logos estará disponible próximamente.",
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

      {/* Información de la Empresa */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-100">
        <CardHeader>
          <CardTitle>Información de la Empresa</CardTitle>
          <CardDescription>
            Datos comerciales y de contacto de tu organización
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo */}
            <div className="space-y-4">
              <Label>Logo de la empresa</Label>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Avatar className="h-20 w-20 rounded-xl border-2 border-white shadow-md">
                    <AvatarImage
                      src={formData.logoUrl}
                      alt={formData.name}
                    />
                    <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-xl">
                      {getInitials(formData.name)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
                    onClick={handleLogoChange}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Recomendado: 256×256px, PNG con transparencia.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleLogoChange}
                    >
                      Cambiar logo
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

            {/* Nombre de la empresa */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la empresa *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nombre comercial de tu empresa"
                required
              />
            </div>

            {/* Email de facturación */}
            <div className="space-y-2">
              <Label htmlFor="billingEmail">Email de facturación</Label>
              <Input
                id="billingEmail"
                type="email"
                value={formData.billingEmail}
                onChange={(e) =>
                  setFormData({ ...formData, billingEmail: e.target.value })
                }
                placeholder="facturacion@empresa.com"
              />
              <p className="text-xs text-muted-foreground">
                Se enviará la facturación y recibos a este email.
              </p>
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

      {/* Plan y Suscripción */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Plan y Suscripción</CardTitle>
              <CardDescription className="mt-1">
                Detalles de tu plan actual y uso de recursos
              </CardDescription>
            </div>
            <Badge className="bg-primary/10 text-primary border-0 text-sm px-3 py-1">
              {planLabels[mockOrganization.plan]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Indicadores de cuota */}
          <div className="space-y-4">
            <QuotaIndicator
              label="Almacenamiento"
              used={Math.round(storageUsage.usedMb / 1024 * 10) / 10}
              total={Math.round(mockOrganization.storageQuotaMb / 1024 * 10) / 10}
              unit="GB"
            />
            <QuotaIndicator
              label="Usuarios"
              used={userCount}
              total={mockOrganization.maxUsers}
            />
            <QuotaIndicator
              label="Proyectos"
              used={3}
              total={mockOrganization.maxProjects}
            />
          </div>

          <Separator />

          {/* Información de contacto */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
            <Building2 className="h-8 w-8 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                ¿Necesitas más recursos?
              </p>
              <p className="text-sm text-muted-foreground">
                Contacta a nuestro equipo para actualizar tu plan.
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Contactar
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
