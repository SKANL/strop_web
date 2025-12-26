# 📋 REQUERIMIENTOS DEL PROYECTO - STROP SaaS

> **Versión:** 2.1 (Con separación de plataformas)
> **Estado:** En proceso (falta validarlo)
> **Última actualización:** Diciembre 23, 2025

---

## 🏗️ ARQUITECTURA DE PLATAFORMAS

> **Propósito:** Strop se compone de DOS plataformas independientes que comparten la misma base de datos.

### PLATAFORMA 1: WEB ADMIN (Este proyecto - Astro)

**Usuarios:** D/A (Dueño/Administrador)

**Propósito:** Visibilidad ejecutiva y gestión estratégica

**Funcionalidades del QUÉ (según SRS):**

| ID | Función | QUÉ hace (no cómo) |
|:---|:--------|:-------------------|
| RF-A01 | Crear Proyectos | Dar de alta nuevas obras con nombre, ubicación, fechas |
| RF-A02 | Asignar Usuarios | Vincular personal a proyectos con roles (S, R, C) |
| RF-A03 | Cargar Ruta Crítica | Importar programa de obra (.xlsx/.csv) como línea base inalterable |
| RF-C03 | Dashboard Ejecutivo | Ver KPIs consolidados de todos los proyectos en tiempo real |
| RF-B06 | Búsqueda/Filtrado | Consultar historial de incidencias con múltiples filtros |
| RF-C04 | Bitácora Digital | Ver historial inmutable y cronológico de cada incidencia |
| - | Gestión de Usuarios | Crear, editar, activar/desactivar usuarios del sistema |
| - | Ver Auditoría | Consultar logs de todas las acciones críticas |
| - | Alertas Críticas | Recibir notificaciones de incidencias CRITICAL y desviaciones de material |

**Características técnicas:**

- Conexión estable (asume internet)
- Dashboard con gráficos y KPIs
- Exportación de reportes (PDF/Excel - Post-MVP)
- Sin modo offline

---

### PLATAFORMA 2: APP MÓVIL (Proyecto separado - Flutter)

**Usuarios:** S (Superintendente), R (Residente), C (Cabo)

**Propósito:** Registro de incidencias en campo con evidencia fotográfica y sincronización offline

**Funcionalidades del QUÉ (según SRS):**

| ID | Función | QUÉ hace (no cómo) |
|:---|:--------|:-------------------|
| RF-B01.1 | Crear Incidencia | Registrar evento con tipo predefinido y descripción |
| RF-B01.2 | Capturar Fotos | Adjuntar 1-5 fotos con GPS y timestamp sellados |
| RF-B02 | Escalamiento | Notificar automáticamente al superior jerárquico |
| RF-B03 | Asignar Responsable | Delegar incidencia a subordinado (solo R, S) |
| RF-B04 | Cerrar Incidencia | Marcar como resuelta con nota de cierre |
| RF-B05 | Solicitar Material | Crear solicitud con validación contra explosión de insumos |
| RF-B06 | Ver Incidencias | Consultar incidencias del proyecto asignado |
| RNF-C02 | Modo Offline | Trabajar sin conexión, sincronizar al recuperar señal |

**Características técnicas:**

- Funciona offline (SQLite local)
- GPS obligatorio para fotos
- Push notifications
- Sincronización automática
- Validación de fotos (solo del día actual)

---

### FLUJO DE COMUNICACIÓN ENTRE PLATAFORMAS

```
┌─────────────────────────────────────────────────────────────┐
│                     SUPABASE (BD compartida)                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐ │
│  │ USERS   │ │PROJECTS │ │INCIDENTS│ │ PHOTOS  │ │ AUDIT  │ │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └────────┘ │
└─────────────────────────────────────────────────────────────┘
        ▲                           ▲
        │ Astro Actions             │ API Routes (REST)
        │ + API Routes              │ + Realtime
        │                           │
┌───────┴───────┐           ┌───────┴───────┐
│   WEB ADMIN   │           │   APP MÓVIL   │
│   (Astro)     │           │   (Flutter)   │
│               │           │               │
│ • Dashboard   │◄─────────►│ • Incidencias │
│ • Proyectos   │  Realtime │ • Fotos + GPS │
│ • Usuarios    │   Sync    │ • Offline     │
│ • Reportes    │           │ • Push Notif  │
└───────────────┘           └───────────────┘
     D/A usa                  S, R, C usan
```

---

### ALCANCE DE ESTE PROYECTO (strop_web_admin)

**✅ EN ALCANCE:**

- Web Admin completo (Dashboard, Proyectos, Usuarios, Auditoría)
- API Routes que la App Móvil consumirá
- Schemas Zod compartidos (para ambas plataformas)
- RLS Policies de Supabase
- Lógica de negocio centralizada

**❌ FUERA DE ALCANCE (proyecto separado):**

- App Móvil (Flutter)
- Modo Offline
- Push Notifications nativas
- Integración con GPS nativa
- Gestión de cámara y galerías

---

## 1️⃣ ESTRUCTURA DE INCIDENCIAS (FINALIZADO)

> **Propósito:** Definir campos de incidencia según Strop SRS.

### 1.1 - Campos Básicos

**[x]** Identificador único: **UUID**

**[x]** Título vs. Descripción:

- El "Título" **ES el "Tipo de Incidencia"** seleccionado de lista predefinida (NO texto libre)
- La "Descripción" es el campo de texto libre para detalles
- **Tipos permitidos (según SRS):**
  - Órdenes e Instrucciones
  - Solicitudes y Consultas
  - Certificaciones
  - Notificaciones de Incidentes
  - Solicitud de Material (tipo especial con lógica de explosión de insumos)

**[x]** Información básica adicional:

- **Fotografías:** Mínimo 1, Máximo 5 (OBLIGATORIAS al crear)
- **Geolocalización (GPS):** OBLIGATORIA (lat, lng). Fallback: marcar como "Ubicación no verificada"
- **Timestamp:** Captura automática en servidor (no editable por usuario)

### 1.2 - Campos de Clasificación

**[x]** Prioridad: **2 valores**

- `NORMAL` (Procesamiento estándar)
- `CRITICAL` (Notificación inmediata al Dueño/Admin)

**[x]** Estado: **3 valores - Workflow lineal**

- `OPEN` (Estado inicial)
- `ASSIGNED` (Delegada a responsable)
- `CLOSED` (Resuelta - INMUTABLE después)

**[x]** Tipo/Categoría:

- Valores predefinidos (NO editables por usuario)
- Listado de tipos en 1.1

### 1.3 - Campos de Asignación

**[x]** ¿Quién crea?: Cabo, Residente, Superintendente, Owner

**[x]** Asignación: Sí, a UN usuario responsable (opcional al crear, puede ser NULL)

- Quien asigna: Residente o superior
- Validación: Debe ser usuario activo del proyecto

**[x]** Múltiples asignados: NO (solo 1 responsable)

**[x]** Roles: 4 jerárquicos

- Owner/Admin (D/A)
- Superintendente (S)
- Residente (R)
- Cabo (C)

### 1.4 - Campos de Tiempo

**[x]** `created_at`: Timestamp automático (servidor)

**[x]** `updated_at`: NO aplica (incidencia es inmutable)

**[x]** `closed_at`: Timestamp al cambiar estado a CLOSED

### 1.5 - Campos Adicionales

**[x]** Adjuntos: 5 fotografías máx (con metadata de GPS original y timestamp)

**[x]** Ubicación: GPS integrado (no campo adicional)

**[x]** Historial/Logs: SÍ, tabla AUDIT_LOGS separada

**[x]** Comentarios: SÍ, tabla COMMENTS para notas de asignación, cierre y seguimiento

---

## 2️⃣ ENTIDADES DEL DOMINIO (SCHEMA SQL SAAS-READY)

> **Propósito:** Definir estructura de base de datos con auditoría, trazabilidad, soft deletes y multi-tenant.
> **Cambios SaaS:** Tabla ORGANIZATIONS, organization_id en todas, TIMESTAMP WITH TIME ZONE, índices de performance, particionamiento

### 2.0 - Tabla ORGANIZATIONS (Nueva - Raíz del multi-tenant)

```sql
CREATE TABLE organizations (
  -- Identificación y segmentación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Por qué: ID único para cada cliente/empresa constructora (tenant isolation)
  -- QUÉ: Separador de datos entre clientes en el SaaS
  
  name VARCHAR(255) UNIQUE NOT NULL,
  -- Por qué: Nombre de la empresa constructora (mostrar en UI, reportes)
  -- Ejemplo: "Constructora ABC", "Grupo Constructor XYZ"
  
  subdomain VARCHAR(100) UNIQUE,
  -- Por qué: URL única por tenant (https://constructora-abc.strop.app)
  -- Para routing multi-tenant eficiente sin exponer IDs
  
  slug VARCHAR(100) UNIQUE NOT NULL,
  -- Por qué: Identificador legible para URLs y APIs (ej: "constructora-abc")
  
  logo_url VARCHAR(500),
  -- Por qué: Branding del tenant - logo de la empresa para mostrar en UI
  -- Almacenado en Supabase Storage, referenciado por URL
  
  billing_email VARCHAR(255),
  -- Por qué: Email para facturas/cobros (puede ser diferente al Owner)
  -- Ejemplo: contabilidad@constructora.com vs owner@constructora.com
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Por qué: Auditoría - cuándo se registró el cliente (con timezone para clientes globales)
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Por qué: Auditoría - cuándo se actualizó datos de la empresa
  
  -- Límites de cuota (para modelo de precios SaaS)
  storage_quota_mb INT DEFAULT 5000,
  -- Por qué: Límite de almacenamiento de fotos/documentos por tenant
  -- Ejemplo: plan básico 5GB, plan pro 50GB (previene costos descontrolados)
  -- NOTA: El uso actual se obtiene vía Supabase Storage API (no duplicar dato)
  
  max_users INT DEFAULT 50,
  -- Por qué: Límite máximo de usuarios por tier de suscripción
  
  max_projects INT DEFAULT 100,
  -- Por qué: Límite máximo de proyectos simultáneos
  
  plan ENUM('STARTER', 'PROFESSIONAL', 'ENTERPRISE') DEFAULT 'STARTER',
  -- Por qué: Tier de suscripción (define features, cuota, límites)
  
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  -- Por qué: Fecha de expiración del periodo de prueba gratis
  -- NULL = no está en trial (ya pagó o trial expirado)
  
  is_active BOOLEAN DEFAULT TRUE,
  -- Por qué: Deshabilitar organización (suspension por falta de pago)
  
  deleted_at TIMESTAMP WITH TIME ZONE,
  -- Por qué: Soft delete - retención de datos históricos post-cancelación (compliance)
  
  CONSTRAINT check_storage_quota CHECK (storage_quota_mb > 0),
  -- Por qué: Validación - cuota debe ser positiva
  
  CONSTRAINT check_max_users CHECK (max_users > 0),
  -- Por qué: Validación - al menos 1 usuario
  
  CONSTRAINT check_billing_email_format CHECK (billing_email IS NULL OR billing_email ~ '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Z|a-z]{2,}$')
  -- Por qué: Validación - si hay billing_email, debe ser formato válido
);

-- Índice para búsquedas por subdomain (lookup rápido en multi-tenant)
CREATE INDEX idx_organizations_subdomain ON organizations(subdomain);
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_plan ON organizations(plan);
CREATE INDEX idx_organizations_trial ON organizations(trial_ends_at) WHERE trial_ends_at IS NOT NULL;
```

