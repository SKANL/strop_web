import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectsLoading() {
  return (
    <div className="flex flex-col h-full space-y-4 p-4">
      {/* Header skeleton */}
      <div className="space-y-1 shrink-0">
        <Skeleton className="h-7 w-52" />
        <Skeleton className="h-4 w-80" />
      </div>
      <Skeleton className="h-px w-full shrink-0" />
      {/* Table skeleton */}
      <div className="flex-1 space-y-2">
        <div className="flex gap-4 pb-2 border-b">
          {["w-12", "w-48", "w-24", "w-32", "w-28", "w-24", "w-28"].map((w, i) => (
            <Skeleton key={i} className={`h-4 ${w}`} />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-4 py-3 border-b items-center">
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-28" />
          </div>
        ))}
      </div>
    </div>
  )
}
