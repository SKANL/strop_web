"use client"

import { useRouter } from "next/navigation"
import { ProjectSetupDrawer } from "@/components/dashboard/project-setup-drawer"

export function NewProjectClient({ staff }: { staff: any[] }) {
  const router = useRouter()

  const handleClose = () => {
    router.push("/dashboard/projects")
  }

  return (
    <>
      {/* Background — clicking outside the drawer navigates back */}
      <div className="flex flex-col h-full items-center justify-center text-muted-foreground text-sm p-8">
        <p>Cargando formulario de proyecto...</p>
      </div>
      <ProjectSetupDrawer isOpen staff={staff} onClose={handleClose} />
    </>
  )
}
