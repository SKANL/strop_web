// islands/DashboardTabs.tsx - Tabs interactivos con filtros
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, ChevronDown, BarChart3, FolderKanban, AlertTriangle, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProjectsWidget } from "@/features/dashboard/components/ProjectsWidget";
import { IncidentsTable } from "@/features/dashboard/components/IncidentsTable";
import { ActivityFeed } from "@/features/dashboard/components/ActivityFeed";
import { StatsWidget } from "@/features/dashboard/components/StatsWidget";
import {
  mockProjectsUI,
  mockIncidentsUI,
  mockActivityUI,
} from "@/lib/mock";

export function DashboardTabs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const statusFilters = [
    { value: null, label: "Todos" },
    { value: "OPEN", label: "Abiertas" },
    { value: "ASSIGNED", label: "Asignadas" },
    { value: "CLOSED", label: "Cerradas" },
  ];

  const filteredIncidents = mockIncidentsUI.filter(incident => {
    const matchesSearch = searchQuery === "" || 
      incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === null || incident.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <TooltipProvider>
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="inline-flex h-auto items-center justify-start gap-2 bg-transparent p-0">
          <TabsTrigger 
            value="overview" 
            className="gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground rounded-xl transition-all border border-transparent hover:border-border hover:bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-md"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Resumen</span>
          </TabsTrigger>
          <TabsTrigger 
            value="projects" 
            className="gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground rounded-xl transition-all border border-transparent hover:border-border hover:bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-md"
          >
            <FolderKanban className="h-4 w-4" />
            <span>Proyectos</span>
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {mockProjectsUI.filter(p => p.status === "ACTIVE").length}
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="incidents" 
            className="gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground rounded-xl transition-all border border-transparent hover:border-border hover:bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-md"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Incidencias</span>
            {mockIncidentsUI.filter(i => i.priority === "CRITICAL" && i.status !== "CLOSED").length > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-semibold text-destructive-foreground animate-pulse">
                {mockIncidentsUI.filter(i => i.priority === "CRITICAL" && i.status !== "CLOSED").length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="activity" 
            className="gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground rounded-xl transition-all border border-transparent hover:border-border hover:bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-md"
          >
            <Activity className="h-4 w-4" />
            <span>Actividad</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <StatsWidget 
            weeklyResolved={15}
            weeklyCreated={12}
            criticalActive={mockIncidentsUI.filter(i => i.priority === "CRITICAL" && i.status !== "CLOSED").length}
            avgResolutionDays={2.5}
            projectProgress={mockProjectsUI.map(p => ({ name: p.name, progress: p.progress }))}
          />
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <ProjectsWidget projects={mockProjectsUI} maxItems={10} />
        </TabsContent>

        <TabsContent value="incidents" className="mt-6 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-50 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border text-sm h-10"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-2 px-4 border-border bg-card hover:bg-muted"
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
                    className={`rounded-lg ${statusFilter === filter.value ? "bg-muted font-medium" : ""}`}
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
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Limpiar
              </Button>
            )}
          </div>

          <IncidentsTable incidents={filteredIncidents} maxItems={15} />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <ActivityFeed activities={mockActivityUI} maxItems={20} />
        </TabsContent>
      </Tabs>
    </TooltipProvider>
  );
}
