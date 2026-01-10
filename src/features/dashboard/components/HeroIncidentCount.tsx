// HeroIncidentCount.tsx - Número grande de incidencias críticas con glow
"use client";

import { motion } from "motion/react";
import { AlertTriangle } from "lucide-react";

interface HeroIncidentCountProps {
  criticalCount: number;
  label?: string;
}

export function HeroIncidentCount({ 
  criticalCount, 
  label = "Incidencias Críticas" 
}: HeroIncidentCountProps) {
  const hasUrgent = criticalCount > 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center justify-center py-8 md:py-12"
    >
      {/* Hero Number */}
      <div className="relative">
        {/* Glow effect for critical incidents */}
        {hasUrgent && (
          <div className="absolute inset-0 blur-3xl bg-destructive/20 rounded-full scale-150 animate-pulse" />
        )}
        
        <motion.span 
          key={criticalCount}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className={`relative text-7xl md:text-9xl font-bold tracking-tight ${
            hasUrgent 
              ? "text-destructive" 
              : "text-muted-foreground"
          }`}
        >
          {criticalCount}
        </motion.span>
      </div>
      
      {/* Label */}
      <div className="flex items-center gap-2 mt-2">
        <AlertTriangle className={`h-4 w-4 ${hasUrgent ? "text-destructive" : "text-muted-foreground"}`} />
        <span className={`text-sm font-medium uppercase tracking-widest ${
          hasUrgent ? "text-destructive/80" : "text-muted-foreground"
        }`}>
          {label}
        </span>
      </div>
    </motion.div>
  );
}
