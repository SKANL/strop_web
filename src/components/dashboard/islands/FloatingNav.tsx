// islands/FloatingNav.tsx - Navegación flotante con client:idle
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  AlertTriangle,
  ClipboardCheck,
  X,
} from "lucide-react";

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
  { id: "auditoria", label: "Auditoría", icon: ClipboardCheck, href: "/dashboard/auditoria" },
];

interface FloatingNavProps {
  currentPath?: string;
}

export function FloatingNav({ currentPath = "/dashboard" }: FloatingNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeItem = navItems.find(item => 
    currentPath === item.href || 
    (item.href !== "/dashboard" && currentPath.startsWith(item.href))
  ) || navItems[0];

  const ActiveIcon = activeItem.icon;

  return (
    <motion.nav
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed left-6 top-6 z-50 bg-[#1a1a1a] text-white shadow-2xl shadow-black/40 border border-white/10 overflow-hidden"
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
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center transition-all relative shrink-0 cursor-pointer hover:bg-white/5 border-b border-white/10 ${
            isOpen ? "h-16 px-4 justify-between" : "h-16 justify-center"
          }`}
        >
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-extrabold text-lg shadow-lg shrink-0 z-20 transition-transform active:scale-95">
            S
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={16} className="text-gray-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-3 pb-4 w-full pt-2"
            >
              <div className="relative">
                <ActiveIcon size={24} className="text-blue-400" strokeWidth={2} />
                {activeItem.badge && activeItem.badge > 0 && (
                  <span className="absolute -top-1 -right-2 h-4 w-4 bg-red-500 text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
                    {activeItem.badge}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => e.stopPropagation()}
                    className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 no-underline ${
                      isActive
                        ? "bg-blue-600/30 text-white"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navActiveIndicator"
                        className="absolute inset-0 border border-blue-500/50 rounded-2xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className="shrink-0 relative z-10">
                      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                      {item.badge && item.badge > 0 && (
                        <span className="absolute -top-1 -right-2 h-4 w-4 bg-red-500 text-[10px] font-bold rounded-full flex items-center justify-center text-white shadow-lg">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className={`text-sm font-medium whitespace-nowrap z-10 ${isActive ? "text-white font-semibold" : ""}`}>
                      {item.label}
                    </span>
                  </a>
                );
              })}

              <div className="h-px w-full bg-white/10 my-2" />

              <div className="px-3 py-2">
                <span className="text-xs text-gray-500 font-medium">Strop v2.0</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
