/**
 * User filters component
 * Provides search, role filter, and status filter controls
 */
"use client";

import { motion } from "motion/react";
import { Search, Filter, X, LayoutGrid, List, Users2 } from "lucide-react";
import type { UserRole } from "@/lib/mock/types";
import { roleLabels } from "@/lib/mock/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ViewMode = "grid" | "list";

interface UserFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  roleFilter: UserRole | "ALL";
  onRoleChange: (role: UserRole | "ALL") => void;
  statusFilter: "ACTIVE" | "INACTIVE" | "ALL";
  onStatusChange: (status: "ACTIVE" | "INACTIVE" | "ALL") => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalUsers: number;
  filteredCount: number;
  counts: {
    total: number;
    active: number;
    inactive: number;
  };
}

export function UserFilters({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleChange,
  statusFilter,
  onStatusChange,
  viewMode,
  onViewModeChange,
  totalUsers,
  filteredCount,
  counts,
}: UserFiltersProps) {
  const hasFilters = searchQuery || roleFilter !== "ALL" || statusFilter !== "ALL";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="space-y-4"
    >
      {/* Status Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Tabs
          value={statusFilter}
          onValueChange={(v) => onStatusChange(v as "ACTIVE" | "INACTIVE" | "ALL")}
        >
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger
              value="ALL"
              className="rounded-lg px-4 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <span>Todos</span>
              <Badge variant="secondary" className="ml-2 text-xs">
                {counts.total}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="ACTIVE"
              className="rounded-lg px-4 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <span>Activos</span>
              <Badge
                variant="secondary"
                className="ml-2 text-xs bg-success/10 text-success"
              >
                {counts.active}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="INACTIVE"
              className="rounded-lg px-4 data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <span>Inactivos</span>
              <Badge variant="secondary" className="ml-2 text-xs bg-muted">
                {counts.inactive}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* View Mode Toggle */}
        <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && onViewModeChange(v as ViewMode)}>
          <ToggleGroupItem value="grid" aria-label="Vista de cuadrícula">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="Vista de lista">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Search and Role Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-muted/50 border-border focus:bg-card transition-colors h-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => onSearchChange("")}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Role Filter */}
        <Select value={roleFilter} onValueChange={(v) => onRoleChange(v as UserRole | "ALL")}>
          <SelectTrigger size="lg" className="w-[180px] rounded-xl bg-muted/50 border-border">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filtrar por rol" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los roles</SelectItem>
            <SelectItem value="OWNER">
              <span className="flex items-center gap-2">
                <span>👑</span> {roleLabels.OWNER}
              </span>
            </SelectItem>
            <SelectItem value="SUPERINTENDENT">
              <span className="flex items-center gap-2">
                <span>🏗️</span> {roleLabels.SUPERINTENDENT}
              </span>
            </SelectItem>
            <SelectItem value="RESIDENT">
              <span className="flex items-center gap-2">
                <span>📋</span> {roleLabels.RESIDENT}
              </span>
            </SelectItem>
            <SelectItem value="CABO">
              <span className="flex items-center gap-2">
                <span>🔧</span> {roleLabels.CABO}
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => {
              onSearchChange("");
              onRoleChange("ALL");
              onStatusChange("ALL");
            }}
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Results Count */}
      {hasFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Users2 className="h-4 w-4" />
          <span>
            Mostrando {filteredCount} de {totalUsers} usuarios
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
