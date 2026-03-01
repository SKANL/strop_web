"use client"

import { AlertTriangle, Building2, LayoutDashboard, Users, type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

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
}[] = [
  { title: "Dashboard",   url: "/dashboard",           icon: LayoutDashboard },
  { title: "Proyectos",   url: "/dashboard/projects",  icon: Building2 },
  { title: "Incidencias", url: "/dashboard/incidents", icon: AlertTriangle },
  { title: "Equipo",      url: "/dashboard/team",      icon: Users },
]

export function NavMain() {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
      <SidebarMenu>
        {NAV_ITEMS.map((item) => (
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
