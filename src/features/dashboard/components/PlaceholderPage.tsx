// PlaceholderPage.tsx - Página placeholder para secciones en desarrollo
"use client";

import { motion } from "motion/react";
import { Construction, ArrowLeft, LayoutGrid, Filter, FileOutput } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { FloatingNav } from "@/features/navigation/components/FloatingNav";
import { MobileNav } from "@/features/navigation/components/MobileNav";
import { RightSidebar } from "@/features/navigation/components/RightSidebar";

interface PlaceholderPageProps {
  title: string;
  description: string;
  currentPath: string;
}

export function PlaceholderPage({ title, description, currentPath }: PlaceholderPageProps) {
  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden relative">
      {/* Patrón de fondo */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(var(--foreground)_1px,transparent_1px)] bg-size-[24px_24px]" 
      />

      {/* Navegación Flotante (Desktop) */}
      <div className="hidden md:block">
        <FloatingNav currentPath={currentPath} />
      </div>

      {/* Navegación Móvil */}
      <MobileNav currentPath={currentPath} />

      {/* Panel Lateral Derecho */}
      <RightSidebar />

      {/* Contenido Principal */}
      <main className="flex-1 h-screen overflow-y-auto relative z-0">
        <div className="p-4 md:p-8 pt-16 md:pt-8 pl-4 md:pl-32 pr-4 md:pr-28 max-w-7xl mx-auto min-h-screen relative z-10">
          
          {/* Breadcrumb usando componente shadcn */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Contenido Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Card className="border-dashed border-2 border-border bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Construction className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">{title}</CardTitle>
                <CardDescription className="text-base text-muted-foreground max-w-md mx-auto">
                  {description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pt-4 pb-8">
                <Badge variant="outline" className="bg-muted text-muted-foreground border-border mb-6">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  En desarrollo
                </Badge>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                  Esta sección estará disponible próximamente. Estamos trabajando para traerte la mejor experiencia.
                </p>
                <Button 
                  variant="outline" 
                  className="gap-2 rounded-xl"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver atrás
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              { title: "Vista en tiempo real", desc: "Datos actualizados al instante", icon: LayoutGrid },
              { title: "Filtros avanzados", desc: "Encuentra lo que buscas rápido", icon: Filter },
              { title: "Exportar datos", desc: "Genera reportes en PDF", icon: FileOutput },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-border">
                  <CardContent className="pt-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
