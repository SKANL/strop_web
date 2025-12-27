/**
 * Datos mock de fotografías/evidencia
 * Basado en REQUIREMENTS_V2.md Sección 2.5
 */

import type { Photo } from "./types";

// ============================================
// CONSTANTE: ID de organización por defecto
// ============================================
const DEFAULT_ORG_ID = "org-001";

// ============================================
// FOTOGRAFÍAS MOCK
// ============================================

/**
 * Fotografías de incidencias
 */
export const mockPhotos: Photo[] = [
  // ============================================
  // INCIDENCIA 1: Falla estructural (CRITICAL)
  // ============================================
  {
    id: "photo-001",
    organizationId: DEFAULT_ORG_ID,
    incidentId: "inc-001",
    storagePath: "/organizations/org-001/projects/proj-001/incidents/inc-001/photo_001_1703577000.jpg",
    uploadedBy: "user-002",
    uploadedAt: "2024-12-26T08:30:00Z",
    originalFilename: "columna_c15_vista_general.jpg",
    fileSize: 2456789, // ~2.4MB
    metadata: {
      gpsLat: 19.4326,
      gpsLng: -99.1332,
      timestampDevice: "2024-12-26T08:28:45Z",
      watermarkVerified: true,
    },
    deletedAt: undefined,
  },
  {
    id: "photo-002",
    organizationId: DEFAULT_ORG_ID,
    incidentId: "inc-001",
    storagePath: "/organizations/org-001/projects/proj-001/incidents/inc-001/photo_002_1703577060.jpg",
    uploadedBy: "user-002",
    uploadedAt: "2024-12-26T08:31:00Z",
    originalFilename: "columna_c15_detalle_grieta.jpg",
    fileSize: 3102456, // ~3.1MB
    metadata: {
      gpsLat: 19.4326,
      gpsLng: -99.1332,
      timestampDevice: "2024-12-26T08:29:30Z",
      watermarkVerified: true,
    },
    deletedAt: undefined,
  },
  {
    id: "photo-003",
    organizationId: DEFAULT_ORG_ID,
    incidentId: "inc-001",
    storagePath: "/organizations/org-001/projects/proj-001/incidents/inc-001/photo_003_1703577120.jpg",
    uploadedBy: "user-002",
    uploadedAt: "2024-12-26T08:32:00Z",
    originalFilename: "columna_c15_medicion.jpg",
    fileSize: 1856234, // ~1.8MB
    metadata: {
      gpsLat: 19.4326,
      gpsLng: -99.1332,
      timestampDevice: "2024-12-26T08:30:15Z",
      watermarkVerified: true,
    },
    deletedAt: undefined,
  },

  // ============================================
  // INCIDENCIA 2: Solicitud de material
  // ============================================
  {
    id: "photo-004",
    organizationId: DEFAULT_ORG_ID,
    incidentId: "inc-002",
    storagePath: "/organizations/org-001/projects/proj-002/incidents/inc-002/photo_001_1703512500.jpg",
    uploadedBy: "user-003",
    uploadedAt: "2024-12-25T14:15:00Z",
    originalFilename: "zona_cimentacion_actual.jpg",
    fileSize: 2234567,
    metadata: {
      gpsLat: 25.6866,
      gpsLng: -100.3161,
      timestampDevice: "2024-12-25T14:13:20Z",
      watermarkVerified: true,
    },
    deletedAt: undefined,
  },

  // ============================================
  // INCIDENCIA 3: Modificación de planos
  // ============================================
  {
    id: "photo-005",
    organizationId: DEFAULT_ORG_ID,
    incidentId: "inc-003",
    storagePath: "/organizations/org-001/projects/proj-001/incidents/inc-003/photo_001_1703503500.jpg",
    uploadedBy: "user-005",
    uploadedAt: "2024-12-25T11:45:00Z",
    originalFilename: "instalacion_electrica_nivel5.jpg",
    fileSize: 2678901,
    metadata: {
      gpsLat: 19.4328,
      gpsLng: -99.1330,
      timestampDevice: "2024-12-25T11:43:10Z",
      watermarkVerified: true,
    },
    deletedAt: undefined,
  },
  {
    id: "photo-006",
    organizationId: DEFAULT_ORG_ID,
    incidentId: "inc-003",
    storagePath: "/organizations/org-001/projects/proj-001/incidents/inc-003/photo_002_1703503560.jpg",
    uploadedBy: "user-005",
    uploadedAt: "2024-12-25T11:46:00Z",
    originalFilename: "plano_original_comparacion.jpg",
    fileSize: 1987654,
    metadata: {
      gpsLat: 19.4328,
      gpsLng: -99.1330,
      timestampDevice: "2024-12-25T11:44:30Z",
      watermarkVerified: true,
    },
    deletedAt: undefined,
  },

  // ============================================
  // INCIDENCIA 4: Certificación de concreto
  // ============================================
  {
    id: "photo-007",
    organizationId: DEFAULT_ORG_ID,
    incidentId: "inc-004",
    storagePath: "/organizations/org-001/projects/proj-003/incidents/inc-004/photo_001_1703433600.jpg",
    uploadedBy: "user-006",
    uploadedAt: "2024-12-24T16:00:00Z",
    originalFilename: "losa_nivel8_preparacion.jpg",
    fileSize: 3456789,
    metadata: {
      gpsLat: 21.1619,
      gpsLng: -101.6860,
      timestampDevice: "2024-12-24T15:58:00Z",
      watermarkVerified: true,
    },
    deletedAt: undefined,
  },

  // ============================================
  // INCIDENCIA 5: Retraso en material (CRITICAL)
  // ============================================
  {
    id: "photo-008",
    organizationId: DEFAULT_ORG_ID,
    incidentId: "inc-005",
    storagePath: "/organizations/org-001/projects/proj-003/incidents/inc-005/photo_001_1703409600.jpg",
    uploadedBy: "user-008",
    uploadedAt: "2024-12-24T09:20:00Z",
    originalFilename: "almacen_sin_acero.jpg",
    fileSize: 2123456,
    metadata: {
      gpsLat: 21.1620,
      gpsLng: -101.6855,
      timestampDevice: "2024-12-24T09:18:30Z",
      watermarkVerified: true,
    },
    deletedAt: undefined,
  },

  // ============================================
  // INCIDENCIA 6: Consulta acabados (CLOSED)
  // ============================================
  {
    id: "photo-009",
    organizationId: DEFAULT_ORG_ID,
    incidentId: "inc-006",
    storagePath: "/organizations/org-001/projects/proj-004/incidents/inc-006/photo_001_1703338200.jpg",
    uploadedBy: "user-009",
    uploadedAt: "2024-12-23T13:30:00Z",
    originalFilename: "area_recepcion_actual.jpg",
    fileSize: 2567890,
    metadata: {
      gpsLat: 19.4362,
      gpsLng: -99.1945,
      timestampDevice: "2024-12-23T13:28:00Z",
      watermarkVerified: true,
    },
    deletedAt: undefined,
  },
  {
    id: "photo-010",
    organizationId: DEFAULT_ORG_ID,
    incidentId: "inc-006",
    storagePath: "/organizations/org-001/projects/proj-004/incidents/inc-006/photo_002_1703338260.jpg",
    uploadedBy: "user-009",
    uploadedAt: "2024-12-23T13:31:00Z",
    originalFilename: "muestra_piso_propuesto.jpg",
    fileSize: 1876543,
    metadata: {
      gpsLat: 19.4362,
      gpsLng: -99.1945,
      timestampDevice: "2024-12-23T13:29:30Z",
      watermarkVerified: true,
    },
    deletedAt: undefined,
  },
];