**DESCRIPCIÓN SEMÁNTICA:**

**QUÉ:** Tabla raíz que representa a cada cliente (empresa constructora) en el SaaS

**POR QUÉ:** En un SaaS multi-tenant, los datos deben estar segregados por cliente. Cada fila es una "compañía" independiente

**QUÉ HACE:** 
- Define límites de cuota (almacenamiento, usuarios, proyectos)
- Segmenta todos los datos de usuarios, proyectos e incidencias por tenant
- Habilita model SaaS con múltiples clientes compartiendo infraestructura

**CÓMO lo hace:**
- Cada tabla tendrá `organization_id` que referencia a esta tabla
- RLS policies filtran automáticamente por `organization_id` del usuario logueado
- URLs incluyen subdomain para routing automático (no expone IDs)

---

### 2.1 - Tabla USERS (Usuarios)

```sql
CREATE TABLE users (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Por qué: Identificador único global, no es secuencial (seguridad)
  -- NOTA: Este ID debe coincidir con auth.users.id de Supabase Auth
  
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  -- Por qué: CRÍTICO para SaaS - vincula usuario a empresa (multi-tenant isolation)
  -- Permite que Juan sea Owner en empresa A y Cabo en empresa B
  
  email VARCHAR(255) NOT NULL,
  -- Por qué: Email para identificación (credenciales manejadas por Supabase Auth)
  -- NOTA: La autenticación real está en auth.users, esto es solo referencia
  
  full_name VARCHAR(255) NOT NULL,
  -- Por qué: Nombre completo para mostrar en UI y auditoría (identidad visual)
  
  role ENUM('OWNER', 'SUPERINTENDENT', 'RESIDENT', 'CABO') NOT NULL,
  -- Por qué: Define nivel de acceso y permisos DENTRO de su organización (RBAC local)
  
  is_active BOOLEAN DEFAULT TRUE,
  -- Por qué: Deshabilitar usuario sin eliminar historial (soft delete lógico)
  -- Ejemplo: empleado sale del equipo pero historial permanece
  
  phone VARCHAR(20),
  -- Por qué: Contacto para notificaciones críticas (Post-MVP: SMS, llamadas)
  
  profile_picture_url VARCHAR(500),
  -- Por qué: Avatar/foto de perfil para identificación visual en la app
  
  timezone VARCHAR(50) DEFAULT 'America/Mexico_City',
  -- Por qué: Zona horaria del usuario para mostrar fechas localizadas
  -- Formato IANA (ej: 'America/New_York', 'Europe/Madrid')
  
  language VARCHAR(10) DEFAULT 'es',
  -- Por qué: Preferencia de idioma para i18n (es=español, en=inglés)
  -- MVP: Solo español. Post-MVP: Multi-idioma
  
  invited_by UUID REFERENCES users(id),
  -- Por qué: Auditoría - quién invitó a este usuario al sistema
  -- NULL para el primer Owner de la organización
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Por qué: Auditoría - cuándo se registró el usuario (timezone para múltiples zonas)
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Por qué: Auditoría - cuándo se modificó el perfil (email, nombre, teléfono)
  
  deleted_at TIMESTAMP WITH TIME ZONE,
  -- Por qué: Soft delete - marcar desactivado sin perder historial de auditoría
  
  last_login TIMESTAMP WITH TIME ZONE,
  -- Por qué: Monitoreo de actividad - saber si usuario sigue activo
  
  CONSTRAINT check_email_format CHECK (email ~ '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Z|a-z]{2,}$'),
  -- Por qué: Validación básica de email (regex estándar)
  
  CONSTRAINT check_language CHECK (language IN ('es', 'en')),
  -- Por qué: Solo idiomas soportados (español e inglés)
  
  UNIQUE(organization_id, email)
  -- Por qué: Email único DENTRO de cada organización (permite duplicados en otros tenants)
);

-- Índices para autenticación y búsquedas rápidas
CREATE INDEX idx_users_org_email ON users(organization_id, email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_org_role ON users(organization_id, role) WHERE is_active = TRUE;
CREATE INDEX idx_users_org_created ON users(organization_id, created_at DESC);
CREATE INDEX idx_users_invited_by ON users(invited_by) WHERE invited_by IS NOT NULL;
```

**DESCRIPCIÓN SEMÁNTICA:**

**QUÉ:** Tabla que almacena los perfiles de usuarios del sistema (Owners, Superintendentes, Residentes, Cabos)

**POR QUÉ:** Cada usuario tiene perfil, permisos y auditoría de acciones. En SaaS, un mismo email puede existir en múltiples organizaciones

**QUÉ HACE:** 
- Define perfil de usuario (nombre, teléfono, foto, preferencias)
- Asigna roles que determinan permisos dentro de su organización
- Registra auditoría de actividad (cuándo se creó, cuándo fue visto por última vez)
- Permite deshabilitar usuarios sin perder historial

**CÓMO lo hace:**
- `organization_id` segmenta usuarios por empresa (Juan puede ser OWNER en A y CABO en B)
- `UNIQUE(organization_id, email)` permite mismo email en diferentes tenants
- Índices rápidos para login (email lookup por org) y búsquedas por rol
- Soft delete con `deleted_at` preserva historial de auditoría
- **IMPORTANTE:** Las credenciales (password) las maneja Supabase Auth en `auth.users`

### 2.2 - Tabla PROJECTS (Proyectos/Obras)

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Por qué: Identificador único para cada obra
  
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  -- Por qué: CRÍTICO para SaaS - vincula proyecto a empresa (separa datos entre tenants)
  
  name VARCHAR(100) NOT NULL,
  -- Por qué: Nombre de la obra (único DENTRO de cada organización, no globalmente)
  -- Permite que empresa A y empresa B tengan proyecto "Edificio A"
  
  location VARCHAR(255) NOT NULL,
  -- Por qué: Dirección/ubicación geográfica de la obra (para mapas, detalles geográficos)
  
  description TEXT,
  -- Por qué: Detalles adicionales de la obra (cliente, contratista, presupuesto, etc.)
  
  start_date DATE NOT NULL,
  -- Por qué: Fecha de inicio planificada (para calcular retrasos vs planeado)
  
  end_date DATE NOT NULL,
  -- Por qué: Fecha de fin planificada (validar: end_date > start_date)
  
  status ENUM('ACTIVE', 'PAUSED', 'COMPLETED') DEFAULT 'ACTIVE',
  -- Por qué: Estado del proyecto (ACTIVE=en progreso, PAUSED=parada, COMPLETED=terminada)
  
  created_by UUID NOT NULL REFERENCES users(id),
  -- Por qué: Auditoría - quién creó el proyecto (trazabilidad de responsables)
  
  owner_id UUID REFERENCES users(id),
  -- Por qué: Usuario responsable del proyecto (Superintendente o Owner)
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Por qué: Auditoría - cuándo se creó el proyecto (timezone para múltiples zonas)
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Por qué: Auditoría - cuándo se modificó (nombre, descripción, estado, fechas)
  
  deleted_at TIMESTAMP WITH TIME ZONE,
  -- Por qué: Soft delete - proyectos completados se marcan sin eliminar (compliance)
  
  CONSTRAINT check_dates CHECK (end_date > start_date),
  -- Por qué: Validación - fecha fin DEBE ser posterior a inicio
  
  UNIQUE(organization_id, name)
  -- Por qué: Nombres únicos DENTRO de cada organización (permite duplicados en otros tenants)
);

-- Índices para queries frecuentes
CREATE INDEX idx_projects_org_status ON projects(organization_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_org_created ON projects(organization_id, created_at DESC);
CREATE INDEX idx_projects_org_owner ON projects(organization_id, owner_id);
```

**DESCRIPCIÓN SEMÁNTICA:**

**QUÉ:** Tabla que almacena los proyectos (obras de construcción) de cada organización

**POR QUÉ:** Una obra constructora realiza múltiples proyectos simultáneamente. Cada proyecto es una instancia independiente de construcción

**QUÉ HACE:** 
- Define meta-datos de la obra (ubicación, fechas, estado)
- Vincula todos los incidentes, usuarios y ruta crítica a su proyecto
- Permite rastrear progreso y financiero de la obra

**CÓMO lo hace:**
- `organization_id` separa proyectos de diferentes clientes
- `UNIQUE(organization_id, name)` permite nombres duplicados en diferentes tenants
- Índices rápidos para queries por organización + estado/fecha
- Soft delete preserva historial post-cierre

**[x]** Cada incidencia pertenece a UN proyecto

**[x]** Múltiples obras simultáneamente: SÍ

### 2.3 - Tabla PROJECT_MEMBERS (Asignación de usuarios a proyectos)

```sql
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Por qué: Relación muchos-a-muchos entre proyectos y usuarios
  
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  -- Por qué: CRÍTICO para SaaS - vincula asignación a empresa (evita consultas cross-org)
  
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  -- Por qué: ID del proyecto al que se asigna el usuario
  
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  -- Por qué: ID del usuario asignado al proyecto
  
  assigned_role ENUM('SUPERINTENDENT', 'RESIDENT', 'CABO') NOT NULL,
  -- Por qué: Rol específico del usuario DENTRO de este proyecto (puede ser diferente en otros)
  -- Nota: OWNER no va aquí porque OWNER tiene acceso a TODOS los proyectos de su org
  
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Por qué: Auditoría - cuándo se asignó (timezone para múltiples zonas)
  
  assigned_by UUID NOT NULL REFERENCES users(id),
  -- Por qué: Auditoría - quién hizo la asignación (trazabilidad de responsables)
  
  removed_at TIMESTAMP WITH TIME ZONE,
  -- Por qué: Soft delete - marcarlo como removido del proyecto sin eliminar historial
  
  UNIQUE(project_id, user_id),
  -- Por qué: Un usuario no puede estar 2 veces en el mismo proyecto
  
  CONSTRAINT check_org_consistency CHECK (
    -- Validación: user.organization_id DEBE coincidir con project.organization_id
    -- Esto previene asignaciones cross-tenant
    (SELECT organization_id FROM users WHERE id = user_id) = organization_id
  )
  -- Por qué: Seguridad - prevenir que un usuario de org A sea asignado a proyecto de org B
);

