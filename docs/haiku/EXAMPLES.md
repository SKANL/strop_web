// EXAMPLES.md - Ejemplos de uso de la nueva arquitectura

## 📚 Ejemplos de Uso

### 1. AGREGAR UN COMPONENTE ESTÁTICO

Si necesitas un nuevo componente que NO necesita interactividad (como un card de información):

```astro
---
// src/components/dashboard/static/ProjectStats.astro
interface Props {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
}

const { totalProjects, activeProjects, completedProjects } = Astro.props;
---

<div class="space-y-2">
  <h3 class="font-semibold">Proyectos</h3>
  <p class="text-sm text-gray-600">
    {activeProjects} de {totalProjects} activos
  </p>
</div>
```

Usar en dashboard:
```astro
---
import ProjectStats from "@/components/dashboard/static/ProjectStats.astro";
---

<ProjectStats 
  totalProjects={10} 
  activeProjects={7} 
  completedProjects={3} 
/>
```

### 2. AGREGAR UN ISLAND INTERACTIVO

Si necesitas un componente con estado (filtros, búsqueda, etc):

```tsx
// src/components/dashboard/islands/ProjectFilter.tsx
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ProjectFilter() {
  const [status, setStatus] = useState("all");

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4"
    >
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="active">Activos</SelectItem>
          <SelectItem value="completed">Completados</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
}
```

Usar en página (con directiva correcta):
```astro
---
import { ProjectFilter } from "@/components/dashboard/islands/ProjectFilter";
---

<ProjectFilter client:visible /> {/* client:visible porque no es crítico */}
```

### 3. USAR MotionWrapper PARA ANIMACIONES

En lugar de duplicar la lógica de animación en cada componente:

```tsx
// ❌ SIN MotionWrapper (repetitivo)
<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
  <Card>Contenido</Card>
</motion.div>

// ✅ CON MotionWrapper (reutilizable)
import { MotionWrapper } from "@/components/dashboard/motion/MotionWrapper";

<MotionWrapper type="fadeInUp" duration={0.3}>
  <Card>Contenido</Card>
</MotionWrapper>
```

### 4. AGREGAR ANIMACIÓN A UN LISTADO

```tsx
// src/components/dashboard/islands/ProjectList.tsx
"use client";

import { motion } from "motion/react";
import { MotionWrapper } from "@/components/dashboard/motion/MotionWrapper";

export function ProjectList({ projects }) {
  return (
    <div className="space-y-2">
      {projects.map((project, index) => (
        <MotionWrapper 
          key={project.id} 
          type="fadeInLeft" 
          delay={index * 0.05}
        >
          <div className="p-4 border rounded-lg">
            {project.name}
          </div>
        </MotionWrapper>
      ))}
    </div>
  );
}
```

### 5. ESTRUCTURA DE UNA PÁGINA COMPLETA

```astro
---
// src/pages/dashboard/usuarios.astro
import DashboardLayout from "@/layouts/DashboardLayout.astro";
import DashboardHeader from "@/components/dashboard/static/DashboardHeader.astro";
import { UserFilter } from "@/components/dashboard/islands/UserFilter";
import { UserTable } from "@/components/dashboard/islands/UserTable";
import { UserStats } from "@/components/dashboard/static/UserStats.astro";
import { mockUsers } from "@/lib/mock-dashboard";

const firstName = "Juan";
const organizationName = "Constructora Demo S.A.";
---

<DashboardLayout>
  <div class="space-y-6 p-8">
    {/* Estático: sin JS, aparece al instante */}
    <DashboardHeader firstName={firstName} organizationName={organizationName} />
    <UserStats totalUsers={mockUsers.length} />

    {/* Interactivo: carga cuando el browser está libre */}
    <UserFilter client:idle />

    {/* Interactivo: se hidrata cuando entra en viewport */}
    <UserTable users={mockUsers} client:visible />
  </div>
</DashboardLayout>
```

### 6. PATRÓN CON ESTADO Y EFECTOS SECUNDARIOS

```tsx
// src/components/dashboard/islands/SearchIncidents.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchIncidentsProps {
  onSearch: (query: string) => void;
}

export function SearchIncidents({ onSearch }: SearchIncidentsProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Debounce la búsqueda
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Buscar incidencias..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          className="pl-10"
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 left-0 right-0 bg-white border rounded-lg shadow-lg p-4 z-10"
          >
            <p className="text-sm text-gray-600">
              Resultados para "{query}"...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

### 7. COMPONENTE CON DATOS DINÁMICOS

```tsx
// src/components/dashboard/islands/RealTimeCounter.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";

export function RealTimeCounter({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);

  // Simular actualizaciones en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key={count}
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="text-3xl font-bold"
    >
      {count}
    </motion.div>
  );
}
```

Usar:
```astro
<RealTimeCounter client:load initialCount={42} />
```

---

## 📋 CHECKLIST PARA NUEVOS COMPONENTES

Cuando crees un nuevo componente, pregúntate:

- [ ] ¿Necesita ser interactivo (useState, onClick, etc.)?
  - NO → Crear `.astro` en `static/`
  - SÍ → Continuar

- [ ] ¿Necesita aparecer en el primer render?
  - SÍ → Usar `client:load` en `islands/`
  - NO → Continuar

- [ ] ¿Siempre está visible en la pantalla?
  - SÍ → Usar `client:idle` en `islands/`
  - NO → Usar `client:visible` en `islands/`

- [ ] ¿Tiene animaciones?
  - SÍ → Usar Motion (importar desde "motion/react")
  - NO → Sin Motion

- [ ] ¿La animación se repite?
  - SÍ → Considerar MotionWrapper reutilizable
  - NO → Motion inline está bien

---

## 🐛 Debugging

### Verificar qué components están hidratados
En DevTools Console:
```javascript
// Ver todos los elements con data-astro-island
document.querySelectorAll('[data-astro-island]').forEach(el => {
  console.log(el.getAttribute('data-astro-island'));
});
```

### Verificar timing de hidratación
En DevTools Performance:
```
React.lazy chunks se cargan cuando se usan:
- DashboardTabs (client:load) = inmediato
- FloatingNav (client:idle) = ~200ms después
- ProjectsWidget (client:visible) = cuando scrolls
```

### Performance en DevTools
1. Throttle a "Slow 3G"
2. Recarga
3. Verifica que KPIs aparecen antes de que cargue React
4. Verifica que no hay "layout shift" cuando se hidratan islands

---

**Última actualización:** Diciembre 26, 2025
