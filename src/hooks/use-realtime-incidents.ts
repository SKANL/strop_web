"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

/**
 * Subscribes to Supabase Realtime on the incidents table.
 * Calls router.refresh() when any change is detected to re-fetch server data.
 *
 * @param enabled - Set to false to disable the subscription
 */
export function useRealtimeIncidents(enabled = true) {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    if (!enabled) return

    const channel = supabase
      .channel("realtime:incidents")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "incidents",
        },
        (payload) => {
          console.log("Realtime incident change:", payload.eventType)
          router.refresh()
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Subscribed to incidents realtime")
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [enabled]) // eslint-disable-line react-hooks/exhaustive-deps
}
