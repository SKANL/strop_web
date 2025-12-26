// KPICard.tsx - Tarjeta de KPI individual para el Dashboard
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
}

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = "default",
  delay = 0 
}: KPICardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-50 border-blue-100";
      case "warning":
        return "bg-amber-50 border-amber-100";
      case "destructive":
        return "bg-red-50 border-red-100";
      default:
        return "bg-white border-gray-100";
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`${getVariantStyles()} p-5 rounded-3xl border shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-gray-900">{value}</span>
            {trend && (
              <span className={`flex items-center text-xs font-medium ${
                trend.isPositive ? "text-green-600" : "text-red-500"
              }`}>
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-0.5" />
                )}
                {trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-400">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${getIconStyles()}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
