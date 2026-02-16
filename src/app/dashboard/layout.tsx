import type { Metadata } from 'next'
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"

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
    url: 'https://strop.app',
    siteName: 'Strop',
    title: 'Strop - Gestión de Proyectos de Construcción',
    description: 'Sistema de gestión de incidencias y proyectos de construcción',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Strop - Gestión de Proyectos',
    description: 'Sistema de gestión de incidencias y proyectos de construcción',
  },
  robots: {
    index: false, // Dashboard shouldn't be indexed
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
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Strop</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="min-h-screen flex-1 rounded-xl md:min-h-min p-4">
                {children}
            </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
