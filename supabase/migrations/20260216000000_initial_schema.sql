-- =============================
-- Archivo: 00-init.sql
-- Descripción: Inicialización global del sistema STROP - Extensiones y configuraciones base
-- Dependencias: Ninguna
-- Autor: Generado por Antigravity
-- Fecha: 2026-02-05
-- =============================

-- Este archivo prepara el entorno de base de datos antes de crear cualquier objeto.
-- Es 100% idempotente y puede ejecutarse múltiples veces sin errores.

-- =============================
-- Sección 1: Extensiones de PostgreSQL
-- =============================

-- UUID generation para IDs únicos
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Funciones criptográficas para tokens y hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- PostGIS para funcionalidades geoespaciales (geofencing de proyectos)
-- Razón: El sistema requiere validar que incidencias estén dentro del radio del proyecto
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =============================
-- Sección 2: Configuraciones Globales
-- =============================

-- Establecer timezone por defecto a UTC para consistencia
-- Todas las timestamps se almacenan en UTC y se convierten en cliente
ALTER DATABASE postgres SET timezone TO 'UTC';

-- =============================
-- Sección 3: Funciones Utilitarias Globales
-- =============================

-- Función para actualizar automáticamente el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

COMMENT ON FUNCTION update_updated_at_column() IS 'Trigger function to automatically update updated_at timestamp';

-- =============================
-- Notas de Implementación
-- =============================
-- 1. PostGIS se usa para:
--    - Almacenar location_gps de proyectos como GEOGRAPHY(POINT)
--    - Validar que gps_coords de incidencias estén dentro del radio del proyecto
--    - Calcular distancias para alertas de geofencing
--
-- 2. pgcrypto se usa para:
--    - Generar public_token seguros para enlaces públicos
--    - Hash de datos sensibles si es necesario
--
-- 3. uuid-ossp se usa para:
--    - Generar UUIDs v4 para todas las entidades principales
-- =============================
-- Archivo: 01-tables.sql
-- Descripción: Definición de todas las tablas del sistema STROP
-- Dependencias: 00-init.sql
-- Autor: Generado por Antigravity
-- Fecha: 2026-02-05
-- =============================

-- Este archivo crea toda la estructura de tablas del sistema.
-- Las tablas están ordenadas según dependencias (tablas referenciadas primero).

BEGIN;

-- =============================
-- Sección 1: Tablas Base (Sin dependencias)
-- =============================

-- Tabla: organizations
-- Representa las empresas constructoras que usan STROP
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subscription_plan TEXT NOT NULL DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'professional', 'enterprise')),
  staff_limit INTEGER NOT NULL DEFAULT 5,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE organizations IS 'Empresas constructoras que utilizan el sistema STROP';
COMMENT ON COLUMN organizations.staff_limit IS 'Número máximo de licencias pagas (Staff)';
COMMENT ON COLUMN organizations.subscription_plan IS 'Nivel de servicio contratado';

-- Tabla: roles
-- Define los roles personalizables con sus capacidades
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  capabilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_system_role BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_role_per_org UNIQUE (organization_id, display_name)
);

COMMENT ON TABLE roles IS 'Roles personalizables con matriz de permisos RBAC';
COMMENT ON COLUMN roles.capabilities IS 'Array JSON de capability IDs de la matriz de permisos';
COMMENT ON COLUMN roles.is_system_role IS 'Si es true, el rol no puede ser eliminado (ej: Admin, Residente)';

-- =============================
-- Sección 2: Usuarios
-- =============================

-- Tabla: users (extiende auth.users de Supabase)
-- Almacena información adicional de usuarios del sistema
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  user_type TEXT NOT NULL CHECK (user_type IN ('staff', 'crew')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE users IS 'Perfiles extendidos de usuarios del sistema';
COMMENT ON COLUMN users.user_type IS 'staff = empleado permanente (consume licencia), crew = temporal por proyecto';
COMMENT ON COLUMN users.is_active IS 'Estado de la licencia del usuario';

-- =============================
-- Sección 3: Proyectos
-- =============================

-- Tabla: projects
-- Representa las obras de construcción
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location_gps GEOGRAPHY(POINT, 4326),
  geofence_radius_meters INTEGER DEFAULT 500,
  contingency_budget DECIMAL(12, 2) NOT NULL DEFAULT 0,
  start_date DATE,
  end_date DATE,
  cover_photo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE projects IS 'Proyectos de construcción (obras)';
COMMENT ON COLUMN projects.location_gps IS 'Coordenadas centrales del proyecto para geofencing';
COMMENT ON COLUMN projects.geofence_radius_meters IS 'Radio en metros para validar ubicación de incidencias';
COMMENT ON COLUMN projects.contingency_budget IS 'Presupuesto asignado para riesgos y reparaciones';

-- Tabla: project_members
-- Relación muchos a muchos entre usuarios y proyectos
CREATE TABLE IF NOT EXISTS project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_project_member UNIQUE (project_id, user_id)
);

COMMENT ON TABLE project_members IS 'Asignación de usuarios a proyectos específicos';

-- =============================
-- Sección 4: Incidencias (Núcleo del sistema)
-- =============================

-- Tabla: incidents
-- Entidad principal del sistema - reportes de problemas en obra
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  folio_number INTEGER NOT NULL,
  
  -- Estado y prioridad
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_REVIEW', 'CLOSED', 'REJECTED')),
  priority TEXT NOT NULL DEFAULT 'NORMAL' CHECK (priority IN ('NORMAL', 'URGENT', 'CRITICAL')),
  
  -- Evidencia original
  description TEXT NOT NULL,
  audio_url TEXT,
  location_tag TEXT,
  gps_coords GEOGRAPHY(POINT, 4326),
  
  -- Contexto
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Asignación y resolución
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ,
  public_token TEXT UNIQUE,
  resolution_photo_url TEXT,
  resolution_timestamp TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Financiero
  estimated_cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
  actual_cost DECIMAL(10, 2),
  is_billable BOOLEAN NOT NULL DEFAULT false,
  
  -- Cierre
  closed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  closed_at TIMESTAMPTZ,
  
  CONSTRAINT unique_folio_per_project UNIQUE (project_id, folio_number)
);

COMMENT ON TABLE incidents IS 'Incidencias reportadas en proyectos - núcleo operativo de STROP';
COMMENT ON COLUMN incidents.folio_number IS 'Número secuencial por proyecto (ej: #1024)';
COMMENT ON COLUMN incidents.status IS 'OPEN=nuevo, IN_REVIEW=subcontratista subió foto, CLOSED=validado, REJECTED=rechazado';
COMMENT ON COLUMN incidents.public_token IS 'Token único para enlace público (WhatsApp)';
COMMENT ON COLUMN incidents.is_billable IS 'true=se cobra al contratista, false=gasto interno';
COMMENT ON COLUMN incidents.estimated_cost IS 'Costo previsto - alimenta KPI de Dinero en Riesgo';
COMMENT ON COLUMN incidents.actual_cost IS 'Monto final acordado al cerrar';

-- Tabla: incident_photos
-- Fotos asociadas a incidencias (antes y después)
CREATE TABLE IF NOT EXISTS incident_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_type TEXT NOT NULL CHECK (photo_type IN ('evidence', 'resolution')),
  annotations JSONB,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE incident_photos IS 'Fotos de evidencia y resolución de incidencias';
COMMENT ON COLUMN incident_photos.photo_type IS 'evidence=foto original del problema, resolution=foto del arreglo';
COMMENT ON COLUMN incident_photos.annotations IS 'Anotaciones o marcas sobre la foto (opcional)';

-- =============================
-- Sección 5: Auditoría
-- =============================

-- Tabla: audit_logs
-- Registro de todos los cambios importantes en el sistema
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  modified_by UUID REFERENCES users(id) ON DELETE SET NULL,
  comment TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE audit_logs IS 'Registro de auditoría de cambios en incidencias';
COMMENT ON COLUMN audit_logs.action IS 'Tipo de cambio (ej: status_change, assignment, cost_update)';
COMMENT ON COLUMN audit_logs.comment IS 'Comentario opcional, obligatorio en rechazos';

COMMIT;
-- =============================
-- Archivo: 02-indexes.sql
-- Descripción: Índices de rendimiento para optimizar queries del sistema STROP
-- Dependencias: 01-tables.sql
-- Autor: Generado por Antigravity
-- Fecha: 2026-02-05
-- =============================

-- Este archivo crea índices para optimizar las consultas más frecuentes del sistema.
-- Cada índice está documentado con su propósito específico.

-- =============================
-- Sección 1: Índices de Organizations
-- =============================

-- Búsqueda por plan de suscripción (para reportes y filtros admin)
CREATE INDEX IF NOT EXISTS idx_organizations_subscription_plan 
  ON organizations(subscription_plan);

-- =============================
-- Sección 2: Índices de Roles
-- =============================

-- Búsqueda de roles por organización (query muy frecuente)
CREATE INDEX IF NOT EXISTS idx_roles_organization_id 
  ON roles(organization_id);

