// KPICard.tsx - Tarjeta de KPI compacta y minimalista
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "warning" | "destructive";
  delay?: number;
  tooltip?: string;
}

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = "default",
  delay = 0,
  tooltip
}: KPICardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-50/80 border-blue-200/60";
      case "warning":
        return "bg-amber-50/80 border-amber-200/60";
      case "destructive":
        return "bg-red-50/80 border-red-200/60";
      default:
        return "bg-white border-gray-200/60";
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-100 text-blue-600";
      case "warning":
        return "bg-amber-100 text-amber-600";
      case "destructive":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className={`${getVariantStyles()} rounded-2xl shadow-sm hover:shadow-md transition-shadow py-0 gap-0`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3">
            {/* Icon - más compacto */}
            <div className={`p-2.5 rounded-xl ${getIconStyles()}`}>
              <Icon className="h-4 w-4" />
            </div>
            
            {/* Contenido principal */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-gray-500 truncate">{title}</p>
                {trend && (
                  <Badge 
                    variant="outline" 
                    className={`text-[10px] font-semibold px-1.5 py-0 h-4 border-0 gap-0.5 shrink-0 ${
                      trend.isPositive 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {trend.isPositive ? (
                      <TrendingUp className="h-2.5 w-2.5" />
                    ) : (
                      <TrendingDown className="h-2.5 w-2.5" />
                    )}
                    {trend.value}%
                  </Badge>
                )}
              </div>
              <span className="text-2xl font-bold tracking-tight text-gray-900">{value}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {cardContent}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return cardContent;
}
