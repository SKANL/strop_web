/**
 * Filter bar for Bitácora Operativa
 * Based on IncidentFilters pattern with AnimatePresence badges
 */

"use client";

import { useState } from "react";
import { useStore } from "@nanostores/react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Filter, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  $filters,
  updateFilters,
  clearFilters,
  toggleCategoryFilter,
  toggleStatusFilter,
} from "../stores/bitacoraStore";
import {
  type LogCategory,
  type LogStatus,
  categoryLabels,
  categoryColors,
  statusLabels,
} from "../types";

const badgeVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring" as const, duration: 0.3, bounce: 0.4 },
  },
  exit: { scale: 0, opacity: 0, transition: { duration: 0.15 } },
};

const allCategories: LogCategory[] = [
  "AVANCE",
  "MATERIAL",
  "HSE",
  "CLIMA",
  "BLOQUEO",
  "ADMINISTRATIVA",
];

const allStatuses: LogStatus[] = ["DRAFT", "PUBLISHED", "LOCKED"];

export function BitacoraFilters() {
  const filters = useStore($filters);
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount =
    filters.category.length +
    filters.status.length +
    (filters.dateRange ? 1 : 0) +
    (filters.search ? 1 : 0);

  return (
    <div className="space-y-3">
      {/* Main filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar eventos..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="pl-9"
          />
        </div>

        {/* Category filter */}
        <Select
          value={filters.category[0] || "all"}
          onValueChange={(val) => {
            if (val === "all") {
              updateFilters({ category: [] });
            } else {
              toggleCategoryFilter(val as LogCategory);
            }
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {allCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {categoryLabels[cat]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select
          value={filters.status[0] || "all"}
          onValueChange={(val) => {
            if (val === "all") {
              updateFilters({ status: [] });
            } else {
              toggleStatusFilter(val as LogStatus);
            }
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {allStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {statusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date range - simplified */}
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          {filters.dateRange
            ? `${filters.dateRange.from} - ${filters.dateRange.to}`
            : "Fecha"}
        </Button>

        {/* Clear filters */}
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Limpiar ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Active filter badges */}
      <AnimatePresence>
        {(filters.category.length > 0 || filters.status.length > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {filters.category.map((cat) => (
              <motion.div
                key={cat}
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Badge
                  variant="outline"
                  className={cn("cursor-pointer gap-1", categoryColors[cat])}
                  onClick={() => toggleCategoryFilter(cat)}
                >
                  {categoryLabels[cat]}
                  <X className="h-3 w-3" />
                </Badge>
              </motion.div>
            ))}
            {filters.status.map((status) => (
              <motion.div
                key={status}
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Badge
                  variant="secondary"
                  className="cursor-pointer gap-1"
                  onClick={() => toggleStatusFilter(status)}
                >
                  {statusLabels[status]}
                  <X className="h-3 w-3" />
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