-- Búsqueda de roles del sistema
CREATE INDEX IF NOT EXISTS idx_roles_system 
  ON roles(is_system_role) 
  WHERE is_system_role = true;

-- =============================
-- Sección 3: Índices de Users
-- =============================

-- FK a organization (JOIN frecuente)
CREATE INDEX IF NOT EXISTS idx_users_organization_id 
  ON users(organization_id);

-- FK a role (JOIN frecuente para verificar permisos)
CREATE INDEX IF NOT EXISTS idx_users_role_id 
  ON users(role_id);

-- Búsqueda por email (login y búsquedas)
CREATE INDEX IF NOT EXISTS idx_users_email 
  ON users(email);

-- Filtro por tipo de usuario (Staff vs Crew)
CREATE INDEX IF NOT EXISTS idx_users_type 
  ON users(user_type);

-- Filtro por usuarios activos (query frecuente en dashboards)
CREATE INDEX IF NOT EXISTS idx_users_active 
  ON users(is_active) 
  WHERE is_active = true;

-- Índice compuesto para queries de usuarios activos por organización
CREATE INDEX IF NOT EXISTS idx_users_org_active 
  ON users(organization_id, is_active);

-- =============================
-- Sección 4: Índices de Projects
-- =============================

-- FK a organization
CREATE INDEX IF NOT EXISTS idx_projects_organization_id 
  ON projects(organization_id);

-- Filtro por proyectos activos
CREATE INDEX IF NOT EXISTS idx_projects_active 
  ON projects(is_active) 
  WHERE is_active = true;

-- Índice espacial para geofencing (búsqueda de proyectos cercanos)
CREATE INDEX IF NOT EXISTS idx_projects_location_gps 
  ON projects USING GIST(location_gps);

-- Índice compuesto para proyectos activos por organización
CREATE INDEX IF NOT EXISTS idx_projects_org_active 
  ON projects(organization_id, is_active);

-- =============================
-- Sección 5: Índices de Project Members
-- =============================

-- FK a project (query muy frecuente: "usuarios de este proyecto")
CREATE INDEX IF NOT EXISTS idx_project_members_project_id 
  ON project_members(project_id);

-- FK a user (query: "proyectos de este usuario")
CREATE INDEX IF NOT EXISTS idx_project_members_user_id 
  ON project_members(user_id);

-- =============================
-- Sección 6: Índices de Incidents (Críticos para performance)
-- =============================

-- FK a project (query MÁS frecuente: incidencias por proyecto)
CREATE INDEX IF NOT EXISTS idx_incidents_project_id 
  ON incidents(project_id);

-- FK a created_by (query: incidencias creadas por usuario)
CREATE INDEX IF NOT EXISTS idx_incidents_created_by 
  ON incidents(created_by);

-- FK a assigned_to (query: incidencias asignadas a usuario)
CREATE INDEX IF NOT EXISTS idx_incidents_assigned_to 
  ON incidents(assigned_to);

-- Búsqueda por status (filtro principal en dashboards)
CREATE INDEX IF NOT EXISTS idx_incidents_status 
  ON incidents(status);

-- Búsqueda por prioridad (filtro en dashboards)
CREATE INDEX IF NOT EXISTS idx_incidents_priority 
  ON incidents(priority);

-- Búsqueda por token público (enlace público - lookup único)
CREATE INDEX IF NOT EXISTS idx_incidents_public_token 
  ON incidents(public_token) 
  WHERE public_token IS NOT NULL;

-- Índice espacial para validación de geofencing
CREATE INDEX IF NOT EXISTS idx_incidents_gps_coords 
  ON incidents USING GIST(gps_coords);

-- Índice compuesto: incidencias abiertas por proyecto (query crítico)
CREATE INDEX IF NOT EXISTS idx_incidents_project_status 
  ON incidents(project_id, status);

-- Índice compuesto: incidencias por proyecto y prioridad
CREATE INDEX IF NOT EXISTS idx_incidents_project_priority 
  ON incidents(project_id, priority);

-- Índice para cálculo de "Dinero en Riesgo" (incidencias abiertas con costo)
CREATE INDEX IF NOT EXISTS idx_incidents_open_cost 
  ON incidents(project_id, estimated_cost) 
  WHERE status IN ('OPEN', 'IN_REVIEW');

-- Índice para cálculo de "Dinero Recuperado" (incidencias cerradas cobrables)
CREATE INDEX IF NOT EXISTS idx_incidents_billable_closed 
  ON incidents(project_id, actual_cost) 
  WHERE status = 'CLOSED' AND is_billable = true;

-- Índice por fecha de creación (ordenamiento temporal)
CREATE INDEX IF NOT EXISTS idx_incidents_created_at 
  ON incidents(created_at DESC);

-- Índice por fecha de actualización (para sincronización offline)
CREATE INDEX IF NOT EXISTS idx_incidents_updated_at 
  ON incidents(updated_at DESC);

-- =============================
-- Sección 7: Índices de Incident Photos
-- =============================

-- FK a incident (query: fotos de una incidencia)
CREATE INDEX IF NOT EXISTS idx_incident_photos_incident_id 
  ON incident_photos(incident_id);

-- Filtro por tipo de foto (evidencia vs resolución)
CREATE INDEX IF NOT EXISTS idx_incident_photos_type 
  ON incident_photos(photo_type);

-- Índice compuesto: fotos por incidencia y tipo
CREATE INDEX IF NOT EXISTS idx_incident_photos_incident_type 
  ON incident_photos(incident_id, photo_type);

-- =============================
-- Sección 8: Índices de Audit Logs
-- =============================

-- FK a incident (query: historial de una incidencia)
CREATE INDEX IF NOT EXISTS idx_audit_logs_incident_id 
  ON audit_logs(incident_id);

-- FK a modified_by (query: acciones de un usuario)
CREATE INDEX IF NOT EXISTS idx_audit_logs_modified_by 
  ON audit_logs(modified_by);

-- Ordenamiento por timestamp (historial cronológico)
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp 
  ON audit_logs(timestamp DESC);

-- Índice compuesto: logs por incidencia ordenados por fecha
CREATE INDEX IF NOT EXISTS idx_audit_logs_incident_timestamp 
  ON audit_logs(incident_id, timestamp DESC);

-- =============================
-- Notas de Implementación
-- =============================
-- 1. Todos los índices usan IF NOT EXISTS para idempotencia
-- 2. Índices espaciales (GIST) para location_gps y gps_coords
-- 3. Índices parciales (WHERE) para optimizar queries específicos
-- 4. Índices compuestos para queries con múltiples filtros
-- 5. Índices DESC en timestamps para ordenamiento eficiente
-- =============================
-- Archivo: 03-rls.sql
-- Descripción: Row Level Security - Políticas de seguridad a nivel de fila
-- Dependencias: 01-tables.sql, 02-indexes.sql
-- Autor: Generado por Antigravity
-- Fecha: 2026-02-05
-- =============================

-- Este archivo implementa RLS para controlar acceso a datos según roles y permisos.
-- IMPORTANTE: Las políticas son simples y directas para evitar recursión.

-- =============================
-- Sección 1: Funciones Helper para RLS
-- =============================

-- Función para obtener el organization_id del usuario actual
-- SECURITY DEFINER para bypassear RLS y evitar recursión
CREATE OR REPLACE FUNCTION auth.user_organization_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
  SELECT organization_id 
  FROM public.users 
  WHERE id = auth.uid()
  LIMIT 1;
$$;

COMMENT ON FUNCTION auth.user_organization_id() IS 'Retorna organization_id del usuario autenticado';

-- Función para verificar si el usuario tiene una capacidad específica
-- SECURITY DEFINER para bypassear RLS
CREATE OR REPLACE FUNCTION auth.user_has_capability(capability_name TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users u
    JOIN public.roles r ON u.role_id = r.id
    WHERE u.id = auth.uid()
      AND r.capabilities @> to_jsonb(capability_name)
  );
$$;

COMMENT ON FUNCTION auth.user_has_capability(TEXT) IS 'Verifica si usuario tiene una capacidad específica';

-- Función para verificar si el usuario pertenece a un proyecto
-- SECURITY DEFINER para bypassear RLS
CREATE OR REPLACE FUNCTION auth.user_in_project(project_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.project_members pm
    WHERE pm.project_id = project_uuid
      AND pm.user_id = auth.uid()
  );
$$;

COMMENT ON FUNCTION auth.user_in_project(UUID) IS 'Verifica si usuario está asignado a un proyecto';

-- =============================
-- Sección 2: RLS en Organizations
-- =============================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Los usuarios solo ven su propia organización
CREATE POLICY "Users can view their own organization"
  ON organizations FOR SELECT
  USING (id = auth.user_organization_id());

-- Solo usuarios con permiso org.edit pueden actualizar
CREATE POLICY "Users with org.edit can update organization"
  ON organizations FOR UPDATE
  USING (
    id = auth.user_organization_id() 
    AND auth.user_has_capability('org.edit')
  );

-- =============================
-- Sección 3: RLS en Roles
-- =============================

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Los usuarios ven roles de su organización
CREATE POLICY "Users can view roles in their organization"
  ON roles FOR SELECT
  USING (organization_id = auth.user_organization_id());

