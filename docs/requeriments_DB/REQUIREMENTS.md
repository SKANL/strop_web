# 📋 REQUERIMIENTOS DEL PROYECTO - SAAS GESTIÓN DE INCIDENCIAS

> **Objetivo:** Recopilar información detallada sobre el dominio y estructura del SaaS para implementar validaciones con Zod, arquitectura desacoplada y buenas prácticas.
> **Instrucciones:** Lee cada sección y responde las preguntas. Puedes responder todas o sección por sección. Las respuestas que no sepas, márcalas con `[ ]` para revisarlas después.

---

## 1️⃣ ESTRUCTURA DE INCIDENCIAS

> **Propósito:** Definir qué campos tiene una incidencia y sus características.

### 1.1 - Campos Básicos

- [ ] ¿Cuál es el identificador único? (uuid, id numérico, etc.)
- [ ] ¿Qué es el título? (descripción corta de la incidencia)
- [ ] ¿Qué es la descripción? (detalles ampliados)
- [ ] ¿Hay otra información básica? (fotografías, ubicación exacta, etc.)

### 1.2 - Campos de Clasificación

- [ ] **Prioridad:** ¿Cuáles son los valores posibles?
  - Ejemplos: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
  - ¿Hay descripción para cada nivel?

- [ ] **Estado:** ¿Cuáles son los estados posibles?
  - Ejemplos: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`, `ON_HOLD`
  - ¿En qué orden fluyen? (workflow)

- [ ] **Tipo/Categoría:** ¿Hay categorías de incidencias?
  - Ejemplos: `SEGURIDAD`, `CALIDAD`, `AMBIENTAL`, `OTROS`
  - ¿Son editables o predefinidas?

### 1.3 - Campos de Asignación

- [ ] ¿Quién crea la incidencia?
- [ ] ¿Se asigna a un usuario responsable?
- [ ] ¿Puede haber múltiples asignados?
- [ ] ¿Hay roles diferentes? (Supervisor, Trabajador, Reportero, etc.)

### 1.4 - Campos de Tiempo

- [ ] ¿Se registra `createdAt`?
- [ ] ¿Se registra `updatedAt`?
- [ ] ¿Hay fecha de vencimiento o deadline?
- [ ] ¿Hay fecha de resolución/cierre?

### 1.5 - Campos Adicionales

- [ ] ¿Hay adjuntos (fotos/documentos)?
- [ ] ¿Hay ubicación en el proyecto?
- [ ] ¿Hay campo de costo de remediación?
- [ ] ¿Hay severidad (diferente de prioridad)?
- [ ] ¿Hay historial de cambios/logs?
- [ ] ¿Hay comentarios/notas internas?

---

## 2️⃣ ENTIDADES DEL DOMINIO

> **Propósito:** Identificar todas las tablas/modelos que necesita la BD.

### 2.1 - Proyectos/Obras

- [ ] ¿Cada incidencia pertenece a una obra/proyecto?
- [ ] ¿Qué campos tiene un proyecto?
  - `id`, `nombre`, `ubicación`, `cliente`, `estado`, `fechaInicio`, `fechaFin`?
- [ ] ¿Hay múltiples obras simultáneamente?

### 2.2 - Usuarios

- [ ] ¿Qué roles existen?
  - Ejemplo: Admin, Supervisor, Capataz, Trabajador, Reportero
- [ ] ¿Qué información guardarás de un usuario?
  - `id`, `email`, `nombre`, `rol`, `proyecto_id`?
- [ ] ¿Un usuario puede estar en múltiples proyectos?

### 2.3 - Comentarios/Notas

- [ ] ¿Las incidencias tienen comentarios?
- [ ] ¿Qué campos? (`id`, `texto`, `autor_id`, `incidencia_id`, `createdAt`)

### 2.4 - Adjuntos/Fotos

- [ ] ¿Se pueden subir fotos a una incidencia?
- [ ] ¿Dónde se almacenan? (Supabase Storage)
- [ ] ¿Cuántas fotos máximo por incidencia?
- [ ] ¿Qué formatos permitidos? (jpg, png, pdf, etc.)

### 2.5 - Historial/Auditoría

- [ ] ¿Necesitas registrar cambios históricos?
  - Quién cambió qué, cuándo, de qué valor a qué valor
- [ ] ¿Es obligatorio o "nice to have"?

### 2.6 - Otras Entidades

- [ ] ¿Hay categorías de incidencias?
- [ ] ¿Hay equipos de trabajo?
- [ ] ¿Hay plantillas de incidencias?
- [ ] ¿Hay reportes/dashboards?

---

## 3️⃣ VALIDACIONES ESPECÍFICAS

> **Propósito:** Definir reglas de negocio y validaciones.

### 3.1 - Campos de Texto

- [ ] **Título:**
  - ¿Longitud mínima? (ej: 5 caracteres)
  - ¿Longitud máxima? (ej: 200 caracteres)
  - ¿Solo ciertos caracteres?

- [ ] **Descripción:**
  - ¿Longitud mínima? (ej: 10 caracteres)
  - ¿Longitud máxima? (ej: 5000 caracteres)
  - ¿Permite URLs, emails, caracteres especiales?

### 3.2 - Campos Requeridos vs Opcionales

- [ ] ¿Cuáles son **obligatorios**?
  - (titulo, descripción, prioridad, asignado, etc.)
- [ ] ¿Cuáles son **opcionales**?
  - (ubicación exacta, fotos, notas internas, etc.)

### 3.3 - Validaciones de Enumeraciones

- [ ] **Prioridad:** ¿Solo acepta valores específicos?
- [ ] **Estado:** ¿Solo acepta valores específicos?
- [ ] **Tipo/Categoría:** ¿Solo acepta valores específicos?

### 3.4 - Validaciones de Relaciones

- [ ] ¿Una incidencia DEBE tener un proyecto válido?
- [ ] ¿Una incidencia DEBE tener un creador válido?
- [ ] ¿Una incidencia DEBE tener un asignado (o puede ser NULL)?
- [ ] ¿Se puede asignar a usuarios que no pertenecen al proyecto?

### 3.5 - Validaciones de Negocio Complejas

- [ ] ¿Cuál es la prioridad mínima para crear una incidencia?
- [ ] ¿Se puede cerrar una incidencia sin comentarios?
- [ ] ¿Se puede cambiar estado de `CLOSED` a `OPEN`?
- [ ] ¿Hay límite de incidencias abiertas por proyecto?
- [ ] ¿Qué datos NO se pueden editar después de creados?
  - (ej: creador, fecha creación, etc.)

### 3.6 - Validaciones de Fechas

- [ ] ¿La fecha de resolución debe ser >= a fecha de creación?
- [ ] ¿La fecha de vencimiento debe ser en el futuro?
- [ ] ¿Hay rangos de fechas permitidas?

### 3.7 - Validaciones de Fotos/Adjuntos

- [ ] ¿Tamaño máximo por archivo?
- [ ] ¿Formatos permitidos?
- [ ] ¿Cantidad máxima de archivos por incidencia?
- [ ] ¿Foto obligatoria para ciertos tipos de incidencia?

---

## 4️⃣ OPERACIONES CRUD Y ACCIONES

> **Propósito:** Definir qué acciones el usuario puede hacer y cómo validarlas.

### 4.1 - Crear Incidencia

- [ ] ¿Quién puede crearla? (todos, solo supervisores, etc.)
- [ ] ¿Qué campos son requeridos?
- [ ] ¿Hay valores por defecto?
  - (ej: estado siempre = OPEN, prioridad = MEDIUM)
- [ ] ¿Se valida contra la BD en el servidor?

### 4.2 - Editar Incidencia

- [ ] ¿Quién puede editar? (creador, asignado, supervisor, etc.)
- [ ] ¿Qué campos se pueden editar?
- [ ] ¿Qué campos NO se pueden editar después de creados?
  - (ej: proyecto, creador, tipo)

### 4.3 - Cambiar Estado

- [ ] ¿Es una acción separada de "editar"?
- [ ] ¿Qué transiciones de estado son válidas?
  - (ej: OPEN → IN_PROGRESS → RESOLVED → CLOSED)
  - ¿O se puede ir de cualquiera a cualquiera?
- [ ] ¿Se requiere comentario al cambiar estado?
- [ ] ¿Hay permisos especiales para ciertos estados?

### 4.4 - Asignar Usuario

- [ ] ¿Es una acción separada de "editar"?
- [ ] ¿Quién puede asignar?
- [ ] ¿Se puede desasignar (dejar vacío)?
- [ ] ¿Se envía notificación al usuario asignado?

### 4.5 - Agregar Comentario

- [ ] ¿Qué campos tiene? (texto, autor, incidencia_id, createdAt)
- [ ] ¿Longitud mínima/máxima?
- [ ] ¿Se pueden editar/eliminar comentarios?
- [ ] ¿Quién puede comentar? (todos, solo asignados, etc.)

### 4.6 - Subir Fotos/Adjuntos

- [ ] ¿Quién puede subir?
- [ ] ¿Se validan formatos y tamaños?
- [ ] ¿Se almacenan en Supabase Storage?
- [ ] ¿Se pueden eliminar después?

### 4.7 - Eliminar Incidencia

- [ ] ¿Se permite eliminar?
- [ ] ¿Qué estados permiten eliminación?
- [ ] ¿Quién puede eliminar?
- [ ] ¿Es eliminación lógica (soft delete) o física?

### 4.8 - Otras Acciones

- [ ] ¿Hay búsqueda/filtrado?
- [ ] ¿Hay exportación a PDF/Excel?
- [ ] ¿Hay generación de reportes?
- [ ] ¿Hay duplicar incidencia?

---

## 5️⃣ AUTENTICACIÓN Y PERMISOS

> **Propósito:** Definir niveles de acceso y control de permisos.

### 5.1 - Autenticación

- [ ] ¿Usa Supabase Auth?
- [ ] ¿Email/contraseña o también OAuth (Google, GitHub)?
- [ ] ¿Hay confirmación de email?
- [ ] ¿Hay recuperación de contraseña?

### 5.2 - Roles y Permisos

- [ ] **Admin:**
  - ¿Permisos? (todo, crear usuarios, ver reportes, etc.)

- [ ] **Supervisor/Jefe de Obra:**
  - ¿Permisos?

- [ ] **Capataz/Líder de Equipo:**
  - ¿Permisos?

- [ ] **Trabajador/Empleado:**
  - ¿Permisos?

- [ ] **Reportero (sin cuenta):**
  - ¿Puede crear incidencias anónimas?

### 5.3 - Control de Acceso por Recurso

- [ ] ¿Un usuario solo ve incidencias de su proyecto?
- [ ] ¿Un supervisor ve TODAS las incidencias del proyecto?
- [ ] ¿Un trabajador solo ve las asignadas a él?
- [ ] ¿Se usa Row Level Security (RLS) en Supabase?

### 5.4 - Permisos por Acción

- [ ] ¿Quién puede crear incidencias? (lista de roles)
- [ ] ¿Quién puede editar? (creador, asignado, supervisor)
- [ ] ¿Quién puede cambiar estado?
- [ ] ¿Quién puede asignar?
- [ ] ¿Quién puede eliminar?
- [ ] ¿Quién puede ver reportes?

---

## 6️⃣ ABORDAJE TÉCNICO

> **Propósito:** Decidir cómo implementar las validaciones y acciones.

### 6.1 - Astro Actions vs API Routes

- [ ] ¿Usamos Astro Actions? (recomendado)
  - Validación type-safe, integrada
  - Ideal para formularios
  
- [ ] ¿Usamos API Routes tradicionales?
  - Más control, estándar REST
  
- [ ] ¿Ambas?
  - Actions para formularios, Routes para REST

### 6.2 - Ubicación de Validaciones

- [ ] **Cliente (React):**
  - Validación en tiempo real (UX)
  - ¿Usamos react-hook-form?

- [ ] **Servidor (Zod):**
  - Validación de seguridad (obligatorio)
  - En Astro Actions o API Routes

- [ ] ¿Duplicamos esquemas Zod en cliente y servidor?
- [ ] ¿Compartimos tipos TypeScript automáticamente?

### 6.3 - Base de Datos

- [ ] ¿Schema SQL de Supabase ya existe?
- [ ] ¿O hay que diseñarlo primero?
- [ ] ¿Hay relaciones que validar en BD?
  - (ej: usuario_id existe antes de crear incidencia)

### 6.4 - Caché de Datos

- [ ] ¿Usamos React Query para caché?
- [ ] ¿Usamos Supabase Realtime?
- [ ] ¿Cuándo refrescar datos?

---

## 7️⃣ INFORMACIÓN ADICIONAL

> **Propósito:** Detalles finales y contexto del negocio.

### 7.1 - Contexto de Construcción

- [ ] ¿Qué tipo de obras? (residencial, comercial, infraestructura)
- [ ] ¿Tamaño típico de proyectos?
- [ ] ¿Duración típica de un proyecto?
- [ ] ¿Cuántos usuarios por proyecto?

### 7.2 - Escala y Rendimiento

- [ ] ¿Cuántas incidencias por día se esperan?
- [ ] ¿Cuántos proyectos activos simultáneamente?
- [ ] ¿Cuántos usuarios totales?
- [ ] ¿Necesitas optimización o es prototipo?

### 7.3 - Integraciones

- [ ] ¿Integrar con sistemas externos?
  - (SAP, Project Management, email alerts, etc.)
- [ ] ¿Enviar emails/notificaciones?
- [ ] ¿Generar reportes automáticos?

### 7.4 - Futuro

- [ ] ¿Hay features planeadas después de MVP?
- [ ] ¿Habrá app móvil?
- [ ] ¿Habrá versión offline?
- [ ] ¿Multiidioma?

### 7.5 - Notas Adicionales

- [ ] Algo que no hayamos preguntado?
- [ ] Referencias o documentos existentes?
- [ ] Prototipo o mockups?

---

## 📝 CÓMO USAR ESTE DOCUMENTO

1. **Lee cada sección** y responde las preguntas que entiendas
2. **Marca con `[x]`** las que respondas
3. **Deja en blanco** las que no sepas (sin marcar)
4. **Añade comentarios** o ejemplos si es necesario
5. **Responde todas o por secciones** - podemos hacerlo iterativamente

---

## 🎯 PRÓXIMOS PASOS

Una vez respondas estas preguntas, crearemos:

1. ✅ Schemas Zod para todas las entidades
2. ✅ Tipos TypeScript automáticos
3. ✅ Validadores reutilizables
4. ✅ Astro Actions funcionales
5. ✅ Ejemplos listos para usar
6. ✅ Estructura desacoplada y mantenible
