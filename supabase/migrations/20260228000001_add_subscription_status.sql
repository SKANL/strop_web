-- Migration: Add subscription_status to organizations
-- Created: 2026-02-28
-- Purpose: Enable manual payment tracking with easy Stripe integration path later.
--
-- Stripe integration path (future):
--   1. Add a webhook handler at /api/webhooks/stripe
--   2. On `customer.subscription.created` / `invoice.paid`  → UPDATE organizations SET subscription_status = 'active'
--   3. On `customer.subscription.deleted` / `invoice.payment_failed` → UPDATE organizations SET subscription_status = 'suspended'
--   4. Optionally store stripe_customer_id and stripe_subscription_id in this table

CREATE TYPE subscription_status AS ENUM ('trial', 'active', 'suspended');

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS subscription_status subscription_status NOT NULL DEFAULT 'trial',
  ADD COLUMN IF NOT EXISTS subscription_plan TEXT NOT NULL DEFAULT 'trial',
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  ADD COLUMN IF NOT EXISTS subscription_activated_at TIMESTAMPTZ,
  -- Stripe fields (nullable, will be populated when Stripe is integrated)
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Index for fast middleware lookups
CREATE INDEX IF NOT EXISTS idx_organizations_subscription_status
  ON organizations(subscription_status);

-- RLS: Only org admins can update subscription fields
-- (actual webhook will use service_role key, bypassing RLS)
COMMENT ON COLUMN organizations.subscription_status IS
  'Values: trial (14-day free trial), active (paid), suspended (payment failed or manually blocked). This is the single field that controls dashboard access.';

COMMENT ON COLUMN organizations.stripe_customer_id IS
  'Populated when Stripe is integrated. Leave NULL for manual payment flow.';