-- Índices para búsquedas frecuentes
CREATE INDEX idx_project_members_org_user ON project_members(organization_id, user_id) WHERE removed_at IS NULL;
CREATE INDEX idx_project_members_org_project ON project_members(organization_id, project_id) WHERE removed_at IS NULL;
```

**DESCRIPCIÓN SEMÁNTICA:**

**QUÉ:** Tabla puente (junction table) que vincula usuarios a proyectos con roles contextuales

**POR QUÉ:** Un usuario puede tener diferentes roles en diferentes proyectos (Ej: Juan es Superintendente en Proyecto A pero Residente en Proyecto B)

**QUÉ HACE:** 
- Define quién trabaja en qué proyecto y con qué rol
- Permite auditoría de quién fue asignado a proyecto y cuándo
- Soft delete permite rastrear historial sin perder trazabilidad

**CÓMO lo hace:**
- `organization_id` separa asignaciones de diferentes empresas
- Índices rápidos para: "¿A qué proyectos está asignado Juan?" y "¿Quién trabaja en Proyecto A?"
- CHECK constraint valida que usuario y proyecto sean del mismo tenant (seguridad)

### 2.4 - Tabla INCIDENTS (Incidencias)

```sql
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Por qué: Identificador único para cada incidencia (bitácora digital)
  
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  -- Por qué: CRÍTICO para SaaS - vincula incidencia a empresa (multi-tenant isolation)
  
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  -- Por qué: Qué proyecto/obra pertenece esta incidencia (segmentación de datos)
  
  created_by UUID NOT NULL REFERENCES users(id),
  -- Por qué: Quién reportó la incidencia (responsabilidad, auditoría, trazabilidad)
  
  type VARCHAR(100) NOT NULL,
  -- Por qué: Tipo de incidencia (Órdenes, Solicitudes, Certificaciones, Notificaciones, Material)
  -- VARCHAR permite futuras extensiones sin migration (flexible vs ENUM rígido)
  
  description TEXT NOT NULL,
  -- Por qué: Detalles de la incidencia (10-1000 caracteres, RF-B01.1)
  
  priority ENUM('NORMAL', 'CRITICAL') DEFAULT 'NORMAL',
  -- Por qué: Nivel de urgencia (CRITICAL = notificación inmediata al Owner, RF-B02)
  
  status ENUM('OPEN', 'ASSIGNED', 'CLOSED') DEFAULT 'OPEN',
  -- Por qué: Workflow (OPEN→ASSIGNED→CLOSED, lineal, sin retroceso, RF-B04)
  
  assigned_to UUID REFERENCES users(id),
  -- Por qué: Quién es responsable de resolver (NULL = abierta, alguien debe asignarla)
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Por qué: Auditoría - marca de tiempo inalterable de creación (servidor, timezone)
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Por qué: Auditoría - cuándo se hicieron cambios (NO para campos inmutables post-cierre)
  
  closed_at TIMESTAMP WITH TIME ZONE,
  -- Por qué: Marca de tiempo cuando se cerró (NULL si aún está abierta)
  
  closed_by UUID REFERENCES users(id),
  -- Por qué: Auditoría - quién cerró la incidencia (trazabilidad de responsables)
  
  location_name VARCHAR(255),
  -- Por qué: Descripción del lugar dentro de la obra ("Piso 3, Zona A, Escalera Sur")
  
  gps_lat DECIMAL(10, 8) NOT NULL,
  -- Por qué: Latitud del GPS al crear (obligatoria, RF-B01.2, previene fraude)
  
  gps_lng DECIMAL(11, 8) NOT NULL,
  -- Por qué: Longitud del GPS al crear (obligatoria, RF-B01.2, previene fraude)
  
  closed_notes TEXT,
  -- Por qué: Nota de cierre obligatoria (RF-B04), explica cómo se resolvió
  
  is_immutable BOOLEAN DEFAULT FALSE,
  -- Por qué: Flag cuando status=CLOSED (trigger bloquea UPDATE, RNF-B02 inalterabilidad)
  
  deleted_at TIMESTAMP WITH TIME ZONE,
  -- Por qué: Soft delete - solo Owner/Admin pueden eliminar (estado OPEN/ASSIGNED)
  
  CONSTRAINT check_description_length CHECK (char_length(description) >= 10 AND char_length(description) <= 1000),
  -- Por qué: Validación - descripción tiene longitud mínima y máxima (SRS)
  
  CONSTRAINT check_closed_notes_required CHECK (
    (status != 'CLOSED' AND closed_notes IS NULL) OR 
    (status = 'CLOSED' AND closed_notes IS NOT NULL AND char_length(closed_notes) > 0)
  )
  -- Por qué: Validación - si cerrada DEBE tener nota (RF-B04)
);

