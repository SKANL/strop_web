-- =============================
-- Archivo: 15-saas-onboarding.sql
-- Descripción: Funciones para el onboarding de nuevas organizaciones (SaaS)
-- Dependencias: 01-tables.sql, 05-functions.sql
-- Autor: Generado por Antigravity
-- Fecha: 2026-02-16
-- =============================

-- RPC: Crear Organización y Dueño (Onboarding)
-- Esta función se llama justo después de que el usuario se registra en auth.users
-- pero antes de que tenga un registro en public.users
CREATE OR REPLACE FUNCTION create_organization_and_owner(
  p_org_name TEXT,
  p_plan TEXT DEFAULT 'free',
  p_full_name TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_user_id UUID;
  v_user_email TEXT;
  v_org_id UUID;
  v_owner_role_id UUID;
BEGIN
  -- 1. Obtener ID del usuario autenticado
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no autenticado';
  END IF;

  -- 2. Verificar si ya tiene perfil (evitar doble creación)
  IF EXISTS (SELECT 1 FROM public.users WHERE id = v_user_id) THEN
    RAISE EXCEPTION 'El usuario ya tiene una organización asignada';
  END IF;

  -- 3. Obtener email de auth.users
  SELECT email INTO v_user_email FROM auth.users WHERE id = v_user_id;

  -- 4. Crear Organización
  INSERT INTO organizations (name, subscription_plan)
  VALUES (p_org_name, p_plan)
  RETURNING id INTO v_org_id;

  -- 5. Crear Roles por Defecto para esa Organización
  -- Rol: Super Admin (Dueño)
  INSERT INTO roles (organization_id, display_name, capabilities, is_system_role)
  VALUES (
    v_org_id,
    'Super Admin',
    jsonb_build_array(
      'org.edit', 'org.manage_staff', 'org.manage_roles', 'org.view_billing',
      'project.create', 'project.delete', 'project.manage_crew', 'project.view_all',
      'incident.create', 'incident.edit_basic', 'incident.set_priority', 'incident.assign',
      'incident.close_operational', 'incident.close_final',
      'financial.view_costs', 'financial.edit_costs', 'financial.manage_chargebacks', 'financial.view_project_budget',
      'comm.share_public_link', 'comm.send_notifications'
    ),
    true
  ) RETURNING id INTO v_owner_role_id;

  -- Rol: Superintendente
  INSERT INTO roles (organization_id, display_name, capabilities, is_system_role)
  VALUES (
    v_org_id, 'Superintendente',
    jsonb_build_array(
      'project.create', 'project.manage_crew', 'project.view_all',
      'incident.create', 'incident.edit_basic', 'incident.set_priority', 'incident.assign',
      'incident.close_operational', 'incident.close_final',
      'financial.view_costs', 'financial.edit_costs', 'financial.manage_chargebacks', 'financial.view_project_budget',
      'comm.share_public_link', 'comm.send_notifications'
    ), true
  );

  -- Rol: Residente
  INSERT INTO roles (organization_id, display_name, capabilities, is_system_role)
  VALUES (
    v_org_id, 'Residente de Obra',
    jsonb_build_array(
      'project.view_all', 'incident.create', 'incident.edit_basic', 'incident.set_priority',
      'incident.close_operational', 'financial.view_costs', 'comm.share_public_link'
    ), true
  );

  -- Rol: Administrativo
  INSERT INTO roles (organization_id, display_name, capabilities, is_system_role)
  VALUES (
    v_org_id, 'Administrativo',
    jsonb_build_array(
      'project.view_all', 'incident.create', 'incident.edit_basic',
      'financial.view_costs', 'financial.view_project_budget'
    ), true
  );
  
  -- Rol: Consultor Externo (Crew)
  INSERT INTO roles (organization_id, display_name, capabilities, is_system_role)
  VALUES (
    v_org_id, 'Consultor Externo',
    jsonb_build_array('incident.create', 'incident.edit_basic'), true
  );

  -- 6. Crear Perfil de Usuario (Owner)
  INSERT INTO public.users (
    id,
    organization_id,
    role_id,
    email,
    full_name,
    avatar_url,
    user_type,
    is_active
  ) VALUES (
    v_user_id,
    v_org_id,
    v_owner_role_id,
    v_user_email,
    COALESCE(p_full_name, v_user_email),
    p_avatar_url,
    'staff',
    true
  );

  RETURN json_build_object(
    'success', true,
    'organization_id', v_org_id,
    'role_id', v_owner_role_id
  );

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error creating organization: %', SQLERRM;
END;
$$;

COMMENT ON FUNCTION create_organization_and_owner IS 'RPC: Crea Org, Roles y Usuario Owner para onboarding';
