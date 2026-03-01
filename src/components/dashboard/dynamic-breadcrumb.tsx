"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react"

/** Maps URL segments to human-readable Spanish labels */
const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  projects: "Proyectos",
  incidents: "Incidencias",
  team: "Equipo",
  settings: "Configuración",
  roles: "Roles y Permisos",
  billing: "Facturación",
  profile: "Mi Perfil",
}

interface BreadcrumbSegment {
  label: string
  href: string
  isLast: boolean
}

function buildSegments(pathname: string): BreadcrumbSegment[] {
  const parts = pathname.split("/").filter(Boolean)
  return parts.map((part, index) => {
    const href = "/" + parts.slice(0, index + 1).join("/")
    // If segment looks like a UUID/ID (long alphanumeric), label it with a generic name
    const isId = /^[0-9a-f-]{8,}$/i.test(part)
    const label = isId ? "Detalle" : (SEGMENT_LABELS[part] ?? ucFirst(part))
    return {
      label,
      href,
      isLast: index === parts.length - 1,
    }
  })
}

function ucFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, " ")
}

/**
 * DynamicBreadcrumb — Reads the current pathname and generates
 * a Spanish breadcrumb trail automatically.
 *
 * Put this in the dashboard layout header.
 */
export function DynamicBreadcrumb() {
  const pathname = usePathname()
  const segments = buildSegments(pathname)

  if (segments.length === 0) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, i) => (
          <React.Fragment key={segment.href}>
            {i > 0 && <BreadcrumbSeparator className="hidden md:block" />}
            <BreadcrumbItem className={i === 0 && segments.length > 1 ? "hidden md:block" : ""}>
              {segment.isLast ? (
                <BreadcrumbPage>{segment.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={segment.href}>{segment.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
