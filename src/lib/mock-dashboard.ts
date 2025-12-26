// mock-dashboard.ts - Datos simulados para el Dashboard
// Basado en REQUIREMENTS_V2.md - Strop SaaS para construcción

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
  logoUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "SUPERINTENDENT" | "RESIDENT" | "CABO";
  avatar?: string;
  avatarUrl?: string;
  isActive: boolean;
  phone?: string;
  lastActiveAt?: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
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

export interface Incident {
  id: string;
  type: "ORDERS_INSTRUCTIONS" | "REQUESTS_QUERIES" | "CERTIFICATIONS" | "INCIDENT_NOTIFICATIONS" | "MATERIAL_REQUEST";
  description: string;
  priority: "NORMAL" | "CRITICAL";
  status: "OPEN" | "ASSIGNED" | "CLOSED";
  projectId: string;
  projectName: string;
  createdBy: string;
  createdByAvatar?: string;
  createdAt: string;
  assignedTo?: string;
  assignedToAvatar?: string;
  closedAt?: string;
  closingNote?: string;
  gpsLat?: number;
  gpsLng?: number;
  photoUrl?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "critical";
  time: string;
  read: boolean;
}

export interface Activity {
  id: string;
  action: string;
  user: string;
  userAvatar?: string;
  target: string;
  timestamp: string;
  type: "incident" | "project" | "user" | "system";
}

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

// Tipo español para los tipos de incidencia
export const incidentTypeLabels: Record<Incident["type"], string> = {
  ORDERS_INSTRUCTIONS: "Órdenes e Instrucciones",
  REQUESTS_QUERIES: "Solicitudes y Consultas", 
  CERTIFICATIONS: "Certificaciones",
  INCIDENT_NOTIFICATIONS: "Notificación de Incidentes",
  MATERIAL_REQUEST: "Solicitud de Material",
};

export const priorityLabels: Record<Incident["priority"], string> = {
  NORMAL: "Normal",
  CRITICAL: "Crítico",
};

export const statusLabels: Record<Incident["status"], string> = {
  OPEN: "Abierto",
  ASSIGNED: "Asignado",
  CLOSED: "Cerrado",
};

export const projectStatusLabels: Record<Project["status"], string> = {
  ACTIVE: "Activo",
  PAUSED: "Pausado",
  COMPLETED: "Completado",
};

export const roleLabels: Record<User["role"], string> = {
  OWNER: "Dueño/Admin",
  SUPERINTENDENT: "Superintendente",
  RESIDENT: "Residente",
  CABO: "Cabo",
};

// ============================================
// MOCK DATA
// ============================================

export const mockOrganization: Organization = {
  id: "org-001",
  name: "Constructora Demo S.A.",
  slug: "constructora-demo",
  plan: "PROFESSIONAL",
};

export const mockCurrentUser: User = {
  id: "user-001",
  name: "Juan Pérez García",
  email: "juan.perez@constructora-demo.com",
  role: "OWNER",
  isActive: true,
  avatarUrl: "https://api.dicebear.com/8.x/initials/svg?seed=JPG",
  phone: "+52 55 1234 5678",
  lastActiveAt: "2024-12-26T10:00:00",
};

export const mockKPIs: KPIData = {
  totalProjects: 12,
  activeProjects: 8,
  totalIncidents: 156,
  openIncidents: 23,
  criticalIncidents: 3,
  resolvedThisWeek: 15,
  avgResolutionTime: "2.5 días",
  totalUsers: 45,
};

export const mockProjects: Project[] = [
  {
    id: "proj-001",
    name: "Torre Residencial Norte",
    location: "Av. Reforma 1500, CDMX",
    status: "ACTIVE",
    startDate: "2024-06-01",
    endDate: "2025-12-31",
    progress: 45,
    totalIncidents: 34,
    openIncidents: 5,
    criticalIncidents: 1,
    membersCount: 12,
    budget: 15000000,
    budgetSpent: 6750000,
    description: "Desarrollo de torre residencial de 25 pisos con amenidades premium.",
  },
  {
    id: "proj-002",
    name: "Centro Comercial Plaza Sur",
    location: "Blvd. Insurgentes 2300, Monterrey",
    status: "ACTIVE",
    startDate: "2024-03-15",
    endDate: "2025-09-30",
    progress: 62,
    totalIncidents: 45,
    openIncidents: 8,
    criticalIncidents: 0,
    membersCount: 18,
    budget: 28000000,
    budgetSpent: 17360000,
    description: "Centro comercial de 3 niveles con estacionamiento subterráneo.",
  },
  {
    id: "proj-003",
    name: "Complejo Industrial Bajío",
    location: "Parque Industrial León, Guanajuato",
    status: "ACTIVE",
    startDate: "2024-08-01",
    endDate: "2026-02-28",
    progress: 25,
    totalIncidents: 18,
    openIncidents: 4,
    criticalIncidents: 2,
    membersCount: 8,
    budget: 45000000,
    budgetSpent: 11250000,
    description: "Complejo de 5 naves industriales con oficinas administrativas.",
  },
  {
    id: "proj-004",
    name: "Edificio Corporativo Polanco",
    location: "Campos Elíseos 345, CDMX",
    status: "PAUSED",
    startDate: "2024-01-10",
    endDate: "2025-06-30",
    progress: 78,
    totalIncidents: 52,
    openIncidents: 3,
    criticalIncidents: 0,
    membersCount: 15,
    budget: 22000000,
    budgetSpent: 17160000,
    description: "Edificio corporativo de 12 pisos con certificación LEED.",
  },
  {
    id: "proj-005",
    name: "Hospital Regional Querétaro",
    location: "Av. Constituyentes 890, Querétaro",
    status: "ACTIVE",
    startDate: "2024-09-01",
    endDate: "2026-06-30",
    progress: 15,
    totalIncidents: 7,
    openIncidents: 3,
    criticalIncidents: 0,
    membersCount: 10,
    budget: 85000000,
    budgetSpent: 12750000,
    description: "Hospital de especialidades con 200 camas y área de urgencias.",
  },
];