// ============================================
// HELPERS
// ============================================

/**
 * Obtiene foto por ID
 */
export function getPhotoById(id: string): Photo | undefined {
  return mockPhotos.find((photo) => photo.id === id);
}

/**
 * Obtiene fotos de una incidencia
 */
export function getPhotosByIncident(incidentId: string): Photo[] {
  return mockPhotos.filter(
    (photo) => photo.incidentId === incidentId && !photo.deletedAt
  );
}

/**
 * Cuenta fotos de una incidencia
 */
export function countPhotosByIncident(incidentId: string): number {
  return getPhotosByIncident(incidentId).length;
}

/**
 * Obtiene fotos de una organización
 */
export function getPhotosByOrganization(organizationId: string): Photo[] {
  return mockPhotos.filter(
    (photo) => photo.organizationId === organizationId && !photo.deletedAt
  );
}

/**
 * Calcula uso de almacenamiento de una organización (en bytes)
 */
export function getStorageUsage(organizationId: string): {
  totalBytes: number;
  totalMb: number;
  photoCount: number;
} {
  const photos = getPhotosByOrganization(organizationId);
  const totalBytes = photos.reduce((sum, photo) => sum + (photo.fileSize || 0), 0);
  
  return {
    totalBytes,
    totalMb: Math.round(totalBytes / (1024 * 1024)),
    photoCount: photos.length,
  };
}

/**
 * Genera URL pública mock para una foto
 * En producción, esto vendría de Supabase Storage
 */
export function getPhotoPublicUrl(photo: Photo): string {
  // Mock: usar un placeholder con el ID
  return `https://placeholder.photos/800x600?text=${encodeURIComponent(photo.originalFilename || photo.id)}`;
}

/**
 * Genera URLs públicas para todas las fotos de una incidencia
 */
export function getIncidentPhotoUrls(incidentId: string): string[] {
  return getPhotosByIncident(incidentId).map(getPhotoPublicUrl);
}
