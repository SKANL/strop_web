/**
 * Centralized enum → Spanish label mapping.
 * Use these helpers everywhere instead of inline string maps so
 * the translation is consistent across the UI.
 */

// ─── Incident Status ─────────────────────────────────────────────────────────

export const INCIDENT_STATUS_LABELS: Record<string, string> = {
  OPEN:      "Abierta",
  IN_REVIEW: "En Revisión",
  CLOSED:    "Cerrada",
  REJECTED:  "Rechazada",
  DRAFT:     "Borrador",
}

export function getLabelForStatus(status: string): string {
  return INCIDENT_STATUS_LABELS[status] ?? status
}

// ─── Incident Priority ────────────────────────────────────────────────────────

export const INCIDENT_PRIORITY_LABELS: Record<string, string> = {
  CRITICAL: "Crítica",
  URGENT:   "Urgente",
  NORMAL:   "Normal",
  // Legacy / fallback values kept for backwards compat
  HIGH:     "Alta",
  MEDIUM:   "Media",
  LOW:      "Baja",
}

export function getLabelForPriority(priority: string): string {
  return INCIDENT_PRIORITY_LABELS[priority] ?? priority
}

// ─── Subscription Plan ────────────────────────────────────────────────────────

export const SUBSCRIPTION_PLAN_LABELS: Record<string, string> = {
  free:       "Gratuito",
  starter:    "Starter",
  pro:        "Pro",
  enterprise: "Enterprise",
}

export function getLabelForPlan(plan: string): string {
  return SUBSCRIPTION_PLAN_LABELS[plan] ?? plan
}

// ─── Subscription Status ──────────────────────────────────────────────────────

export const SUBSCRIPTION_STATUS_LABELS: Record<string, string> = {
  active:    "Activa",
  trial:     "Periodo de Prueba",
  suspended: "Suspendida",
  cancelled: "Cancelada",
}

export function getLabelForSubscriptionStatus(status: string): string {
  return SUBSCRIPTION_STATUS_LABELS[status] ?? status
}
