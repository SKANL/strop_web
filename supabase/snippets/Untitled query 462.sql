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

-- Asegurar que la publicación existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END
$$;

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
