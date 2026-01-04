// islands/MobileNav.tsx - Navegación móvil
"use client";

import { useStore } from "@nanostores/react";
import { isMobileMenuOpen, toggleMobileMenu } from "@/store/ui";
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
  const open = useStore(isMobileMenuOpen);

  const activeItem = navItems.find(item => 
    currentPath === item.href || 
    (item.href !== "/dashboard" && currentPath.startsWith(item.href))
  ) || navItems[0];

  return (
    <Sheet open={open} onOpenChange={toggleMobileMenu}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed top-4 left-4 z-50 md:hidden h-10 w-10 rounded-full bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground shadow-lg"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-72 bg-background border-r border-border p-0">
        <div className="flex flex-col h-full">
        <SheetHeader className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-extrabold text-lg">
              S
            </div>
            <SheetTitle className="text-foreground text-lg font-bold">Strop</SheetTitle>
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-2">
          <nav className="flex flex-col p-3 gap-1">
            {navItems.map((item) => {
              const isActive = activeItem.id === item.id;
              const Icon = item.icon;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => toggleMobileMenu()}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all no-underline ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/10 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-sm font-medium ${isActive ? "font-semibold" : ""}`}>
                    {item.label}
                  </span>
                  {item.badge && item.badge > 0 && (
                    <Badge variant="destructive" size="sm" className="ml-auto h-5 px-1.5">
                      {item.badge}
                    </Badge>
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        <Separator className="bg-border my-2" />

        <div className="p-4 mt-auto">
          <span className="text-xs text-muted-foreground font-medium">Strop v2.0</span>
        </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
