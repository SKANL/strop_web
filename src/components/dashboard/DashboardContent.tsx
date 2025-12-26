// DashboardContent.tsx - Dashboard con Tabs para organizar información
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ChevronDown, FolderKanban, AlertTriangle, Activity, BarChart3 } from "lucide-react";
import { FloatingNav } from "./FloatingNav";
import { MobileNav } from "./MobileNav";
import { RightSidebar } from "./RightSidebar";
import { KPIGrid } from "./KPIGrid";
import { ProjectsWidget } from "./ProjectsWidget";
import { IncidentsTable } from "./IncidentsTable";
import { ActivityFeed } from "./ActivityFeed";
import { StatsWidget } from "./StatsWidget";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Filtros disponibles (usando valores del enum real)
  const statusFilters = [
    { value: null, label: "Todos" },
    { value: "OPEN", label: "Abiertas" },
    { value: "ASSIGNED", label: "Asignadas" },
    { value: "CLOSED", label: "Cerradas" },
  ];

  // Filtrar incidencias
  const filteredIncidents = mockIncidents.filter(incident => {
    const matchesSearch = searchQuery === "" || 
      incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === null || incident.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

      {/* Navegación Flotante (Desktop) */}
      <div className="hidden md:block">
        <FloatingNav currentPath={currentPath} />
      </div>

      {/* Navegación Móvil (Sheet) */}
      <MobileNav currentPath={currentPath} />

      {/* Panel Lateral Derecho */}
      <RightSidebar />

      {/* Contenido Principal */}
      <main className="flex-1 h-screen overflow-y-auto relative z-0">
        <div className="p-4 md:p-8 pt-16 md:pt-8 pl-4 md:pl-32 pr-4 md:pr-28 max-w-400 mx-auto min-h-screen relative z-10">
          
          {/* Header Minimalista */}
          <header className="mb-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <Badge variant="outline" className="text-xs font-medium px-2 py-0.5 bg-gray-50">
                {mockOrganization.name}
              </Badge>
            </div>
            <motion.h1 
              key={currentPath}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl md:text-2xl font-bold text-gray-900"
            >
              Hola, {firstName}
            </motion.h1>
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
              {/* KPIs Grid - Siempre visible, info esencial */}
              <section className="mb-6">
                <KPIGrid data={mockKPIs} />
              </section>

              {/* Tabs para organizar el contenido secundario */}
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="inline-flex h-auto items-center justify-start gap-2 bg-transparent p-0">
                  <TabsTrigger 
                    value="overview" 
                    className="gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 rounded-xl transition-all border border-transparent hover:border-gray-200 hover:bg-gray-50 data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:border-gray-900 data-[state=active]:shadow-md"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Resumen</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="projects" 
                    className="gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 rounded-xl transition-all border border-transparent hover:border-gray-200 hover:bg-gray-50 data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:border-gray-900 data-[state=active]:shadow-md"
                  >
                    <FolderKanban className="h-4 w-4" />
                    <span>Proyectos</span>
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-semibold text-blue-700">
                      {mockProjects.filter(p => p.status === "ACTIVE").length}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="incidents" 
                    className="gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 rounded-xl transition-all border border-transparent hover:border-gray-200 hover:bg-gray-50 data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:border-gray-900 data-[state=active]:shadow-md"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>Incidencias</span>
                    {mockIncidents.filter(i => i.priority === "CRITICAL" && i.status !== "CLOSED").length > 0 && (
                      <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white animate-pulse">
                        {mockIncidents.filter(i => i.priority === "CRITICAL" && i.status !== "CLOSED").length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="activity" 
                    className="gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 rounded-xl transition-all border border-transparent hover:border-gray-200 hover:bg-gray-50 data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:border-gray-900 data-[state=active]:shadow-md"
                  >
                    <Activity className="h-4 w-4" />
                    <span>Actividad</span>
                  </TabsTrigger>
                </TabsList>

                {/* Tab: Resumen - Solo gráficas */}
                <TabsContent value="overview" className="mt-6">
                  <StatsWidget 
                    weeklyResolved={15}
                    weeklyCreated={12}
                    criticalActive={mockIncidents.filter(i => i.priority === "CRITICAL" && i.status !== "CLOSED").length}
                    avgResolutionDays={2.5}
                    projectProgress={mockProjects.map(p => ({ name: p.name, progress: p.progress }))}
                  />
                </TabsContent>

                {/* Tab: Proyectos */}
                <TabsContent value="projects" className="mt-6">
                  <ProjectsWidget projects={mockProjects} maxItems={10} />
                </TabsContent>

                {/* Tab: Incidencias - Con búsqueda y filtros */}
                <TabsContent value="incidents" className="mt-6 space-y-4">
                  {/* Barra de búsqueda y filtros - Solo visible aquí */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-50 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Buscar incidencias..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-10 bg-white border-gray-200 rounded-xl text-sm"
                      />
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-10 gap-2 px-4 rounded-xl border-gray-200 bg-white hover:bg-gray-50"
                        >
                          <Filter className="h-4 w-4" />
                          <span>{statusFilters.find(f => f.value === statusFilter)?.label || "Estado"}</span>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-44 rounded-xl">
                        {statusFilters.map((filter) => (
                          <DropdownMenuItem 
                            key={filter.label}
                            onClick={() => setStatusFilter(filter.value)}
                            className={`rounded-lg ${statusFilter === filter.value ? "bg-gray-100 font-medium" : ""}`}
                          >
                            {filter.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {(searchQuery || statusFilter) && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => { setSearchQuery(""); setStatusFilter(null); }}
                        className="h-10 text-xs text-gray-500 hover:text-gray-700"
                      >
                        Limpiar filtros
                      </Button>
                    )}
                  </div>

                  <IncidentsTable incidents={filteredIncidents} maxItems={15} />
                </TabsContent>

                {/* Tab: Actividad */}
                <TabsContent value="activity" className="mt-6">
                  <ActivityFeed activities={mockActivity} maxItems={20} />
                </TabsContent>
              </Tabs>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
