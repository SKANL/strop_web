// ConfigurationHub.tsx - Hub principal de configuración
"use client";

import { motion } from "motion/react";
import {
  User,
  Building2,
  Bell,
  Shield,
  Pencil,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SettingsCard } from "./shared/SettingsCard";
import { QuotaIndicator } from "./shared/QuotaIndicator";
import { mockCurrentUser } from "@/lib/mock/users";
import { mockOrganization, getOrganizationStorageUsage } from "@/lib/mock/organizations";
import { roleLabels, planLabels } from "@/lib/mock/types";
import { countUsersByRole } from "@/lib/mock/users";

// Obtener uso de cuota
const storageUsage = getOrganizationStorageUsage(mockOrganization.id);
const userCount = Object.values(countUsersByRole(mockOrganization.id)).reduce((a, b) => a + b, 0);

// Configuración de las secciones
const settingsSections = [
  {
    icon: User,
    title: "Perfil Personal",
    description: "Nombre, email, foto de perfil, idioma y zona horaria",
    href: "/dashboard/configuracion/perfil",
  },
  {
    icon: Building2,
    title: "Organización",
    description: "Nombre de empresa, logo, email de facturación y plan",
    href: "/dashboard/configuracion/organizacion",
  },
  {
    icon: Bell,
    title: "Notificaciones",
    description: "Alertas críticas, resúmenes y preferencias de email",
    href: "/dashboard/configuracion/notificaciones",
  },
  {
    icon: Shield,
    title: "Seguridad",
    description: "Contraseña, sesiones activas y autenticación",
    href: "/dashboard/configuracion/seguridad",
  },
];

// Animación container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

export function ConfigurationHub() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header con perfil del usuario y cuota */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Card de Perfil Rápido */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                    <AvatarImage
                      src={mockCurrentUser.profilePictureUrl}
                      alt={mockCurrentUser.fullName}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {mockCurrentUser.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    asChild
                  >
                    <a href="/dashboard/configuracion/perfil">
                      <Pencil className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-foreground truncate">
                    {mockCurrentUser.fullName}
                  </h2>
                  <p className="text-sm text-muted-foreground truncate">
                    {mockCurrentUser.email}
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    {roleLabels[mockCurrentUser.role]}
                  </Badge>
                </div>
              </div>
              <Separator className="my-4" />
              <Button variant="outline" className="w-full" asChild>
                <a href="/dashboard/configuracion/perfil">
                  Editar perfil
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card de Resumen de Cuota */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Resumen de Cuota
                </CardTitle>
                <Badge className="bg-primary/10 text-primary border-0">
                  {planLabels[mockOrganization.plan]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
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
                used={3} // Mock: número de proyectos activos
                total={mockOrganization.maxProjects}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Grid de Secciones de Configuración */}
      <div>
        <motion.h2
          variants={itemVariants}
          className="text-lg font-semibold text-foreground mb-4"
        >
          Configuración
        </motion.h2>
        <motion.div
          variants={containerVariants}
          className="grid gap-4 sm:grid-cols-2"
        >
          {settingsSections.map((section) => (
            <motion.div key={section.href} variants={itemVariants}>
              <SettingsCard
                icon={section.icon}
                title={section.title}
                description={section.description}
                href={section.href}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Seccion de Apariencia */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Apariencia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Tema</p>
                  <p className="text-sm text-muted-foreground">
                    Selecciona tu preferencia de tema para la interfaz.
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
