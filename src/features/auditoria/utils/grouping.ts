/**
 * Utilidades de agrupación temporal de logs
 */

import type { AuditLog } from "@/lib/mock/types";
import { format, startOfDay, startOfWeek, startOfMonth } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Agrupa logs por día
 */
export function groupLogsByDate(logs: AuditLog[]): Record<string, AuditLog[]> {
  const grouped: Record<string, AuditLog[]> = {};

  logs.forEach((log) => {
    const date = startOfDay(new Date(log.createdAt));
    const key = format(date, "yyyy-MM-dd");

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(log);
  });

  return grouped;
}

/**
 * Agrupa logs por semana
 */
export function groupLogsByWeek(logs: AuditLog[]): Record<string, AuditLog[]> {
  const grouped: Record<string, AuditLog[]> = {};

  logs.forEach((log) => {
    const weekStart = startOfWeek(new Date(log.createdAt), { locale: es });
    const key = format(weekStart, "yyyy-'W'ww");

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(log);
  });

  return grouped;
}

/**
 * Agrupa logs por mes
 */
export function groupLogsByMonth(logs: AuditLog[]): Record<string, AuditLog[]> {
  const grouped: Record<string, AuditLog[]> = {};

  logs.forEach((log) => {
    const monthStart = startOfMonth(new Date(log.createdAt));
    const key = format(monthStart, "yyyy-MM");

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(log);
  });

  return grouped;
}

/**
 * Agrupa logs por usuario
 */
export function groupLogsByUser(logs: AuditLog[]): Record<string, AuditLog[]> {
  const grouped: Record<string, AuditLog[]> = {};

  logs.forEach((log) => {
    const userId = log.userId || "system";

    if (!grouped[userId]) {
      grouped[userId] = [];
    }
    grouped[userId].push(log);
  });

  return grouped;
}

/**
 * Agrupa logs por tipo de acción
 */
export function groupLogsByAction(logs: AuditLog[]): Record<string, AuditLog[]> {
  const grouped: Record<string, AuditLog[]> = {};

  logs.forEach((log) => {
    const action = log.action;

    if (!grouped[action]) {
      grouped[action] = [];
    }
    grouped[action].push(log);
  });

  return grouped;
}

/**
 * Agrupa logs por tipo de recurso
 */
export function groupLogsByResourceType(logs: AuditLog[]): Record<string, AuditLog[]> {
  const grouped: Record<string, AuditLog[]> = {};

  logs.forEach((log) => {
    const resourceType = log.resourceType;

    if (!grouped[resourceType]) {
      grouped[resourceType] = [];
    }
    grouped[resourceType].push(log);
  });

  return grouped;
}
