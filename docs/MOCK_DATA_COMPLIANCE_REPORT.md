# 📊 INFORME DE CONFORMIDAD: Mock Data vs REQUIREMENTS_V2.md

> **Fecha:** 27 de Diciembre 2024  
> **Evaluación:** SaaS Strop Web Admin - Datos Mock  
> **Archivos analizados:**  
> - `src/lib/mock-dashboard.ts`  
> - `src/lib/mock-auth.ts`  
> - `docs/requeriments_DB/REQUIREMENTS_V2.md`

---

## 📋 RESUMEN EJECUTIVO

| Categoría | Puntuación | Estado |
|:----------|:----------:|:------:|
| **ORGANIZATIONS** | 60% | ⚠️ Parcial |
| **USERS** | 75% | ⚠️ Parcial |
| **PROJECTS** | 80% | ✅ Bueno |
| **INCIDENTS** | 90% | ✅ Excelente |
| **ENUMS/Tipos** | 95% | ✅ Excelente |
| **Multi-Tenant** | 40% | ❌ Crítico |
| **SCORE GLOBAL** | **73%** | ⚠️ Requiere Mejoras |

---

## ✅ CONFORMIDADES CORRECTAS

### 1. ROLES (100% ✅)

**REQUIREMENTS_V2.md:**
```sql
role ENUM('OWNER', 'SUPERINTENDENT', 'RESIDENT', 'CABO')
```

**mock-dashboard.ts:**
```typescript
role: "OWNER" | "SUPERINTENDENT" | "RESIDENT" | "CABO"
```

**Veredicto:** ✅ **CONFORME** - Los 4 roles están correctamente implementados.

---

### 2. TIPOS DE INCIDENCIA (100% ✅)

**REQUIREMENTS_V2.md (Sección 1.1):**
- Órdenes e Instrucciones
- Solicitudes y Consultas
- Certificaciones
- Notificaciones de Incidentes
- Solicitud de Material

**mock-dashboard.ts:**
```typescript
type: "ORDERS_INSTRUCTIONS" | "REQUESTS_QUERIES" | "CERTIFICATIONS" | "INCIDENT_NOTIFICATIONS" | "MATERIAL_REQUEST"
```

**Veredicto:** ✅ **CONFORME** - Los 5 tipos de incidencia están correctamente mapeados.

---

### 3. PRIORIDAD DE INCIDENCIAS (100% ✅)

**REQUIREMENTS_V2.md:**
```sql
priority ENUM('NORMAL', 'CRITICAL')
```

**mock-dashboard.ts:**
```typescript
priority: "NORMAL" | "CRITICAL"
```

**Veredicto:** ✅ **CONFORME** - Ambas prioridades implementadas.

---

### 4. ESTADOS DE INCIDENCIA (100% ✅)

**REQUIREMENTS_V2.md:**
```sql
status ENUM('OPEN', 'ASSIGNED', 'CLOSED')
```

**mock-dashboard.ts:**
```typescript
status: "OPEN" | "ASSIGNED" | "CLOSED"
```

**Veredicto:** ✅ **CONFORME** - Workflow lineal OPEN→ASSIGNED→CLOSED correcto.

---

### 5. ESTADOS DE PROYECTO (100% ✅)

**REQUIREMENTS_V2.md:**
```sql
status ENUM('ACTIVE', 'PAUSED', 'COMPLETED')
```

**mock-dashboard.ts:**
```typescript
status: "ACTIVE" | "PAUSED" | "COMPLETED"
```

**Veredicto:** ✅ **CONFORME** - Los 3 estados de proyecto implementados.

---

### 6. PLANES DE ORGANIZACIÓN (100% ✅)

**REQUIREMENTS_V2.md:**
```sql
plan ENUM('STARTER', 'PROFESSIONAL', 'ENTERPRISE')
```

**mock-dashboard.ts:**
```typescript
plan: "STARTER" | "PROFESSIONAL" | "ENTERPRISE"
```

**Veredicto:** ✅ **CONFORME** - Modelo SaaS de 3 tiers correcto.

---

### 7. CAMPOS GPS EN INCIDENCIAS (100% ✅)

**REQUIREMENTS_V2.md:**
```sql
gps_lat DECIMAL(10, 8) NOT NULL,
gps_lng DECIMAL(11, 8) NOT NULL,
```