-- Solo usuarios con org.manage_roles pueden crear/modificar roles
CREATE POLICY "Users with org.manage_roles can insert roles"
  ON roles FOR INSERT
  WITH CHECK (
    organization_id = auth.user_organization_id()
    AND auth.user_has_capability('org.manage_roles')
  );

CREATE POLICY "Users with org.manage_roles can update roles"
  ON roles FOR UPDATE
  USING (
    organization_id = auth.user_organization_id()
    AND auth.user_has_capability('org.manage_roles')
  );

-- No se pueden eliminar roles del sistema
CREATE POLICY "Users with org.manage_roles can delete custom roles"
  ON roles FOR DELETE
  USING (
    organization_id = auth.user_organization_id()
    AND auth.user_has_capability('org.manage_roles')
    AND is_system_role = false
  );

-- =============================
-- Sección 4: RLS en Users
-- =============================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Los usuarios ven usuarios de su organización
CREATE POLICY "Users can view users in their organization"
  ON users FOR SELECT
  USING (organization_id = auth.user_organization_id());

-- Solo usuarios con org.manage_staff pueden gestionar usuarios
CREATE POLICY "Users with org.manage_staff can insert users"
  ON users FOR INSERT
  WITH CHECK (
    organization_id = auth.user_organization_id()
    AND auth.user_has_capability('org.manage_staff')
  );

CREATE POLICY "Users with org.manage_staff can update users"
  ON users FOR UPDATE
  USING (
    organization_id = auth.user_organization_id()
    AND auth.user_has_capability('org.manage_staff')
  );

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());

-- =============================
-- Sección 5: RLS en Projects
-- =============================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Los usuarios ven proyectos de su organización
CREATE POLICY "Users can view projects in their organization"
  ON projects FOR SELECT
  USING (organization_id = auth.user_organization_id());

-- Solo usuarios con project.create pueden crear proyectos
CREATE POLICY "Users with project.create can insert projects"
  ON projects FOR INSERT
  WITH CHECK (
    organization_id = auth.user_organization_id()
    AND auth.user_has_capability('project.create')
  );

-- Usuarios con permisos pueden actualizar proyectos
CREATE POLICY "Users with permissions can update projects"
  ON projects FOR UPDATE
  USING (
    organization_id = auth.user_organization_id()
    AND (
      auth.user_has_capability('project.create')
      OR auth.user_has_capability('project.manage_crew')
    )
  );

-- Solo usuarios con project.delete pueden eliminar
CREATE POLICY "Users with project.delete can delete projects"
  ON projects FOR DELETE
  USING (
    organization_id = auth.user_organization_id()
    AND auth.user_has_capability('project.delete')
  );

-- =============================
-- Sección 6: RLS en Project Members
-- =============================

ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- Los usuarios ven miembros de proyectos de su organización
CREATE POLICY "Users can view project members in their organization"
  ON project_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_members.project_id
        AND p.organization_id = auth.user_organization_id()
    )
  );

-- Solo usuarios con project.manage_crew pueden gestionar miembros
CREATE POLICY "Users with project.manage_crew can manage members"
  ON project_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_members.project_id
        AND p.organization_id = auth.user_organization_id()
    )
    AND auth.user_has_capability('project.manage_crew')
  );

-- =============================
-- Sección 7: RLS en Incidents
-- =============================

ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Los usuarios ven incidencias de proyectos de su organización
-- O incidencias que ellos crearon o les fueron asignadas
CREATE POLICY "Users can view incidents in their projects"
  ON incidents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = incidents.project_id
        AND p.organization_id = auth.user_organization_id()
    )
    OR created_by = auth.uid()
    OR assigned_to = auth.uid()
  );

-- Usuarios con incident.create pueden crear incidencias
CREATE POLICY "Users with incident.create can insert incidents"
  ON incidents FOR INSERT
  WITH CHECK (
    auth.user_has_capability('incident.create')
    AND auth.user_in_project(project_id)
  );

-- Usuarios pueden actualizar incidencias según sus permisos
CREATE POLICY "Users can update incidents based on permissions"
  ON incidents FOR UPDATE
  USING (
    (
      -- Creador puede editar campos básicos
      created_by = auth.uid()
      AND auth.user_has_capability('incident.edit_basic')
    )
    OR (
      -- Usuario con incident.assign puede asignar
      auth.user_has_capability('incident.assign')
      AND auth.user_in_project(project_id)
    )
    OR (
      -- Usuario con incident.set_priority puede cambiar prioridad
      auth.user_has_capability('incident.set_priority')
      AND auth.user_in_project(project_id)
    )
    OR (
      -- Usuario con financial.edit_costs puede editar costos
      auth.user_has_capability('financial.edit_costs')
      AND auth.user_in_project(project_id)
    )
  );

-- =============================
-- Sección 8: RLS en Incident Photos
-- =============================

ALTER TABLE incident_photos ENABLE ROW LEVEL SECURITY;

-- Los usuarios ven fotos de incidencias que pueden ver
CREATE POLICY "Users can view photos of visible incidents"
  ON incident_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM incidents i
      JOIN projects p ON i.project_id = p.id
      WHERE i.id = incident_photos.incident_id
        AND p.organization_id = auth.user_organization_id()
    )
  );

-- Usuarios pueden subir fotos a incidencias de sus proyectos
CREATE POLICY "Users can insert photos to their project incidents"
  ON incident_photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM incidents i
      WHERE i.id = incident_photos.incident_id
        AND auth.user_in_project(i.project_id)
    )
  );

-- =============================
-- Sección 9: RLS en Audit Logs
-- =============================

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Los usuarios ven logs de incidencias que pueden ver
CREATE POLICY "Users can view audit logs of visible incidents"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM incidents i
      JOIN projects p ON i.project_id = p.id
      WHERE i.id = audit_logs.incident_id
        AND p.organization_id = auth.user_organization_id()
    )
  );

-- Solo el sistema puede insertar logs (via triggers)
-- No hay política de INSERT - se hace via SECURITY DEFINER functions

-- =============================
-- Notas de Seguridad
-- =============================
-- 1. Todas las funciones helper usan SECURITY DEFINER con search_path fijo
-- 2. Las políticas NO consultan la misma tabla que protegen (evita recursión)
-- 3. Se usan funciones helper para lógica compleja
-- 4. Políticas simples y directas para mejor performance
-- 5. Índices ya creados en 02-indexes.sql soportan estas políticas
-- =============================
-- Archivo: 04-triggers.sql
-- Descripción: Triggers y funciones trigger para automatización
-- Dependencias: 01-tables.sql, 05-functions.sql
-- Autor: Generado por Antigravity
-- Fecha: 2026-02-05
-- =============================

-- Este archivo implementa triggers para automatizar acciones en respuesta a eventos.
-- IMPORTANTE: Triggers diseñados para evitar loops infinitos y recursión.

-- =============================
-- Sección 1: Trigger Functions para Updated_at
-- =============================

-- Función trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION trigger_set_updated_at() IS 'Actualiza automáticamente el campo updated_at';

-- Aplicar trigger a todas las tablas con updated_at
DROP TRIGGER IF EXISTS set_updated_at ON organizations;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON roles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON users;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON projects;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON incidents;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON incidents
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- =============================
-- Sección 2: Trigger para Generar Public Token
-- =============================

-- Función trigger para generar public_token al crear incidencia
CREATE OR REPLACE FUNCTION trigger_generate_public_token()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Solo generar si no se proporcionó uno
  IF NEW.public_token IS NULL THEN
    NEW.public_token = generate_public_token();
  END IF;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION trigger_generate_public_token() IS 'Genera public_token automáticamente al crear incidencia';

DROP TRIGGER IF EXISTS generate_public_token ON incidents;
CREATE TRIGGER generate_public_token
  BEFORE INSERT ON incidents
  FOR EACH ROW
  EXECUTE FUNCTION trigger_generate_public_token();

-- =============================
-- Sección 3: Trigger para Invalidar Token al Cerrar
-- =============================

-- Función trigger para invalidar public_token al cerrar incidencia
CREATE OR REPLACE FUNCTION trigger_invalidate_token_on_close()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Si el estado cambió a CLOSED, invalidar token
  IF NEW.status = 'CLOSED' AND OLD.status != 'CLOSED' THEN
    NEW.public_token = NULL;
  END IF;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION trigger_invalidate_token_on_close() IS 'Invalida public_token cuando incidencia se cierra';

DROP TRIGGER IF EXISTS invalidate_token_on_close ON incidents;
CREATE TRIGGER invalidate_token_on_close
  BEFORE UPDATE ON incidents
  FOR EACH ROW
  WHEN (NEW.status = 'CLOSED')
  EXECUTE FUNCTION trigger_invalidate_token_on_close();

-- =============================
-- Sección 4: Trigger para Cambio Automático a IN_REVIEW
-- =============================

