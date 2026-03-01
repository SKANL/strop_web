"use client"

import { AlertTriangle, Building2, LayoutDashboard, Users, type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useCapabilities } from "@/hooks/use-capabilities"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const NAV_ITEMS: {
  title: string
  url: string
  icon: LucideIcon
  capability?: string[]
}[] = [
  { title: "Dashboard",   url: "/dashboard",           icon: LayoutDashboard },
  { title: "Proyectos",   url: "/dashboard/projects",  icon: Building2 },
  { title: "Incidencias", url: "/dashboard/incidents", icon: AlertTriangle },
  { title: "Equipo",      url: "/dashboard/team",      icon: Users, capability: ["org.manage_staff", "project.manage_crew"] },
]

export function NavMain() {
  const pathname = usePathname()
  const { can, loading } = useCapabilities()

  const visibleItems = loading
    ? NAV_ITEMS.filter(item => !item.capability)
    : NAV_ITEMS.filter(item => {
        if (!item.capability) return true
        return item.capability.some(c => can(c))
      })

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
      <SidebarMenu>
        {visibleItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              isActive={pathname === item.url || pathname.startsWith(item.url + '/')}
            >
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
