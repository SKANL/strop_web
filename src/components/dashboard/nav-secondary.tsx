"use client"

import * as React from "react"
import { LifeBuoy, Send, Settings2, type LucideIcon } from "lucide-react"
import Link from "next/link"

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
}[] = [
  { title: "Configuración", url: "/dashboard/settings",                            icon: Settings2 },
  { title: "Soporte",       url: "mailto:hola@strop.app",                          icon: LifeBuoy },
  { title: "Feedback",      url: "mailto:hola@strop.app?subject=Feedback%20Strop", icon: Send },
]

export function NavSecondary({ ...props }: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {NAV_SECONDARY.map((item) => (
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