export const mockIncidents: Incident[] = [
  {
    id: "inc-001",
    type: "INCIDENT_NOTIFICATIONS",
    description: "Falla estructural detectada en columna C-15 del nivel 3. Se requiere evaluación inmediata.",
    priority: "CRITICAL",
    status: "OPEN",
    projectId: "proj-001",
    projectName: "Torre Residencial Norte",
    createdBy: "Carlos Mendoza",
    createdByAvatar: "https://api.dicebear.com/8.x/initials/svg?seed=CM",
    createdAt: "2024-12-26T08:30:00",
    gpsLat: 19.4326,
    gpsLng: -99.1332,
  },
  {
    id: "inc-002",
    type: "MATERIAL_REQUEST",
    description: "Solicitud de 500 sacos de cemento Portland para cimentación zona B.",
    priority: "NORMAL",
    status: "ASSIGNED",
    projectId: "proj-002",
    projectName: "Centro Comercial Plaza Sur",
    createdBy: "María García",
    createdByAvatar: "https://api.dicebear.com/8.x/initials/svg?seed=MG",
    createdAt: "2024-12-25T14:15:00",
    assignedTo: "Roberto Sánchez",
    assignedToAvatar: "https://api.dicebear.com/8.x/initials/svg?seed=RS",
  },
  {
    id: "inc-003",
    type: "ORDERS_INSTRUCTIONS",
    description: "Modificación en planos de instalación eléctrica nivel 5. Actualizar antes de continuar.",
    priority: "NORMAL",
    status: "OPEN",
    projectId: "proj-001",
    projectName: "Torre Residencial Norte",
    createdBy: "Ana López",
    createdByAvatar: "https://api.dicebear.com/8.x/initials/svg?seed=AL",
    createdAt: "2024-12-25T11:45:00",
  },
  {
    id: "inc-004",
    type: "CERTIFICATIONS",
    description: "Certificación de calidad de concreto f'c=250 requerida para losa nivel 8.",
    priority: "NORMAL",
    status: "ASSIGNED",
    projectId: "proj-003",
    projectName: "Complejo Industrial Bajío",
    createdBy: "Pedro Ramírez",
    createdByAvatar: "https://api.dicebear.com/8.x/initials/svg?seed=PR",
    createdAt: "2024-12-24T16:00:00",
    assignedTo: "Laura Torres",
    assignedToAvatar: "https://api.dicebear.com/8.x/initials/svg?seed=LT",
  },
  {
    id: "inc-005",
    type: "INCIDENT_NOTIFICATIONS",
    description: "Retraso en entrega de acero estructural. Proveedor reporta 5 días de demora.",
    priority: "CRITICAL",
    status: "OPEN",
    projectId: "proj-003",
    projectName: "Complejo Industrial Bajío",
    createdBy: "Fernando Ortiz",
    createdByAvatar: "https://api.dicebear.com/8.x/initials/svg?seed=FO",
    createdAt: "2024-12-24T09:20:00",
  },
  {
    id: "inc-006",
    type: "REQUESTS_QUERIES",
    description: "Consulta sobre especificaciones de acabados para área de recepción.",
    priority: "NORMAL",
    status: "CLOSED",
    projectId: "proj-004",
    projectName: "Edificio Corporativo Polanco",
    createdBy: "Diana Herrera",
    createdByAvatar: "https://api.dicebear.com/8.x/initials/svg?seed=DH",
    createdAt: "2024-12-23T13:30:00",
    assignedTo: "Juan Pérez García",
    assignedToAvatar: "https://api.dicebear.com/8.x/initials/svg?seed=JPG",
    closedAt: "2024-12-24T10:00:00",
    closingNote: "Especificaciones enviadas por correo electrónico.",
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "notif-001",
    title: "Incidencia Crítica",
    message: "Nueva incidencia CRÍTICA en Torre Residencial Norte: Falla estructural en columna C-15",
    type: "critical",
    time: "Hace 2h",
    read: false,
  },
  {
    id: "notif-002",
    title: "Retraso en Material",
    message: "Proveedor de acero reporta retraso de 5 días para Complejo Industrial Bajío",
    type: "warning",
    time: "Hace 5h",
    read: false,
  },
  {
    id: "notif-003",
    title: "Proyecto Actualizado",
    message: "Centro Comercial Plaza Sur alcanzó 62% de avance",
    type: "info",
    time: "Hace 1d",
    read: true,
  },
  {
    id: "notif-004",
    title: "Nuevo Usuario",
    message: "Laura Torres se unió al equipo de Complejo Industrial Bajío",
    type: "info",
    time: "Hace 2d",
    read: true,
  },
];

