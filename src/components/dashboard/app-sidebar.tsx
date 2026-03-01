"use server"

import * as React from "react"

import { NavMain } from "@/components/dashboard/nav-main"
import { NavSecondary } from "@/components/dashboard/nav-secondary"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Fetch real authenticated user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get profile from users table for full_name and avatar
  let userName = user?.email?.split("@")[0] ?? "Usuario"
  let userEmail = user?.email ?? ""
  let userAvatar = ""
  let isCrew = false

  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("full_name, avatar_url, user_type")
      .eq("id", user.id)
      .single()

    if (profile) {
      userName = profile.full_name || userName
      userAvatar = profile.avatar_url || ""
      isCrew = profile.user_type === "crew"
    }
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-xs">
                  ST
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Strop</span>
                  <span className="truncate text-xs text-sidebar-foreground/60">Gestión de Obras</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: userName, email: userEmail, avatar: userAvatar, isCrew }} />
      </SidebarFooter>
    </Sidebar>
  )
}
