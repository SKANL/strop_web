// BackLink.tsx - Componente de navegación hacia atrás
"use client";

import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

interface BackLinkProps {
  href: string;
  label?: string;
}

export function BackLink({ href, label = "Volver" }: BackLinkProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground hover:text-foreground mb-4"
        asChild
      >
        <a href={href}>
          <ArrowLeft className="h-4 w-4" />
          {label}
        </a>
      </Button>
    </motion.div>
  );
}
