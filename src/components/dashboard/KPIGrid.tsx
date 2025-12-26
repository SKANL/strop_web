// KPIGrid.tsx - Grid de tarjetas KPI para el Dashboard
import { 
  FolderKanban, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle, 
  Clock, 
  Users 
} from "lucide-react";
import { KPICard } from "./KPICard";
import type { KPIData } from "@/lib/mock-dashboard";

interface KPIGridProps {
  data: KPIData;
}

export function KPIGrid({ data }: KPIGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <KPICard
        title="Proyectos Activos"
        value={data.activeProjects}
        subtitle={`de ${data.totalProjects} totales`}
        icon={FolderKanban}
        variant="primary"
        delay={0}
      />
      <KPICard
        title="Incidencias Abiertas"
        value={data.openIncidents}
        subtitle={`de ${data.totalIncidents} totales`}
        icon={AlertTriangle}
        variant="warning"
        trend={{ value: 12, isPositive: false }}
        delay={0.05}
      />
      <KPICard
        title="Incidencias Críticas"
        value={data.criticalIncidents}
        subtitle="Requieren atención"
        icon={AlertOctagon}
        variant="destructive"
        delay={0.1}
      />
      <KPICard
        title="Resueltas esta Semana"
        value={data.resolvedThisWeek}
        subtitle="Últimos 7 días"
        icon={CheckCircle}
        trend={{ value: 8, isPositive: true }}
        delay={0.15}
      />
      <KPICard
        title="Tiempo Promedio"
        value={data.avgResolutionTime}
        subtitle="Resolución de incidencias"
        icon={Clock}
        delay={0.2}
      />
      <KPICard
        title="Usuarios Activos"
        value={data.totalUsers}
        subtitle="En la organización"
        icon={Users}
        delay={0.25}
      />
    </div>
  );
}
