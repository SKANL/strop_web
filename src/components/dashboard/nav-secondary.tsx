"use client"

import * as React from "react"
import { LifeBuoy, Send, Settings2, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { useCapabilities } from "@/hooks/use-capabilities"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const NAV_SECONDARY: {
  title: string
  url: string
  icon: LucideIcon
  capability?: string[]
}[] = [
  { title: "Configuración", url: "/dashboard/settings", icon: Settings2, capability: ["org.edit", "org.manage_roles", "org.view_billing"] },
  { title: "Soporte",       url: "mailto:hola@strop.app",                          icon: LifeBuoy },
  { title: "Feedback",      url: "mailto:hola@strop.app?subject=Feedback%20Strop", icon: Send },
]

export function NavSecondary({ ...props }: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { can, loading } = useCapabilities()

  const visibleItems = loading
    ? NAV_SECONDARY.filter(item => !item.capability)
    : NAV_SECONDARY.filter(item => {
        if (!item.capability) return true
        return item.capability.some(c => can(c))
      })

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {visibleItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm">
                {item.url.startsWith('mailto:') ? (
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                ) : (
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