-- Índices para queries frecuentes (SaaS escalable)
CREATE INDEX idx_incidents_org_status ON incidents(organization_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_incidents_org_project ON incidents(organization_id, project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_incidents_org_created ON incidents(organization_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_incidents_org_assigned ON incidents(organization_id, assigned_to) WHERE status != 'CLOSED';

-- NOTA ESCALABILIDAD: Cuando la tabla supere 1M registros, considerar:
-- 1. Particionamiento por fecha (PARTITION BY RANGE created_at)
-- 2. Archivado de incidencias cerradas >1 año a tabla histórica
-- 3. Índices parciales adicionales según patrones de queries
-- Por ahora, los índices anteriores son suficientes para MVP
```

**DESCRIPCIÓN SEMÁNTICA:**

**QUÉ:** Tabla que almacena eventos de construcción reportados (incidencias, órdenes, solicitudes)

**POR QUÉ:** Necesidad de registro digital inalterable de todos los eventos en obra para compliance, auditoría y resolución de disputas

**QUÉ HACE:** 
- Captura evento en momento específico con contexto (GPS, fotos, descripción)
- Registra workflow desde creación hasta cierre (OPEN→ASSIGNED→CLOSED)
- Garantiza inalterabilidad post-cierre para cumplimiento normativo (RNF-B02)
- Permite auditoría completa (quién creó, quién cerró, cuándo)

**CÓMO lo hace:**
- `organization_id` separa incidencias de diferentes clientes
- Índices rápidos por estado/proyecto/fecha (queries de dashboards)
- Particionamiento por fecha permite escalar a millones sin ralentizar (PARTITION BY RANGE)
- Trigger SQL bloquea UPDATE si status=CLOSED (inalterabilidad técnica)
- CHECK constraint valida transiciones de estado (RLS policy en app valida permisos)

### 2.5 - Tabla PHOTOS (Fotografías/Evidencia)

```sql
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Por qué: Identificador único para cada foto (múltiples fotos por incidencia)
  
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  -- Por qué: CRÍTICO para SaaS - vincula foto a empresa (multi-tenant isolation)
  
  incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  -- Por qué: Vincula foto a incidencia (relación 1:N, máximo 5 por incidencia)
  
  storage_path VARCHAR(500) NOT NULL,
  -- Por qué: URL en Supabase Storage donde se almacena encriptado (AES-256)
  -- Ejemplo: /organizations/org_id/incidents/incident_id/uuid_timestamp.jpg.encrypted
  
  uploaded_by UUID NOT NULL REFERENCES users(id),
  -- Por qué: Auditoría - quién subió la foto (trazabilidad, responsabilidad)
  
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Por qué: Marca de tiempo inalterable de cuándo se subió (servidor, timezone)
  
  original_filename VARCHAR(255),
  -- Por qué: Nombre original antes de encriptación (para logging e identificación)
  
  file_size INT,
  -- Por qué: Tamaño en bytes (monitoreo de cuota de Storage, para alertas de límite)
  
  metadata JSONB,
  -- Por qué: Metadatos capturados: {gps_lat, gps_lng, timestamp_device, watermark_verified}
  -- JSONB permite indexing y búsquedas de coordenadas (previene fraude de fotos antiguas)
  
  deleted_at TIMESTAMP WITH TIME ZONE,
  -- Por qué: Soft delete - marcar eliminada pero mantener en auditoria (RNF-B02)
  -- Nota: No se puede eliminar si incidencia está cerrada (trigger)
  
  CONSTRAINT check_file_size CHECK (file_size > 0 AND file_size <= 5242880)
  -- Por qué: Validación - máximo 5MB por foto (5242880 bytes, previene abuso de cuota)
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_photos_org_incident ON photos(organization_id, incident_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_photos_org_uploaded ON photos(organization_id, uploaded_at DESC) WHERE deleted_at IS NULL;
```

**DESCRIPCIÓN SEMÁNTICA:**

**QUÉ:** Tabla que almacena evidencia visual (fotografías) de cada incidencia

**POR QUÉ:** Fotos son prueba visual incontestable de estado de obra. Requieren encriptación y auditoría de almacenamiento

**QUÉ HACE:** 
- Vincula fotos a incidencias específicas
- Registra metadatos de captura (GPS, timestamp, watermark)
- Monitorea uso de almacenamiento por tenant (para cobrar según cuota)
- Permite auditar quién subió qué foto y cuándo

**CÓMO lo hace:**
- `organization_id` separa fotos de diferentes clientes en Storage
- Índices rápidos para "¿Todas las fotos de incidencia X?" y "¿Cuánto almacenamiento usó org Y?"
- Metadata JSONB permite búsquedas por GPS (geoloctalización de evidencia)
- Soft delete preserva evidencia incluso si se elimina accidentalmente

**[x]** Almacenamiento: Supabase Storage (con encriptación AES-256)

**[x]** Máximo 5 fotos por incidencia (validar en aplicación con trigger)

**[x]** Formatos: JPG, PNG, WebP (validar en API Route)

### 2.6 - Tabla COMMENTS (Comentarios/Notas)

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Por qué: Identificador único para cada comentario (bitácora de seguimiento)
  
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  -- Por qué: CRÍTICO para SaaS - vincula comentario a empresa (multi-tenant isolation)
  
  incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  -- Por qué: Vincula comentario a incidencia (múltiples notas por incidencia)
  
  author_id UUID NOT NULL REFERENCES users(id),
  -- Por qué: Quién escribió el comentario (responsabilidad, auditoría, trazabilidad)
  
  text TEXT NOT NULL,
  -- Por qué: Contenido del comentario (5-500 caracteres, RF-B07)
  
  comment_type ENUM('ASSIGNMENT', 'CLOSURE', 'FOLLOWUP') DEFAULT 'FOLLOWUP',
  -- Por qué: Clasificación (ASSIGNMENT=instrucción, CLOSURE=nota cierre, FOLLOWUP=seguimiento)
  -- FOLLOWUP permite agregar notas a incidencias CLOSED (RNF-B02 inalterabilidad)
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Por qué: Auditoría - marca cronológica inalterable (servidor, timezone)
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Por qué: Auditoría - si fue editado por admin (flag is_edited para compliance)
  
  is_edited BOOLEAN DEFAULT FALSE,
  -- Por qué: Flag para detectar comentarios editados (para cumplimiento normativo)
  
  deleted_at TIMESTAMP WITH TIME ZONE,
  -- Por qué: Soft delete - mantener en auditoría aunque se borre (preserva evidencia)
  
  CONSTRAINT check_text_length CHECK (char_length(text) >= 5 AND char_length(text) <= 500)
  -- Por qué: Validación - comentarios muy cortos o muy largos no son útiles para auditoría
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_comments_org_incident ON comments(organization_id, incident_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_comments_org_author ON comments(organization_id, author_id) WHERE deleted_at IS NULL;
```

**DESCRIPCIÓN SEMÁNTICA:**

**QUÉ:** Tabla que almacena comunicación escrita (comentarios, notas, instrucciones) vinculada a incidencias

**POR QUÉ:** Evidencia textual de decisiones, acuerdos e instrucciones. Permite auditar quién dijo qué y cuándo

**QUÉ HACE:** 
- Registra comunicación entre usuarios sobre incidencias
- Permite seguimiento de instrucciones (ASSIGNMENT) y resoluciones (CLOSURE)
- Permite agregar notas de seguimiento incluso post-cierre (FOLLOWUP)
- Detecta ediciones administrativas para compliance

**CÓMO lo hace:**
- `organization_id` separa comentarios de diferentes clientes
- Índices rápidos para "¿Todas las notas de incidencia X?" y "¿Qué comentó usuario Y?"
- Soft delete preserva evidencia incluso si se elimina accidentalmente
- Flag `is_edited` detecta cambios retroactivos (importa para auditoría legal)

**[x]** Permitido agregar comentarios a incidencias cerradas (tipo FOLLOWUP)

**[x]** Comentarios son inmutables (no editar, solo marcar is_edited)

### 2.7 - Tabla CRITICAL_PATH_ITEMS (Ruta Crítica)

```sql
CREATE TABLE critical_path_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Por qué: Identificador único para cada actividad crítica
  
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  -- Por qué: CRÍTICO para SaaS - vincula actividad a empresa (multi-tenant isolation)
  
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  -- Por qué: Ruta crítica pertenece a un proyecto (línea base RF-A03)
  
  activity_name VARCHAR(255) NOT NULL,
  -- Por qué: Nombre de la actividad (ej: "Excavación", "Cimentación", "Encofrado")
  
  planned_start DATE NOT NULL,
  -- Por qué: Fecha de inicio planeada (importada de .xlsx, baseline inmutable)
  
  planned_end DATE NOT NULL,
  -- Por qué: Fecha de fin planeada (importada de .xlsx, permite calcular retrasos)
  
  actual_start DATE,
  -- Por qué: Fecha real de inicio (cuándo empezó realmente vs. planeado)
  
  actual_end DATE,
  -- Por qué: Fecha real de fin (para medir desviaciones de cronograma, KPI)
  
  status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'PENDING',
  -- Por qué: Estado (PENDING=no inicia, IN_PROGRESS=en ejecución, COMPLETED=terminada)
  
  progress_percentage INTEGER DEFAULT 0,
  -- Por qué: Porcentaje avance (0-100, reportado por Residente, RF-B06, KPI del dashboard)
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Por qué: Cuándo se importó la ruta crítica (timezone para múltiples zonas)
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Por qué: Cuándo se actualizó el progreso (auditoría de cambios)
  
  updated_by UUID REFERENCES users(id),
  -- Por qué: Auditoría - quién reportó el progreso (trazabilidad)
  
  deleted_at TIMESTAMP WITH TIME ZONE,
  -- Por qué: Soft delete - marcar eliminada sin romper auditoría (compliance)
  
  CONSTRAINT check_dates CHECK (planned_end >= planned_start),
  -- Por qué: Validación - fecha fin DEBE ser >= a inicio (lógica de cronograma)
  
  CONSTRAINT check_progress CHECK (progress_percentage >= 0 AND progress_percentage <= 100)
  -- Por qué: Validación - porcentaje debe estar entre 0 y 100 (lógica de avance)
);

-- Índices para búsquedas frecuentes
CREATE INDEX idx_critical_path_org_project ON critical_path_items(organization_id, project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_critical_path_org_status ON critical_path_items(organization_id, status) WHERE deleted_at IS NULL;
```

**DESCRIPCIÓN SEMÁNTICA:**

**QUÉ:** Tabla que almacena la ruta crítica del proyecto (cronograma de actividades y su progreso)

**POR QUÉ:** Línea base de obra permite detectar retrasos, desviaciones y calcular KPIs del proyecto (avance físico vs planeado)

**QUÉ HACE:** 
- Importa cronograma desde archivo Excel (.xlsx) como línea base inalterable
- Permite reportar progreso real (% avance, fechas actuales) vs planeado
- Calcula desviaciones para alertas de retrasos
- Audita quién y cuándo reportó avances

**CÓMO lo hace:**
- `organization_id` separa cronogramas de diferentes clientes
- Índices rápidos para "¿Todas las actividades de proyecto X?" y "¿Cuáles están retrasadas?"
- Soft delete permite ver historial sin eliminar datos
- Comparison planned_start/actual_start calcula varianza de cronograma

**[x]** No es solo archivo; se procesa e importa a BD (RF-A03)

**[x]** Inmodificable por usuarios de campo (solo lectura para Cabo/Residente)

**[x]** Reportar avance es tarea de Residente/Superintendente (RF-B06)

### 2.8 - Tabla AUDIT_LOGS (Bitácora - RNF-B03)

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Por qué: Identificador único para cada evento auditado
  
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  -- Por qué: CRÍTICO para SaaS - vincula log a empresa (multi-tenant isolation)
  -- Permite separar auditoría por cliente para reportes y compliance
  
  user_id UUID NOT NULL REFERENCES users(id),
  -- Por qué: Quién realizó la acción (responsabilidad, trazabilidad)
  
  action VARCHAR(100) NOT NULL,
  -- Por qué: Tipo de acción (CREATE_INCIDENT, ASSIGN_INCIDENT, CLOSE_INCIDENT, UPDATE_PROJECT, etc.)
  
  target_id UUID NOT NULL,
  -- Por qué: ID del recurso afectado (incident_id, project_id, user_id, etc.)
  
  target_type VARCHAR(50),
  -- Por qué: Tipo de recurso (INCIDENT, PROJECT, USER, COMMENT, etc.)
  
  changes_summary TEXT,
  -- Por qué: Descripción legible de qué cambió (ej: "Asignado a Juan Pérez")
  
  old_values JSONB,
  -- Por qué: Valores anteriores antes de la acción {field: old_value, ...} (análisis forense)
  
  new_values JSONB,
  -- Por qué: Valores nuevos después de la acción {field: new_value, ...} (análisis forense)
  
  ip_address VARCHAR(45),
  -- Por qué: IP de origen (trazabilidad, detectar acceso no autorizado, fraud detection)
  
  user_agent VARCHAR(500),
  -- Por qué: Browser/Cliente (ej: "Mozilla/5.0... Chrome/120", identifica tipo de cliente)
  
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Por qué: Marca cronológica inalterable (registrada en servidor, timezone)
  
  is_immutable BOOLEAN DEFAULT TRUE
  -- Por qué: Esta tabla es de SOLO LECTURA (nunca UPDATE/DELETE, RNF-B03)
  -- Nota: No hay deleted_at aquí porque los logs NUNCA se borran
  -- La única forma de deshabilitar logs es una RLS policy de seguridad en BD
);

-- Índices para auditoría rápida (queries frecuentes de compliance)
CREATE INDEX idx_audit_org_timestamp ON audit_logs(organization_id, timestamp DESC);
CREATE INDEX idx_audit_org_user ON audit_logs(organization_id, user_id);
CREATE INDEX idx_audit_org_action ON audit_logs(organization_id, action);
CREATE INDEX idx_audit_org_target ON audit_logs(organization_id, target_id);

-- NOTA ESCALABILIDAD: Cuando la tabla supere 5M registros, considerar:
-- 1. Particionamiento por fecha (PARTITION BY RANGE timestamp)
-- 2. Archivado automático a Supabase Storage (logs >1 año como JSON comprimido)
-- 3. Política de retención configurable por tenant (enterprise feature)
-- Por ahora, los índices anteriores son suficientes para MVP
```

**DESCRIPCIÓN SEMÁNTICA:**

**QUÉ:** Tabla que almacena bitácora inalterable de TODAS las acciones críticas en el sistema

**POR QUÉ:** Compliance legal, auditoría forense, y protección contra manipulación de evidencia. Imposible de modificar post-creación

**QUÉ HACE:** 
- Registra TODA acción que afecte datos críticos (crear, asignar, cerrar incidencias, cambiar usuarios)
- Captura valores antes/después para análisis forense (quién cambió qué y cómo)
- Registra contexto técnico (IP, navegador) para detectar acceso fraudulento
- Particiona por fecha para escalar a millones sin ralentizar

**CÓMO lo hace:**
- `organization_id` separa auditoría de diferentes clientes (reportes por tenant)
- Tabla particionada permite archivar logs antiguos sin eliminar
- Índices rápidos para \"\u00bfQué hizo usuario X en período Y?\" y \"¿Quién modificó recurso Z?\"
- Trigger SQL bloquea UPDATE/DELETE (garantiza inmutabilidad técnica)
- `old_values`/`new_values` JSONB permite reconstruir estado histórico de cualquier recurso

**[x]** Tabla inalterable (RLS policy para evitar UPDATE/DELETE)

**[x]** Registra TODOS los cambios críticos (crear, asignar, cerrar, actualizar)

**[x]** Almacena old_values y new_values para análisis forense

---

## 2.9 - SUPABASE STORAGE (Buckets y Políticas)

> **QUÉ:** Configuración de almacenamiento de archivos (fotos, documentos) en Supabase Storage
> **POR QUÉ:** Las fotos de incidencias necesitan almacenamiento seguro, organizado por tenant, con políticas de acceso
> **QUÉ HACE:** Define buckets, estructura de carpetas, y RLS policies para archivos
> **CÓMO:** Buckets privados con políticas que validan organization_id del usuario autenticado

### Buckets Requeridos

```sql
-- BUCKET: incident-photos
-- Propósito: Almacena fotos de incidencias (evidencia visual)
-- Acceso: Privado (requiere autenticación + pertenencia al proyecto)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'incident-photos',
  'incident-photos',
  FALSE,  -- Privado: requiere auth para acceder
  5242880, -- 5MB máximo por archivo
  ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
);

-- BUCKET: profile-pictures
-- Propósito: Fotos de perfil de usuarios
-- Acceso: Público (avatares visibles para todos los usuarios del sistema)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-pictures',
  'profile-pictures',
  TRUE,  -- Público: avatares visibles sin auth adicional
  2097152, -- 2MB máximo por archivo
  ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
);

-- BUCKET: organization-assets
-- Propósito: Logos de organizaciones, documentos compartidos
-- Acceso: Privado (solo usuarios de la organización)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'organization-assets',
  'organization-assets',
  FALSE,
  10485760, -- 10MB máximo (logos pueden ser más grandes)
  ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'application/pdf']::text[]
);

