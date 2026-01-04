/**
 * Header component for Bitácora Operativa
 * Displays title and global actions
 */

"use client";

import { motion } from "motion/react";
import { BookOpen, Plus, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface BitacoraHeaderProps {
  chainIntegrity?: boolean;
  className?: string;
}

export function BitacoraHeader({
  chainIntegrity = true,
  className,
}: BitacoraHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("space-y-2", className)}
    >
      {/* Title Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Diario de Obra
            </h1>
            {/* Chain Integrity Badge */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant={chainIntegrity ? "default" : "destructive"}
                  className={cn(
                    "gap-1",
                    chainIntegrity
                      ? "bg-success/20 text-success hover:bg-success/30"
                      : "bg-destructive/20 text-destructive hover:bg-destructive/30"
                  )}
                >
                  {chainIntegrity ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <AlertCircle className="h-3 w-3" />
                  )}
                  {chainIntegrity ? "Cadena Íntegra" : "Cadena Comprometida"}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {chainIntegrity
                  ? "Todos los hashes verificados correctamente"
                  : "Se detectaron inconsistencias en la cadena de hashes"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            Nuevo Evento
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
