/**
 * Tipos e interfaces para datos mock - Basado en REQUIREMENTS_V2.md
 * Strop SaaS para construcción - Multi-tenant ready
 */

// ============================================
// ENUMS Y TIPOS BASE
// ============================================

/** Planes de suscripción SaaS */
export type PlanType = "STARTER" | "PROFESSIONAL" | "ENTERPRISE";

/** Roles jerárquicos del sistema */
export type UserRole = "OWNER" | "SUPERINTENDENT" | "RESIDENT" | "CABO";

/** Roles asignables a proyectos (OWNER tiene acceso a todos) */
export type ProjectRole = "SUPERINTENDENT" | "RESIDENT" | "CABO";

/** Estados de proyecto */
export type ProjectStatus = "ACTIVE" | "PAUSED" | "COMPLETED";

/** Tipos de incidencia predefinidos */
export type IncidentType =
  | "ORDERS_INSTRUCTIONS"      // Órdenes e Instrucciones
  | "REQUESTS_QUERIES"         // Solicitudes y Consultas
  | "CERTIFICATIONS"           // Certificaciones
  | "INCIDENT_NOTIFICATIONS"   // Notificaciones de Incidentes
  | "MATERIAL_REQUEST";        // Solicitud de Material

/** Prioridad de incidencias */
export type IncidentPriority = "NORMAL" | "CRITICAL";

/** Estados de incidencia (workflow lineal) */
export type IncidentStatus = "OPEN" | "ASSIGNED" | "CLOSED";

/** Tipos de comentario */
export type CommentType = "ASSIGNMENT" | "CLOSURE" | "FOLLOWUP";

/** Estados de ruta crítica */
export type CriticalPathStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

// ============================================
// INTERFACES DE ENTIDADES
// ============================================

/**
 * Organización (Tenant) - Tabla raíz del SaaS multi-tenant
 * @see REQUIREMENTS_V2.md Sección 2.0
 */