-- Función trigger para cambiar estado a IN_REVIEW cuando se sube foto de resolución
CREATE OR REPLACE FUNCTION trigger_auto_in_review()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Si se agregó resolution_photo_url y el estado es OPEN, cambiar a IN_REVIEW
  IF NEW.resolution_photo_url IS NOT NULL 
     AND OLD.resolution_photo_url IS NULL 
     AND NEW.status = 'OPEN' THEN
    NEW.status = 'IN_REVIEW';
    NEW.resolution_timestamp = NOW();
  END IF;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION trigger_auto_in_review() IS 'Cambia estado a IN_REVIEW cuando subcontratista sube foto';

DROP TRIGGER IF EXISTS auto_in_review ON incidents;
CREATE TRIGGER auto_in_review
  BEFORE UPDATE ON incidents
  FOR EACH ROW
  EXECUTE FUNCTION trigger_auto_in_review();

-- =============================
-- Sección 5: Trigger para Auditoría de Cambios de Estado
-- =============================

-- Función trigger para auditar cambios de estado
CREATE OR REPLACE FUNCTION trigger_audit_status_change()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Solo auditar si el estado cambió
  IF NEW.status != OLD.status THEN
    INSERT INTO audit_logs (
      incident_id,
      action,
      old_value,
      new_value,
      modified_by,
      comment
    ) VALUES (
      NEW.id,
      'status_change',
      to_jsonb(OLD.status),
      to_jsonb(NEW.status),
      auth.uid(),
      NEW.rejection_reason -- Incluir razón de rechazo si aplica
    );
  END IF;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION trigger_audit_status_change() IS 'Registra cambios de estado en audit_logs';

DROP TRIGGER IF EXISTS audit_status_change ON incidents;
CREATE TRIGGER audit_status_change
  AFTER UPDATE ON incidents
  FOR EACH ROW
  WHEN (NEW.status IS DISTINCT FROM OLD.status)
  EXECUTE FUNCTION trigger_audit_status_change();

-- =============================
-- Sección 6: Trigger para Auditoría de Asignaciones
-- =============================

-- Función trigger para auditar cambios de asignación
CREATE OR REPLACE FUNCTION trigger_audit_assignment()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Solo auditar si la asignación cambió
  IF NEW.assigned_to IS DISTINCT FROM OLD.assigned_to THEN
    INSERT INTO audit_logs (
      incident_id,
      action,
      old_value,
      new_value,
      modified_by
    ) VALUES (
      NEW.id,
      'assignment',
      to_jsonb(OLD.assigned_to),
      to_jsonb(NEW.assigned_to),
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION trigger_audit_assignment() IS 'Registra cambios de asignación en audit_logs';

DROP TRIGGER IF EXISTS audit_assignment ON incidents;
CREATE TRIGGER audit_assignment
  AFTER UPDATE ON incidents
  FOR EACH ROW
  WHEN (NEW.assigned_to IS DISTINCT FROM OLD.assigned_to)
  EXECUTE FUNCTION trigger_audit_assignment();

-- =============================
-- Sección 7: Trigger para Auditoría de Cambios de Costo
-- =============================

-- Función trigger para auditar cambios financieros
CREATE OR REPLACE FUNCTION trigger_audit_cost_change()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Auditar cambios en estimated_cost
  IF NEW.estimated_cost IS DISTINCT FROM OLD.estimated_cost THEN
    INSERT INTO audit_logs (
      incident_id,
      action,
      old_value,
      new_value,
      modified_by
    ) VALUES (
      NEW.id,
      'estimated_cost_change',
      to_jsonb(OLD.estimated_cost),
      to_jsonb(NEW.estimated_cost),
      auth.uid()
    );
  END IF;
  
  -- Auditar cambios en actual_cost
  IF NEW.actual_cost IS DISTINCT FROM OLD.actual_cost THEN
    INSERT INTO audit_logs (
      incident_id,
      action,
      old_value,
      new_value,
      modified_by
    ) VALUES (
      NEW.id,
      'actual_cost_change',
      to_jsonb(OLD.actual_cost),
      to_jsonb(NEW.actual_cost),
      auth.uid()
    );
  END IF;
  
  -- Auditar cambios en is_billable
  IF NEW.is_billable IS DISTINCT FROM OLD.is_billable THEN
    INSERT INTO audit_logs (
      incident_id,
      action,
      old_value,
      new_value,
      modified_by
    ) VALUES (
      NEW.id,
      'billable_change',
      to_jsonb(OLD.is_billable),
      to_jsonb(NEW.is_billable),
      auth.uid()
    );
  END IF;
  
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION trigger_audit_cost_change() IS 'Registra cambios financieros en audit_logs';

DROP TRIGGER IF EXISTS audit_cost_change ON incidents;
CREATE TRIGGER audit_cost_change
  AFTER UPDATE ON incidents
  FOR EACH ROW
  WHEN (
    NEW.estimated_cost IS DISTINCT FROM OLD.estimated_cost
    OR NEW.actual_cost IS DISTINCT FROM OLD.actual_cost
    OR NEW.is_billable IS DISTINCT FROM OLD.is_billable
  )
  EXECUTE FUNCTION trigger_audit_cost_change();

-- =============================
-- Notas de Implementación
-- =============================
-- 1. Todos los triggers usan DROP IF EXISTS para idempotencia
-- 2. Funciones trigger usan SECURITY DEFINER con search_path fijo
-- 3. BEFORE triggers modifican NEW directamente (no hacen UPDATE)
-- 4. AFTER triggers solo insertan en audit_logs (no modifican la tabla origen)
-- 5. Se usa WHEN clause para optimizar ejecución de triggers
-- 6. No hay ciclos de triggers entre tablas
-- 7. Triggers de auditoría usan auth.uid() para rastrear usuario
-- =============================
-- Archivo: 05-functions.sql
-- Descripción: Funciones de negocio y procedimientos almacenados
-- Dependencias: 01-tables.sql, 02-indexes.sql, 03-rls.sql
-- Autor: Generado por Antigravity
-- Fecha: 2026-02-05
-- =============================

-- Este archivo define la lógica de negocio reutilizable del sistema.
-- Todas las funciones usan CREATE OR REPLACE para idempotencia.

-- =============================
-- Sección 1: Funciones de Generación de Tokens
-- =============================

-- Genera un token único para enlaces públicos
CREATE OR REPLACE FUNCTION generate_public_token()
RETURNS TEXT
LANGUAGE SQL
VOLATILE
AS $$
  SELECT encode(gen_random_bytes(32), 'base64');
$$;

COMMENT ON FUNCTION generate_public_token() IS 'Genera token seguro para enlaces públicos';

-- =============================
-- Sección 2: Funciones de Folio Secuencial
-- =============================

-- Obtiene el siguiente número de folio para un proyecto
CREATE OR REPLACE FUNCTION get_next_folio_number(project_uuid UUID)
RETURNS INTEGER
LANGUAGE SQL
VOLATILE
AS $$
  SELECT COALESCE(MAX(folio_number), 0) + 1
  FROM incidents
  WHERE project_id = project_uuid;
$$;

COMMENT ON FUNCTION get_next_folio_number(UUID) IS 'Obtiene el siguiente número de folio secuencial para un proyecto';

-- =============================
-- Sección 3: Funciones Financieras
-- =============================

-- Calcula el dinero en riesgo de un proyecto (incidencias abiertas)
CREATE OR REPLACE FUNCTION calculate_money_at_risk(project_uuid UUID)
RETURNS DECIMAL(12, 2)
LANGUAGE SQL
STABLE
AS $$
  SELECT COALESCE(SUM(estimated_cost), 0)
  FROM incidents
  WHERE project_id = project_uuid
    AND status IN ('OPEN', 'IN_REVIEW');
$$;

COMMENT ON FUNCTION calculate_money_at_risk(UUID) IS 'Calcula el dinero en riesgo (incidencias abiertas) de un proyecto';

-- Calcula el dinero recuperado de un proyecto (incidencias cerradas cobrables)
CREATE OR REPLACE FUNCTION calculate_money_recovered(project_uuid UUID)
RETURNS DECIMAL(12, 2)
LANGUAGE SQL
STABLE
AS $$
  SELECT COALESCE(SUM(actual_cost), 0)
  FROM incidents
  WHERE project_id = project_uuid
    AND status = 'CLOSED'
    AND is_billable = true;
$$;

COMMENT ON FUNCTION calculate_money_recovered(UUID) IS 'Calcula el dinero recuperado (cobrables cerradas) de un proyecto';

-- Calcula el presupuesto disponible de un proyecto
CREATE OR REPLACE FUNCTION calculate_available_budget(project_uuid UUID)
RETURNS DECIMAL(12, 2)
LANGUAGE SQL
STABLE
AS $$
  SELECT 
    p.contingency_budget - COALESCE(SUM(
      CASE 
        WHEN i.status = 'CLOSED' AND i.is_billable = false 
        THEN i.actual_cost 
        ELSE 0 
      END
    ), 0)
  FROM projects p
  LEFT JOIN incidents i ON i.project_id = p.id
  WHERE p.id = project_uuid
  GROUP BY p.id, p.contingency_budget;
$$;

COMMENT ON FUNCTION calculate_available_budget(UUID) IS 'Calcula el presupuesto disponible (contingencia - gastos internos)';

-- =============================
-- Sección 4: Funciones de Validación de Geofencing
-- =============================

-- Verifica si una coordenada está dentro del geofence de un proyecto
CREATE OR REPLACE FUNCTION is_within_geofence(
  project_uuid UUID,
  incident_coords GEOGRAPHY
)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM projects
    WHERE id = project_uuid
      AND location_gps IS NOT NULL
      AND incident_coords IS NOT NULL
      AND ST_DWithin(
        location_gps,
        incident_coords,
        COALESCE(geofence_radius_meters, 500)
      )
  );
