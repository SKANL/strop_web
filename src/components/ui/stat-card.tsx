// components/ui/stat-card.tsx - Tarjeta de estadística/KPI reutilizable
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type StatCardVariant = "default" | "primary" | "success" | "warning" | "destructive";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label?: string;
  };
  variant?: StatCardVariant;
  tooltip?: string;
  className?: string;
  animated?: boolean;
  compact?: boolean;
}

const variantStyles: Record<StatCardVariant, { card: string; icon: string; badge: string }> = {
  default: {
    card: "bg-white border-gray-200/60",
    icon: "bg-gray-100 text-gray-600",
    badge: "bg-gray-100 text-gray-700",
  },
  primary: {
    card: "bg-blue-50/80 border-blue-200/60",
    icon: "bg-blue-100 text-blue-600",
    badge: "bg-blue-100 text-blue-700",
  },
  success: {
    card: "bg-emerald-50/80 border-emerald-200/60",
    icon: "bg-emerald-100 text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
  },
  warning: {
    card: "bg-amber-50/80 border-amber-200/60",
    icon: "bg-amber-100 text-amber-600",
    badge: "bg-amber-100 text-amber-700",
  },
  destructive: {
    card: "bg-red-50/80 border-red-200/60",
    icon: "bg-red-100 text-red-600",
    badge: "bg-red-100 text-red-700",
  },
};

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  tooltip,
  className,
  animated = true,
  compact = false,
}: StatCardProps) {
  const styles = variantStyles[variant];
  const isPositive = trend ? trend.value >= 0 : undefined;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  const CardWrapper = animated ? motion.div : "div";
  const cardMotionProps = animated
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
      }
    : {};

  const content = (
    <CardWrapper {...cardMotionProps}>
      <Card
        className={cn(
          styles.card,
          "rounded-2xl shadow-sm hover:shadow-md transition-shadow",
          compact ? "py-3" : "py-4",
          tooltip && "cursor-help",
          className
        )}
      >
        <CardContent className={cn("flex items-center gap-4", compact ? "p-3" : "p-4", "pt-0 pb-0")}>
          {Icon && (
            <div
              className={cn(
                styles.icon,
                "rounded-xl flex items-center justify-center shrink-0",
                compact ? "w-10 h-10" : "w-12 h-12"
              )}
            >
              <Icon className={compact ? "h-5 w-5" : "h-6 w-6"} />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  "font-bold text-gray-900 truncate",
                  compact ? "text-xl" : "text-2xl"
                )}
              >
                {value}
              </span>

              {trend && (
                <Badge
                  variant="secondary"
                  className={cn(
                    "shrink-0 gap-0.5 border-0",
                    compact ? "text-[10px] px-1.5 h-5" : "text-xs px-2 h-6",
                    isPositive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-600"
                  )}
                >
                  <TrendIcon className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
                  {isPositive && "+"}
                  {trend.value}%
                </Badge>
              )}
            </div>

            <p className={cn("text-gray-500 truncate", compact ? "text-xs" : "text-sm")}>
              {title}
            </p>

            {subtitle && (
              <p className="text-xs text-gray-400 mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}

// Grid de stats para dashboards
interface StatCardGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

function StatCardGrid({ children, columns = 4, className }: StatCardGridProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {children}
    </div>
  );
}

export { StatCard, StatCardGrid };
export type { StatCardProps, StatCardVariant };
