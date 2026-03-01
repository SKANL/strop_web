"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCapabilities } from "@/hooks/use-capabilities"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  AlertTriangle,
  FolderKanban,
  Users,
  Settings,
} from "lucide-react"

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  capability?: string | string[] // if undefined, always visible
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/incidents", label: "Incidencias", icon: AlertTriangle },
  { href: "/dashboard/projects", label: "Proyectos", icon: FolderKanban },
  { href: "/dashboard/team", label: "Equipo", icon: Users, capability: ["org.manage_staff", "project.manage_crew"] },
  { href: "/dashboard/settings", label: "Configuración", icon: Settings, capability: ["org.edit", "org.manage_roles", "org.view_billing"] },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { can, loading } = useCapabilities()

  const visibleItems = loading
    ? NAV_ITEMS.filter(item => !item.capability) // While loading, show public items
    : NAV_ITEMS.filter(item => {
        if (!item.capability) return true
        const caps = Array.isArray(item.capability) ? item.capability : [item.capability]
        return caps.some(c => can(c))
      })

  return (
    <nav className="flex flex-col gap-1 p-2" aria-label="Navegación principal">
      {visibleItems.map((item) => {
        const isActive = pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href))
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
