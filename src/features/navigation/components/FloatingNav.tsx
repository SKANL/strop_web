// islands/FloatingNav.tsx - Navegación flotante con client:idle (shadcn optimized)
"use client";

import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { isSidebarCollapsed, toggleSidebar } from "@/store/ui";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  AlertTriangle,
  ClipboardCheck,
  BookOpen,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { mockCurrentUserUI as user } from "@/lib/mock";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { id: "proyectos", label: "Proyectos", icon: FolderKanban, href: "/dashboard/proyectos" },
  { id: "usuarios", label: "Usuarios", icon: Users, href: "/dashboard/usuarios" },
  { id: "incidencias", label: "Incidencias", icon: AlertTriangle, href: "/dashboard/incidencias", badge: 3 },
  { id: "bitacora", label: "Bitácora", icon: BookOpen, href: "/dashboard/bitacora" },
  { id: "auditoria", label: "Auditoría", icon: ClipboardCheck, href: "/dashboard/auditoria" },
];

interface FloatingNavProps {
  currentPath?: string;
}

export function FloatingNav({ currentPath = "/dashboard" }: FloatingNavProps) {
  // Client-side hydration flag to prevent mismatch
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Global state: collapsed = true -> isOpen = false
  const $isSidebarCollapsed = useStore(isSidebarCollapsed);
  // Always render collapsed on SSR to match client initial state
  const isOpen = mounted ? !$isSidebarCollapsed : false;

  const activeItem = navItems.find(item => 
    currentPath === item.href || 
    (item.href !== "/dashboard" && currentPath.startsWith(item.href))
  ) || navItems[0];

  const ActiveIcon = activeItem.icon;

  return (
    <TooltipProvider>
      <motion.nav
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed left-6 top-6 z-50 bg-popover text-popover-foreground shadow-2xl shadow-black/5 border border-border overflow-hidden"
        style={{
          width: isOpen ? 260 : 72,
          height: isOpen ? "auto" : 130,
          borderRadius: isOpen ? 24 : 36,
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 30,
        }}
      >
        <div className="flex flex-col w-full">
          {/* Header con logo */}
          <div
            onClick={() => toggleSidebar()}
            className={cn(
              "w-full flex items-center transition-all relative shrink-0 cursor-pointer hover:bg-accent/50 border-b border-border",
              isOpen ? "h-16 px-4 justify-between" : "h-16 justify-center"
            )}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-extrabold text-lg shadow-lg shrink-0 z-20 transition-transform active:scale-95">
                  S
                </div>
              </TooltipTrigger>
              {!isOpen && (
                <TooltipContent side="right">
                  <p>Strop Admin</p>
                </TooltipContent>
              )}
            </Tooltip>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Cerrar menú</span>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User profile when open */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                className="px-2 py-2"
              >
                <div className="flex items-center gap-3 px-3 py-2 bg-muted/30 border border-border rounded-lg mb-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-2 ring-background">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Icono activo cuando está cerrado */}
          <AnimatePresence>
            {!isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-3 pb-4 w-full pt-2"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative cursor-pointer">
                      <ActiveIcon size={24} className="text-primary" strokeWidth={2} />
                      {activeItem.badge && activeItem.badge > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-2 -right-3 h-4 min-w-4 px-1 text-xs font-bold"
                        >
                          {activeItem.badge}
                        </Badge>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{activeItem.label}</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navegación expandida */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                className="flex flex-col px-2 py-2"
              >
                {navItems.map((item) => {
                  const isActive = activeItem.id === item.id;
                  const Icon = item.icon;

                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      asChild
                      className={cn(
                        "relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <a href={item.href} onClick={(e) => e.stopPropagation()}>
                        {isActive && (
                          <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-lg -z-10"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                        )}
                        <div className="shrink-0 relative z-10">
                          <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                          {item.badge && item.badge > 0 && (
                            <Badge 
                              variant="destructive" 
                              className="absolute -top-2 -right-3 h-4 min-w-4 px-1 text-xs font-bold"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <span className={cn(
                          "text-sm whitespace-nowrap z-10",
                          isActive ? "font-semibold" : "font-medium"
                        )}>
                          {item.label}
                        </span>
                      </a>
                    </Button>
                  );
                })}

                <Separator className="my-2 bg-border" />

                <div className="px-3 py-2">
                  <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-accent">
                    Strop v2.0
                  </Badge>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </TooltipProvider>
  );
}
