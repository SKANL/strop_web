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
          <TabsList className="bg-gray-100/50 p-1 rounded-xl">
            <TabsTrigger
              value="ALL"
              className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <span>Todos</span>
              <Badge variant="secondary" className="ml-2 text-xs">
                {counts.total}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="ACTIVE"
              className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <span>Activos</span>
              <Badge
                variant="secondary"
                className="ml-2 text-xs bg-emerald-100 text-emerald-700"
              >
                {counts.active}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="INACTIVE"
              className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <span>Inactivos</span>
              <Badge variant="secondary" className="ml-2 text-xs bg-gray-200">
                {counts.inactive}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-xl">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className={cn(
              "h-8 w-8 rounded-lg",
              viewMode === "grid" && "bg-white shadow-sm"
            )}
            onClick={() => onViewModeChange("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className={cn(
              "h-8 w-8 rounded-lg",
              viewMode === "list" && "bg-white shadow-sm"
            )}
            onClick={() => onViewModeChange("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search and Role Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
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
          <SelectTrigger className="w-[180px] h-11 rounded-xl bg-gray-50/50 border-gray-200">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
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
            className="text-gray-500 hover:text-gray-700"
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
          className="flex items-center gap-2 text-sm text-gray-500"
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