export interface Organization {
  id: string;
  name: string;
  subdomain: string;
  slug: string;
  logoUrl?: string;
  billingEmail?: string;
  plan: PlanType;
  storageQuotaMb: number;
  maxUsers: number;
  maxProjects: number;
  trialEndsAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

/**
 * Usuario del sistema
 * @see REQUIREMENTS_V2.md Sección 2.1
 */
export interface User {
  id: string;
  organizationId: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  phone?: string;
  profilePictureUrl?: string;
  timezone: string;
  language: "es" | "en";
  invitedBy?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  lastLogin?: string;
}

/**
 * Proyecto/Obra de construcción
 * @see REQUIREMENTS_V2.md Sección 2.2
 */
export interface Project {
  id: string;
  organizationId: string;
  name: string;
  location: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  createdBy: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

/**
 * Proyecto con datos calculados (para UI)
 * Extiende Project con campos que se calculan en queries
 */
export interface ProjectWithStats extends Project {
  progress: number;           // Calculado de critical_path_items
  totalIncidents: number;     // COUNT(incidents)
  openIncidents: number;      // COUNT(incidents WHERE status != 'CLOSED')
  criticalIncidents: number;  // COUNT(incidents WHERE priority = 'CRITICAL')
  membersCount: number;       // COUNT(project_members)
  budget?: number;            // Post-MVP
  budgetSpent?: number;       // Post-MVP
  coverImageUrl?: string;     // Post-MVP
}

/**
 * Asignación de usuario a proyecto
 * @see REQUIREMENTS_V2.md Sección 2.3
 */
export interface ProjectMember {
  id: string;
  organizationId: string;
  projectId: string;
  userId: string;
  assignedRole: ProjectRole;
  assignedAt: string;
  assignedBy: string;
  removedAt?: string;
}

/**
 * Incidencia/Evento de construcción
 * @see REQUIREMENTS_V2.md Sección 2.4
 */
export interface Incident {
  id: string;
  organizationId: string;
  projectId: string;
  createdBy: string;
  type: IncidentType;
  description: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  closedBy?: string;
  locationName?: string;
  gpsLat: number;
  gpsLng: number;
  closedNotes?: string;
  isImmutable: boolean;
  deletedAt?: string;
}

/**
 * Incidencia con datos denormalizados (para UI)
 */
export interface IncidentWithDetails extends Incident {
  projectName: string;
  createdByName: string;
  createdByAvatar?: string;
  assignedToName?: string;
  assignedToAvatar?: string;
  photosCount: number;
  commentsCount: number;
}

/**
 * Fotografía/Evidencia de incidencia
 * @see REQUIREMENTS_V2.md Sección 2.5
 */
export interface Photo {
  id: string;
  organizationId: string;
  incidentId: string;
  storagePath: string;
  uploadedBy: string;
  uploadedAt: string;
  originalFilename?: string;
  fileSize?: number;
  metadata?: {
    gpsLat: number;
    gpsLng: number;
    timestampDevice: string;
    watermarkVerified: boolean;
  };
  deletedAt?: string;
}

/**
 * Comentario de incidencia
 * @see REQUIREMENTS_V2.md Sección 2.6
 */
export interface Comment {
  id: string;
  organizationId: string;
  incidentId: string;
  authorId: string;
  text: string;
  commentType: CommentType;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  deletedAt?: string;
}

/**
 * Comentario con datos denormalizados
 */
export interface CommentWithAuthor extends Comment {
  authorName: string;
  authorAvatar?: string;
  authorRole: UserRole;
}

/**
 * Actividad de ruta crítica
 * @see REQUIREMENTS_V2.md Sección 2.7
 */
export interface CriticalPathItem {
  id: string;
  organizationId: string;
  projectId: string;
  activityName: string;
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  status: CriticalPathStatus;
  progressPercentage: number;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  deletedAt?: string;
}

/**
 * Registro de auditoría
 * @see REQUIREMENTS_V2.md Sección 2.8
 */
export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "EXPORT" | "IMPORT" | "VIEW";

export type AuditResourceType = 
  | "incident" 
  | "project" 
  | "user" 
  | "comment" 
  | "photo" 
  | "organization"
  | "critical_path"
  | "project_member"
  | "report";

export interface AuditLog {
  id: string;
  organizationId: string;
  userId?: string; // Opcional para acciones de sistema o intentos fallidos
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// ============================================
// INTERFACES AUXILIARES (UI)
// ============================================

/**
 * Notificación del sistema
 */
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "critical";
  time: string;
  read: boolean;
  relatedId?: string;
  relatedType?: "incident" | "project" | "user";
}

/**
 * Actividad reciente para feed
 */
export interface Activity {
  id: string;
  action: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  target: string;
  targetId?: string;
  timestamp: string;
  type: "incident" | "project" | "user" | "system";
}

/**
 * KPIs del dashboard
 */
export interface KPIData {
  totalProjects: number;
  activeProjects: number;
  totalIncidents: number;
  openIncidents: number;
  criticalIncidents: number;
  resolvedThisWeek: number;
  avgResolutionTime: string;
  totalUsers: number;
}

// ============================================
// LABELS EN ESPAÑOL
// ============================================

export const incidentTypeLabels: Record<IncidentType, string> = {
  ORDERS_INSTRUCTIONS: "Órdenes e Instrucciones",
  REQUESTS_QUERIES: "Solicitudes y Consultas",
  CERTIFICATIONS: "Certificaciones",
  INCIDENT_NOTIFICATIONS: "Notificación de Incidentes",
  MATERIAL_REQUEST: "Solicitud de Material",
};

export const priorityLabels: Record<IncidentPriority, string> = {
  NORMAL: "Normal",
  CRITICAL: "Crítico",
};

export const statusLabels: Record<IncidentStatus, string> = {
  OPEN: "Abierto",
  ASSIGNED: "Asignado",
  CLOSED: "Cerrado",
};

export const projectStatusLabels: Record<ProjectStatus, string> = {
  ACTIVE: "Activo",
  PAUSED: "Pausado",
  COMPLETED: "Completado",
};

export const roleLabels: Record<UserRole, string> = {
  OWNER: "Dueño/Admin",
  SUPERINTENDENT: "Superintendente",
  RESIDENT: "Residente",
  CABO: "Cabo",
};

export const planLabels: Record<PlanType, string> = {
  STARTER: "Starter",
  PROFESSIONAL: "Profesional",
  ENTERPRISE: "Empresarial",
};

export const commentTypeLabels: Record<CommentType, string> = {
  ASSIGNMENT: "Asignación",
  CLOSURE: "Cierre",
  FOLLOWUP: "Seguimiento",
};

// ============================================
// INTERFACES UI (Compatibilidad con componentes)
// ============================================

/**
 * Proyecto para UI del dashboard
 * Combina ProjectWithStats con campos display-friendly
 */
export interface ProjectUI {
  id: string;
  name: string;
  location: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  progress: number;
  totalIncidents: number;
  openIncidents: number;
  criticalIncidents: number;
  membersCount: number;
  budget?: number;
  budgetSpent?: number;
  description?: string;
  coverImageUrl?: string;
}

/**
 * Incidencia para UI del dashboard
 * Campos denormalizados para display directo
 */
export interface IncidentUI {
  id: string;
  type: IncidentType;
  description: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  projectId: string;
  projectName: string;
  createdBy: string;        // Nombre del creador
  createdByAvatar?: string;
  createdAt: string;
  assignedTo?: string;      // Nombre del asignado
  assignedToAvatar?: string;
  closedAt?: string;
  closingNote?: string;
  gpsLat?: number;
  gpsLng?: number;
  photoUrl?: string;
}

/**
 * Usuario para UI (formato simplificado)
 */
export interface UserUI {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  avatarUrl?: string;
  isActive: boolean;
  phone?: string;
  lastActiveAt?: string;
}

/**
 * Actividad para UI (formato simplificado)
 */
export interface ActivityUI {
  id: string;
  action: string;
  user: string;
  userAvatar?: string;
  target: string;
  timestamp: string;
  type: "incident" | "project" | "user" | "system";
}