export const mockActivity: Activity[] = [
  {
    id: "act-001",
    action: "creó incidencia crítica en",
    user: "Carlos Mendoza",
    userAvatar: "https://api.dicebear.com/8.x/initials/svg?seed=CM",
    target: "Torre Residencial Norte",
    timestamp: "Hace 2 horas",
    type: "incident",
  },
  {
    id: "act-002",
    action: "asignó incidencia a",
    user: "María García",
    userAvatar: "https://api.dicebear.com/8.x/initials/svg?seed=MG",
    target: "Roberto Sánchez",
    timestamp: "Hace 5 horas",
    type: "incident",
  },
  {
    id: "act-003",
    action: "actualizó progreso de",
    user: "Sistema",
    target: "Centro Comercial Plaza Sur (62%)",
    timestamp: "Hace 1 día",
    type: "project",
  },
  {
    id: "act-004",
    action: "cerró incidencia",
    user: "Juan Pérez García",
    userAvatar: "https://api.dicebear.com/8.x/initials/svg?seed=JPG",
    target: "Consulta de acabados - Polanco",
    timestamp: "Hace 1 día",
    type: "incident",
  },
  {
    id: "act-005",
    action: "agregó usuario",
    user: "Admin",
    target: "Laura Torres (Residente)",
    timestamp: "Hace 2 días",
    type: "user",
  },
  {
    id: "act-006",
    action: "subió documentación a",
    user: "Ana López",
    userAvatar: "https://api.dicebear.com/8.x/initials/svg?seed=AL",
    target: "Torre Residencial Norte",
    timestamp: "Hace 2 días",
    type: "project",
  },
  {
    id: "act-007",
    action: "solicitó materiales para",
    user: "Pedro Ramírez",
    userAvatar: "https://api.dicebear.com/8.x/initials/svg?seed=PR",
    target: "Complejo Industrial Bajío",
    timestamp: "Hace 3 días",
    type: "incident",
  },
];

export const mockUsers: User[] = [
  { id: "user-001", name: "Juan Pérez García", email: "juan.perez@constructora-demo.com", role: "OWNER", isActive: true, avatarUrl: "https://api.dicebear.com/8.x/initials/svg?seed=JPG", phone: "+52 55 1234 5678" },
  { id: "user-002", name: "Carlos Mendoza", email: "carlos.mendoza@constructora-demo.com", role: "SUPERINTENDENT", isActive: true, avatarUrl: "https://api.dicebear.com/8.x/initials/svg?seed=CM", phone: "+52 81 9876 5432" },
  { id: "user-003", name: "María García", email: "maria.garcia@constructora-demo.com", role: "RESIDENT", isActive: true, avatarUrl: "https://api.dicebear.com/8.x/initials/svg?seed=MG" },
  { id: "user-004", name: "Roberto Sánchez", email: "roberto.sanchez@constructora-demo.com", role: "CABO", isActive: true, avatarUrl: "https://api.dicebear.com/8.x/initials/svg?seed=RS" },
  { id: "user-005", name: "Ana López", email: "ana.lopez@constructora-demo.com", role: "RESIDENT", isActive: true, avatarUrl: "https://api.dicebear.com/8.x/initials/svg?seed=AL" },
  { id: "user-006", name: "Pedro Ramírez", email: "pedro.ramirez@constructora-demo.com", role: "CABO", isActive: true, avatarUrl: "https://api.dicebear.com/8.x/initials/svg?seed=PR" },
  { id: "user-007", name: "Laura Torres", email: "laura.torres@constructora-demo.com", role: "RESIDENT", isActive: true, avatarUrl: "https://api.dicebear.com/8.x/initials/svg?seed=LT" },
  { id: "user-008", name: "Fernando Ortiz", email: "fernando.ortiz@constructora-demo.com", role: "SUPERINTENDENT", isActive: false, avatarUrl: "https://api.dicebear.com/8.x/initials/svg?seed=FO" },
];
