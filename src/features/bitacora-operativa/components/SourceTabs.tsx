/**
 * Source Tabs for filtering events by origin
 * Implements the "Centro de Verdad Única" concept from design docs
 * 
 * Sources:
 * - SYSTEM: Automated audit logs (login, CRUD, exports)
 * - INCIDENT: Events from incident management module
 * - MANUAL: Superintendent's manual entries
 * - MOBILE: Future mobile app events (check-in/out, field reports)
 */

"use client";

import { motion } from "motion/react";
import { Lock, AlertTriangle, Pencil, Smartphone, LayoutGrid } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type EventSource = "ALL" | "SYSTEM" | "INCIDENT" | "MANUAL" | "MOBILE";

interface SourceTabsProps {
  activeSource: EventSource;
  onSourceChange: (source: EventSource) => void;
  counts: Record<EventSource, number>;
  className?: string;
}

const sourceConfig: Record<
  EventSource,
  { label: string; icon: React.ElementType; color: string }
> = {
  ALL: {
    label: "Todo",
    icon: LayoutGrid,
    color: "text-foreground",
  },
  SYSTEM: {
    label: "Sistema",
    icon: Lock,
    color: "text-muted-foreground",
  },
  INCIDENT: {
    label: "Incidencias",
    icon: AlertTriangle,
    color: "text-warning",
  },
  MANUAL: {
    label: "Manual",
    icon: Pencil,
    color: "text-primary",
  },
  MOBILE: {
    label: "Móvil",
    icon: Smartphone,
    color: "text-success",
  },
};

export function SourceTabs({
  activeSource,
  onSourceChange,
  counts,
  className,
}: SourceTabsProps) {
  return (
    <Tabs
      value={activeSource}
      onValueChange={(value) => onSourceChange(value as EventSource)}
      className={className}
    >
      <TabsList className="h-auto p-1 bg-muted/50">
        {(Object.keys(sourceConfig) as EventSource[]).map((source) => {
          const config = sourceConfig[source];
          const Icon = config.icon;
          const count = counts[source];
          const isActive = activeSource === source;

          return (
            <TabsTrigger
              key={source}
              value={source}
              className={cn(
                "relative gap-1.5 px-3 py-2 data-[state=active]:shadow-sm",
                "transition-all duration-200"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive && config.color)} />
              <span className="hidden sm:inline">{config.label}</span>
              {count > 0 && (
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className={cn(
                    "ml-1 h-5 min-w-[20px] px-1.5 text-xs",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                >
                  {count}
                </Badge>
              )}
              {/* Animated underline indicator */}
              {isActive && (
                <motion.div
                  layoutId="source-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
