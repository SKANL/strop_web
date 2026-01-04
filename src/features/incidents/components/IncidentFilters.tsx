/**
 * Filtros avanzados para lista de incidencias
 * Con búsqueda, multi-select y badges de filtros activos
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Filter, 
  X, 
  AlertTriangle,
  Circle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { 
  type IncidentWithDetails,
  type IncidentStatus,
  type IncidentPriority,
  type IncidentType,
  incidentTypeLabels,
  statusLabels,
  priorityLabels
} from "@/lib/mock/types";

export interface FilterState {
  status: IncidentStatus[];
  priority: IncidentPriority[];
  type: IncidentType[];
  project: string[];
  search: string;
}

interface IncidentFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  incidents: IncidentWithDetails[];
}

const statusIcons: Record<IncidentStatus, React.ReactNode> = {
  OPEN: <Circle className="size-3 text-warning" />,
  ASSIGNED: <Clock className="size-3 text-info" />,
  CLOSED: <CheckCircle2 className="size-3 text-success" />,
};

const tagVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      duration: 0.3,
      bounce: 0.4,
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

export function IncidentFilters({ 
  filters, 
  onFiltersChange,
  incidents 
}: IncidentFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Get unique projects from incidents
  const projects = Array.from(
    new Map(incidents.map((i) => [i.projectId, { id: i.projectId, name: i.projectName }])).values()
  );

  const toggleStatus = (status: IncidentStatus) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    onFiltersChange({ ...filters, status: newStatus });
  };

  const togglePriority = (priority: IncidentPriority) => {
    const newPriority = filters.priority.includes(priority)
      ? filters.priority.filter((p) => p !== priority)
      : [...filters.priority, priority];
    onFiltersChange({ ...filters, priority: newPriority });
  };

  const toggleType = (type: IncidentType) => {
    const newType = filters.type.includes(type)
      ? filters.type.filter((t) => t !== type)
      : [...filters.type, type];
    onFiltersChange({ ...filters, type: newType });
  };

  const toggleProject = (projectId: string) => {
    const newProject = filters.project.includes(projectId)
      ? filters.project.filter((p) => p !== projectId)
      : [...filters.project, projectId];
    onFiltersChange({ ...filters, project: newProject });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: [],
      priority: [],
      type: [],
      project: [],
      search: "",
    });
  };

  const activeFilterCount =
    filters.status.length +
    filters.priority.length +
    filters.type.length +
    filters.project.length;

  return (
    <div className="space-y-3">
      {/* Search and Filter Button */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar incidencias..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              Filtros
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 size-5 p-0 justify-center">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filtros</h4>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-auto p-1 text-xs"
                  >
                    Limpiar todo
                  </Button>
                )}
              </div>

              <Separator />

              {/* Status */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Estado</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["OPEN", "ASSIGNED", "CLOSED"] as IncidentStatus[]).map((status) => (
                    <div key={status} className="flex items-center gap-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={filters.status.includes(status)}
                        onCheckedChange={() => toggleStatus(status)}
                      />
                      <Label
                        htmlFor={`status-${status}`}
                        className="flex items-center gap-1 text-xs cursor-pointer"
                      >
                        {statusIcons[status]}
                        {statusLabels[status]}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Priority */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Prioridad</Label>
                <div className="flex gap-3">
                  {(["NORMAL", "CRITICAL"] as IncidentPriority[]).map((priority) => (
                    <div key={priority} className="flex items-center gap-2">
                      <Checkbox
                        id={`priority-${priority}`}
                        checked={filters.priority.includes(priority)}
                        onCheckedChange={() => togglePriority(priority)}
                      />
                      <Label
                        htmlFor={`priority-${priority}`}
                        className="flex items-center gap-1 text-xs cursor-pointer"
                      >
                        {priority === "CRITICAL" && (
                          <AlertTriangle className="size-3 text-destructive" />
                        )}
                        {priorityLabels[priority]}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Type */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Tipo</Label>
                <div className="space-y-2">
                  {(Object.keys(incidentTypeLabels) as IncidentType[]).map((type) => (
                    <div key={type} className="flex items-center gap-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={filters.type.includes(type)}
                        onCheckedChange={() => toggleType(type)}
                      />
                      <Label
                        htmlFor={`type-${type}`}
                        className="text-xs cursor-pointer"
                      >
                        {incidentTypeLabels[type]}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {projects.length > 1 && (
                <>
                  <Separator />

                  {/* Projects */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">Proyecto</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {projects.map((project) => (
                        <div key={project.id} className="flex items-center gap-2">
                          <Checkbox
                            id={`project-${project.id}`}
                            checked={filters.project.includes(project.id)}
                            onCheckedChange={() => toggleProject(project.id)}
                          />
                          <Label
                            htmlFor={`project-${project.id}`}
                            className="text-xs cursor-pointer truncate"
                          >
                            {project.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filter Tags */}
      <AnimatePresence>
        {activeFilterCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {filters.status.map((status) => (
              <motion.div key={`tag-status-${status}`} variants={tagVariants} initial="hidden" animate="visible" exit="exit">
                <Badge
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-secondary/80"
                  onClick={() => toggleStatus(status)}
                >
                  {statusIcons[status]}
                  {statusLabels[status]}
                  <X className="size-3" />
                </Badge>
              </motion.div>
            ))}
            {filters.priority.map((priority) => (
              <motion.div key={`tag-priority-${priority}`} variants={tagVariants} initial="hidden" animate="visible" exit="exit">
                <Badge
                  variant={priority === "CRITICAL" ? "destructive" : "secondary"}
                  className="gap-1 cursor-pointer"
                  onClick={() => togglePriority(priority)}
                >
                  {priorityLabels[priority]}
                  <X className="size-3" />
                </Badge>
              </motion.div>
            ))}
            {filters.type.map((type) => (
              <motion.div key={`tag-type-${type}`} variants={tagVariants} initial="hidden" animate="visible" exit="exit">
                <Badge
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-secondary/80"
                  onClick={() => toggleType(type)}
                >
                  {incidentTypeLabels[type]}
                  <X className="size-3" />
                </Badge>
              </motion.div>
            ))}
            {filters.project.map((projectId) => {
              const project = projects.find((p) => p.id === projectId);
              return (
                <motion.div key={`tag-project-${projectId}`} variants={tagVariants} initial="hidden" animate="visible" exit="exit">
                  <Badge
                    variant="outline"
                    className="gap-1 cursor-pointer hover:bg-accent"
                    onClick={() => toggleProject(projectId)}
                  >
                    {project?.name || projectId}
                    <X className="size-3" />
                  </Badge>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
