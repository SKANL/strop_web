// components/ui/empty-state.tsx - Estado vacío reutilizable
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  icon?: LucideIcon;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  iconClassName?: string;
  iconContainerClassName?: string;
  className?: string;
  animated?: boolean;
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  iconClassName,
  iconContainerClassName,
  className,
  animated = true,
}: EmptyStateProps) {
  const content = (
    <>
      <div
        className={cn(
          "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4",
          iconContainerClassName
        )}
      >
        <Icon className={cn("h-8 w-8 text-muted-foreground", iconClassName)} />
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>

      {description && (
        <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="flex items-center gap-3 mt-2">
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant || "outline"}
              onClick={secondaryAction.onClick}
              className="rounded-xl gap-2"
            >
              {secondaryAction.icon && (
                <secondaryAction.icon className="h-4 w-4" />
              )}
              {secondaryAction.label}
            </Button>
          )}
          {action && (
            <Button
              variant={action.variant || "default"}
              onClick={action.onClick}
              className="rounded-xl gap-2"
            >
              {action.icon && <action.icon className="h-4 w-4" />}
              {action.label}
            </Button>
          )}
        </div>
      )}
    </>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={cn(
          "flex flex-col items-center justify-center py-12 px-4",
          className
        )}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4",
        className
      )}
    >
      {content}
    </div>
  );
}

// Variantes pre-configuradas para casos comunes
interface SearchEmptyStateProps {
  onClearFilters?: () => void;
  message?: string;
  className?: string;
}

function SearchEmptyState({
  onClearFilters,
  message = "No se encontraron resultados",
  className,
}: SearchEmptyStateProps) {
  const SearchIcon = require("lucide-react").Search as LucideIcon;
  const RefreshCwIcon = require("lucide-react").RefreshCw as LucideIcon;

  return (
    <EmptyState
      icon={SearchIcon}
      title={message}
      description="Intenta modificar los filtros de búsqueda"
      secondaryAction={
        onClearFilters
          ? {
              label: "Limpiar filtros",
              onClick: onClearFilters,
              icon: RefreshCwIcon,
              variant: "outline",
            }
          : undefined
      }
      className={className}
    />
  );
}

interface CreateEmptyStateProps {
  resourceName: string;
  onCreate: () => void;
  description?: string;
  className?: string;
}

function CreateEmptyState({
  resourceName,
  onCreate,
  description,
  className,
}: CreateEmptyStateProps) {
  const FolderOpenIcon = require("lucide-react").FolderOpen as LucideIcon;
  const PlusIcon = require("lucide-react").Plus as LucideIcon;

  return (
    <EmptyState
      icon={FolderOpenIcon}
      title={`Crea tu primer ${resourceName}`}
      description={
        description || `Aún no tienes ningún ${resourceName}. Comienza creando uno.`
      }
      iconContainerClassName="bg-primary shadow-xl shadow-primary/30"
      iconClassName="text-primary-foreground"
      action={{
        label: `Crear ${resourceName}`,
        onClick: onCreate,
        icon: PlusIcon,
      }}
      className={className}
    />
  );
}

export { EmptyState, SearchEmptyState, CreateEmptyState };
export type { EmptyStateProps, EmptyStateAction };
