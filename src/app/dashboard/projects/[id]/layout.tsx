
import { FinancialHeader } from "@/components/projects/financial-header"

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
        <FinancialHeader />
        <div className="flex-1 overflow-auto bg-muted/10 p-4">
            {children}
        </div>
    </div>
  )
}
