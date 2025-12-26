// ProjectsWidget.tsx - Widget de proyectos recientes para el Dashboard
import { motion } from "framer-motion";
import { FolderKanban, MapPin, Users, AlertTriangle, ChevronRight } from "lucide-react";
import type { Project } from "@/lib/mock-dashboard";
import { projectStatusLabels } from "@/lib/mock-dashboard";

interface ProjectsWidgetProps {
  projects: Project[];
  maxItems?: number;
}

export function ProjectsWidget({ projects, maxItems = 5 }: ProjectsWidgetProps) {
  const displayProjects = projects.slice(0, maxItems);

  const getStatusStyles = (status: Project["status"]) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "PAUSED":
        return "bg-gray-100 text-gray-600";
      case "COMPLETED":
        return "bg-blue-100 text-blue-700";
    }
  };

  const getProgressColor = (progress: number, criticalIncidents: number) => {
    if (criticalIncidents > 0) return "bg-red-500";
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    return "bg-amber-500";
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100">
            <FolderKanban className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Proyectos</h3>
        </div>
        <a 
          href="/dashboard/proyectos"
          className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          Ver todos
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 space-y-3 max-h-100 overflow-y-auto">
        {displayProjects.map((project, index) => (
          <motion.a
            key={project.id}
            href={`/dashboard/proyectos/${project.id}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="block p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-1">
                <h4 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                  {project.name}
                </h4>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate max-w-45">{project.location}</span>
                </div>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getStatusStyles(project.status)}`}>
                {projectStatusLabels[project.status]}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Avance</span>
                <span className="font-semibold text-gray-900">{project.progress}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${getProgressColor(project.progress, project.criticalIncidents)}`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{project.membersCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                <span>{project.openIncidents} abiertas</span>
              </div>
              {project.criticalIncidents > 0 && (
                <div className="flex items-center gap-1 text-red-500">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span>{project.criticalIncidents} críticas</span>
                </div>
              )}
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
