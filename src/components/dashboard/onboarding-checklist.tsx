"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2, Circle, X, Rocket } from "lucide-react"

const STORAGE_KEY = "strop_onboarding_dismissed"

interface ChecklistItem {
  id: string
  label: string
  done: boolean
  href: string
}

interface OnboardingChecklistProps {
  hasProject: boolean
  hasTeamMember: boolean
  hasIncident: boolean
  hasConfiguredRoles: boolean
}

export function OnboardingChecklist({
  hasProject,
  hasTeamMember,
  hasIncident,
  hasConfiguredRoles,
}: OnboardingChecklistProps) {
  const [dismissed, setDismissed] = useState(true) // start hidden, read localStorage on mount
  const [mounted, setMounted] = useState(false)

  const items: ChecklistItem[] = [
    {
      id: "project",
      label: "Crea tu primer proyecto",
      done: hasProject,
      href: "/dashboard/projects/new",
    },
    {
      id: "team",
      label: "Invita a un miembro de tu equipo",
      done: hasTeamMember,
      href: "/dashboard/team",
    },
    {
      id: "incident",
      label: "Registra tu primera incidencia",
      done: hasIncident,
      href: "/dashboard/incidents",
    },
    {
      id: "roles",
      label: "Configura los roles y permisos",
      done: hasConfiguredRoles,
      href: "/dashboard/settings/roles",
    },
  ]

  const completedCount = items.filter((i) => i.done).length
  const allDone = completedCount === items.length
  const progressPct = Math.round((completedCount / items.length) * 100)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== "true") {
      setDismissed(false)
    }
  }, [])

  // Auto-dismiss once everything is done
  useEffect(() => {
    if (allDone && mounted) {
      const t = setTimeout(() => handleDismiss(), 4000)
      return () => clearTimeout(t)
    }
  }, [allDone, mounted])

  function handleDismiss() {
    localStorage.setItem(STORAGE_KEY, "true")
    setDismissed(true)
  }

  if (!mounted || dismissed) return null

  return (
    <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-900/40 dark:bg-orange-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <Rocket className="h-4 w-4 text-orange-600 shrink-0" aria-hidden="true" />
            <div>
              <CardTitle className="text-sm font-semibold text-orange-900 dark:text-orange-100">
                Primeros pasos — {completedCount}/{items.length} completados
              </CardTitle>
              <CardDescription className="text-xs text-orange-700/80 dark:text-orange-300/80">
                {allDone
                  ? "¡Todo listo! Ya tienes Strop configurado."
                  : "Configura tu espacio de trabajo para sacar el máximo partido."}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/40"
            onClick={handleDismiss}
            aria-label="Cerrar guía de inicio"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </div>
        <Progress
          value={progressPct}
          className="h-1.5 mt-1 bg-orange-200 dark:bg-orange-900/40 [&>div]:bg-orange-600"
          aria-label={`${completedCount} de ${items.length} pasos completados`}
        />
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="grid gap-1.5 sm:grid-cols-2" role="list">
          {items.map((item) => (
            <li key={item.id}>
              {item.done ? (
                <span className="flex items-center gap-2 text-sm text-orange-700/70 dark:text-orange-300/70 line-through">
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-orange-600"
                    aria-hidden="true"
                  />
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center gap-2 text-sm text-orange-900 dark:text-orange-100 hover:underline"
                >
                  <Circle
                    className="h-4 w-4 shrink-0 text-orange-400"
                    aria-hidden="true"
                  />
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