**mock-dashboard.ts:**
```typescript
gpsLat?: number;
gpsLng?: number;
```

**Veredicto:** ✅ **CONFORME** - GPS implementado (aunque marcado opcional en mock, correcto para datos demo).

---

## ⚠️ DISCREPANCIAS ENCONTRADAS

### 1. ORGANIZACIÓN - Campos Faltantes (60%)

**REQUIREMENTS_V2.md define:**
```sql
CREATE TABLE organizations (
  id UUID,
  name VARCHAR(255),
  subdomain VARCHAR(100),
  slug VARCHAR(100),
  logo_url VARCHAR(500),
  billing_email VARCHAR(255),
  storage_quota_mb INT DEFAULT 5000,
  max_users INT DEFAULT 50,
  max_projects INT DEFAULT 100,
  plan ENUM('STARTER', 'PROFESSIONAL', 'ENTERPRISE'),
  trial_ends_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at, updated_at, deleted_at
);
```

**mock-dashboard.ts tiene:**
```typescript
interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
  logoUrl?: string;
}
```

**Campos Faltantes:**
| Campo | Estado |
|:------|:------:|
| `subdomain` | ❌ Falta |
| `billing_email` | ❌ Falta |
| `storage_quota_mb` | ❌ Falta |
| `max_users` | ❌ Falta |
| `max_projects` | ❌ Falta |
| `trial_ends_at` | ❌ Falta |
| `is_active` | ❌ Falta |
| `created_at` | ❌ Falta |

**Recomendación:** Agregar campos de cuota y trial para simular comportamiento SaaS completo.

---

### 2. USUARIOS - Campos Parciales (75%)

**REQUIREMENTS_V2.md define:**
```sql
CREATE TABLE users (
  id UUID,
  organization_id UUID NOT NULL, -- CRÍTICO
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role ENUM(...),
  is_active BOOLEAN,
  phone VARCHAR(20),
  profile_picture_url VARCHAR(500),
  timezone VARCHAR(50),
  language VARCHAR(10),
  invited_by UUID,
  created_at, updated_at, deleted_at, last_login
);
```

**mock-dashboard.ts tiene:**
```typescript
interface User {
  id: string;
  name: string;        // Debería ser full_name
  email: string;
  role: ...;
  avatar?: string;     // Debería ser profile_picture_url
  avatarUrl?: string;  // Duplicado innecesario
  isActive: boolean;
  phone?: string;
  lastActiveAt?: string;
}
```

**Problemas detectados:**
| Campo Requerido | Mock Actual | Problema |
|:----------------|:------------|:---------|
| `organization_id` | ❌ Falta | **CRÍTICO** - Multi-tenant |
| `full_name` | `name` | Nombre diferente |
| `profile_picture_url` | `avatar/avatarUrl` | Duplicado y nombre diferente |
| `timezone` | ❌ Falta | No implementado |
| `language` | ❌ Falta | No implementado |
| `invited_by` | ❌ Falta | No implementado |
| `created_at` | ❌ Falta | No implementado |
| `last_login` | `lastActiveAt` | Nombre diferente |

---

### 3. PROYECTOS - Campos Parciales (80%)

**REQUIREMENTS_V2.md define:**
```sql
CREATE TABLE projects (
  id UUID,
  organization_id UUID NOT NULL, -- CRÍTICO
  name VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('ACTIVE', 'PAUSED', 'COMPLETED'),
  created_by UUID NOT NULL,
  owner_id UUID,
  created_at, updated_at, deleted_at
);
```

**mock-dashboard.ts tiene:**
```typescript
interface Project {
  id: string;
  name: string;
  location: string;
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
  startDate: string;
  endDate: string;
  progress: number;           // ❓ No en requirements
  totalIncidents: number;     // ❓ Calculado, no almacenado
  openIncidents: number;      // ❓ Calculado
  criticalIncidents: number;  // ❓ Calculado
  membersCount: number;       // ❓ Calculado
  budget?: number;            // ❓ No en requirements
  budgetSpent?: number;       // ❓ No en requirements
  description?: string;
  coverImageUrl?: string;     // ❓ No en requirements
}
```

