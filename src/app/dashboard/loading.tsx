import { Skeleton } from "@/components/ui/skeleton"

/**
 * Dashboard-level loading skeleton.
 * Shown during server component data fetching for any /dashboard/* route.
 */
export default function DashboardLoading() {
  return (
    <div className="flex flex-col h-full gap-4 p-4">
      {/* KPI row skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 shrink-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        ))}
      </div>

      {/* Main content area skeleton */}
      <div className="grid gap-4 md:grid-cols-3 flex-1 min-h-0">
        <div className="md:col-span-2 rounded-xl border bg-card p-4 space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <Skeleton className="h-5 w-28" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-md border p-3 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
