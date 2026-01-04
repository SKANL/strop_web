// components/ui/stat-card.tsx - Tarjeta de estadística/KPI reutilizable
"use client";

import * as React from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const statCardVariants = cva(
  "rounded-2xl shadow-sm hover:shadow-md transition-shadow",
  {
    variants: {
      variant: {
        default: "bg-card border-border",
        primary: "bg-primary/5 border-primary/20",
        success: "bg-success/5 border-success/20",
        warning: "bg-warning/5 border-warning/20",
        destructive: "bg-destructive/5 border-destructive/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const statCardIconVariants = cva(
  "rounded-xl flex items-center justify-center shrink-0",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        primary: "bg-primary/10 text-primary",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        destructive: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label?: string;
  };
  tooltip?: string;
  animated?: boolean;
  compact?: boolean;
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant,
  tooltip,
  className,
  animated = true,
  compact = false,
  ...props
}: StatCardProps) {
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
          statCardVariants({ variant }),
          compact ? "py-3" : "py-4",
          tooltip && "cursor-help",
          className
        )}
        {...props}
      >
        <CardContent className={cn("flex items-center gap-4", compact ? "p-3" : "p-4", "pt-0 pb-0")}>
          {Icon && (
            <div
              className={cn(
                statCardIconVariants({ variant }),
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
                  "font-bold text-foreground truncate",
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
                    compact ? "text-xs px-1.5 h-5" : "text-xs px-2 h-6",
                    isPositive
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  <TrendIcon className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
                  {isPositive && "+"}
                  {trend.value}%
                </Badge>
              )}
            </div>

            <p className={cn("text-muted-foreground truncate", compact ? "text-xs" : "text-sm")}>
              {title}
            </p>

            {subtitle && (
              <p className="text-xs text-muted-foreground/70 mt-0.5 truncate">{subtitle}</p>
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
