/**
 * Utilidades de formateo para el módulo de auditoría
 */

import type { AuditLog } from "@/lib/mock/types";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Formatea fecha y hora en formato completo
 */
export function formatDateTime(isoDate: string): string {
  return format(new Date(isoDate), "dd/MM/yyyy HH:mm:ss", { locale: es });
}

/**
 * Formatea solo la fecha
 */
export function formatDate(isoDate: string): string {
  return format(new Date(isoDate), "dd/MM/yyyy", { locale: es });
}

/**
 * Formatea solo la hora
 */
export function formatTime(isoDate: string): string {
  return format(new Date(isoDate), "HH:mm:ss", { locale: es });
}

/**
 * Formatea fecha relativa (ej: "hace 2 horas")
 */
export function formatRelativeTime(isoDate: string): string {
  return formatDistanceToNow(new Date(isoDate), { addSuffix: true, locale: es });
}

/**
 * Formatea rango de fechas
 */
export function formatDateRange(range?: { from: Date; to: Date }): string {
  if (!range) return "Seleccionar rango";
  if (!range.from) return "Seleccionar rango";
  if (!range.to) return format(range.from, "dd/MM/yyyy", { locale: es });
  
  return `${format(range.from, "dd/MM/yyyy", { locale: es })} - ${format(range.to, "dd/MM/yyyy", { locale: es })}`;
}

/**
 * Formatea detalles del log para mostrar en tabla
 */
export function formatDetails(details?: Record<string, unknown>): string {
  if (!details) return "—";
  
  // Extraer información relevante según el tipo de detalle
  if ("title" in details) return String(details.title);
  if ("field" in details && "oldValue" in details && "newValue" in details) {
    return `${details.field}: ${details.oldValue} → ${details.newValue}`;
  }
  if ("description" in details) return String(details.description);
  if ("email" in details) return String(details.email);
  if ("fileName" in details) return String(details.fileName);
  
  // Fallback: mostrar primeras claves
  const keys = Object.keys(details).slice(0, 2);
  return keys.map(k => `${k}: ${details[k]}`).join(", ");
}

/**
 * Parsea User-Agent para mostrar navegador/dispositivo
 */
export function parseUserAgent(userAgent?: string): string {
  if (!userAgent) return "Desconocido";
  
  // Detectar navegador
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
  if (userAgent.includes("Edge")) return "Edge";
  
  // Detectar móvil
  if (userAgent.includes("Strop-Mobile")) {
    if (userAgent.includes("iOS")) return "App iOS";
    if (userAgent.includes("Android")) return "App Android";
    return "App Móvil";
  }
  
  // Sistema
  if (userAgent.includes("Strop-System")) return "Sistema";
  if (userAgent.includes("Strop-Billing")) return "Sistema de Facturación";
  
  return "Navegador";
}

/**
 * Formatea descripción de acción para timeline
 */
export function formatActionDescription(log: AuditLog): string {
  const { action, resourceType, details } = log;
  
  switch (action) {
    case "CREATE":
      return `creó ${getResourceArticle(resourceType)} ${getResourceName(resourceType)}`;
    case "UPDATE":
      if (details && "field" in details) {
        return `actualizó el campo "${details.field}"`;
      }
      return `actualizó ${getResourceArticle(resourceType)} ${getResourceName(resourceType)}`;
    case "DELETE":
      return `eliminó ${getResourceArticle(resourceType)} ${getResourceName(resourceType)}`;
    case "LOGIN":
      if (details && "success" in details && !details.success) {
        return "intentó iniciar sesión (fallido)";
      }
      return "inició sesión";
    case "LOGOUT":
      return "cerró sesión";
    case "EXPORT":
      return `exportó ${getResourceArticle(resourceType)} ${getResourceName(resourceType)}`;
    case "IMPORT":
      return `importó datos`;
    case "VIEW":
      return `visualizó ${getResourceArticle(resourceType)} ${getResourceName(resourceType)}`;
    default:
      return `realizó una acción en ${getResourceName(resourceType)}`;
  }
}

/**
 * Obtiene artículo para recurso (un/una)
 */
function getResourceArticle(type: string): string {
  const feminine = ["organization", "photo"];
  return feminine.includes(type) ? "una" : "un";
}

/**
 * Obtiene nombre legible del recurso
 */
function getResourceName(type: string): string {
  const names: Record<string, string> = {
    incident: "incidencia",
    project: "proyecto",
    user: "usuario",
    comment: "comentario",
    photo: "fotografía",
    organization: "organización",
    critical_path: "actividad de ruta crítica",
    project_member: "miembro de proyecto",
    report: "reporte",
  };
  return names[type] || type;
}

/**
 * Obtiene color para tipo de acción (para timeline)
 */
export function getActionColor(action: string): string {
  const colors: Record<string, string> = {
    CREATE: "bg-green-500",
    UPDATE: "bg-blue-500",
    DELETE: "bg-red-500",
    LOGIN: "bg-purple-500",
    LOGOUT: "bg-gray-500",
    EXPORT: "bg-yellow-500",
    IMPORT: "bg-orange-500",
    VIEW: "bg-cyan-500",
  };
  return colors[action] || "bg-gray-400";
}
