/**
 * Datos mock de comentarios
 * Basado en REQUIREMENTS_V2.md Sección 2.6
 */

import type { Comment, CommentWithAuthor } from "./types";
import { getUserById } from "./users";

// ============================================
// CONSTANTE: ID de organización por defecto
// ============================================
const DEFAULT_ORG_ID = "org-001";

// ============================================
// COMENTARIOS MOCK
// ============================================

/**
 * Comentarios de incidencias
 */
export const mockComments: Comment[] = [
  // ============================================
  // INCIDENCIA 1: Falla estructural (CRITICAL)
  // ============================================
  {
    id: "comment-001",
    organizationId: DEFAULT_ORG_ID,
    incidentId: "inc-001",
    authorId: "user-001", // Juan Pérez (OWNER)
    text: "Prioridad máxima. Contactar al ingeniero estructural de inmediato. Suspender trabajos en la zona afectada.",
    commentType: "FOLLOWUP",
    createdAt: "2024-12-26T09:00:00Z",
    updatedAt: "2024-12-26T09:00:00Z",
    isEdited: false,
    deletedAt: undefined,
  },
  {
    id: "comment-002",
    organizationId: DEFAULT_ORG_ID,
    incidentId: "inc-001",
    authorId: "user-002", // Carlos Mendoza
    text: "Ya contacté al Ing. García. Confirmó visita para las 11:00 hrs. Zona acordonada y personal reubicado temporalmente.",
    commentType: "FOLLOWUP",
    createdAt: "2024-12-26T09:30:00Z",
    updatedAt: "2024-12-26T09:30:00Z",
    isEdited: false,
    deletedAt: undefined,
  },

  // ============================================
  // INCIDENCIA 2: Solicitud de material
  // ============================================
  {
    id: "comment-003",
    organizationId: DEFAULT_ORG_ID,
    incidentId: "inc-002",
    authorId: "user-002", // Carlos Mendoza
    text: "Asignado a Roberto para coordinación con proveedor. Verificar disponibilidad en almacén antes de hacer pedido.",
    commentType: "ASSIGNMENT",
    createdAt: "2024-12-25T16:00:00Z",
    updatedAt: "2024-12-25T16:00:00Z",
    isEdited: false,
    deletedAt: undefined,
  },
  {
    id: "comment-004",
    organizationId: DEFAULT_ORG_ID,
    incidentId: "inc-002",
    authorId: "user-004", // Roberto Sánchez
    text: "Revisado inventario. Tenemos 150 sacos en almacén. Pedido de 350 adicionales realizado a Cemex. Entrega estimada: 27/12.",
    commentType: "FOLLOWUP",
    createdAt: "2024-12-25T17:30:00Z",
    updatedAt: "2024-12-25T17:30:00Z",
    isEdited: false,
    deletedAt: undefined,
  },

  // ============================================
  // INCIDENCIA 4: Certificación de concreto
  // ============================================
  {
    id: "comment-005",
    organizationId: DEFAULT_ORG_ID,
    incidentId: "inc-004",
    authorId: "user-007", // Laura Torres
    text: "Laboratorio confirmado para mañana 8:00 AM. Preparar cilindros de prueba y acceso a zona de colado.",
    commentType: "ASSIGNMENT",
    createdAt: "2024-12-24T18:30:00Z",
    updatedAt: "2024-12-24T18:30:00Z",
    isEdited: false,
    deletedAt: undefined,
  },

  // ============================================
  // INCIDENCIA 5: Retraso en material (CRITICAL)
  // ============================================
  {
    id: "comment-006",
    organizationId: DEFAULT_ORG_ID,
    incidentId: "inc-005",
    authorId: "user-001", // Juan Pérez (OWNER)
    text: "Escalar a gerencia de compras. Evaluar proveedores alternativos para minimizar impacto en cronograma.",
    commentType: "FOLLOWUP",
    createdAt: "2024-12-24T10:00:00Z",
    updatedAt: "2024-12-24T10:00:00Z",
    isEdited: false,
    deletedAt: undefined,
  },
  {
    id: "comment-007",
    organizationId: DEFAULT_ORG_ID,
    incidentId: "inc-005",
    authorId: "user-002", // Carlos Mendoza
    text: "Contacté a DeAcero. Pueden entregar 50% del pedido en 2 días. Reprogramando armado para comenzar con material parcial.",
    commentType: "FOLLOWUP",
    createdAt: "2024-12-24T14:00:00Z",
    updatedAt: "2024-12-24T14:00:00Z",
    isEdited: false,
    deletedAt: undefined,
  },

  // ============================================
  // INCIDENCIA 6: Consulta acabados (CLOSED)
  // ============================================
  {
    id: "comment-008",
    organizationId: DEFAULT_ORG_ID,
    incidentId: "inc-006",
    authorId: "user-001", // Juan Pérez (OWNER)
    text: "Revisado con cliente. Se aprueba cambio a mármol Carrara. Diferencia de costo asumida por cliente. Documentación adjunta en correo.",
    commentType: "ASSIGNMENT",
    createdAt: "2024-12-24T09:00:00Z",
    updatedAt: "2024-12-24T09:00:00Z",
    isEdited: false,
    deletedAt: undefined,
  },
  {
    id: "comment-009",
    organizationId: DEFAULT_ORG_ID,
    incidentId: "inc-006",
    authorId: "user-001", // Juan Pérez (OWNER)
    text: "Especificaciones enviadas por correo electrónico al cliente. Se aprueba cambio de porcelanato por mármol según cotización adjunta.",
    commentType: "CLOSURE",
    createdAt: "2024-12-24T10:00:00Z",
    updatedAt: "2024-12-24T10:00:00Z",
    isEdited: false,
    deletedAt: undefined,
  },

  // ============================================
  // INCIDENCIA 7: Solicitud de varillas (CLOSED)
  // ============================================
  {
    id: "comment-010",
    organizationId: DEFAULT_ORG_ID,
    incidentId: "inc-007",
    authorId: "user-002", // Carlos Mendoza
    text: "Verificado en almacén. Tenemos 120 varillas disponibles. Solicitar 80 adicionales.",
    commentType: "ASSIGNMENT",
    createdAt: "2024-12-22T11:00:00Z",
    updatedAt: "2024-12-22T11:00:00Z",
    isEdited: false,
    deletedAt: undefined,
  },
  {
    id: "comment-011",
    organizationId: DEFAULT_ORG_ID,
    incidentId: "inc-007",
    authorId: "user-002", // Carlos Mendoza
    text: "Material entregado en sitio. Verificada cantidad y calidad por almacenista.",
    commentType: "CLOSURE",
    createdAt: "2024-12-23T14:00:00Z",
    updatedAt: "2024-12-23T14:00:00Z",
    isEdited: false,
    deletedAt: undefined,
  },

  // ============================================
  // INCIDENCIA 8: Modificación ductos hospital
  // ============================================
  {
    id: "comment-012",
    organizationId: DEFAULT_ORG_ID,
    incidentId: "inc-008",
    authorId: "user-002", // Carlos Mendoza
    text: "Asignado a Ana López para coordinación con instalador HVAC. Normativa actualizada requiere cambios en dimensiones de ductos.",
    commentType: "ASSIGNMENT",
    createdAt: "2024-12-25T10:30:00Z",
    updatedAt: "2024-12-25T10:30:00Z",
    isEdited: false,
    deletedAt: undefined,
  },
  {
    id: "comment-013",
    organizationId: DEFAULT_ORG_ID,
    incidentId: "inc-008",
    authorId: "user-005", // Ana López
    text: "Reunión programada con instalador para el 27/12 a las 9:00. Revisaremos planos actualizados y plan de trabajo.",
    commentType: "FOLLOWUP",
    createdAt: "2024-12-25T14:00:00Z",
    updatedAt: "2024-12-25T14:00:00Z",
    isEdited: false,
    deletedAt: undefined,
  },
];

