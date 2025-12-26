// ProjectsWidget.tsx - Widget de proyectos minimalista con shadcn
import { motion } from "framer-motion";
import { FolderKanban, ChevronRight, Users, AlertTriangle } from "lucide-react";
import type { Project } from "@/lib/mock-dashboard";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ProjectsWidgetProps {
  projects: Project[];
  maxItems?: number;
}

export function ProjectsWidget({ projects, maxItems = 5 }: ProjectsWidgetProps) {
  const displayProjects = projects.slice(0, maxItems);

  const getStatusVariant = (status: Project["status"]) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700 border-green-200";
      case "PAUSED":
        return "bg-gray-100 text-gray-600 border-gray-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  // Progreso siempre usa el mismo color para simplicidad visual
  const getProgressColor = () => "[&>div]:bg-blue-500";

  return (
    <Card className="rounded-3xl border-gray-200/60 shadow-sm py-0 gap-0">
      <CardHeader className="p-4 pb-3 border-b-0">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-100">
            <FolderKanban className="h-4 w-4 text-blue-600" />
          </div>
          <CardTitle className="text-sm font-semibold text-gray-700">Proyectos</CardTitle>
        </div>
        <CardAction>
          <a href="/dashboard/proyectos" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-0.5">
            Ver todos <ChevronRight className="h-3 w-3" />
          </a>
        </CardAction>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0">
        <ScrollArea className="h-100 pr-2">
          <div className="space-y-2">
            {displayProjects.map((project, index) => (
              <motion.a
                key={project.id}
                href={`/dashboard/proyectos/${project.id}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="block p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h4 className="font-medium text-sm text-gray-900 group-hover:text-blue-600 truncate max-w-48 cursor-default">
                        {project.name}
                      </h4>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">{project.name}</p>
                      <p className="text-[10px] text-gray-400">{project.location}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Badge variant="outline" className={`text-[9px] font-medium px-1.5 py-0 h-4 ${getStatusVariant(project.status)}`}>
                    {project.status === "ACTIVE" ? "Activo" : project.status === "PAUSED" ? "Pausado" : "Fin"}
                  </Badge>
                </div>

                {/* Progress compacto */}
                <div className="flex items-center gap-2 mb-2">
                  <Progress 
                    value={project.progress} 
                    className={`h-1 flex-1 bg-gray-100 ${getProgressColor()}`}
                  />
                  <span className="text-[10px] font-semibold text-gray-700 w-8 text-right">{project.progress}%</span>
                </div>

                {/* Stats en línea */}
                <div className="flex items-center gap-3 text-[10px] text-gray-400">
                  <span className="flex items-center gap-0.5"><Users className="h-2.5 w-2.5" /> {project.membersCount}</span>
                  <span className="flex items-center gap-0.5"><AlertTriangle className="h-2.5 w-2.5" /> {project.openIncidents}</span>
                  {project.criticalIncidents > 0 && (
                    <span className="flex items-center gap-0.5 text-red-500">
                      <span className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
                      {project.criticalIncidents}
                    </span>
                  )}
                </div>
              </motion.a>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
