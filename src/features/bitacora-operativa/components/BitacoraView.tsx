/**
 * Test with all components: Stats, Filters, Timeline, Composer, and DetailSheet
 */

"use client";

import { motion } from "motion/react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BitacoraStats } from "./BitacoraStats";
import { BitacoraFilters } from "./BitacoraFilters";
import { DailyTimeline } from "./DailyTimeline";
import { OfficialComposer } from "./OfficialComposer";
import { LogDetailSheet } from "./LogDetailSheet";
import { mockOperationalLogs } from "@/lib/mock/operational-logs";

export function BitacoraView() {
  return (
    <TooltipProvider>
      <div className="p-6 flex">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 rounded-xl bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Diario de Obra</h1>
              <p className="text-sm text-muted-foreground">
                Test completo - Todos los componentes
              </p>
            </div>
          </motion.div>
          <div className="mt-4">
            <BitacoraStats />
          </div>
          <div className="mt-4">
            <BitacoraFilters />
          </div>
          <div className="mt-4 h-[400px]">
            <DailyTimeline logs={mockOperationalLogs} />
          </div>
        </div>
        <div className="w-80 shrink-0 h-screen">
          <OfficialComposer />
        </div>
        <LogDetailSheet />
      </div>
    </TooltipProvider>
  );
}
