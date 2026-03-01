"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function adminActivateOrg(formData: FormData) {
  const orgId = formData.get("org_id") as string
  const plan = (formData.get("plan") as string) || "pro"

  if (!orgId) return { success: false, error: "org_id requerido" }

  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("organizations")
    .update({
      subscription_status: "active",
      subscription_plan: plan,
      subscription_activated_at: new Date().toISOString(),
    })
    .eq("id", orgId)

  if (error) return { success: false, error: error.message }

  revalidatePath("/dashboard/settings/billing")
  return { success: true }
}

export async function adminSuspendOrg(formData: FormData) {
  const orgId = formData.get("org_id") as string
  if (!orgId) return { success: false, error: "org_id requerido" }

  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("organizations")
    .update({ subscription_status: "suspended" })
    .eq("id", orgId)

  if (error) return { success: false, error: error.message }

  revalidatePath("/dashboard/settings/billing")
  return { success: true }
}

export async function getMyOrganization() {
  const supabase = await createClient()

  // Step 1: get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: "No autenticado" }

  // Step 2: get organization_id from users table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: userData, error: userError } = await (supabase as any)
    .from("users")
    .select("organization_id")
    .eq("id", user.id)
    .single()

  if (userError || !userData?.organization_id) {
    return { data: null, error: userError?.message ?? "Sin organización asociada" }
  }

  // Step 3: fetch the organization directly by its ID
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: org, error: orgError } = await (supabase as any)
    .from("organizations")
    .select("id, name, subscription_status, subscription_plan, trial_ends_at, subscription_activated_at, stripe_customer_id, created_at")
    .eq("id", userData.organization_id)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { data: org as any | null, error: orgError?.message }
}

export async function getAllOrganizations() {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("organizations")
    .select(
      "id, name, subscription_status, subscription_plan, trial_ends_at, subscription_activated_at, stripe_customer_id, created_at"
    )
    .order("created_at", { ascending: false })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { data: data as any[] | null, error: error?.message }
}
