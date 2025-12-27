# 🏗️ ARQUITECTURA OPTIMIZADA DEL DASHBOARD - GUÍA DE REFERENCIA

## 📋 Estructura de Carpetas (Islands Architecture)

```
src/components/dashboard/
├── islands/              # React components con interactividad (hidratados selectivamente)
│   ├── FloatingNav.tsx           (client:idle) - Navegación flotante
│   ├── MobileNav.tsx             (client:idle) - Nav móvil
│   ├── RightSidebar.tsx          (client:idle) - Panel usuario
│   ├── DashboardTabs.tsx         (client:load) - Tabs principales
│   ├── ProjectsWidget.tsx        (client:visible) - Widget proyectos
│   ├── IncidentsTable.tsx        (client:visible) - Tabla incidencias
│   ├── ActivityFeed.tsx          (client:visible) - Feed de actividad
│   └── StatsWidget.tsx           (client:visible) - Gráficos
│
├── static/              # Astro components (renderizados en servidor, sin JS)
│   ├── KPIGrid.astro             - Grid de KPIs
│   ├── KPICard.astro             - Card individual de KPI
│   ├── DashboardHeader.astro     - Header estático
│   └── ProjectCard.astro         - Card de proyecto
│
└── motion/              # Utilidades de animación reutilizables
    └── MotionWrapper.tsx         - Wrapper para animaciones con Motion
```

## 🎯 Directivas de Hidratación Explicadas

| Directiva | Carga | Uso | Ejemplo |
|-----------|-------|-----|---------|
| `client:load` | Inmediato | Componentes críticos en first-paint | DashboardTabs |
| `client:idle` | Cuando el navegador está libre | UI no crítica pero interactiva | FloatingNav, RightSidebar |
| `client:visible` | Cuando entra en viewport | Widgets pesados abajo en la página | ProjectsWidget, StatsWidget |
| (ninguna) | Nunca | Datos estáticos, renderizados en servidor | KPIGrid, DashboardHeader |

## 📊 Impacto de Rendimiento

### Antes (Monolítico)
```
- DashboardContent: client:load
- ~240 líneas de React
- Todas las animaciones (Framer Motion + Motion)
- Todo el JavaScript hidratado al cargar
- ~180-200 KB de JavaScript inicial
```

### Después (Islands Architecture)
```
- KPIs: Astro (0 KB JS)
- Header: Astro (0 KB JS)
- FloatingNav: client:idle (↓ prioridad)
- RightSidebar: client:idle (↓ prioridad)
- DashboardTabs: client:load (crítico)
- Widgets: client:visible (solo cuando visible)
- Estimado: ~80-100 KB de JavaScript inicial (↓ 50-60%)
```

## 🎬 Animaciones con Motion

### Patrón Recomendado
```tsx
// ✅ CORRECTO: Animación de entrada una sola vez
import { motion } from "motion/react";

export function AnimatedCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

// ✅ MEJOR: Con reutilizable MotionWrapper
import { MotionWrapper } from "@/components/dashboard/motion/MotionWrapper";

export function MyComponent() {
  return (
    <MotionWrapper type="fadeInUp" duration={0.3}>
      <div>Contenido animado</div>
    </MotionWrapper>
  );
}
```

### Dónde Usar Motion
- ✅ Entrada de componentes (initial → animate)
- ✅ Cambios de estado (open/close, expanded/collapsed)
- ✅ Transiciones entre tabs
- ❌ NO en props que cambian constantemente
- ❌ NO en elementos que re-renderizan frecuentemente

## 🔄 Flujo de Hidratación en Dashboard

```
1. El servidor renderiza la página (Astro)
   └─ KPIGrid (estático, HTML puro)
   └─ DashboardHeader (estático, HTML puro)
   └─ DashboardTabs (marcado como client:load)
   └─ FloatingNav (marcado como client:idle)
   └─ RightSidebar (marcado como client:idle)

2. El navegador recibe HTML + referencias de islands
   └─ Muestra KPIs e Header inmediatamente (sin esperar JS)
   └─ Comienza a descargar React + componentes interactivos

3. React se carga y React hydrata:
   └─ PRIMERO: DashboardTabs (client:load)
   └─ DESPUÉS: FloatingNav y RightSidebar (client:idle)
   └─ CUANDO VISIBLE: ProjectsWidget, IncidentsTable, etc (client:visible)

4. Las animaciones de Motion se ejecutan solo en componentes hidratados
```

## 📝 Guía de Migración de Componentes

Si necesitas crear un nuevo componente:

1. **¿Necesita ser interactivo?**
   - NO → Crear como `.astro` en `static/`
   - SÍ → Ir al paso 2

2. **¿Necesita mostrarse en el primer render?**
   - SÍ → Usar `client:load` en `islands/`
   - NO → Ir al paso 3

3. **¿Está siempre visible?**
   - SÍ → Usar `client:idle` en `islands/`
   - NO → Usar `client:visible` en `islands/`

## 🧪 Testing de Rendimiento

Para verificar que la arquitectura funciona correctamente:

```bash
# 1. Construir la app
npm run build

# 2. Verificar tamaño de chunks en .vercel/output/
# Las carpetas de islands/ deben estar en chunks separados

# 3. En DevTools > Performance > Largest Contentful Paint (LCP)
# Debe ser < 2.5s (Web Vitals)

# 4. Verificar que los KPIs aparecen sin esperar a React
# (abrir DevTools > Network y throttle a slow 3G)
```

## 🚀 Performance Tips

1. **Cada island es independiente**
   - FloatingNav se hidrata sin esperar RightSidebar
   - Las animaciones no se bloquean mutuamente

2. **Usa client:visible para listas largas**
   - ProjectsWidget solo se hidrata cuando scrolls hacia él
   - Ahorra ~20KB si no lo necesitas en first-paint

3. **Mantén componentes estáticos sin estado**
   - KPICard.astro no tiene useState, onClick, etc.
   - Se renderiza una sola vez en el servidor

4. **Reutiliza MotionWrapper**
   - Evita duplicar lógica de animaciones
   - Reduce tamaño de bundle

## 📚 Referencias Externas

- [Astro Islands Architecture](https://docs.astro.build/en/concepts/islands/)
- [Hydration Directives](https://docs.astro.build/en/reference/directives-reference/#client-directives)
- [Motion Library](https://motion.dev/)
- [Web Vitals](https://web.dev/vitals/)

---

**Última actualización:** Diciembre 26, 2025
**Versión:** 1.0 - Arquitectura optimizada con Islands
