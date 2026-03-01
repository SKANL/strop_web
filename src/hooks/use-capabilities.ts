"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

interface UseCapabilitiesReturn {
  capabilities: string[]
  can: (capability: string) => boolean
  loading: boolean
}

export function useCapabilities(): UseCapabilitiesReturn {
  const [capabilities, setCapabilities] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    const fetchCapabilities = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !mounted) return

        const { data: userData } = await supabase
          .from("users")
          .select("role_id")
          .eq("id", user.id)
          .single()

        if (!userData?.role_id || !mounted) return

        const { data: roleData } = await supabase
          .from("roles")
          .select("capabilities")
          .eq("id", userData.role_id)
          .single()

        if (!mounted) return

        const caps = Array.isArray(roleData?.capabilities)
          ? (roleData.capabilities as string[])
          : []
        setCapabilities(caps)
      } catch (error) {
        console.error("Error fetching capabilities:", error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchCapabilities()

    // Re-fetch on auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchCapabilities()
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const can = useCallback(
    (capability: string): boolean => {
      return capabilities.includes(capability)
    },
    [capabilities]
  )

  return { capabilities, can, loading }
}