-- BUCKET: critical-path-imports
-- Propósito: Archivos Excel/CSV de ruta crítica importados
-- Acceso: Privado (solo OWNER puede subir, procesados y eliminados)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'critical-path-imports',
  'critical-path-imports',
  FALSE,
  20971520, -- 20MB máximo (archivos Excel pueden ser grandes)
  ARRAY['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'application/vnd.ms-excel']::text[]
);
```

### Estructura de Carpetas (Convención)

```
incident-photos/
└── {organization_id}/
    └── {project_id}/
        └── {incident_id}/
            └── {uuid}_{timestamp}.{ext}
            
profile-pictures/
└── {user_id}/
    └── avatar.{ext}
    
organization-assets/
└── {organization_id}/
    ├── logo.{ext}
    └── documents/
        └── {filename}.{ext}
        
critical-path-imports/
└── {organization_id}/
    └── {project_id}/
        └── {upload_timestamp}_{filename}.{ext}
```

### Storage RLS Policies

```sql
-- POLICY: incident-photos - Solo usuarios del proyecto pueden ver/subir
-- SELECT: Usuario debe pertenecer al proyecto de la incidencia
CREATE POLICY "incident_photos_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'incident-photos' AND
    -- Extraer organization_id del path: incident-photos/{org_id}/...
    (storage.foldername(name))[1]::uuid IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- INSERT: Usuario autenticado puede subir a su organización
CREATE POLICY "incident_photos_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'incident-photos' AND
    (storage.foldername(name))[1]::uuid IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

-- DELETE: Solo OWNER/ADMIN pueden eliminar (y solo si incidencia no está cerrada)
CREATE POLICY "incident_photos_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'incident-photos' AND
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'OWNER' AND organization_id = (storage.foldername(name))[1]::uuid
    )
  );

-- POLICY: profile-pictures - Usuario solo puede modificar su propia foto
CREATE POLICY "profile_pictures_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-pictures');

CREATE POLICY "profile_pictures_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-pictures' AND
    (storage.foldername(name))[1]::uuid = auth.uid()
  );

CREATE POLICY "profile_pictures_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profile-pictures' AND
    (storage.foldername(name))[1]::uuid = auth.uid()
  );

-- POLICY: organization-assets - Solo usuarios de la org pueden ver, OWNER puede modificar
CREATE POLICY "org_assets_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'organization-assets' AND
    (storage.foldername(name))[1]::uuid IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "org_assets_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'organization-assets' AND
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'OWNER' AND organization_id = (storage.foldername(name))[1]::uuid
    )
  );

-- POLICY: critical-path-imports - Solo OWNER puede subir/ver
CREATE POLICY "critical_path_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'critical-path-imports' AND
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'OWNER' AND organization_id = (storage.foldername(name))[1]::uuid
    )
  );

CREATE POLICY "critical_path_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'critical-path-imports' AND
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'OWNER' AND organization_id = (storage.foldername(name))[1]::uuid
    )
  );
```

**DESCRIPCIÓN SEMÁNTICA:**

**QUÉ:** Configuración completa de Supabase Storage para el SaaS

**POR QUÉ:** Separar archivos por tenant, controlar acceso, prevenir abuso de cuota

**QUÉ HACE:** 
- Define 4 buckets con propósitos específicos (fotos, avatares, logos, imports)
- Establece límites de tamaño y tipos MIME permitidos
- Implementa RLS policies para control de acceso granular

**CÓMO lo hace:**
- Buckets privados por defecto (excepto avatares)
- Estructura de carpetas incluye organization_id para aislamiento
- Policies extraen org_id del path y validan pertenencia del usuario
- OWNER tiene permisos especiales para administración

---

## 2.10 - SUPABASE TRIGGERS (Automatización)

> **QUÉ:** Triggers SQL que automatizan lógica de negocio crítica
> **POR QUÉ:** Garantizar consistencia de datos sin depender de la aplicación
> **QUÉ HACE:** Actualiza timestamps, bloquea modificaciones ilegales, crea audit logs
> **CÓMO:** Funciones PL/pgSQL ejecutadas automáticamente en eventos INSERT/UPDATE

### Trigger: updated_at Automático

```sql
-- FUNCIÓN: Actualiza updated_at automáticamente en cada UPDATE
-- Aplicar a: organizations, users, projects, incidents, comments, critical_path_items
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas con updated_at
CREATE TRIGGER set_updated_at_organizations
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_projects
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_incidents
  BEFORE UPDATE ON incidents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_comments
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_critical_path
  BEFORE UPDATE ON critical_path_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Trigger: Inmutabilidad de Incidencias Cerradas (RNF-B02)

```sql
-- FUNCIÓN: Bloquea modificaciones a incidencias cerradas
-- Campos protegidos: type, description, priority, gps_lat, gps_lng, created_by
-- Permite: agregar comentarios (tabla separada), cambios administrativos por OWNER
CREATE OR REPLACE FUNCTION prevent_closed_incident_modification()
RETURNS TRIGGER AS $$
BEGIN
  -- Si la incidencia está cerrada, bloquear cambios en campos críticos
  IF OLD.status = 'CLOSED' THEN
    -- Campos que NUNCA se pueden modificar después de cerrar
    IF OLD.type IS DISTINCT FROM NEW.type OR
       OLD.description IS DISTINCT FROM NEW.description OR
       OLD.priority IS DISTINCT FROM NEW.priority OR
       OLD.gps_lat IS DISTINCT FROM NEW.gps_lat OR
       OLD.gps_lng IS DISTINCT FROM NEW.gps_lng OR
       OLD.created_by IS DISTINCT FROM NEW.created_by OR
       OLD.created_at IS DISTINCT FROM NEW.created_at THEN
      RAISE EXCEPTION 'No se puede modificar una incidencia cerrada. Campos inmutables: type, description, priority, gps, created_by, created_at';
    END IF;
    
    -- Bloquear reapertura (CLOSED → otro estado)
    IF NEW.status != 'CLOSED' THEN
      RAISE EXCEPTION 'No se puede reabrir una incidencia cerrada. Cree una nueva incidencia vinculada.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_incident_immutability
  BEFORE UPDATE ON incidents
  FOR EACH ROW EXECUTE FUNCTION prevent_closed_incident_modification();
```

### Trigger: Marcar is_immutable al Cerrar

```sql
-- FUNCIÓN: Cuando status cambia a CLOSED, marcar is_immutable = TRUE
CREATE OR REPLACE FUNCTION set_incident_immutable_on_close()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'CLOSED' AND OLD.status != 'CLOSED' THEN
    NEW.is_immutable = TRUE;
    NEW.closed_at = CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_immutable_on_close
  BEFORE UPDATE ON incidents
  FOR EACH ROW EXECUTE FUNCTION set_incident_immutable_on_close();
```

### Trigger: Validar Máximo 5 Fotos por Incidencia

```sql
-- FUNCIÓN: Bloquea INSERT si ya hay 5 fotos para la incidencia
CREATE OR REPLACE FUNCTION check_max_photos_per_incident()
RETURNS TRIGGER AS $$
DECLARE
  photo_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO photo_count
  FROM photos
  WHERE incident_id = NEW.incident_id AND deleted_at IS NULL;
  
  IF photo_count >= 5 THEN
    RAISE EXCEPTION 'Máximo 5 fotos por incidencia. Ya hay % fotos.', photo_count;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_max_photos
  BEFORE INSERT ON photos
  FOR EACH ROW EXECUTE FUNCTION check_max_photos_per_incident();
```

### Trigger: Audit Log Automático (Acciones Críticas)

```sql
-- FUNCIÓN: Crea entrada en audit_logs para acciones críticas
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
DECLARE
  action_type VARCHAR(100);
  target_type VARCHAR(50);
BEGIN
  -- Determinar tipo de acción
  IF TG_OP = 'INSERT' THEN
    action_type = 'CREATE_' || UPPER(TG_TABLE_NAME);
  ELSIF TG_OP = 'UPDATE' THEN
    action_type = 'UPDATE_' || UPPER(TG_TABLE_NAME);
  ELSIF TG_OP = 'DELETE' THEN
    action_type = 'DELETE_' || UPPER(TG_TABLE_NAME);
  END IF;
  
  target_type = UPPER(TG_TABLE_NAME);
  
  -- Insertar en audit_logs
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (organization_id, user_id, action, target_id, target_type, old_values, timestamp)
    VALUES (
      OLD.organization_id,
      auth.uid(),
      action_type,
      OLD.id,
      target_type,
      to_jsonb(OLD),
      CURRENT_TIMESTAMP
    );
    RETURN OLD;
  ELSE
    INSERT INTO audit_logs (organization_id, user_id, action, target_id, target_type, old_values, new_values, timestamp)
    VALUES (
      NEW.organization_id,
      auth.uid(),
      action_type,
      NEW.id,
      target_type,
      CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
      to_jsonb(NEW),
      CURRENT_TIMESTAMP
    );
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar a tablas críticas (incidents es la más importante)
CREATE TRIGGER audit_incidents
  AFTER INSERT OR UPDATE OR DELETE ON incidents
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_projects
  AFTER INSERT OR UPDATE OR DELETE ON projects
  FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- NOTA: No aplicar a audit_logs (evitar recursión infinita)
```

