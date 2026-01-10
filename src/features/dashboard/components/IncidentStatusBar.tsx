// IncidentStatusBar.tsx - Barra horizontal de estados clickable
"use client";

import { motion } from "motion/react";
import { AlertCircle, Clock, UserCheck, CheckCircle2 } from "lucide-react";

interface StatusCount {
  critical: number;
  open: number;
  assigned: number;
  closed: number;
}

interface IncidentStatusBarProps {
  counts: StatusCount;
  activeFilter?: keyof StatusCount | null;
  onFilterChange?: (filter: keyof StatusCount | null) => void;
}

const statusConfig = [
  { 
    key: "critical" as const, 
    label: "Críticas", 
    icon: AlertCircle, 
    activeClass: "bg-destructive/10 text-destructive border-destructive/30",
    dotClass: "bg-destructive"
  },
  { 
    key: "open" as const, 
    label: "Abiertas", 
    icon: Clock, 
    activeClass: "bg-warning/10 text-warning border-warning/30",
    dotClass: "bg-warning"
  },
  { 
    key: "assigned" as const, 
    label: "Asignadas", 
    icon: UserCheck, 
    activeClass: "bg-info/10 text-info border-info/30",
    dotClass: "bg-info"
  },
  { 
    key: "closed" as const, 
    label: "Cerradas", 
    icon: CheckCircle2, 
    activeClass: "bg-success/10 text-success border-success/30",
    dotClass: "bg-success"
  },
];

export function IncidentStatusBar({ 
  counts, 
  activeFilter = null,
  onFilterChange 
}: IncidentStatusBarProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex items-center justify-center gap-1 md:gap-2 flex-wrap"
    >
      {statusConfig.map((status, index) => {
        const Icon = status.icon;
        const count = counts[status.key];
        const isActive = activeFilter === status.key;
        
        return (
          <motion.button
            key={status.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            onClick={() => onFilterChange?.(isActive ? null : status.key)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
              border transition-all duration-200 cursor-pointer
              ${isActive 
                ? status.activeClass 
                : "border-border text-muted-foreground hover:border-border hover:bg-muted/50"
              }
            `}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${status.dotClass}`} />
            <span>{status.label}</span>
            <span className="font-bold">{count}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
