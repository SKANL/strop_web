import type { Metadata } from 'next'
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { DynamicBreadcrumb } from "@/components/dashboard/dynamic-breadcrumb"

export const metadata: Metadata = {
  title: {
    template: '%s | Strop',
    default: 'Dashboard | Strop',
  },
  description: 'Sistema de gestión de incidencias y proyectos de construcción',
  keywords: ['construcción', 'gestión de proyectos', 'incidencias', 'RBAC', 'superintendencia'],
  authors: [{ name: 'Strop' }],
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://constructora.zentyar.com',
    siteName: 'Strop',
    title: 'Strop - Gestión de Proyectos de Construcción',
    description: 'Sistema de gestión de incidencias y proyectos de construcción',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" aria-label="Alternar barra lateral" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumb />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
