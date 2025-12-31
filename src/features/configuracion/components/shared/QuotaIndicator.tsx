// QuotaIndicator.tsx - Indicador visual de uso de cuota
"use client";

import { motion } from "motion/react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface QuotaIndicatorProps {
  label: string;
  used: number;
  total: number;
  unit?: string;
  className?: string;
}

export function QuotaIndicator({
  label,
  used,
  total,
  unit = "",
  className,
}: QuotaIndicatorProps) {
  const percentage = total > 0 ? Math.round((used / total) * 100) : 0;
  
  // Determinar color según porcentaje
  const getColorClass = () => {
    if (percentage >= 90) return "bg-destructive";
    if (percentage >= 75) return "bg-amber-500";
    return "bg-primary";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {used.toLocaleString()}{unit && ` ${unit}`} / {total.toLocaleString()}{unit && ` ${unit}`}
          <span className="text-muted-foreground ml-1">({percentage}%)</span>
        </span>
      </div>
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ originX: 0 }}
      >
        <Progress
          value={percentage}
          className="h-2"
          indicatorClassName={getColorClass()}
        />
      </motion.div>
    </div>
  );
}