**Problemas detectados:**
| Campo Requerido | Mock Actual | Problema |
|:----------------|:------------|:---------|
| `organization_id` | ❌ Falta | **CRÍTICO** - Multi-tenant |
| `created_by` | ❌ Falta | Auditoría faltante |
| `owner_id` | ❌ Falta | Responsable faltante |
| `start_date/end_date` | `startDate/endDate` | camelCase vs snake_case |

**Campos extra en mock (no en requirements):**
- `progress` - Debería calcularse de `critical_path_items`
- `totalIncidents`, `openIncidents`, `criticalIncidents` - Calculados con COUNT()
- `membersCount` - Calculado de `project_members`
- `budget`, `budgetSpent` - No especificados (¿Post-MVP?)
- `coverImageUrl` - No especificado

---

### 4. INCIDENCIAS - Muy Bueno (90%)

**REQUIREMENTS_V2.md define:**
```sql
CREATE TABLE incidents (
  id UUID,
  organization_id UUID NOT NULL, -- CRÍTICO
  project_id UUID NOT NULL,
  created_by UUID NOT NULL,
  type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  priority ENUM('NORMAL', 'CRITICAL'),
  status ENUM('OPEN', 'ASSIGNED', 'CLOSED'),
  assigned_to UUID,
  created_at, updated_at, closed_at, closed_by,
  location_name VARCHAR(255),
  gps_lat DECIMAL(10, 8) NOT NULL,
  gps_lng DECIMAL(11, 8) NOT NULL,
  closed_notes TEXT,
  is_immutable BOOLEAN,
  deleted_at
);
```

**mock-dashboard.ts tiene:**
```typescript
interface Incident {
  id: string;
  type: "ORDERS_INSTRUCTIONS" | ...;  // ✅
  description: string;                 // ✅
  priority: "NORMAL" | "CRITICAL";    // ✅
  status: "OPEN" | "ASSIGNED" | "CLOSED"; // ✅
  projectId: string;                   // ✅
  projectName: string;                 // Extra (denormalizado)
  createdBy: string;                   // ✅ (debería ser UUID)
  createdByAvatar?: string;            // Extra
  createdAt: string;                   // ✅
  assignedTo?: string;                 // ✅
  assignedToAvatar?: string;           // Extra
  closedAt?: string;                   // ✅
  closingNote?: string;                // ⚠️ Debería ser closed_notes
  gpsLat?: number;                     // ✅
  gpsLng?: number;                     // ✅
  photoUrl?: string;                   // Extra (relación con PHOTOS)
}
```

**Problemas detectados:**
| Campo Requerido | Mock Actual | Problema |
|:----------------|:------------|:---------|
| `organization_id` | ❌ Falta | **CRÍTICO** - Multi-tenant |
| `closed_notes` | `closingNote` | Nombre diferente |
| `closed_by` | ❌ Falta | Auditoría de cierre |
| `location_name` | ❌ Falta | Descripción del lugar |
| `is_immutable` | ❌ Falta | Flag de bloqueo |

---

## ❌ PROBLEMAS CRÍTICOS

### 1. MULTI-TENANT NO IMPLEMENTADO (40%)

**Problema Principal:** El campo `organization_id` está **AUSENTE** en todas las interfaces mock:

```typescript
// ❌ ACTUAL (Incorrecto)
interface User {
  id: string;
  name: string;
  // ... falta organization_id
}

interface Project {
  id: string;
  name: string;
  // ... falta organization_id
}

interface Incident {
  id: string;
  projectId: string;
  // ... falta organization_id
}
```

**Requerido para SaaS:**
```typescript
// ✅ CORRECTO
interface User {
  id: string;
  organizationId: string;  // CRÍTICO
  // ...
}

interface Project {
  id: string;
  organizationId: string;  // CRÍTICO
  // ...
}

interface Incident {
  id: string;
  organizationId: string;  // CRÍTICO
  projectId: string;
  // ...
}
```

**Impacto:** Sin `organization_id`, no es posible:
- Implementar RLS policies de Supabase
- Aislar datos entre tenants
- Validar pertenencia de recursos

---

### 2. CONSISTENCIA mock-auth.ts vs mock-dashboard.ts