$$;

COMMENT ON FUNCTION is_within_geofence(UUID, GEOGRAPHY) IS 'Verifica si coordenadas están dentro del geofence del proyecto';

-- =============================
-- Sección 5: RPC Functions (Llamadas desde cliente)
-- =============================

-- RPC: Crear incidencia con folio automático
CREATE OR REPLACE FUNCTION create_incident(
  p_project_id UUID,
  p_description TEXT,
  p_priority TEXT DEFAULT 'NORMAL',
  p_location_tag TEXT DEFAULT NULL,
  p_gps_coords GEOGRAPHY DEFAULT NULL,
  p_audio_url TEXT DEFAULT NULL,
  p_estimated_cost DECIMAL(10, 2) DEFAULT 0
)
RETURNS JSON
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_folio_number INTEGER;
  v_incident_id UUID;
  v_public_token TEXT;
  v_within_geofence BOOLEAN;
BEGIN
  -- Validar parámetros
  IF p_project_id IS NULL THEN
    RAISE EXCEPTION 'project_id es requerido';
  END IF;
  
  IF p_description IS NULL OR trim(p_description) = '' THEN
    RAISE EXCEPTION 'description es requerido';
  END IF;
  
  IF p_priority NOT IN ('NORMAL', 'URGENT', 'CRITICAL') THEN
    RAISE EXCEPTION 'priority debe ser NORMAL, URGENT o CRITICAL';
  END IF;
  
  -- Obtener siguiente folio
  v_folio_number := get_next_folio_number(p_project_id);
  
  -- Generar token público
  v_public_token := generate_public_token();
  
  -- Verificar geofencing si hay coordenadas
  IF p_gps_coords IS NOT NULL THEN
    v_within_geofence := is_within_geofence(p_project_id, p_gps_coords);
  ELSE
    v_within_geofence := NULL;
  END IF;
  
  -- Crear incidencia
  INSERT INTO incidents (
    project_id,
    folio_number,
    description,
    priority,
    location_tag,
    gps_coords,
    audio_url,
    estimated_cost,
    created_by,
    public_token
  ) VALUES (
    p_project_id,
    v_folio_number,
    p_description,
    p_priority,
    p_location_tag,
    p_gps_coords,
    p_audio_url,
    p_estimated_cost,
    auth.uid(),
    v_public_token
  )
  RETURNING id INTO v_incident_id;
  
  -- Retornar resultado
  RETURN json_build_object(
    'success', true,
    'incident_id', v_incident_id,
    'folio_number', v_folio_number,
    'public_token', v_public_token,
    'within_geofence', v_within_geofence
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

COMMENT ON FUNCTION create_incident IS 'RPC: Crea una incidencia con folio automático y token público';

-- RPC: Actualizar estado de incidencia con auditoría
CREATE OR REPLACE FUNCTION update_incident_status(
  p_incident_id UUID,
  p_new_status TEXT,
  p_comment TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_old_status TEXT;
  v_project_id UUID;
BEGIN
  -- Validar parámetros
  IF p_new_status NOT IN ('OPEN', 'IN_REVIEW', 'CLOSED', 'REJECTED') THEN
    RAISE EXCEPTION 'status inválido';
  END IF;
  
  -- Obtener estado actual
  SELECT status, project_id 
  INTO v_old_status, v_project_id
  FROM incidents 
  WHERE id = p_incident_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Incidencia no encontrada';
  END IF;
  
  -- Actualizar estado
  UPDATE incidents
  SET 
    status = p_new_status,
    updated_at = NOW(),
    closed_at = CASE WHEN p_new_status = 'CLOSED' THEN NOW() ELSE closed_at END,
    closed_by = CASE WHEN p_new_status = 'CLOSED' THEN auth.uid() ELSE closed_by END,
    rejection_reason = CASE WHEN p_new_status = 'REJECTED' THEN p_comment ELSE rejection_reason END
  WHERE id = p_incident_id;
  
  -- Registrar en auditoría
  INSERT INTO audit_logs (
    incident_id,
    action,
    old_value,
    new_value,
    modified_by,
    comment
  ) VALUES (
    p_incident_id,
    'status_change',
    to_jsonb(v_old_status),
    to_jsonb(p_new_status),
    auth.uid(),
    p_comment
  );
  
  RETURN json_build_object(
    'success', true,
    'old_status', v_old_status,
    'new_status', p_new_status
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

COMMENT ON FUNCTION update_incident_status IS 'RPC: Actualiza estado de incidencia con auditoría automática';

-- RPC: Asignar incidencia a usuario
CREATE OR REPLACE FUNCTION assign_incident(
  p_incident_id UUID,
  p_assigned_to UUID
)
RETURNS JSON
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_old_assigned UUID;
BEGIN
  -- Obtener asignación actual
  SELECT assigned_to INTO v_old_assigned
  FROM incidents 
  WHERE id = p_incident_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Incidencia no encontrada';
  END IF;
  
  -- Actualizar asignación
  UPDATE incidents
  SET 
    assigned_to = p_assigned_to,
    assigned_at = NOW(),
    updated_at = NOW()
  WHERE id = p_incident_id;
  
  -- Registrar en auditoría
  INSERT INTO audit_logs (
    incident_id,
    action,
    old_value,
    new_value,
    modified_by
  ) VALUES (
    p_incident_id,
    'assignment',
    to_jsonb(v_old_assigned),
    to_jsonb(p_assigned_to),
    auth.uid()
  );
  
  RETURN json_build_object(
    'success', true,
    'assigned_to', p_assigned_to
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

COMMENT ON FUNCTION assign_incident IS 'RPC: Asigna incidencia a un usuario con auditoría';

-- =============================
-- Notas de Implementación
-- =============================
-- 1. Todas las funciones usan CREATE OR REPLACE para idempotencia
-- 2. Funciones RPC usan SECURITY DEFINER con search_path fijo
-- 3. Todas las funciones RPC retornan JSON estructurado
-- 4. Todas las funciones RPC tienen manejo de errores con EXCEPTION
-- 5. Validación de parámetros al inicio de cada función
-- 6. Funciones de cálculo marcadas como STABLE para optimización
-- =============================
-- Archivo: 09-auth-sync.sql
-- Descripción: Sincronización entre auth.users de Supabase y tabla users
-- Dependencias: 01-tables.sql, 03-rls.sql
-- Autor: Generado por Antigravity
-- Fecha: 2026-02-05
-- =============================

-- Este archivo sincroniza el sistema de autenticación de Supabase con la tabla de usuarios.
-- Mantiene consistencia entre auth.users y public.users.

-- =============================
-- Sección 1: Función Trigger para Crear Perfil de Usuario
-- =============================

-- Función que crea automáticamente un perfil cuando se registra un usuario
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_default_role_id UUID;
  v_org_id UUID;
BEGIN
  -- Obtener organization_id y role_id de los metadatos del usuario
  -- Estos deben ser establecidos durante el registro
  v_org_id := (NEW.raw_user_meta_data->>'organization_id')::UUID;
  v_default_role_id := (NEW.raw_user_meta_data->>'role_id')::UUID;
  
  -- Si no hay organización en metadata, no crear perfil aún
  -- Esto permite registro en dos pasos si es necesario
  IF v_org_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Si no hay role_id, buscar un rol por defecto de la organización
  IF v_default_role_id IS NULL THEN
    SELECT id INTO v_default_role_id
    FROM public.roles
    WHERE organization_id = v_org_id
      AND display_name = 'Usuario Básico'
    LIMIT 1;
  END IF;
  
  -- Crear perfil de usuario
  INSERT INTO public.users (
    id,
    organization_id,
    role_id,
    email,
    full_name,
    user_type,
    is_active
  ) VALUES (
    NEW.id,
    v_org_id,
    v_default_role_id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'crew'),
    true
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log error pero no fallar el registro
    RAISE WARNING 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION handle_new_user() IS 'Crea perfil de usuario automáticamente al registrarse en auth.users';

-- =============================
-- Sección 2: Trigger en auth.users
-- =============================

-- Eliminar trigger existente si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Crear trigger para sincronización
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =============================
-- Sección 3: Función para Actualizar Email
-- =============================

-- Función que sincroniza cambios de email
CREATE OR REPLACE FUNCTION handle_user_email_change()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
  -- Actualizar email en tabla users si cambió
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    UPDATE public.users
    SET email = NEW.email
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error syncing email change: %', SQLERRM;
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION handle_user_email_change() IS 'Sincroniza cambios de email de auth.users a public.users';

-- Trigger para sincronizar email
DROP TRIGGER IF EXISTS on_auth_user_email_changed ON auth.users;
CREATE TRIGGER on_auth_user_email_changed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (NEW.email IS DISTINCT FROM OLD.email)
  EXECUTE FUNCTION handle_user_email_change();

-- =============================
-- Sección 4: Función para Eliminar Usuario
-- =============================

-- Función que maneja eliminación de usuarios
CREATE OR REPLACE FUNCTION handle_user_delete()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
  -- El perfil se eliminará automáticamente por ON DELETE CASCADE
  -- Este trigger es para logging o acciones adicionales si se necesitan
  
  RETURN OLD;
END;
$$;

COMMENT ON FUNCTION handle_user_delete() IS 'Maneja eliminación de usuarios de auth.users';

-- Trigger para eliminación
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_user_delete();

-- =============================
-- Notas de Implementación
-- =============================
-- 1. Los triggers en auth.users requieren permisos especiales
-- 2. raw_user_meta_data se usa para pasar organization_id y role_id durante registro
-- 3. La sincronización es unidireccional: auth.users -> public.users
-- 4. Los cambios en public.users NO se reflejan en auth.users automáticamente
-- 5. El email es el único campo que se sincroniza bidireccionalmente
-- 6. ON DELETE CASCADE en la FK de users.id maneja la eliminación automática
-- =============================
-- Archivo: 10-seed-data.sql
-- Descripción: Datos iniciales del sistema (roles y capacidades)
-- Dependencias: 01-tables.sql
-- Autor: Generado por Antigravity
-- Fecha: 2026-02-05
-- =============================

-- Este archivo carga datos iniciales necesarios para el funcionamiento del sistema.
-- Es idempotente y puede ejecutarse múltiples veces.

-- =============================
-- Sección 1: Organización de Demostración (Opcional)
-- =============================

-- Insertar organización de demo para testing
-- En producción, esto se crearía via UI
INSERT INTO organizations (id, name, subscription_plan, staff_limit)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo Construction Co.',
  'professional',
  50
)
ON CONFLICT (id) DO NOTHING;

-- =============================
-- Sección 2: Roles del Sistema
-- =============================

-- Rol: Super Admin (Dueño de la constructora)
INSERT INTO roles (
  id,
  organization_id,
  display_name,
  capabilities,
  is_system_role
) VALUES (
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000001',
  'Super Admin',
  jsonb_build_array(
    'org.edit',
    'org.manage_staff',
    'org.manage_roles',
    'org.view_billing',
    'project.create',
    'project.delete',
    'project.manage_crew',
    'project.view_all',
    'incident.create',
    'incident.edit_basic',
    'incident.set_priority',
    'incident.assign',
    'incident.close_operational',
    'incident.close_final',
    'financial.view_costs',
    'financial.edit_costs',
    'financial.manage_chargebacks',
    'financial.view_project_budget',
    'comm.share_public_link',
    'comm.send_notifications'
  ),
  true
)
ON CONFLICT (id) DO UPDATE SET
  capabilities = EXCLUDED.capabilities;

-- Rol: Superintendente
INSERT INTO roles (
  id,
  organization_id,
  display_name,
  capabilities,
  is_system_role
) VALUES (
  '00000000-0000-0000-0000-000000000011',
  '00000000-0000-0000-0000-000000000001',
  'Superintendente',
  jsonb_build_array(
    'project.create',
    'project.manage_crew',
    'project.view_all',
    'incident.create',
    'incident.edit_basic',
    'incident.set_priority',
    'incident.assign',
    'incident.close_operational',
    'incident.close_final',
    'financial.view_costs',
    'financial.edit_costs',
    'financial.manage_chargebacks',
    'financial.view_project_budget',
    'comm.share_public_link',
    'comm.send_notifications'
  ),
  true
)
ON CONFLICT (id) DO UPDATE SET
  capabilities = EXCLUDED.capabilities;

-- Rol: Residente de Obra
INSERT INTO roles (
  id,
  organization_id,
  display_name,
  capabilities,
  is_system_role
) VALUES (
  '00000000-0000-0000-0000-000000000012',
  '00000000-0000-0000-0000-000000000001',
  'Residente de Obra',
  jsonb_build_array(
    'project.view_all',
    'incident.create',
    'incident.edit_basic',
    'incident.set_priority',
    'incident.close_operational',
    'financial.view_costs',
    'comm.share_public_link'
  ),
  true
)
ON CONFLICT (id) DO UPDATE SET
  capabilities = EXCLUDED.capabilities;

-- Rol: Administrativo
INSERT INTO roles (
  id,
  organization_id,
  display_name,
  capabilities,
  is_system_role
) VALUES (
  '00000000-0000-0000-0000-000000000013',
  '00000000-0000-0000-0000-000000000001',
  'Administrativo',
  jsonb_build_array(
    'project.view_all',
    'incident.create',
    'incident.edit_basic',
    'financial.view_costs',
    'financial.view_project_budget'
  ),
  true
)
ON CONFLICT (id) DO UPDATE SET
  capabilities = EXCLUDED.capabilities;

-- Rol: Consultor Externo (Crew - acceso limitado)
INSERT INTO roles (
  id,
  organization_id,
  display_name,
  capabilities,
  is_system_role
) VALUES (
  '00000000-0000-0000-0000-000000000014',
  '00000000-0000-0000-0000-000000000001',
  'Consultor Externo',
  jsonb_build_array(
    'incident.create',
    'incident.edit_basic'
  ),
  true
)
ON CONFLICT (id) DO UPDATE SET
  capabilities = EXCLUDED.capabilities;

-- Rol: Solo Lectura
INSERT INTO roles (
  id,
  organization_id,
  display_name,
  capabilities,
  is_system_role
) VALUES (
  '00000000-0000-0000-0000-000000000015',
  '00000000-0000-0000-0000-000000000001',
  'Solo Lectura',
  jsonb_build_array(
    'project.view_all',
    'financial.view_costs',
    'financial.view_project_budget'
  ),
  true
)
ON CONFLICT (id) DO UPDATE SET
  capabilities = EXCLUDED.capabilities;

-- =============================
-- Notas de Implementación
-- =============================
-- 1. Los roles del sistema tienen is_system_role = true (no se pueden eliminar)
-- 2. Las capacidades están basadas en la Matriz de Permisos del documento
-- 3. ON CONFLICT DO UPDATE permite actualizar capacidades si cambian
-- 4. Los IDs de roles son UUIDs fijos para referencia consistente
-- 5. En producción, cada organización tendrá sus propios roles
-- 6. La organización de demo es solo para testing inicial
-- =============================
-- Archivo: 13-storage.sql
-- Descripción: Configuración de Storage buckets y políticas RLS
-- Dependencias: 01-tables.sql, 03-rls.sql
-- Autor: Generado por Antigravity
-- Fecha: 2026-02-05
-- =============================

-- Este archivo configura los buckets de Supabase Storage para evidencias y avatares.
-- Incluye políticas RLS para controlar acceso a archivos.

-- =============================
-- Sección 1: Crear Buckets
-- =============================

-- Bucket para evidencias de incidencias (fotos y audios)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'incident-evidence',
  'incident-evidence',
  false, -- Privado, requiere autenticación
  10485760, -- 10 MB límite
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/wav', 'audio/webm']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket para fotos de resolución (subidas por enlaces públicos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resolution-photos',
  'resolution-photos',
  false, -- Privado pero accesible via token
  10485760, -- 10 MB límite
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket para avatares de usuarios
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true, -- Público
  2097152, -- 2 MB límite
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket para fotos de portada de proyectos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-covers',
  'project-covers',
  false,
  5242880, -- 5 MB límite
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- =============================
-- Sección 2: RLS en storage.objects
-- =============================

-- Habilitar RLS en storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- =============================
-- Sección 3: Políticas para incident-evidence
-- =============================

-- Los usuarios pueden ver evidencias de incidencias de su organización
CREATE POLICY "Users can view incident evidence in their organization"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'incident-evidence'
    AND (
      -- Verificar que la incidencia pertenece a un proyecto de su organización
      EXISTS (
        SELECT 1
        FROM incidents i
        JOIN projects p ON i.project_id = p.id
        WHERE p.organization_id = auth.user_organization_id()
          AND (storage.foldername(name))[1] = i.id::text
      )
    )
  );

-- Los usuarios pueden subir evidencias a incidencias de sus proyectos
CREATE POLICY "Users can upload incident evidence to their projects"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'incident-evidence'
    AND auth.uid() IS NOT NULL
    AND (
      -- Verificar que pueden acceder a la incidencia
      EXISTS (
        SELECT 1
        FROM incidents i
        WHERE i.id = ((storage.foldername(name))[1])::uuid
          AND auth.user_in_project(i.project_id)
      )
    )
  );

-- Los usuarios pueden eliminar evidencias que subieron
CREATE POLICY "Users can delete their own incident evidence"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'incident-evidence'
    AND owner = auth.uid()
  );

