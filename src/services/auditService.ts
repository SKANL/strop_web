/**
 * Servicio de abstracción para acceso a datos de auditoría
 * Actualmente usa mock data, preparado para migración a Supabase
 */

import {
  getAuditLogsByOrganization,
  getAuditLogById,
  getAuditLogsForResource,
  getActivitySummary,
  getFailedLoginAttempts,
  getRecentActivity,
  type AuditLog,
} from "@/lib/mock/audit-logs";
import type { AuditAction, AuditResourceType } from "@/lib/mock/types";

/**
 * Resumen de actividad
 */
export interface ActivitySummary {
  totalActions: number;
  todayActions: number;
  weekActions: number;
  topUsers: Array<{ userId: string; count: number }>;
  actionBreakdown: Record<AuditAction, number>;
}

/**
 * Resultado paginado
 */
export interface PaginatedLogs {
  logs: AuditLog[];
  total: number;
  pages: number;
}

/**
 * Interface del servicio de auditoría
 */
export interface AuditService {
  getLogsByOrganization(orgId: string): Promise<AuditLog[]>;
  getLogById(id: string): Promise<AuditLog | undefined>;
  getLogsForResource(
    type: AuditResourceType,
    id: string
  ): Promise<AuditLog[]>;
  getActivitySummary(orgId: string): Promise<ActivitySummary>;
  getSecurityAlerts(orgId: string): Promise<AuditLog[]>;
  getRecentActivity(
    orgId: string,
    page: number,
    limit: number
  ): Promise<PaginatedLogs>;
}

/**
 * Implementación Mock del servicio
 */
export const auditService: AuditService = {
  async getLogsByOrganization(orgId: string): Promise<AuditLog[]> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getAuditLogsByOrganization(orgId);
  },

  async getLogById(id: string): Promise<AuditLog | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return getAuditLogById(id);
  },

  async getLogsForResource(
    type: AuditResourceType,
    id: string
  ): Promise<AuditLog[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getAuditLogsForResource(type, id);
  },

  async getActivitySummary(orgId: string): Promise<ActivitySummary> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getActivitySummary(orgId);
  },

  async getSecurityAlerts(orgId: string): Promise<AuditLog[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getFailedLoginAttempts(orgId, 24);
  },

  async getRecentActivity(
    orgId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedLogs> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getRecentActivity(orgId, page, limit);
  },
};

/**
 * Implementación Supabase (futura)
 * 
 * import { supabase } from '@/lib/supabase'
 * 
 * export const auditService: AuditService = {
 *   async getLogsByOrganization(orgId: string): Promise<AuditLog[]> {
 *     const { data, error } = await supabase
 *       .from('audit_logs')
 *       .select('*')
 *       .eq('organization_id', orgId)
 *       .order('created_at', { ascending: false })
 *     
 *     if (error) throw error
 *     return data
 *   },
 *   
 *   async getLogById(id: string): Promise<AuditLog | undefined> {
 *     const { data, error } = await supabase
 *       .from('audit_logs')
 *       .select('*')
 *       .eq('id', id)
 *       .single()
 *     
 *     if (error) return undefined
 *     return data
 *   },
 *   
 *   async getLogsForResource(type: AuditResourceType, id: string): Promise<AuditLog[]> {
 *     const { data, error } = await supabase
 *       .from('audit_logs')
 *       .select('*')
 *       .eq('resource_type', type)
 *       .eq('resource_id', id)
 *       .order('created_at', { ascending: false })
 *     
 *     if (error) throw error
 *     return data
 *   },
 *   
 *   async getActivitySummary(orgId: string): Promise<ActivitySummary> {
 *     // Implementar queries agregadas con Supabase
 *     // Usar RPC functions para cálculos complejos
 *   },
 *   
 *   async getSecurityAlerts(orgId: string): Promise<AuditLog[]> {
 *     const cutoff = new Date()
 *     cutoff.setHours(cutoff.getHours() - 24)
 *     
 *     const { data, error } = await supabase
 *       .from('audit_logs')
 *       .select('*')
 *       .eq('organization_id', orgId)
 *       .eq('action', 'LOGIN')
 *       .eq('details->>success', false)
 *       .gte('created_at', cutoff.toISOString())
 *     
 *     if (error) throw error
 *     return data
 *   },
 *   
 *   async getRecentActivity(orgId: string, page: number, limit: number): Promise<PaginatedLogs> {
 *     const start = (page - 1) * limit
 *     
 *     const { data, error, count } = await supabase
 *       .from('audit_logs')
 *       .select('*', { count: 'exact' })
 *       .eq('organization_id', orgId)
 *       .order('created_at', { ascending: false })
 *       .range(start, start + limit - 1)
 *     
 *     if (error) throw error
 *     
 *     return {
 *       logs: data,
 *       total: count || 0,
 *       pages: Math.ceil((count || 0) / limit)
 *     }
 *   }
 * }
 */
