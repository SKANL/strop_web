// Índice de componentes de Dashboard
// Usa este archivo como referencia para importar componentes

// ========== COMPONENTES ESTÁTICOS (Astro - sin JS) ==========
// NOTA: Los componentes .astro NO se pueden exportar desde archivos .ts
// Impórtalos directamente en tus archivos .astro:
//   import KPIGrid from "@/components/dashboard/static/KPIGrid.astro";
//   import KPICard from "@/components/dashboard/static/KPICard.astro";
//   import DashboardHeader from "@/components/dashboard/static/DashboardHeader.astro";

// ========== ISLANDS (React - hidratación selectiva) ==========
export * from '@/components/dashboard/islands/FloatingNav'; // client:idle
export * from '@/components/dashboard/islands/MobileNav'; // client:idle
export * from '@/components/dashboard/islands/RightSidebar'; // client:idle
export * from '@/components/dashboard/islands/DashboardTabs'; // client:load
export * from '@/components/dashboard/islands/ProjectsWidget'; // client:visible
export * from '@/components/dashboard/islands/IncidentsTable'; // client:visible
export * from '@/components/dashboard/islands/ActivityFeed'; // client:visible
export * from '@/components/dashboard/islands/StatsWidget'; // client:visible

// ========== UTILIDADES DE MOTION ==========
export * from '@/components/dashboard/motion/MotionWrapper'; // Wrapper reutilizable para animaciones