-- =============================
-- Sección 4: Políticas para resolution-photos
-- =============================

-- Los usuarios autenticados pueden ver fotos de resolución de su organización
CREATE POLICY "Users can view resolution photos in their organization"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'resolution-photos'
    AND (
      auth.uid() IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM incidents i
        JOIN projects p ON i.project_id = p.id
        WHERE p.organization_id = auth.user_organization_id()
          AND (storage.foldername(name))[1] = i.id::text
      )
    )
  );

-- Cualquiera puede subir fotos de resolución (enlaces públicos)
-- La validación se hace por token en la aplicación
CREATE POLICY "Anyone can upload resolution photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'resolution-photos'
    AND (storage.foldername(name))[1] IS NOT NULL
  );

-- Solo el owner puede eliminar fotos de resolución
CREATE POLICY "Owner can delete resolution photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'resolution-photos'
    AND (owner = auth.uid() OR auth.uid() IS NULL)
  );

-- =============================
-- Sección 5: Políticas para avatars
-- =============================

-- Todos pueden ver avatares (bucket público)
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Los usuarios pueden subir su propio avatar
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Los usuarios pueden actualizar su propio avatar
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND owner = auth.uid()
  );

-- Los usuarios pueden eliminar su propio avatar
CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND owner = auth.uid()
  );

