/**
 * Mock data for Bitácora Operativa (Construction Daily Log)
 * Sample operational logs with hash chaining and GPS data
 */

import type { OperationalLog, DailyWeather, DailyClosure } from "@/features/bitacora-operativa/types";
import { mockUsers } from "./users";

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateHash(content: string): string {
  // Simulated SHA-256 hash (first 8 chars)
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0').slice(0, 8);
}

// ============================================
// WEATHER DATA
// ============================================

export const mockWeatherData: DailyWeather[] = [
  { date: "2025-12-31", temp: 18, condition: "rain", precipitationMm: 45 },
  { date: "2025-12-30", temp: 22, condition: "cloud", precipitationMm: 0 },
  { date: "2025-12-29", temp: 25, condition: "sun", precipitationMm: 0 },
  { date: "2025-12-28", temp: 15, condition: "storm", precipitationMm: 78 },
];

// ============================================
// OPERATIONAL LOGS
// ============================================

const residente = mockUsers.find(u => u.role === "RESIDENT") || mockUsers[0];
const superintendente = mockUsers.find(u => u.role === "SUPERINTENDENT") || mockUsers[0];
const cabo = mockUsers.find(u => u.role === "CABO") || mockUsers[0];

export const mockOperationalLogs: OperationalLog[] = [
  // === 31 de Diciembre ===
  {
    id: "log-001",
    folio: 1,
    projectId: "proj-001",
    userDate: "2025-12-31T09:45:00Z",
    serverDate: "2025-12-31T09:47:32Z",
    category: "HSE",
    author: {
      id: residente.id,
      name: residente.fullName,
      role: residente.role,
      avatar: residente.profilePictureUrl,
    },
    content: {
      title: "Personal sin EPP en Nivel 4",
      description: "Se detectó a 3 trabajadores sin arnés de seguridad en el andamio del eje 4. Se detuvo la actividad y se envió al personal a equiparse correctamente.",
    },
    evidence: {
      photos: [
        { url: "/mock/photos/hse-001.jpg", exifDate: "2025-12-31T09:44:12Z", exifGps: { lat: 19.4326, lng: -99.1332 } },
        { url: "/mock/photos/hse-002.jpg", exifDate: "2025-12-31T09:44:45Z", exifGps: { lat: 19.4326, lng: -99.1332 } },
      ],
    },
    gps: { lat: 19.4326, lng: -99.1332, inGeofence: true },
    integrity: {
      hash: generateHash("log-001-hse-epp"),
      previousHash: "00000000",
      verified: true,
    },
    status: "PUBLISHED",
  },
  {
    id: "log-002",
    folio: 2,
    projectId: "proj-001",
    userDate: "2025-12-31T11:30:00Z",
    serverDate: "2025-12-31T11:32:15Z",
    category: "MATERIAL",
    author: {
      id: cabo.id,
      name: cabo.fullName,
      role: cabo.role,
      avatar: cabo.profilePictureUrl,
    },
    content: {
      title: "Recepción de Acero (40 toneladas)",
      description: "Se recibieron 40 toneladas de acero corrugado #4 y #6. Remisión #RC-2025-1234. Se verificó cantidad y calidad conforme a especificaciones.",
    },
    evidence: {
      photos: [
        { url: "/mock/photos/mat-001.jpg", exifDate: "2025-12-31T11:28:05Z", exifGps: { lat: 19.4327, lng: -99.1330 } },
      ],
    },
    gps: { lat: 19.4327, lng: -99.1330, inGeofence: true },
    integrity: {
      hash: generateHash("log-002-material-acero"),
      previousHash: generateHash("log-001-hse-epp"),
      verified: true,
    },
    status: "PUBLISHED",
  },
  {
    id: "log-003",
    folio: 3,
    projectId: "proj-001",
    userDate: "2025-12-31T14:15:00Z",
    serverDate: "2025-12-31T14:18:42Z",
    category: "CLIMA",
    author: {
      id: residente.id,
      name: residente.fullName,
      role: residente.role,
      avatar: residente.profilePictureUrl,
    },
    content: {
      title: "Suspensión por lluvia intensa",
      description: "Se suspendieron actividades de colado debido a precipitación pluvial intensa (45mm). Se protegieron los elementos de acero expuestos.",
    },
    evidence: {
      photos: [
        { url: "/mock/photos/clima-001.jpg", exifDate: "2025-12-31T14:12:30Z", exifGps: { lat: 19.4325, lng: -99.1335 } },
      ],
    },
    gps: { lat: 19.4325, lng: -99.1335, inGeofence: true },
    integrity: {
      hash: generateHash("log-003-clima-lluvia"),
      previousHash: generateHash("log-002-material-acero"),
      verified: true,
    },
    status: "PUBLISHED",
  },
  {
    id: "log-004",
    folio: 4,
    projectId: "proj-001",
    userDate: "2025-12-31T16:00:00Z",
    serverDate: "2025-12-31T16:02:10Z",
    category: "BLOQUEO",
    author: {
      id: superintendente.id,
      name: superintendente.fullName,
      role: superintendente.role,
      avatar: superintendente.profilePictureUrl,
    },
    content: {
      title: "Bloqueo: Sin frente de trabajo",
      description: "El contratista de instalaciones eléctricas no liberó el frente para continuar con el colado de losa Nivel 5. Se notificó formalmente.",
    },
    evidence: {
      photos: [],
    },
    gps: { lat: 19.4328, lng: -99.1331, inGeofence: true },
    integrity: {
      hash: generateHash("log-004-bloqueo-frente"),
      previousHash: generateHash("log-003-clima-lluvia"),
      verified: true,
    },
    status: "PUBLISHED",
  },
  // === 30 de Diciembre ===
  {
    id: "log-005",
    folio: 5,
    projectId: "proj-001",
    userDate: "2025-12-30T08:00:00Z",
    serverDate: "2025-12-30T08:05:22Z",
    category: "AVANCE",
    author: {
      id: residente.id,
      name: residente.fullName,
      role: residente.role,
      avatar: residente.profilePictureUrl,
    },
    content: {
      title: "Colado de losa Nivel 4 completado",
      description: "Se completó el colado de losa del Nivel 4 (180 m³ de concreto f'c=250 kg/cm²). Pruebas de revenimiento satisfactorias.",
    },
    evidence: {
      photos: [
        { url: "/mock/photos/avance-001.jpg", exifDate: "2025-12-30T07:55:10Z", exifGps: { lat: 19.4326, lng: -99.1333 } },
        { url: "/mock/photos/avance-002.jpg", exifDate: "2025-12-30T07:58:45Z", exifGps: { lat: 19.4326, lng: -99.1333 } },
      ],
    },
    gps: { lat: 19.4326, lng: -99.1333, inGeofence: true },
    integrity: {
      hash: generateHash("log-005-avance-losa"),
      previousHash: generateHash("log-004-bloqueo-frente"),
      verified: true,
    },
    status: "LOCKED",
  },
  {
    id: "log-006",
    folio: 6,
    projectId: "proj-001",
    userDate: "2025-12-30T10:30:00Z",
    serverDate: "2025-12-30T10:35:18Z",
    category: "ADMINISTRATIVA",
    author: {
      id: superintendente.id,
      name: superintendente.fullName,
      role: superintendente.role,
      avatar: superintendente.profilePictureUrl,
    },
    content: {
      title: "Visita de supervisión externa",
      description: "Visita del Ing. Roberto Méndez (Supervisión Externa) para revisión de calidad estructural. Sin observaciones mayores.",
    },
    evidence: {
      photos: [],
    },
    gps: { lat: 19.4326, lng: -99.1332, inGeofence: true },
    integrity: {
      hash: generateHash("log-006-admin-visita"),
      previousHash: generateHash("log-005-avance-losa"),
      verified: true,
    },
    status: "LOCKED",
  },
  // === 29 de Diciembre ===
  {
    id: "log-007",
    folio: 7,
    projectId: "proj-001",
    userDate: "2025-12-29T09:00:00Z",
    serverDate: "2025-12-29T09:02:45Z",
    category: "MATERIAL",
    author: {
      id: cabo.id,
      name: cabo.fullName,
      role: cabo.role,
      avatar: cabo.profilePictureUrl,
    },
    content: {
      title: "Retraso en entrega de concreto",
      description: "La planta de concreto reportó retraso de 2 horas en el primer olla. Se ajustó la programación del colado.",
    },
    evidence: {
      photos: [],
    },
    gps: { lat: 19.4326, lng: -99.1332, inGeofence: true },
    integrity: {
      hash: generateHash("log-007-material-retraso"),
      previousHash: generateHash("log-006-admin-visita"),
      verified: true,
    },
    status: "LOCKED",
  },
  // === Log extemporáneo (para mostrar badge) ===
  {
    id: "log-008",
    folio: 8,
    projectId: "proj-001",
    userDate: "2025-12-28T15:00:00Z",
    serverDate: "2025-12-30T09:00:00Z", // 40+ hours later
    category: "HSE",
    author: {
      id: residente.id,
      name: residente.fullName,
      role: residente.role,
      avatar: residente.profilePictureUrl,
    },
    content: {
      title: "Registro extemporáneo: Incidente menor",
      description: "Trabajador sufrió cortadura menor en mano. Se aplicó primeros auxilios. NOTA: Registro tardío por falta de conectividad.",
    },
    evidence: {
      photos: [
        { url: "/mock/photos/hse-003.jpg", exifDate: "2025-12-28T15:02:00Z", exifGps: { lat: 19.4326, lng: -99.1332 } },
      ],
    },
    gps: { lat: 19.4326, lng: -99.1332, inGeofence: true },
    integrity: {
      hash: generateHash("log-008-hse-extemporaneo"),
      previousHash: generateHash("log-007-material-retraso"),
      verified: true,
    },
    status: "LOCKED",
  },
];

