// SettingsCard.tsx - Card navegable para el hub de configuración
"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SettingsCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  className?: string;
}

export function SettingsCard({
  icon: Icon,
  title,
  description,
  href,
  className,
}: SettingsCardProps) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      className="block"
    >
      <Card
        className={cn(
          "group cursor-pointer transition-all duration-200",
          "hover:shadow-md hover:border-primary/20",
          "bg-card/80 backdrop-blur-sm",
          className
        )}
      >
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            {/* Icono */}
            <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Icon className="h-5 w-5 text-primary" />
            </div>

            {/* Contenido */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                {description}
              </p>
            </div>

            {/* Flecha */}
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        </CardContent>
      </Card>
    </motion.a>
  );
}