### Trigger: Proteger audit_logs (Solo Lectura)

```sql
-- FUNCIÓN: Bloquea UPDATE y DELETE en audit_logs
CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'audit_logs es inmutable. No se permite UPDATE ni DELETE.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER protect_audit_logs_update
  BEFORE UPDATE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_modification();

CREATE TRIGGER protect_audit_logs_delete
  BEFORE DELETE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_modification();
```

**DESCRIPCIÓN SEMÁNTICA:**

**QUÉ:** Triggers SQL para automatizar lógica de negocio crítica

**POR QUÉ:** Garantizar consistencia sin depender de la aplicación (defense in depth)

**QUÉ HACE:** 
- Actualiza `updated_at` automáticamente en cada modificación
- Bloquea modificaciones a incidencias cerradas (RNF-B02)
- Limita a 5 fotos por incidencia
- Crea audit logs automáticamente para acciones críticas
- Protege audit_logs de modificación/eliminación

**CÓMO lo hace:**
- Funciones PL/pgSQL ejecutadas en eventos BEFORE/AFTER
- SECURITY DEFINER para audit logs (ejecuta con permisos elevados)
- Validaciones con RAISE EXCEPTION para bloquear operaciones inválidas

---

## 2.11 - SUPABASE REALTIME (Suscripciones en Tiempo Real)

> **QUÉ:** Configuración de Supabase Realtime para actualizaciones en vivo
> **POR QUÉ:** Dashboard ejecutivo debe reflejar cambios sin refresh manual
> **QUÉ HACE:** Habilita suscripciones a cambios en tablas críticas
> **CÓMO:** Publicaciones de PostgreSQL + filtrado por RLS

### Habilitar Realtime en Tablas

```sql
-- Habilitar publicación Realtime para tablas específicas
-- NOTA: Solo habilitar en tablas donde se necesite tiempo real
-- (no habilitar en audit_logs por volumen alto)

-- INCIDENTS: Cambios en tiempo real (nuevas, asignadas, cerradas)
ALTER PUBLICATION supabase_realtime ADD TABLE incidents;

-- COMMENTS: Nuevos comentarios en tiempo real
ALTER PUBLICATION supabase_realtime ADD TABLE comments;

-- PROJECTS: Cambios de estado en proyectos
ALTER PUBLICATION supabase_realtime ADD TABLE projects;

-- CRITICAL_PATH_ITEMS: Actualizaciones de progreso
ALTER PUBLICATION supabase_realtime ADD TABLE critical_path_items;
```

### Configuración de Suscripciones (Cliente)

```typescript
// Ejemplo de suscripción desde Web Admin (Astro + React)
// Archivo: src/lib/realtime/subscriptions.ts

import { supabase } from '@/lib/supabase/client';

// Suscripción a incidencias de un proyecto específico
export function subscribeToProjectIncidents(
  projectId: string,
  organizationId: string,
  onInsert: (incident: Incident) => void,
  onUpdate: (incident: Incident) => void
) {
  return supabase
    .channel(`incidents:project:${projectId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'incidents',
        filter: `project_id=eq.${projectId}`
      },
      (payload) => onInsert(payload.new as Incident)
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'incidents',
        filter: `project_id=eq.${projectId}`
      },
      (payload) => onUpdate(payload.new as Incident)
    )
    .subscribe();
}

// Suscripción a incidencias CRITICAL (para alertas al Owner)
export function subscribeToCriticalIncidents(
  organizationId: string,
  onCritical: (incident: Incident) => void
) {
  return supabase
    .channel(`incidents:critical:${organizationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'incidents',
        filter: `organization_id=eq.${organizationId},priority=eq.CRITICAL`
      },
      (payload) => onCritical(payload.new as Incident)
    )
    .subscribe();
}

// Suscripción a progreso de ruta crítica
export function subscribeToCriticalPathProgress(
  projectId: string,
  onProgress: (item: CriticalPathItem) => void
) {
  return supabase
    .channel(`critical_path:${projectId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'critical_path_items',
        filter: `project_id=eq.${projectId}`
      },
      (payload) => onProgress(payload.new as CriticalPathItem)
    )
    .subscribe();
}
```

### Casos de Uso de Realtime

| Pantalla | Suscripción | Evento | Acción en UI |
|:---------|:------------|:-------|:-------------|
| **Dashboard Ejecutivo** | `incidents` por org | INSERT | Incrementar contador, mostrar alerta si CRITICAL |
| **Dashboard Ejecutivo** | `incidents` por org | UPDATE (status) | Actualizar KPIs (abiertos, cerrados) |
| **Lista de Incidencias** | `incidents` por proyecto | INSERT/UPDATE | Actualizar lista automáticamente |
| **Detalle Incidencia** | `comments` por incident_id | INSERT | Mostrar nuevo comentario sin refresh |
| **Ruta Crítica** | `critical_path_items` | UPDATE | Actualizar barra de progreso |
| **Alertas Owner** | `incidents` con priority=CRITICAL | INSERT | Toast notification + sonido |

### Consideraciones de Performance

```typescript
// IMPORTANTE: Desuscribirse al desmontar componentes
useEffect(() => {
  const subscription = subscribeToProjectIncidents(projectId, orgId, onInsert, onUpdate);
  
  return () => {
    subscription.unsubscribe();
  };
}, [projectId, orgId]);

