import { Skeleton } from "@/components/ui/skeleton"

export default function IncidentsLoading() {
  return (
    <div className="flex flex-col h-full">
      {/* Filters bar skeleton */}
      <div className="px-6 py-4 border-b space-y-3">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-9 w-36" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-md" />
          ))}
        </div>
      </div>
      {/* Table skeleton */}
      <div className="px-6 py-4 space-y-2 flex-1">
        <div className="flex gap-4 pb-2 border-b">
          {["w-14", "w-28", "w-16", "w-48", "w-32", "w-28", "w-24"].map((w, i) => (
            <Skeleton key={i} className={`h-4 ${w}`} />
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-4 py-2 border-b">
            <Skeleton className="h-8 w-14" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-10 w-10 rounded" />
            <Skeleton className="h-8 w-48 flex-1" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
