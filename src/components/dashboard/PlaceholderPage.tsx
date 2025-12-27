// PlaceholderPage.tsx - Página placeholder para secciones en desarrollo
"use client";

import { motion } from "motion/react";
import { Construction, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingNav } from "@/components/dashboard/islands/FloatingNav";
import { MobileNav } from "@/components/dashboard/islands/MobileNav";
import { RightSidebar } from "@/components/dashboard/islands/RightSidebar";

interface PlaceholderPageProps {
  title: string;
  description: string;
  currentPath: string;
}

export function PlaceholderPage({ title, description, currentPath }: PlaceholderPageProps) {
  return (
    <div className="flex min-h-screen w-full bg-[#fafafa] overflow-hidden relative">
      {/* Patrón de fondo */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)", 
          backgroundSize: "24px 24px" 
        }} 
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
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a 
              href="/dashboard" 
              className="hover:text-gray-900 transition-colors"
              data-astro-prefetch
            >
              Dashboard
            </a>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{title}</span>
          </nav>

          {/* Contenido Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Card className="border-dashed border-2 border-gray-200 bg-white/50 backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <Construction className="h-8 w-8 text-gray-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">{title}</CardTitle>
                <CardDescription className="text-base text-gray-500 max-w-md mx-auto">
                  {description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pt-4 pb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-sm font-medium mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  En desarrollo
                </div>
                <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
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
              { title: "Vista en tiempo real", desc: "Datos actualizados al instante" },
              { title: "Filtros avanzados", desc: "Encuentra lo que buscas rápido" },
              { title: "Exportar datos", desc: "Genera reportes en PDF y Excel" },
            ].map((feature, index) => (
              <div 
                key={index}
                className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
