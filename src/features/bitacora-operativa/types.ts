/**
 * Types for Bitácora Operativa (Construction Daily Log)
 * Based on design documents V1 and V2
 */

import type { UserRole } from "@/lib/mock/types";

// ============================================
// ENUMS
// ============================================

/** Categorías de evento operativo */
export type LogCategory = 
  | 'AVANCE'        // Avance físico
  | 'MATERIAL'      // Suministros
  | 'HSE'           // Seguridad/Salud
  | 'CLIMA'         // Condiciones climáticas
  | 'BLOQUEO'       // Paro/impedimento
  | 'ADMINISTRATIVA'; // Visitas, minutas

/** Estados de nota */
export type LogStatus = 
  | 'DRAFT'      // Borrador editable
  | 'PUBLISHED'  // Publicado (inmutable)
  | 'LOCKED';    // Cerrado (día firmado)

/** Condiciones climáticas */
export type WeatherCondition = 'sun' | 'cloud' | 'rain' | 'storm';

// ============================================
// INTERFACES
// ============================================

export interface OperationalLog {
  id: string;
  folio: number;
  projectId: string;
  
  // Timestamps (V1: doble fecha)
  userDate: string;   // Cuándo ocurrió (usuario)
  serverDate: string; // Cuándo llegó (servidor)
  
  category: LogCategory;
  
  author: {
    id: string;
    name: string;
    role: UserRole;
    avatar?: string;
  };
  
  content: {
    title: string;
    description: string;
  };
  
  // Evidencia forense
  evidence: {
    photos: Array<{
      url: string;
      exifDate: string;
      exifGps: { lat: number; lng: number };
    }>;
  };
  
  // Geolocalización (V2: Geofencing)
  gps: {
    lat: number;
    lng: number;
    inGeofence: boolean;
  };
  
  // Integridad (V1: Hash chaining)
  integrity: {
    hash: string;
    previousHash: string;
    verified: boolean;
  };
  
  status: LogStatus;
}

export interface DailyWeather {
  date: string;
  temp: number;
  condition: WeatherCondition;
  precipitationMm: number;
}

export interface DailyClosure {
  date: string;
  closedAt: string;
  closedBy: string;
  closedByIp: string;
  signature: string;
}

// ============================================
// UI TYPES
// ============================================

export interface BitacoraFilterState {
  search: string;
  category: LogCategory[];
  dateRange: { from: string; to: string } | null;
  project: string[];
  author: string[];
  status: LogStatus[];
}

export const categoryLabels: Record<LogCategory, string> = {
  AVANCE: "Avance",
  MATERIAL: "Material",
  HSE: "Seguridad",
  CLIMA: "Clima",
  BLOQUEO: "Bloqueo",
  ADMINISTRATIVA: "Administrativa",
};

export const categoryColors: Record<LogCategory, string> = {
  AVANCE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  MATERIAL: "bg-blue-100 text-blue-700 border-blue-200",
  HSE: "bg-red-100 text-red-700 border-red-200",
  CLIMA: "bg-sky-100 text-sky-700 border-sky-200",
  BLOQUEO: "bg-amber-100 text-amber-700 border-amber-200",
  ADMINISTRATIVA: "bg-purple-100 text-purple-700 border-purple-200",
};

export const statusLabels: Record<LogStatus, string> = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicado",
  LOCKED: "Cerrado",
};