// ============================================
// DAILY CLOSURES
// ============================================

export const mockDailyClosures: DailyClosure[] = [
  {
    date: "2025-12-30",
    closedAt: "2025-12-30T23:45:00Z",
    closedBy: superintendente.id,
    closedByIp: "192.168.1.45",
    signature: generateHash("cierre-2025-12-30"),
  },
  {
    date: "2025-12-29",
    closedAt: "2025-12-29T22:30:00Z",
    closedBy: superintendente.id,
    closedByIp: "192.168.1.45",
    signature: generateHash("cierre-2025-12-29"),
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getOperationalLogsByProject(projectId: string): OperationalLog[] {
  return mockOperationalLogs.filter(log => log.projectId === projectId);
}

export function getOperationalLogById(id: string): OperationalLog | undefined {
  return mockOperationalLogs.find(log => log.id === id);
}

export function getWeatherForDate(date: string): DailyWeather | undefined {
  return mockWeatherData.find(w => w.date === date.split('T')[0]);
}

export function getClosureForDate(date: string): DailyClosure | undefined {
  return mockDailyClosures.find(c => c.date === date);
}

export function isExtemporaneous(log: OperationalLog): boolean {
  const userDate = new Date(log.userDate);
  const serverDate = new Date(log.serverDate);
  const diffHours = Math.abs(serverDate.getTime() - userDate.getTime()) / (1000 * 60 * 60);
  return diffHours > 24;
}

/**
 * Group logs by date for timeline display
 */
export function groupLogsByDate(logs: OperationalLog[]): Record<string, OperationalLog[]> {
  const grouped: Record<string, OperationalLog[]> = {};
  
  for (const log of logs) {
    const dateKey = log.userDate.split('T')[0];
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(log);
  }
  
  // Sort each group by time
  for (const date in grouped) {
    grouped[date].sort((a, b) => 
      new Date(a.userDate).getTime() - new Date(b.userDate).getTime()
    );
  }
  
  return grouped;
}

/**
 * Get stats for dashboard
 */
export function getBitacoraStats(projectId?: string) {
  const logs = projectId 
    ? getOperationalLogsByProject(projectId) 
    : mockOperationalLogs;
  
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter(l => l.userDate.startsWith(today));
  
  return {
    eventsToday: todayLogs.length,
    totalEvents: logs.length,
    pendingSignature: logs.filter(l => l.status === 'PUBLISHED').length,
    alerts: logs.filter(l => l.category === 'HSE' || l.category === 'BLOQUEO').length,
    chainIntegrity: logs.every(l => l.integrity.verified),
  };
}