-- =============================
-- Sección 6: Políticas para project-covers
-- =============================

-- Los usuarios pueden ver portadas de proyectos de su organización
CREATE POLICY "Users can view project covers in their organization"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'project-covers'
    AND EXISTS (
      SELECT 1
      FROM projects p
      WHERE p.organization_id = auth.user_organization_id()
        AND (storage.foldername(name))[1] = p.id::text
    )
  );

-- Los usuarios con permisos pueden subir portadas de proyectos
CREATE POLICY "Users with permissions can upload project covers"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'project-covers'
    AND auth.user_has_capability('project.create')
  );

-- Los usuarios con permisos pueden actualizar portadas
CREATE POLICY "Users with permissions can update project covers"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'project-covers'
    AND auth.user_has_capability('project.create')
  );

-- Los usuarios con permisos pueden eliminar portadas
CREATE POLICY "Users with permissions can delete project covers"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'project-covers'
    AND auth.user_has_capability('project.create')
  );

-- =============================
-- Notas de Implementación
-- =============================
-- 1. Los buckets usan estructura de carpetas: bucket/entity_id/filename
-- 2. incident-evidence: incident-evidence/{incident_id}/{filename}
-- 3. resolution-photos: resolution-photos/{incident_id}/{filename}
-- 4. avatars: avatars/{user_id}/{filename}
-- 5. project-covers: project-covers/{project_id}/{filename}
-- 6. storage.foldername(name) extrae la estructura de carpetas
-- 7. Las políticas usan funciones helper de 03-rls.sql
-- 8. resolution-photos permite uploads sin autenticación para enlaces públicos
-- Migration 14: WhatsApp Bot Integration
-- Description: Adds tables, columns, triggers and RLS policies for WhatsApp Bot (Strop AI)
-- Created: 2026-02-15

-- =====================================================
-- 1. NEW TABLES
-- =====================================================

-- Table: whatsapp_interactions
-- Purpose: Log all interactions with the WhatsApp bot for auditing and cost tracking
CREATE TABLE whatsapp_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('command', 'query', 'approval', 'photo_upload', 'voice_note', 'report_request')),
  message_content TEXT,
  incident_id UUID REFERENCES incidents(id) ON DELETE SET NULL,
  ai_provider TEXT, -- 'openai', 'anthropic', 'google', 'groq', 'cerebras', 'openrouter'
  ai_model TEXT,
  ai_response TEXT,
  tokens_used INTEGER,
  cost_usd DECIMAL(10, 6),
  latency_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE whatsapp_interactions IS 'Logs all WhatsApp bot interactions for auditing and analytics';
COMMENT ON COLUMN whatsapp_interactions.message_type IS 'Type of message: command, query, approval, photo_upload, voice_note, report_request';
COMMENT ON COLUMN whatsapp_interactions.ai_provider IS 'AI provider used: openai, anthropic, google, groq, cerebras, openrouter';
COMMENT ON COLUMN whatsapp_interactions.cost_usd IS 'Cost in USD for this AI request';

-- Indexes for whatsapp_interactions
CREATE INDEX idx_whatsapp_interactions_user_date ON whatsapp_interactions(user_id, created_at DESC);
CREATE INDEX idx_whatsapp_interactions_provider_date ON whatsapp_interactions(ai_provider, created_at DESC);
CREATE INDEX idx_whatsapp_interactions_type_date ON whatsapp_interactions(message_type, created_at DESC);
CREATE INDEX idx_whatsapp_interactions_incident ON whatsapp_interactions(incident_id) WHERE incident_id IS NOT NULL;

-- =====================================================

-- Table: whatsapp_preferences
-- Purpose: Store user preferences for WhatsApp bot notifications and settings
CREATE TABLE whatsapp_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  daily_briefing_enabled BOOLEAN DEFAULT true,
  briefing_time TIME DEFAULT '08:00:00',
  critical_alerts_enabled BOOLEAN DEFAULT true,
  approval_notifications_enabled BOOLEAN DEFAULT true,
  predictive_alerts_enabled BOOLEAN DEFAULT true,
  language TEXT DEFAULT 'es',
  timezone TEXT DEFAULT 'America/Mexico_City',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE whatsapp_preferences IS 'User preferences for WhatsApp bot notifications and behavior';
COMMENT ON COLUMN whatsapp_preferences.briefing_time IS 'Time of day to send daily briefing (in user timezone)';
COMMENT ON COLUMN whatsapp_preferences.timezone IS 'IANA timezone identifier for the user';

-- Trigger to update timestamp on preferences change
CREATE TRIGGER update_whatsapp_preferences_timestamp
BEFORE UPDATE ON whatsapp_preferences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================

-- Table: ai_usage_logs
-- Purpose: Detailed tracking of AI usage for cost optimization and analytics
CREATE TABLE ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  task_type TEXT NOT NULL, -- 'image_analysis', 'chat', 'transcription', 'ocr', 'prediction', 'report_generation', 'classification'
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  tokens_used INTEGER,
  cost_usd DECIMAL(10, 6),
  latency_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  metadata JSONB, -- Additional task-specific data
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE ai_usage_logs IS 'Detailed logs of AI usage for cost tracking and optimization';
COMMENT ON COLUMN ai_usage_logs.task_type IS 'Type of AI task: image_analysis, chat, transcription, ocr, prediction, report_generation, classification';
COMMENT ON COLUMN ai_usage_logs.metadata IS 'Additional task-specific data in JSON format';

-- Indexes for ai_usage_logs
CREATE INDEX idx_ai_usage_user_date ON ai_usage_logs(user_id, created_at DESC);
CREATE INDEX idx_ai_usage_provider_date ON ai_usage_logs(provider, created_at DESC);
CREATE INDEX idx_ai_usage_task_date ON ai_usage_logs(task_type, created_at DESC);
CREATE INDEX idx_ai_usage_cost ON ai_usage_logs(cost_usd DESC) WHERE cost_usd IS NOT NULL;

-- =====================================================
-- 2. MODIFY EXISTING TABLES
-- =====================================================

-- Add WhatsApp phone to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS whatsapp_phone TEXT UNIQUE;

COMMENT ON COLUMN users.whatsapp_phone IS 'WhatsApp phone number in E.164 format (e.g., +5215512345678)';

-- Index for fast lookup by WhatsApp phone
CREATE INDEX IF NOT EXISTS idx_users_whatsapp_phone ON users(whatsapp_phone) WHERE whatsapp_phone IS NOT NULL;

-- =====================================================

-- Add WhatsApp approval tracking to incidents table
ALTER TABLE incidents
ADD COLUMN IF NOT EXISTS approved_via_whatsapp BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS whatsapp_approval_timestamp TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS ai_audit_result JSONB;

COMMENT ON COLUMN incidents.approved_via_whatsapp IS 'True if incident was approved via WhatsApp bot instead of mobile app';
COMMENT ON COLUMN incidents.whatsapp_approval_timestamp IS 'Timestamp when incident was approved via WhatsApp';
COMMENT ON COLUMN incidents.ai_audit_result IS 'Result of AI visual audit (Auditor Eye) in JSON format';

-- Index for WhatsApp approval analytics
CREATE INDEX IF NOT EXISTS idx_incidents_whatsapp_approval ON incidents(approved_via_whatsapp, whatsapp_approval_timestamp) 
WHERE approved_via_whatsapp = true;

-- Index for AI audit results
CREATE INDEX IF NOT EXISTS idx_incidents_ai_audit ON incidents USING GIN (ai_audit_result) 
WHERE ai_audit_result IS NOT NULL;

-- =====================================================
-- 3. TRIGGERS
-- =====================================================