**mock-auth.ts tiene:**
```typescript
const mockUsers = [
  {
    id: "usr_001",
    email: "admin@constructora-xyz.com",
    password: "Admin123!",
    fullName: "Juan Pérez García",  // ← fullName
    role: "OWNER",
    organization: {
      id: "org_001",
      name: "Constructora XYZ S.A. de C.V.",
      subdomain: "constructora-xyz",  // ← subdomain existe
    },
  },
];
```

**mock-dashboard.ts tiene:**
```typescript
interface User {
  name: string;  // ← name (diferente)
}

interface Organization {
  // ← subdomain NO existe
}
```

**Problema:** Los dos archivos mock usan **nombres diferentes** para los mismos campos:
- `fullName` vs `name`
- `subdomain` existe en auth pero no en dashboard

---

### 3. TABLAS FALTANTES EN MOCK

Las siguientes tablas del REQUIREMENTS_V2.md **no tienen representación mock**:

| Tabla | Estado | Prioridad |
|:------|:------:|:---------:|
| `PROJECT_MEMBERS` | ❌ Falta | Alta |
| `PHOTOS` | ❌ Falta | Alta |
| `COMMENTS` | ❌ Falta | Media |
| `CRITICAL_PATH_ITEMS` | ❌ Falta | Media |
| `AUDIT_LOGS` | ❌ Falta | Baja |

---

## 🔧 RECOMENDACIONES DE CORRECCIÓN

### Prioridad ALTA (Hacer primero)

#### 1. Agregar `organizationId` a todas las interfaces

```typescript
// mock-dashboard.ts

interface Organization {
  id: string;
  name: string;
  subdomain: string;       // ← AGREGAR
  slug: string;
  plan: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
  logoUrl?: string;
  billingEmail?: string;   // ← AGREGAR
  storageQuotaMb: number;  // ← AGREGAR
  maxUsers: number;        // ← AGREGAR
  maxProjects: number;     // ← AGREGAR
  isActive: boolean;       // ← AGREGAR
  createdAt: string;       // ← AGREGAR
}

interface User {
  id: string;
  organizationId: string;  // ← AGREGAR (CRÍTICO)
  fullName: string;        // ← Renombrar de 'name'
  email: string;
  role: "OWNER" | "SUPERINTENDENT" | "RESIDENT" | "CABO";
  profilePictureUrl?: string;  // ← Renombrar de 'avatar'
  isActive: boolean;
  phone?: string;
  timezone?: string;       // ← AGREGAR
  language?: string;       // ← AGREGAR
  invitedBy?: string;      // ← AGREGAR
  createdAt: string;       // ← AGREGAR
  lastLogin?: string;      // ← Renombrar de 'lastActiveAt'
}

interface Project {
  id: string;
  organizationId: string;  // ← AGREGAR (CRÍTICO)
  name: string;
  location: string;
  description?: string;
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
  startDate: string;
  endDate: string;
  createdBy: string;       // ← AGREGAR
  ownerId?: string;        // ← AGREGAR
  createdAt: string;       // ← AGREGAR
}

interface Incident {
  id: string;
  organizationId: string;  // ← AGREGAR (CRÍTICO)
  projectId: string;
  type: IncidentType;
  description: string;
  priority: "NORMAL" | "CRITICAL";
  status: "OPEN" | "ASSIGNED" | "CLOSED";
  createdBy: string;
  assignedTo?: string;
  createdAt: string;
  closedAt?: string;
  closedBy?: string;       // ← AGREGAR
  closedNotes?: string;    // ← Renombrar de 'closingNote'
  locationName?: string;   // ← AGREGAR
  gpsLat: number;
  gpsLng: number;
  isImmutable?: boolean;   // ← AGREGAR
}
```

#### 2. Agregar interfaces faltantes

```typescript
// Nuevas interfaces necesarias

interface ProjectMember {
  id: string;
  organizationId: string;
  projectId: string;
  userId: string;
  assignedRole: "SUPERINTENDENT" | "RESIDENT" | "CABO";
  assignedAt: string;
  assignedBy: string;
  removedAt?: string;
}

interface Photo {
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
}

interface Comment {
  id: string;
  organizationId: string;
  incidentId: string;
  authorId: string;
  text: string;
  commentType: "ASSIGNMENT" | "CLOSURE" | "FOLLOWUP";
  createdAt: string;
  isEdited: boolean;
}
```