// ============================================
// COMENTARIOS CON AUTOR (Para UI)
// ============================================

/**
 * Genera comentarios con datos de autor
 */
export function getCommentsWithAuthor(incidentId: string): CommentWithAuthor[] {
  return mockComments
    .filter((comment) => comment.incidentId === incidentId && !comment.deletedAt)
    .map((comment) => {
      const author = getUserById(comment.authorId);
      return {
        ...comment,
        authorName: author?.fullName ?? "Usuario desconocido",
        authorAvatar: author?.profilePictureUrl,
        authorRole: author?.role ?? "CABO",
      };
    })
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

// ============================================
// HELPERS
// ============================================

/**
 * Obtiene comentario por ID
 */
export function getCommentById(id: string): Comment | undefined {
  return mockComments.find((comment) => comment.id === id);
}

/**
 * Obtiene comentarios de una incidencia
 */
export function getCommentsByIncident(incidentId: string): Comment[] {
  return mockComments
    .filter((comment) => comment.incidentId === incidentId && !comment.deletedAt)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

/**
 * Cuenta comentarios de una incidencia
 */
export function countCommentsByIncident(incidentId: string): number {
  return getCommentsByIncident(incidentId).length;
}

/**
 * Obtiene comentarios por tipo
 */
export function getCommentsByType(
  incidentId: string,
  commentType: Comment["commentType"]
): Comment[] {
  return mockComments.filter(
    (comment) =>
      comment.incidentId === incidentId &&
      comment.commentType === commentType &&
      !comment.deletedAt
  );
}

/**
 * Obtiene el comentario de cierre de una incidencia
 */
export function getClosureComment(incidentId: string): Comment | undefined {
  return mockComments.find(
    (comment) =>
      comment.incidentId === incidentId &&
      comment.commentType === "CLOSURE" &&
      !comment.deletedAt
  );
}

/**
 * Obtiene comentarios de un usuario
 */
export function getCommentsByUser(userId: string): Comment[] {
  return mockComments.filter(
    (comment) => comment.authorId === userId && !comment.deletedAt
  );
}

/**
 * Cuenta comentarios por tipo en una incidencia
 */
export function countCommentsByType(
  incidentId: string
): Record<Comment["commentType"], number> {
  const comments = getCommentsByIncident(incidentId);
  return {
    ASSIGNMENT: comments.filter((c) => c.commentType === "ASSIGNMENT").length,
    CLOSURE: comments.filter((c) => c.commentType === "CLOSURE").length,
    FOLLOWUP: comments.filter((c) => c.commentType === "FOLLOWUP").length,
  };
}
