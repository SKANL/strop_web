"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { useCapabilities } from "@/hooks/use-capabilities"

export function CreateProjectButton() {
  const { can, loading } = useCapabilities()

  if (loading || !can('project.create')) return null

  return (
    <Button asChild>
      <Link href="/dashboard/projects/new">
        <PlusCircle className="h-4 w-4 mr-2" />
        Nuevo Proyecto
      </Link>
    </Button>
  )
}