### Prioridad MEDIA

#### 3. Sincronizar nombres entre mock-auth.ts y mock-dashboard.ts

```typescript
// Usar consistentemente:
// ✅ fullName (no 'name')
// ✅ profilePictureUrl (no 'avatar' ni 'avatarUrl')
// ✅ subdomain en Organization
```

#### 4. Actualizar datos mock con organizationId

```typescript
export const mockOrganization: Organization = {
  id: "org-001",
  name: "Constructora Demo S.A.",
  subdomain: "constructora-demo",  // ← AGREGAR
  slug: "constructora-demo",
  plan: "PROFESSIONAL",
  billingEmail: "facturacion@constructora-demo.com",
  storageQuotaMb: 10000,
  maxUsers: 100,
  maxProjects: 50,
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
};

export const mockCurrentUser: User = {
  id: "user-001",
  organizationId: "org-001",  // ← AGREGAR
  fullName: "Juan Pérez García",
  email: "juan.perez@constructora-demo.com",
  role: "OWNER",
  isActive: true,
  // ...
};
```

---

## 📊 MATRIZ DE CONFORMIDAD DETALLADA

| Entidad | Campo Requerido | Mock Actual | Conforme |
|:--------|:----------------|:------------|:--------:|
| **ORGANIZATIONS** ||||
| | id | ✅ Existe | ✅ |
| | name | ✅ Existe | ✅ |
| | subdomain | ❌ Falta | ❌ |
| | slug | ✅ Existe | ✅ |
| | plan | ✅ Existe | ✅ |
| | logo_url | logoUrl | ✅ |
| | billing_email | ❌ Falta | ❌ |
| | storage_quota_mb | ❌ Falta | ❌ |
| | max_users | ❌ Falta | ❌ |
| | max_projects | ❌ Falta | ❌ |
| | is_active | ❌ Falta | ❌ |
| **USERS** ||||
| | id | ✅ Existe | ✅ |
| | organization_id | ❌ Falta | ❌ |
| | email | ✅ Existe | ✅ |
| | full_name | name | ⚠️ |
| | role | ✅ Existe | ✅ |
| | is_active | isActive | ✅ |
| | phone | ✅ Existe | ✅ |
| | profile_picture_url | avatar/avatarUrl | ⚠️ |
| | timezone | ❌ Falta | ❌ |
| | language | ❌ Falta | ❌ |
| **PROJECTS** ||||
| | id | ✅ Existe | ✅ |
| | organization_id | ❌ Falta | ❌ |
| | name | ✅ Existe | ✅ |
| | location | ✅ Existe | ✅ |
| | status | ✅ Existe | ✅ |
| | start_date | startDate | ✅ |
| | end_date | endDate | ✅ |
| | created_by | ❌ Falta | ❌ |
| | owner_id | ❌ Falta | ❌ |
| **INCIDENTS** ||||
| | id | ✅ Existe | ✅ |
| | organization_id | ❌ Falta | ❌ |
| | project_id | projectId | ✅ |
| | type | ✅ Existe | ✅ |
| | description | ✅ Existe | ✅ |
| | priority | ✅ Existe | ✅ |
| | status | ✅ Existe | ✅ |
| | created_by | createdBy | ✅ |
| | assigned_to | assignedTo | ✅ |
| | gps_lat | gpsLat | ✅ |
| | gps_lng | gpsLng | ✅ |
| | closed_notes | closingNote | ⚠️ |
| | closed_by | ❌ Falta | ❌ |

---

## 🎯 PRÓXIMOS PASOS

1. **[ ] Refactorizar mock-dashboard.ts** con campos organizationId
2. **[ ] Sincronizar nombres** entre mock-auth.ts y mock-dashboard.ts
3. **[ ] Agregar interfaces** para ProjectMember, Photo, Comment
4. **[ ] Agregar datos mock** para las nuevas entidades
5. **[ ] Actualizar componentes UI** que consumen los mock data
6. **[ ] Validar con Zod schemas** la estructura de datos

---

> **Conclusión:** Los datos mock tienen una base sólida en cuanto a ENUMs y tipos, pero carecen del campo crítico `organizationId` necesario para la arquitectura multi-tenant SaaS. Se recomienda refactorización antes de integrar con Supabase.
