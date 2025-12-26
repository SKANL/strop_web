// KPIGrid.tsx - Grid de tarjetas KPI compactas para el Dashboard
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <KPICard
        title="Proyectos"
        value={data.activeProjects}
        icon={FolderKanban}
        variant="primary"
        delay={0}
        tooltip={`${data.activeProjects} activos de ${data.totalProjects} totales`}
      />
      <KPICard
        title="Abiertas"
        value={data.openIncidents}
        icon={AlertTriangle}
        variant="warning"
        trend={{ value: 12, isPositive: false }}
        delay={0.05}
        tooltip={`${data.openIncidents} incidencias abiertas de ${data.totalIncidents} totales`}
      />
      <KPICard
        title="Críticas"
        value={data.criticalIncidents}
        icon={AlertOctagon}
        variant="destructive"
        delay={0.1}
        tooltip="Incidencias críticas que requieren atención inmediata"
      />
      <KPICard
        title="Resueltas"
        value={data.resolvedThisWeek}
        icon={CheckCircle}
        trend={{ value: 8, isPositive: true }}
        delay={0.15}
        tooltip="Incidencias resueltas en los últimos 7 días"
      />
      <KPICard
        title="Tiempo Res."
        value={data.avgResolutionTime}
        icon={Clock}
        delay={0.2}
        tooltip="Tiempo promedio de resolución de incidencias"
      />
      <KPICard
        title="Usuarios"
        value={data.totalUsers}
        icon={Users}
        delay={0.25}
        tooltip="Usuarios activos en la organización"
      />
    </div>
  );
}