// IMPORTANTE: No suscribirse a tablas de alto volumen sin filtros
// ❌ MAL: Suscribirse a TODOS los audit_logs
// ✅ BIEN: Suscribirse solo a incidents de UN proyecto
```

**DESCRIPCIÓN SEMÁNTICA:**

**QUÉ:** Configuración de Supabase Realtime para actualizaciones en vivo

**POR QUÉ:** UX mejorada - dashboard refleja cambios sin refresh manual

**QUÉ HACE:** 
- Habilita publicación en tablas críticas (incidents, comments, projects, critical_path)
- Define patrones de suscripción por proyecto/organización
- Maneja alertas de incidencias CRITICAL en tiempo real

**CÓMO lo hace:**
- PostgreSQL publications + Supabase Realtime channels
- Filtrado por project_id/organization_id (no cargar todos los datos)
- RLS policies aplican automáticamente (solo ves cambios autorizados)
- Cleanup de suscripciones en unmount (prevenir memory leaks)

---

## ⚡ RESUMEN: MEJORAS SAAS-READY IMPLEMENTADAS

### ✅ MULTI-TENANT ISOLATION

| Cambio | Antes | Después | Impacto |
|:-------|:------|:--------|:--------|
| **Tabla ORGANIZATIONS** | ❌ NO EXISTE | ✅ Nueva | Raíz de multi-tenant, segmenta clientes |
| **organization_id** | ❌ AUSENTE | ✅ EN TODAS | Separa datos entre empresas |
| **RLS Policies** | ⚠️ Incompletas | ✅ Multi-tenant | Validar org_id en cada query |
| **Email único** | ❌ GLOBAL | ✅ POR TENANT | Juan@email.com en múltiples orgs |
| **Nombres únicos** | ❌ GLOBAL | ✅ POR TENANT | 2 orgs pueden tener Proyecto A |

### ✅ TIMEZONE SUPPORT (Usuarios globales)

| Cambio | Antes | Después |
|:-------|:------|:--------|
| `created_at` | `TIMESTAMP` | `TIMESTAMP WITH TIME ZONE` |
| `updated_at` | `TIMESTAMP` | `TIMESTAMP WITH TIME ZONE` |
| `deleted_at` | `TIMESTAMP` | `TIMESTAMP WITH TIME ZONE` |
| Beneficio | Sin zona horaria | Soporta usuarios en múltiples países |

### ✅ ÍNDICES DE PERFORMANCE

| Tabla | Índices Agregados | Propósito |
|:------|:------------------|:----------|
| **users** | `(org_id, email)` | Login rápido |
| **projects** | `(org_id, status, created_at)` | Dashboards rápidos |
| **incidents** | `(org_id, status, created_at DESC)` | Queries de reportes |
| **comments** | `(org_id, incident_id)` | Cargar notas de incidencia |
| **photos** | `(org_id, incident_id)` | Cargar fotos de incidencia |
| **critical_path** | `(org_id, project_id, status)` | Ruta crítica del dashboard |
| **audit_logs** | `(org_id, timestamp DESC, action)` | Compliance queries rápidas |

### ✅ ESCALABILIDAD PREPARADA (Sin over-engineering)

| Aspecto | Implementado Ahora | Preparado para Futuro |
|:--------|:-------------------|:----------------------|
| **Particionamiento** | ❌ No (YAGNI) | ✅ Comentarios con instrucciones cuando >1M registros |
| **Archivado** | ❌ No | ✅ Documentado cómo hacerlo con Supabase Storage |
| **Cuotas Storage** | ✅ Límite definido | ✅ Uso calculado via Supabase Storage API |

### ✅ SUPABASE INFRASTRUCTURE

| Componente | Estado | Descripción |
|:-----------|:-------|:------------|
| **Storage Buckets** | ✅ Definido | 4 buckets (incident-photos, profile-pictures, organization-assets, critical-path-imports) |
| **Storage Policies** | ✅ RLS | Acceso controlado por organization_id y rol |
| **Triggers** | ✅ Definidos | updated_at automático, inmutabilidad, max 5 fotos, audit log |
| **Realtime** | ✅ Configurado | Suscripciones a incidents, comments, projects, critical_path |

### ✅ LÍMITES DE CUOTA POR TENANT

| Límite | Propósito | Ejemplos de Tiers |
|:-------|:----------|:------------------|
| `storage_quota_mb` | Cobrar por almacenamiento | Starter: 5GB, Pro: 50GB, Enterprise: 500GB |
| `max_users` | Cobrar por cantidad de usuarios | Starter: 50, Pro: 200, Enterprise: Ilimitado |
| `max_projects` | Cobrar por cantidad de obras | Starter: 5, Pro: 50, Enterprise: Ilimitado |
| `plan` | Nivel de suscripción | STARTER, PROFESSIONAL, ENTERPRISE |

### ✅ AUDITORÍA FORENSE POR TENANT

- `old_values` / `new_values` JSONB para reconstruir histórico
- Particionamiento permite archivar logs antiguos
- Índices separados por `organization_id` para compliance rápida

---

## 3️⃣ VALIDACIONES ESPECÍFICAS (ZODA RULES FINALIZADAS)

> **Propósito:** Reglas de negocio con Zod (Backend).

### 3.1 - Campos de Texto

**[x]** Tipo (Título):

- Validación: **ENUM** (valores predefinidos solamente)
- Sin longitud (es selectable, no texto libre)

**[x]** Descripción:

- `min(10, "Descripción debe tener al menos 10 caracteres")`
- `max(1000, "Descripción no puede exceder 1000 caracteres")`
- Permite espacios, puntuación, caracteres especiales

**[x]** Nombre Proyecto:

- `min(5, "Nombre muy corto")`
- `max(100, "Nombre muy largo")`
- Regex: `/^[a-zA-Z0-9\s\-._áéíóúñ]+$/` (evitar caracteres inválidos en URLs)
- UNIQUE en BD

### 3.2 - Campos Requeridos vs Opcionales

**Obligatorios al crear incidencia:**

- ✅ `type` (seleccionar de lista)
- ✅ `description` (texto, 10-1000 chars)
- ✅ `project_id` (válido en BD)
- ✅ `gps_lat`, `gps_lng` (captura automática)
- ✅ Mínimo 1 fotografía

**Opcionales:**

- ❌ `assigned_to` (NULL permitido)
- ❌ `priority` (default: NORMAL)

### 3.3 - Validaciones de Enumeraciones

**[x]** Tipo: ENUM restringido a 5 valores

**[x]** Prioridad: ENUM (NORMAL | CRITICAL)

**[x]** Estado: ENUM (OPEN | ASSIGNED | CLOSED)

### 3.4 - Validaciones de Relaciones

**[x]** Incidencia DEBE tener project_id válido (FK)

**[x]** Incidencia DEBE tener created_by válido (FK)

**[x]** assigned_to es NULLABLE (puede ser NULL)

**[x]** No se puede asignar a usuario de diferente proyecto

### 3.5 - Validaciones de Negocio Complejas (CRÍTICO - RNF-B02)

**INALTERABILIDAD POST-CIERRE:**

| Acción | Permitido | Razón |
|--------|-----------|-------|
| Editar descripción original | ❌ | Rompe auditoría |
| Editar tipo/prioridad | ❌ | Rompe auditoría |
| Editar assigned_to | ❌ | Rompe auditoría |
| Agregar comentario (FOLLOWUP) | ✅ | Permitido para notas de seguimiento |
| Agregar foto (en comentario) | ✅ | Permitido como parte de seguimiento |
| Cambiar estado CLOSED → OPEN | ❌ | Crear nueva incidencia vinculada en su lugar |
| Ver detalles | ✅ | Solo lectura |

**Implementación:**

- Trigger SQL: Si `status = CLOSED`, bloquear UPDATE en columnas: type, description, priority, assigned_to
- RLS Policy: Solo Owner/Admin pueden crear nuevas incidencias (validación de rol en app)

### 3.6 - Validaciones de Fechas

**[x]** Proyecto: `end_date > start_date`

**[x]** Incidencias: `created_at` y `closed_at` capturados del servidor (no editable)

**[x]** Ruta Crítica: `planned_end >= planned_start`

### 3.7 - Validaciones de Fotografías

**[x]** Tamaño: Máximo 5MB por foto

**[x]** Formatos: JPG, PNG, WebP

**[x]** Cantidad: Mín 1, Máx 5 por incidencia

**[x]** Obligatorias: SÍ al crear (no al cerrar)

---

## 4️⃣ OPERACIONES CRUD Y ACCIONES (FINALIZADO)

> **Propósito:** Flujos de negocio detallados.

### 4.1 - Crear Incidencia

**[x]** Quién: Cabo, Residente, Superintendente, Owner (validar en Zod/Backend)

**[x]** Campos requeridos:

- type (ENUM)
- description (10-1000 chars)
- project_id (válido en BD)
- gps_lat, gps_lng (captura automática)
- Mínimo 1 foto (máximo 5)

**[x]** Valores por defecto:

- `status = OPEN`
- `priority = NORMAL`
- `assigned_to = NULL`
- `created_at = NOW()` (servidor)
- `created_by = current_user` (automático)

### 4.2 - Editar Incidencia

**[x]** Quién puede editar: Creador o Superintendente+ (si status != CLOSED)

**[x]** Qué se puede editar:

- `assigned_to` (cambiar responsable)
- Agregar comentarios
- Agregar fotos (solo si es FOLLOWUP)

**[x]** NO editable (INMUTABLE):

- type, description, priority, gps_lat, gps_lng, created_by

### 4.3 - Cambiar Estado

**[x]** Workflow lineal (NO se puede retroceder):

```
OPEN → ASSIGNED → CLOSED
```

**[x]** Transiciones permitidas:

- `OPEN → ASSIGNED` (Cuando se asigna)
- `OPEN → CLOSED` (Si se resuelve directamente)
- `ASSIGNED → CLOSED` (Cuando está resuelta)
- `CLOSED → OPEN` ❌ PROHIBIDO (crear nueva incidencia en su lugar)

**[x]** Cambio de estado automático:

- Cuando se ejecuta `assigned_to = user` → status = ASSIGNED (automático)

**[x]** Nota de cierre: Opcional (pero recomendado)

### 4.4 - Asignar Usuario

**[x]** Acción: Separada de editar

**[x]** Quién: Residente, Superintendente, Owner

**[x]** Puede desasignar: SÍ (set assigned_to = NULL)

**[x]** Notificación: Push inmediata al usuario asignado

### 4.5 - Escalamiento Automático (IMPORTANTE)

**[x]** ¿Asignación o Notificación?: **NOTIFICACIÓN** (no automática)

**Flujo:**

1. Cabo crea incidencia
2. Sistema envía Push al Residente responsable del proyecto
3. Residente revisa y decide si asignar o resolver él mismo
4. Si es `CRITICAL` → Push inmediata al Owner/Admin (saltando cadena)

### 4.6 - Reportar Avance (Ruta Crítica)

**[x]** Quién: Residente, Superintendente (NO Cabo)

**[x]** Validación: Porcentaje 0-100, debe existir actividad en BD

**[x]** Efecto: Actualiza `critical_path_items.progress_percentage` y recalcula KPI del proyecto

### 4.7 - Agregar Comentario

**[x]** Campos: text, comment_type (ASSIGNMENT | CLOSURE | FOLLOWUP), author_id, created_at

**[x]** Longitud: 5-500 caracteres

**[x]** Editar/Eliminar: NO (inmutable como auditoría)

**[x]** Quién: Cualquier usuario autorizado del proyecto

### 4.8 - Subir Fotos

**[x]** Quién: Creador, asignado, supervisor+

**[x]** Validaciones: 5MB máx, formato JPG/PNG/WebP

**[x]** Almacenamiento: Supabase Storage (con encriptación)

**[x]** Eliminar: NO (inmutable post-cierre)

### 4.9 - Eliminar Incidencia

**[x]** ¿Permitido?: NO para incidencias cerradas

**[x]** Estados permitidos: OPEN o ASSIGNED (soft delete posible)

**[x]** Quién: Owner/Admin únicamente

**[x]** Tipo: Soft delete (marcar como deleted_at, conservar en auditoría)

### 4.10 - Búsqueda y Filtrado Avanzado (MVP)

**[x]** Implementado por: Web Admin (RF-B06)

**Criterios de búsqueda:**

- Por rango de fechas (created_at)
- Por estado (OPEN, ASSIGNED, CLOSED)
- Por tipo de incidencia (Enum)
- Por autor (created_by user_id)
- Por responsable asignado (assigned_to)
- Por proyecto (para Owner/Admin multi-proyecto)
- Por prioridad (NORMAL, CRITICAL)

**Visualización:**

- Lista con paginación (20 items por página)
- Filtros persistentes en URL (para compartir búsquedas)
- Contador de resultados

### 4.11 - Otras Acciones (Post-MVP)

- [ ] Exportación PDF/Excel con filtros aplicados
- [ ] Generación de reportes mensuales por proyecto
- [ ] Duplicar incidencia (crear copia con nuevas fotos)
- [ ] Estadísticas por tipo/categoría
- [ ] Gráficos de tiempo promedio de cierre
- [ ] Notificaciones por email (adicional a Push)

---

## 5️⃣ AUTENTICACIÓN Y PERMISOS RBAC (FINALIZADO)

> **Propósito:** Control de acceso granular.

### 5.1 - Autenticación

**[x]** Sistema: Supabase Auth

**[x]** Método: Email/Contraseña (OAuth post-MVP)

**[x]** Confirmación de email: SÍ (obligatoria)

**[x]** Recuperación de contraseña: SÍ

### 5.2 - Roles y Jerarquía

**4 Roles jerárquicos:**

1. **OWNER/ADMIN (D/A)** - Dueño del sistema
   - Acceso total
   - Crea proyectos
   - Define plantillas
   - Carga Ruta Crítica
   - Ve dashboard ejecutivo
   - Notificado de incidents CRITICAL

2. **SUPERINTENDENT (S)** - Jefe de obra
   - Gestiona múltiples proyectos
   - Revisa incidencias
   - Reporta avance físico
   - Aprueba solicitudes de material
   - Ve incidencias de sus obras

3. **RESIDENT (R)** - Residente de obra
   - Registra incidencias
   - Reporta avance
   - Notifica necesidades
   - Ve incidencias de su proyecto
   - Recibe Push notifications

4. **CABO (C)** - Capataz de campo
   - Crea incidencias (con fotos obligatorias)
   - Solo lectura de Ruta Crítica
   - Reporta necesidades básicas
   - NO acceso a gestión

### 5.3 - Matriz de Permisos (RBAC Completa)

| ACCIÓN | OWNER | SUPER | RESIDENT | CABO | Plataforma |
|:---|:---:|:---:|:---:|:---:|:---:|
| Crear incidencia | ✅ | ✅ | ✅ | ✅ | Móvil/Admin |
| Editar incidencia* | ✅ | ✅ | ✅ | ❌ | Móvil/Admin |
| Asignar responsable | ✅ | ✅ | ✅ | ❌ | Móvil/Admin |
| Cerrar incidencia | ✅ | ✅ | ✅ | ❌ | Móvil/Admin |
| Ver todas (global) | ✅ | ✅** | ❌ | ❌ | Admin |
| Ver solo su obra | - | ✅** | ✅ | ✅ | Móvil/Admin |
| Reportar avance | ✅ | ✅ | ✅ | ❌ | Móvil/Admin |
| Cargar Ruta Crítica | ✅ | ❌ | ❌ | ❌ | Admin |
| Ver Ruta Crítica (RO) | ✅ | ✅ | ✅ | ✅ | Móvil/Admin |
| Agregar comentario | ✅ | ✅ | ✅ | ✅ | Móvil/Admin |
| Subir fotos | ✅ | ✅ | ✅ | ✅ | Móvil |
| Crear usuario | ✅ | ❌ | ❌ | ❌ | Admin |
| Ver auditoría | ✅ | ✅ | ❌ | ❌ | Admin |
| Editar usuario | ✅ | ❌ | ❌ | ❌ | Admin |
| Activar/desactivar usuario | ✅ | ❌ | ❌ | ❌ | Admin |

*Editar = agregar comentarios/fotos en status OPEN/ASSIGNED, cambiar assigned_to

**SUPER ve incidencias de proyectos asignados a él o sus subordinados

### 5.4 - Row Level Security (RLS) Policies

**[x]** Implementar RLS en Supabase:

```sql
-- INCIDENTS: Usuario solo ve incidencias de su proyecto + OWNER ve todo
CREATE POLICY incidents_visibility ON incidents
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'OWNER'
    )
    OR project_id IN (
      SELECT project_id FROM project_members WHERE user_id = auth.uid()
    )
  );

