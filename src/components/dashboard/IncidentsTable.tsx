// IncidentsTable.tsx - Lista de incidencias recientes para el Dashboard
import { motion } from "framer-motion";
import { AlertTriangle, ChevronRight, Clock } from "lucide-react";
import type { Incident } from "@/lib/mock-dashboard";
import { incidentTypeLabels, priorityLabels, statusLabels } from "@/lib/mock-dashboard";

interface IncidentsTableProps {
  incidents: Incident[];
  maxItems?: number;
}

export function IncidentsTable({ incidents, maxItems = 6 }: IncidentsTableProps) {
  const displayIncidents = incidents.slice(0, maxItems);

  const getPriorityStyles = (priority: Incident["priority"]) => {
    return priority === "CRITICAL" 
      ? "bg-red-100 text-red-700" 
      : "bg-gray-100 text-gray-600";
  };

  const getStatusStyles = (status: Incident["status"]) => {
    switch (status) {
      case "OPEN":
        return "bg-amber-100 text-amber-700";
      case "ASSIGNED":
        return "bg-blue-100 text-blue-700";
      case "CLOSED":
        return "bg-green-100 text-green-700";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Hace menos de 1h";
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Incidencias Recientes</h3>
        </div>
        <a 
          href="/dashboard/incidencias"
          className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          Ver todas
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 space-y-2 max-h-100 overflow-y-auto">
        {displayIncidents.map((incident, index) => (
          <motion.a
            key={incident.id}
            href={`/dashboard/incidencias/${incident.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className="block p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all group"
          >
            {/* Row 1: Description + Priority */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                {incident.priority === "CRITICAL" && (
                  <span className="h-2 w-2 mt-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                )}
                <span className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {incident.description}
                </span>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${getPriorityStyles(incident.priority)}`}>
                {priorityLabels[incident.priority]}
              </span>
            </div>

            {/* Row 2: Meta info */}
            <div className="flex items-center gap-3 flex-wrap text-xs">
              <span className="text-gray-500 truncate max-w-30">
                {incident.projectName}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-400">
                {incidentTypeLabels[incident.type]}
              </span>
              <span className="text-gray-300">•</span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getStatusStyles(incident.status)}`}>
                {statusLabels[incident.status]}
              </span>
              <span className="ml-auto flex items-center gap-1 text-gray-400">
                <Clock className="h-3 w-3" />
                {formatDate(incident.createdAt)}
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