-- Trigger: Automatically set whatsapp_approval_timestamp when approved via WhatsApp
CREATE OR REPLACE FUNCTION record_whatsapp_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.approved_via_whatsapp = true AND (OLD.approved_via_whatsapp = false OR OLD.approved_via_whatsapp IS NULL) THEN
    NEW.whatsapp_approval_timestamp := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_record_whatsapp_approval
BEFORE UPDATE ON incidents
FOR EACH ROW
EXECUTE FUNCTION record_whatsapp_approval();

COMMENT ON FUNCTION record_whatsapp_approval() IS 'Automatically sets whatsapp_approval_timestamp when incident is approved via WhatsApp';

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE whatsapp_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own WhatsApp interactions
CREATE POLICY "Users can view own WhatsApp interactions"
ON whatsapp_interactions
FOR SELECT
USING (
  auth.uid() = user_id
  OR
  EXISTS (
    SELECT 1 FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.id = auth.uid()
    AND r.display_name = 'Super Admin'
  )
);

-- Policy: System can insert WhatsApp interactions (via service role)
CREATE POLICY "System can insert WhatsApp interactions"
ON whatsapp_interactions
FOR INSERT
WITH CHECK (true); -- Service role will handle this

COMMENT ON POLICY "Users can view own WhatsApp interactions" ON whatsapp_interactions IS 'Users can only see their own interactions, admins can see all';

-- =====================================================

-- Policy: Users can manage their own WhatsApp preferences
CREATE POLICY "Users can manage own WhatsApp preferences"
ON whatsapp_preferences
FOR ALL
USING (auth.uid() = user_id);

-- Policy: Auto-insert default preferences for new users
CREATE POLICY "System can insert default WhatsApp preferences"
ON whatsapp_preferences
FOR INSERT
WITH CHECK (true); -- Service role will handle this

COMMENT ON POLICY "Users can manage own WhatsApp preferences" ON whatsapp_preferences IS 'Users can view and update their own WhatsApp preferences';

-- =====================================================

-- Policy: Only admins can view AI usage logs (for cost tracking)
CREATE POLICY "Admins can view AI usage logs"
ON ai_usage_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.id = auth.uid()
    AND r.display_name = 'Super Admin'
  )
);

-- Policy: System can insert AI usage logs (via service role)
CREATE POLICY "System can insert AI usage logs"
ON ai_usage_logs
FOR INSERT
WITH CHECK (true); -- Service role will handle this

COMMENT ON POLICY "Admins can view AI usage logs" ON ai_usage_logs IS 'Only admins can view AI usage logs for cost tracking and optimization';

-- =====================================================
-- 5. HELPER FUNCTIONS FOR ANALYTICS
-- =====================================================

-- Function: Get AI cost summary by user for a date range
CREATE OR REPLACE FUNCTION get_ai_cost_by_user(
  start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
  user_id UUID,
  user_name TEXT,
  user_email TEXT,
  total_requests BIGINT,
  total_tokens BIGINT,
  total_cost_usd NUMERIC,
  avg_latency_ms NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(*)::BIGINT as total_requests,
    COALESCE(SUM(ail.tokens_used), 0)::BIGINT as total_tokens,
    COALESCE(SUM(ail.cost_usd), 0) as total_cost_usd,
    COALESCE(AVG(ail.latency_ms), 0) as avg_latency_ms
  FROM ai_usage_logs ail
  JOIN users u ON u.id = ail.user_id
  WHERE ail.created_at >= start_date
    AND ail.created_at <= end_date
  GROUP BY u.id, u.name, u.email
  ORDER BY total_cost_usd DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_ai_cost_by_user IS 'Returns AI usage and cost summary by user for a given date range';

-- =====================================================

-- Function: Get WhatsApp approval rate
CREATE OR REPLACE FUNCTION get_whatsapp_approval_rate(
  project_id_param UUID DEFAULT NULL,
  start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
  whatsapp_approvals BIGINT,
  app_approvals BIGINT,
  total_approvals BIGINT,
  whatsapp_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(CASE WHEN i.approved_via_whatsapp = true THEN 1 END)::BIGINT as whatsapp_approvals,
    COUNT(CASE WHEN i.approved_via_whatsapp = false OR i.approved_via_whatsapp IS NULL THEN 1 END)::BIGINT as app_approvals,
    COUNT(*)::BIGINT as total_approvals,
    ROUND(
      100.0 * COUNT(CASE WHEN i.approved_via_whatsapp = true THEN 1 END) / NULLIF(COUNT(*), 0),
      2
    ) as whatsapp_percentage
  FROM incidents i
  WHERE i.status = 'CLOSED'
    AND i.updated_at >= start_date
    AND i.updated_at <= end_date
    AND (project_id_param IS NULL OR i.project_id = project_id_param);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_whatsapp_approval_rate IS 'Returns the percentage of incidents approved via WhatsApp vs mobile app';

-- =====================================================

-- Function: Get AI provider usage statistics
CREATE OR REPLACE FUNCTION get_ai_provider_stats(
  start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '7 days',
  end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
  task_type TEXT,
  provider TEXT,
  model TEXT,
  requests BIGINT,
  avg_latency_ms NUMERIC,
  total_cost_usd NUMERIC,
  success_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ail.task_type,
    ail.provider,
    ail.model,
    COUNT(*)::BIGINT as requests,
    COALESCE(AVG(ail.latency_ms), 0) as avg_latency_ms,
    COALESCE(SUM(ail.cost_usd), 0) as total_cost_usd,
    ROUND(100.0 * COUNT(CASE WHEN ail.success = true THEN 1 END) / NULLIF(COUNT(*), 0), 2) as success_rate
  FROM ai_usage_logs ail
  WHERE ail.created_at >= start_date
    AND ail.created_at <= end_date
  GROUP BY ail.task_type, ail.provider, ail.model
  ORDER BY ail.task_type, requests DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_ai_provider_stats IS 'Returns usage statistics by AI provider and task type';

-- =====================================================
-- 6. INITIAL DATA
-- =====================================================

-- Create default WhatsApp preferences for existing users
INSERT INTO whatsapp_preferences (user_id)
SELECT id FROM users
ON CONFLICT (user_id) DO NOTHING;

-- =====================================================
-- 7. GRANTS (for service role and authenticated users)
-- =====================================================

-- Grant usage on tables to authenticated users
GRANT SELECT ON whatsapp_interactions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON whatsapp_preferences TO authenticated;
GRANT SELECT ON ai_usage_logs TO authenticated;

-- Grant all privileges to service role (for Edge Functions)
GRANT ALL ON whatsapp_interactions TO service_role;
GRANT ALL ON whatsapp_preferences TO service_role;
GRANT ALL ON ai_usage_logs TO service_role;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
-- =============================
-- Archivo: 27-enable-realtime.sql
-- Descripción: Configuración de Realtime para actualizaciones en tiempo real
-- Dependencias: 01-tables.sql
-- Autor: Generado por Antigravity
-- Fecha: 2026-02-05
-- =============================

-- Este archivo habilita Realtime en tablas específicas para notificaciones en tiempo real.
-- Solo se habilita en tablas donde es realmente necesario para evitar overhead.

-- =============================
-- Sección 1: Habilitar Realtime en Incidents
-- =============================

-- Habilitar realtime para incidencias
-- Permite notificaciones en tiempo real de cambios de estado, asignaciones, etc.
ALTER PUBLICATION supabase_realtime ADD TABLE incidents;

COMMENT ON TABLE incidents IS 'Incidencias con realtime habilitado para actualizaciones en vivo';

-- =============================
-- Sección 2: Habilitar Realtime en Incident Photos
-- =============================

-- Habilitar realtime para fotos de incidencias
-- Permite ver cuando se suben nuevas fotos de evidencia o resolución
ALTER PUBLICATION supabase_realtime ADD TABLE incident_photos;

-- =============================
-- Sección 3: Habilitar Realtime en Audit Logs
-- =============================

-- Habilitar realtime para logs de auditoría
-- Permite ver el historial de cambios en tiempo real
ALTER PUBLICATION supabase_realtime ADD TABLE audit_logs;

-- =============================
-- Sección 4: Habilitar Realtime en Project Members
-- =============================

-- Habilitar realtime para miembros de proyecto
-- Permite notificar cuando se agregan/remueven usuarios de proyectos
ALTER PUBLICATION supabase_realtime ADD TABLE project_members;

-- =============================
-- Notas de Implementación
-- =============================
-- 1. Realtime NO se habilita en todas las tablas para evitar overhead
-- 2. Tablas habilitadas:
--    - incidents: Cambios de estado, asignaciones, actualizaciones
--    - incident_photos: Nuevas fotos subidas
--    - audit_logs: Historial de cambios en vivo
--    - project_members: Cambios en equipo de proyecto
-- 3. RLS aplica también a realtime - usuarios solo ven cambios que pueden ver
-- 4. El cliente debe suscribirse a canales específicos para recibir updates
-- 5. Ejemplo de suscripción:
--    supabase
--      .channel('incidents')
--      .on('postgres_changes', 
--        { event: '*', schema: 'public', table: 'incidents' },
--        payload => console.log(payload)
--      )
--      .subscribe()
