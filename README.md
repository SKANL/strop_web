# 🖥️ STROP Web - Comando Central Gerencial

[![React](https://img.shields.io/badge/React-19+-61DAFB?logo=react)](https://react.dev)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-SSR-3ECF8E?logo=supabase)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript)](https://www.typescriptlang.org/)

<div align="center">
  <h3>📊 Dashboard Gubernamental B2B y Analíticas</h3>
</div>

---

## 1. Descripción Breve

**STROP Web** es el centro de comando (Dashboard Administrativo) del proyecto STROP. Mientras que la App Móvil captura la cruda realidad en la obra, esta plataforma web procesa, estructura y proyecta de manera analítica esa información para la Alta Gerencia de proyectos de construcción civil.

Resuelve el desorden administrativo centralizando la evaluación de riesgos financieros, permitiendo gestionar organizaciones, presupuestos de contingencia, revisión visual de incidentes mediante geolocalización o notas multimedia y operando bajo un entorno seguro de aislamiento de datos (*Multi-Tenant B2B*).

---

## 2. Características Principales

*   **Supervisión Finanzas FinOps:** Dashboards interactivos y analíticas de gráficas visuales que reportan sobrepresupuestos, dinero en riesgo y contingencias rescatadas por incidencias (Finanzas vs Reales).
*   **Geolocalización Inmersiva:** Visualización cartográfica interactiva de los proyectos apoyado por integraciones topográficas que mapean dónde reportó el obrero el problema.
*   **Auditorías AI-Drivem:** Interactúa transparentemente con el historial procesado por el Asistente de IA. Los documentos de obra viajan por motores RAG para brindar resúmenes instantáneos a los gerentes.
*   **RBAC (Manejo de Equipos):** Consola para invitar operarios, asignar proyectos particulares y bloquear accesos maliciosos basándose en roles estrictos (`is_system_role`).
*   **Aprobación Híbrida Directa:** Además de aprobar mitigaciones de incidentes directamente desde este panel web, hace sinergia con el ecosistema de autorizaciones vía WhatsApp de la directiva.

---

## 3. Arquitectura y Stack Tecnológico

Hemos garantizado que STROP rinda como una herramienta de grado Empresarial invirtiendo fuertemente en las herramientas más ágiles y robustas del sector frontend moderno.

### Frontend Framework & Core
*   **Entorno Robusto:** **Next.js 16** usando el moderno **App Router**. Todo fuertemente tipado utilizando **TypeScript** nativo.
*   **UI/UX Empresarial (Design System):** Renderizado con **Taiwlind CSS v4** sumamente optimizado y fusionado con componentes sin cabeza de **Shadcn/ui** y Radix-UI.
*   **Rendimiento y Lógica Asíncrona:** Formularios infalibles controlados mediante `react-hook-form` y esquemas de validación estricta de `zod`, combinando cálculos dinámicos de fechas con `date-fns`.
*   **Visualización Científica:** `Recharts` para las curvas financieras y proyecciones de ahorro y `MapLibre-GL` para el rastreo digital en tiempo real de los terrenos.

### Backend y Modelos de Seguridad Asíncrona (Supabase SSR)
*   Integración end-to-end con clúster **Supabase**. Usamos el `@supabase/ssr` (Server Side Rendering) garantizando el despachado de las sesiones al límite del servidor, cumpliendo de lleno con las legislaciones **RLS (Row Level Security)** en PostgreSQL que garantizan que una compañía de construcción A jamás acceda a los costos o incidentes de una compañía B.

---

## 4. Estructura de Carpetas

La aplicación previene el temido código legado (Spaghetti), implementando separación estricta:

```text
src/
├── app/                  # Enrutador Físico Next.js.
│   ├── (auth)/           # Flujos limpios de login y pass-recovery.
│   ├── dashboard/        # Centro de mando analítico principal.
│   └── actions/          # Lógica pura de Servidor (Next.js Server Actions) mutando BD.
├── components/           # UI Atómica.
│   ├── ui/               # Componentes genéricos instalados (Shadcn forms, buttons, cards).
│   └── [features]/       # (incidents, landing, projects, roles) UI altamente específica a negocio.
├── hooks/                # React custom hooks y asincronía.
├── lib/                  # Utilidades como singletons de base de datos Supabase, formateadores HTTP.
└── types/                # Transposición total estática del esquema SQL a Interfaces de TS (`supabase.ts`).
```

---

## 5. El Equipo (Créditos)

Unir de manera fluida un Frontend SSR interactivo con la crueldad y la desincronización natural de reportes móviles de la construcción es resultado de un ensamble de arquitectura sólido orquestado por talento real:

*   **Braulio Isaias Bernal Padron** - *Lead Architect & Modelado C4*: Fundó las bases del Next.js App Router, integró la filosofía arquitectónica global y la interacción del ecosistema de componentes. 
*   **Luis Yael Zapata Paredez** - *Frontend Web System & UI/UX*: Master visual que integró las primitivas de Radix UI y Tailwind CSS con React 19 para garantizar el aspecto estético, moderno, lúgubre y corporativo de los tableros analíticos.
*   **Andri Yael Rodriguez Flota** - *Server Actions & Data Engineering*: Experto que vinculó los componentes del SSR hacia los esquemas fuertemente tipados de Supabase (`zod` validations a PostgreSQL), manteniendo seguros los pipelines API.
*   **Jose Gaspar Anguas Ku** - *Flujos de Operacionales & QA Mastery*: Mantenimiento de rigurosos controles de calidad entre lo enviado por el Módulo Móvil Offline, cruce de presupuestos reportados y lo dibujado fidedignamente en las gráficas directivas.
*   **Francia Faride Ojeda Estrella** - *UI/UX Liaison & Sinergia Operacional*: Coordinación transversal de las jerarquías de diseño, consolidando la experiencia responsiva integral del Web Dashboard para los gerentes de proyecto.

---

## 6. 🤖 Desarrollo Impulsado por Inteligencia Artificial (+IA)

Este no es un proyecto de software tradicional. **STROP Web** fue orquestado y fundamentado utilizando metodologías de vanguardia en **Agentic AI Workflow y Prompt Engineering**.

A través de la co-creación con avanzados modelos de Inteligencia Artificial actuando como arquitectos de co-piloto, logramos catalizar drásticamente la eficiencia del ciclo de desarrollo. Desde la inyección de tipos rígidos de TypeScript para la validación End-to-End con la Base de datos, hasta el veloz acoplamiento de métricas complejas en Next.js SSR; la IA funcionó como una extensión hiper-optimizada de las capacidades humanas de nuestro equipo, destrozando las barreras del desarrollo de software convencional.

---

## 7. Prerrequisitos e Instalación (Comandos Node.js/Next)

Para correr la plataforma en modo Servidor de Desarrollo, clona el repositorio e instala los paquetes:

*(A continuación se listan las instrucciones nativas automatizadas para correr localmente el motor SSR).*

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
