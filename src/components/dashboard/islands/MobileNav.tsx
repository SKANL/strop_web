// islands/MobileNav.tsx - Navegación móvil
"use client";

import { useState } from "react";
import { Menu, LayoutDashboard, FolderKanban, Users, AlertTriangle, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

interface MobileNavProps {
  currentPath?: string;
}

export function MobileNav({ currentPath = "/dashboard" }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  const activeItem = navItems.find(item => 
    currentPath === item.href || 
    (item.href !== "/dashboard" && currentPath.startsWith(item.href))
  ) || navItems[0];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed top-4 left-4 z-50 md:hidden h-10 w-10 rounded-full bg-[#1a1a1a] border-white/10 text-white hover:bg-[#2a2a2a] hover:text-white shadow-lg"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-72 bg-[#1a1a1a] border-white/10 p-0">
        <SheetHeader className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-extrabold text-lg">
              S
            </div>
            <SheetTitle className="text-white text-lg font-bold">Strop</SheetTitle>
          </div>
        </SheetHeader>
        
        <nav className="flex flex-col p-3 gap-1">
          {navItems.map((item) => {
            const isActive = activeItem.id === item.id;
            const Icon = item.icon;

            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all no-underline ${
                  isActive
                    ? "bg-blue-600/30 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-sm font-medium ${isActive ? "font-semibold" : ""}`}>
                  {item.label}
                </span>
                {item.badge && item.badge > 0 && (
                  <Badge variant="destructive" className="ml-auto text-[10px] h-5 px-1.5">
                    {item.badge}
                  </Badge>
                )}
              </a>
            );
          })}
        </nav>

        <Separator className="bg-white/10 my-2" />

        <div className="p-4">
          <span className="text-xs text-gray-500 font-medium">Strop v2.0</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
