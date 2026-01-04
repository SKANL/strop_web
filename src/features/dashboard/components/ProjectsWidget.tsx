// islands/ProjectsWidget.tsx - Widget de proyectos (movido a island)
"use client";

import { motion } from "motion/react";
import { FolderKanban, ChevronRight, Users, AlertTriangle } from "lucide-react";
import type { ProjectUI } from "@/lib/mock";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ProjectsWidgetProps {
  projects: ProjectUI[];
  maxItems?: number;
}

export function ProjectsWidget({ projects, maxItems = 5 }: ProjectsWidgetProps) {
  const displayProjects = projects.slice(0, maxItems);

  const getStatusVariant = (status: ProjectUI["status"]) => {
    switch (status) {
      case "ACTIVE":
        return "bg-success/10 text-success border-success/20";
      case "PAUSED":
        return "bg-muted text-muted-foreground border-border";
      case "COMPLETED":
        return "bg-info/10 text-info border-info/20";
    }
  };

  return (
    <Card className="rounded-3xl border-border/60 shadow-sm py-0 gap-0">
      <CardHeader className="p-4 pb-3 border-b-0">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10">
            <FolderKanban className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-sm font-semibold text-foreground">Proyectos</CardTitle>
        </div>
        <CardAction>
          <a href="/dashboard/proyectos" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5">
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
                className="block p-3 rounded-xl border border-border hover:border-border hover:bg-muted/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h4 className="font-medium text-sm text-foreground group-hover:text-primary truncate max-w-48 cursor-default">
                        {project.name}
                      </h4>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">{project.name}</p>
                      <p className="text-xs text-muted-foreground">{project.location}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Badge variant="outline" size="sm" className={`font-medium ${getStatusVariant(project.status)}`}>
                    {project.status === "ACTIVE" ? "Activo" : project.status === "PAUSED" ? "Pausado" : "Fin"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Progress 
                    value={project.progress} 
                    className="h-1 flex-1 bg-muted [&>div]:bg-primary"
                  />
                  <span className="text-xs font-semibold text-foreground w-8 text-right">{project.progress}%</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-0.5"><Users className="h-2.5 w-2.5" /> {project.membersCount}</span>
                  <span className="flex items-center gap-0.5"><AlertTriangle className="h-2.5 w-2.5" /> {project.openIncidents}</span>
                  {project.criticalIncidents > 0 && (
                    <span className="flex items-center gap-0.5 text-destructive">
                      <span className="h-1 w-1 rounded-full bg-destructive animate-pulse" />
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
