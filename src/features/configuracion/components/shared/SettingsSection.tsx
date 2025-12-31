// SettingsSection.tsx - Sección con título para páginas de configuración
"use client";

import { motion } from "motion/react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  showSeparator?: boolean;
}

export function SettingsSection({
  title,
  description,
  children,
  className,
  showSeparator = true,
}: SettingsSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("space-y-4", className)}
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {showSeparator && <Separator className="my-4" />}
      {children}
    </motion.section>
  );
}
