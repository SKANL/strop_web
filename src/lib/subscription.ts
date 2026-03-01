/**
 * Subscription / Billing helper
 *
 * Current mode: MANUAL PAYMENT TRACKING
 * The `subscription_status` field in the `organizations` table is updated
 * manually by the Strop admin via the dashboard at /dashboard/settings/billing.
 *
 * STRIPE INTEGRATION PATH (future, ~1 day of work):
 * ─────────────────────────────────────────────────
 * 1. Create /src/app/api/webhooks/stripe/route.ts
 * 2. Handle `invoice.paid`           → subscriptionService.activate(orgId)
 * 3. Handle `invoice.payment_failed` → subscriptionService.suspend(orgId)
 * 4. Handle `customer.subscription.deleted` → subscriptionService.suspend(orgId)
 * 5. Store stripe_customer_id in organizations table (column already exists)
 * 6. Replace ManualActivateButton with Stripe Checkout redirect
 *
 * Nothing else needs to change. The middleware, paywall page, and status
 * checks all read `subscription_status` which Stripe webhooks will update.
 */

import { createClient } from "@/lib/supabase/server"

export type SubscriptionStatus = "trial" | "active" | "suspended"

export interface SubscriptionInfo {
  status: SubscriptionStatus
  plan: string
  trialEndsAt: Date | null
  activatedAt: Date | null
  stripeCustomerId: string | null
  isActive: boolean    // trial or active
  isSuspended: boolean
  isTrialExpired: boolean
}

/**
 * Get the subscription status for the authenticated user's organization.
 * Used in middleware and server components.
 * Returns null if user is not authenticated or has no organization.
 */
export async function getSubscriptionInfo(): Promise<SubscriptionInfo | null> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: userData } = await supabase
      .from("users")
      .select("organization_id")
      .eq("id", user.id)
      .single()

    if (!userData?.organization_id) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: org } = await (supabase as any)
      .from("organizations")
      .select(
        "subscription_status, subscription_plan, trial_ends_at, subscription_activated_at, stripe_customer_id"
      )
      .eq("id", userData.organization_id)
      .single() as { data: any }

    if (!org) return null

    const status = (org.subscription_status as SubscriptionStatus) ?? "trial"
    const trialEndsAt = org.trial_ends_at ? new Date(org.trial_ends_at) : null
    const isTrialExpired =
      status === "trial" && trialEndsAt !== null && new Date() > trialEndsAt

    return {
      status,
      plan: org.subscription_plan ?? "trial",
      trialEndsAt,
      activatedAt: org.subscription_activated_at
        ? new Date(org.subscription_activated_at)
        : null,
      stripeCustomerId: org.stripe_customer_id ?? null,
      isActive: status === "active" || (status === "trial" && !isTrialExpired),
      isSuspended: status === "suspended" || isTrialExpired,
      isTrialExpired,
    }
  } catch {
    // If the subscription columns don't exist yet (pre-migration),
    // default to active so the app doesn't break.
    return {
      status: "active",
      plan: "migration_pending",
      trialEndsAt: null,
      activatedAt: null,
      stripeCustomerId: null,
      isActive: true,
      isSuspended: false,
      isTrialExpired: false,
    }
  }
}

/**
 * Server action: Activate an organization's subscription (manual payment confirmed).
 * Only callable by admin users.
 */
export async function activateSubscription(
  orgId: string,
  plan: string = "pro"
): Promise<{ success: boolean; error?: string }> {
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
  return { success: true }
}

/**
 * Server action: Suspend an organization (payment not received).
 */
export async function suspendSubscription(
  orgId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("organizations")
    .update({ subscription_status: "suspended" })
    .eq("id", orgId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}
