"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { ProjectSetupDrawer } from "./project-setup-drawer"

export function CreateProjectButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <PlusIcon className="mr-2 h-4 w-4" />
        New Project
      </Button>
      <ProjectSetupDrawer isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