-- AUDIT_LOGS: Solo OWNER/SUPER+ pueden leer
CREATE POLICY audit_logs_visibility ON audit_logs
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role IN ('OWNER', 'SUPERINTENDENT')
    )
  );

-- PHOTOS: Inmutable post-creación
CREATE POLICY photos_immutable ON photos
  FOR DELETE USING (FALSE);
```

### 5.5 - Control de Acceso por Recurso

**[x]** OWNER: Ve TODA la plataforma (multirental)

**[x]** SUPERINTENDENT: Ve solo sus proyectos asignados + sub-usuarios

**[x]** RESIDENT: Ve solo proyecto actual + equipo asignado

**[x]** CABO: Ve solo incidencias creadas por él + asignadas

---

## 6️⃣ ABORDAJE TÉCNICO (ARQUITECTURA FINALIZADA)

> **Propósito:** Estrategia técnica desacoplada y escalable.

### 6.1 - Astro Actions vs API Routes

**[x]** Estrategia HÍBRIDA (lo mejor de ambos):

**Astro Actions:**

- ✅ Crear/editar incidencias (formularios)
- ✅ Cambiar estado
- ✅ Asignar usuarios
- ✅ Login/Autenticación
- ✅ Crear proyectos
- **Por qué:** Validación type-safe integrada, seguridad automática, ideal para formularios

**API Routes (REST):**

- ✅ Sincronización offline (móvil)
- ✅ Subir fotos (multipart/form-data)
- ✅ Reportar avance (cálculos complejos)
- ✅ Exportar datos (PDF/Excel)
- **Por qué:** Más control, estándar REST, mejor para datos binarios

### 6.2 - Stack de Validación

**[x]** Zod en servidor (OBLIGATORIO)

- Validar en Astro Actions y API Routes
- Compartir esquemas entre cliente/servidor
- Generar tipos TypeScript automáticos

**[x]** React Hook Form + Zod en cliente

- Validación en tiempo real (UX)
- Mostrar errores al usuario
- Submits seguros

**[x]** No duplicar lógica: Compartir `src/lib/schemas/` entre cliente y servidor

### 6.3 - Base de Datos

**[x]** Schema SQL (ver sección 2) ya definido

**[x]** Implementación: Supabase PostgreSQL

**[x]** Relaciones y constraints:

```sql
-- Foreign Keys
ALTER TABLE incidents ADD CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id);
ALTER TABLE incidents ADD CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users(id);
ALTER TABLE incidents ADD CONSTRAINT fk_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id);

-- Validaciones SQL
ALTER TABLE projects ADD CONSTRAINT check_dates CHECK (end_date > start_date);
ALTER TABLE critical_path_items ADD CONSTRAINT check_progress CHECK (progress_percentage >= 0 AND progress_percentage <= 100);

-- Triggers para inalterabilidad
CREATE TRIGGER prevent_closed_incident_update
BEFORE UPDATE ON incidents
FOR EACH ROW
WHEN (OLD.status = 'CLOSED')
DO RAISE EXCEPTION 'No se puede editar incidencia cerrada';
```

### 6.4 - Caché de Datos

**[x]** React Query (TanStack Query):

- Caché inteligente de incidencias
- Refetch automático cada 30s (tiempo real)
- Invalidación manual al crear/editar

**[x]** Supabase Realtime:

- Escuchar cambios en tiempo real
- Notificaciones de escalamiento
- Sincronización entre usuarios

**[x]** Estrategia de refresco:

- Crear/editar incidencia → refetch lista
- Cambiar estado → notificación en tiempo real
- Reportar avance → recalcular KPI del dashboard

### 6.5 - Modo Offline (RNF-C02)

**[x]** Alcance: **App Móvil SOLO** (Web asume conexión estable)

**[x]** Tecnología: Base de datos local en dispositivo + sincronización automática

**[x]** Qué se sincroniza:

**Bajada (Pull - al abrir app con conexión):**

- Catálogos (tipos incidencia, lista de usuarios del proyecto)
- Ruta Crítica completa (para poder reportar avance sin conexión)
- Incidencias del proyecto (últimas 7 días)
- Foto de perfil de usuarios (caché)

**Subida (Push - cuando se recupera conexión):**

- Incidencias nuevas creadas offline (con fotos comprimidas para ahorro de banda)
- Reportes de avance realizados offline
- Comentarios creados offline
- Resolución de conflictos (última escritura gana)

**[x]** Implementación Web Admin (API Routes):

- API Route `/api/sync` que recibe JSON masivo
- Validación de datos contra esquemas Zod
- Validación de integridad (NO permite editar incidencias cerradas)
- Atomicidad: todo se sincroniza o nada (transacciones)
- Retorna timestamp de última sincronización + lista de errores
- Rate limiting: máximo 1 sincronización por 30 segundos por usuario

**[x]** Especificación de conflictos:

- Si una incidencia fue cerrada en servidor mientras estaba offline: rechazar edición
- Si fotos tienen conflicto de nombre: renombrar automáticamente con timestamp
- Si comentario duplicado detectado (mismo texto, mismo author, misma incidencia): ignorar

### 6.6 - Estructura de Carpetas Recomendada

```
src/
├── lib/
│   ├── schemas/          ← Zod schemas compartidos
│   │   ├── incidents.ts
│   │   ├── projects.ts
│   │   └── auth.ts
│   ├── services/         ← Lógica desacoplada
│   │   ├── incidents.service.ts
│   │   ├── projects.service.ts
│   │   └── auth.service.ts
│   ├── supabase/         ← Cliente Supabase
│   │   ├── client.ts     (cliente público)
│   │   └── server.ts     (servidor privado)
│   ├── types/            ← TypeScript types generados
│   └── utils/            ← Utilidades
├── pages/
│   ├── api/              ← API Routes (REST)
│   │   ├── incidents/
│   │   ├── auth/
│   │   └── sync/
│   └── actions.ts        ← Astro Actions
└── components/           ← React + Astro
    ├── IncidentForm.tsx
    └── ...
```

### 6.7 - Seguridad (CRÍTICO)

**[x]** HTTPS obligatorio

**[x]** Rate limiting en API Routes

**[x]** Validación de token JWT en servidor

**[x]** RLS policies en Supabase

**[x]** Auditoría de todas las acciones críticas

**[x]** Encriptación de fotos en Storage (AES-256)

---

## 📊 RESUMEN DE DECISIONES

### ✅ CONFIRMADAS

- **2 Plataformas:** Web Admin (Astro) + App Móvil (Capacitor - proyecto separado)
- **Web Admin:** Dashboard, Proyectos, Usuarios, Auditoría, Alertas
- **App Móvil:** Incidencias, Fotos+GPS, Offline, Push Notifications
- **Zod + React Hook Form** para validación robusta
- **Astro Actions + API Routes** (híbrido)
- **Supabase + PostgreSQL** con RLS
- **4 Roles RBAC** (Owner, Super, Resident, Cabo)
- **Inalterabilidad post-cierre** (RNF-B02)
- **GPS obligatorio** en incidencias (App Móvil)
- **Notificación de escalamiento** (no asignación automática)
- **Modo offline** solo en App Móvil (RNF-C02)

### 🎯 ALCANCE WEB ADMIN (Este proyecto)

**MVP - Funciones del D/A (Dueño/Administrador):**

1. **RF-A01:** Crear proyectos
2. **RF-A02:** Asignar usuarios a proyectos
3. **RF-A03:** Cargar Ruta Crítica (.xlsx/.csv)
4. **RF-C03:** Dashboard ejecutivo con KPIs
5. **RF-B06:** Búsqueda/filtrado de incidencias
6. **RF-C04:** Ver bitácora digital (solo lectura)
7. Gestión de usuarios (CRUD)
8. Ver auditoría del sistema
9. Recibir alertas de incidencias CRITICAL

**API Routes para App Móvil:**

- `/api/incidents` - CRUD de incidencias
- `/api/photos` - Subir fotos
- `/api/sync` - Sincronización offline
- `/api/auth` - Autenticación

### 🔧 SIGUIENTE PASO

**Para Web Admin (este proyecto):**

1. Crear migrations de Supabase (SQL)
2. Generar Zod schemas compartidos
3. Crear tipos TypeScript
4. Implementar Astro Actions (Dashboard, Proyectos, Usuarios)
5. Crear API Routes (para que App Móvil consuma)

**Proyecto futuro (App Móvil - Flutter):**

- Stack tecnológico: Flutter (independiente)
- Base de datos local: Implementation details de Flutter
- Push Notifications: FCM (Android) / APNs (iOS)
- GPS, Cámara, Permisos: Nativos de plataforma
- Optimización: Compresión de imágenes antes de sincronización
