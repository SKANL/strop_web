/**
 * Stats cards for Bitácora Operativa dashboard
 * Reuses StatCardGrid pattern from existing components
 */

"use client";

import { Activity, AlertTriangle, Clock, Link } from "lucide-react";
import { StatCard, StatCardGrid } from "@/components/shared/stat-card";
import { getBitacoraStats } from "@/lib/mock/operational-logs";

interface BitacoraStatsProps {
  projectId?: string;
}

export function BitacoraStats({ projectId }: BitacoraStatsProps) {
  const stats = getBitacoraStats(projectId);

  return (
    <StatCardGrid columns={4}>
      <StatCard
        title="Eventos Hoy"
        value={stats.eventsToday}
        icon={Activity}
        variant="primary"
        tooltip="Eventos registrados en el día actual"
      />
      <StatCard
        title="Alertas Activas"
        value={stats.alerts}
        icon={AlertTriangle}
        variant="warning"
        tooltip="Eventos de seguridad y bloqueos"
      />
      <StatCard
        title="Pendientes Firma"
        value={stats.pendingSignature}
        icon={Clock}
        variant="default"
        tooltip="Eventos publicados sin cierre diario"
      />
      <StatCard
        title="Cadena Íntegra"
        value={stats.chainIntegrity ? "✓" : "✗"}
        icon={Link}
        variant={stats.chainIntegrity ? "success" : "destructive"}
        tooltip={
          stats.chainIntegrity
            ? "Todos los hashes verificados correctamente"
            : "Se detectaron inconsistencias en la cadena"
        }
      />
    </StatCardGrid>
  );
}
