// DashboardContent.tsx - Contenido principal del Dashboard (React Island)
import { motion, AnimatePresence } from "framer-motion";
import { FloatingNav } from "./FloatingNav";
import { RightSidebar } from "./RightSidebar";
import { KPIGrid } from "./KPIGrid";
import { ProjectsWidget } from "./ProjectsWidget";
import { IncidentsTable } from "./IncidentsTable";
import { ActivityFeed } from "./ActivityFeed";
import {
  mockKPIs,
  mockProjects,
  mockIncidents,
  mockActivity,
  mockCurrentUser,
  mockOrganization,
} from "@/lib/mock-dashboard";

interface DashboardContentProps {
  currentPath?: string;
}

export function DashboardContent({ currentPath = "/dashboard" }: DashboardContentProps) {
  const firstName = mockCurrentUser.name.split(" ")[0];

  return (
    <div className="flex min-h-screen w-full bg-[#fafafa] overflow-hidden relative">
      {/* Fondo decorativo con patrón de puntos */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)", 
          backgroundSize: "24px 24px" 
        }} 
      />

      {/* Navegación Flotante */}
      <FloatingNav currentPath={currentPath} />

      {/* Panel Lateral Derecho */}
      <RightSidebar />

      {/* Contenido Principal */}
      <main className="flex-1 h-screen overflow-y-auto relative z-0">
        <div className="p-6 md:p-8 pt-8 pl-28 md:pl-32 pr-6 md:pr-28 max-w-400 mx-auto min-h-screen relative z-10">
          
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                {mockOrganization.name}
              </p>
            </div>
            <motion.h1 
              key={currentPath}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight"
            >
              Bienvenido, {firstName}
            </motion.h1>
            <p className="text-gray-500 mt-1">Aquí está el resumen de tu organización</p>
          </header>

          {/* Contenido con animación */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPath}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* KPIs Grid */}
              <section className="mb-8">
                <KPIGrid data={mockKPIs} />
              </section>

              {/* Main Grid: Proyectos + Incidencias */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ProjectsWidget projects={mockProjects} />
                <IncidentsTable incidents={mockIncidents} />
              </section>

              {/* Activity Feed */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {/* Placeholder para gráficos */}
                  <div className="h-80 bg-white rounded-3xl border border-gray-200 shadow-sm flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-900">Gráficos y Análisis</p>
                      <p className="text-xs text-gray-500 mt-1">Próximamente...</p>
                    </div>
                  </div>
                </div>
                <ActivityFeed activities={mockActivity} />
              </section>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
