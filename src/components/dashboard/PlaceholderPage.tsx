// PlaceholderPage.tsx - Componente placeholder para páginas en desarrollo
import { motion } from "framer-motion";
import { Construction, ArrowLeft } from "lucide-react";
import { FloatingNav } from "./FloatingNav";
import { RightSidebar } from "./RightSidebar";

interface PlaceholderPageProps {
  title: string;
  description?: string;
  currentPath: string;
}

export function PlaceholderPage({ title, description, currentPath }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Floating Navigation */}
      <FloatingNav currentPath={currentPath} />

      {/* Panel Lateral Derecho */}
      <RightSidebar />

      {/* Main Content */}
      <main className="pl-28 md:pl-32 pr-6 md:pr-28 py-6">
        {/* Header */}
        <div className="mb-8">
          <a 
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Dashboard
          </a>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-gray-500 mt-1">{description}</p>
          )}
        </div>

        {/* Placeholder Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center min-h-[60vh] rounded-3xl border-2 border-dashed border-gray-200 bg-white"
        >
          <div className="p-4 rounded-2xl bg-blue-100 mb-6">
            <Construction className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">En Construcción</h2>
          <p className="text-gray-500 text-center max-w-md mb-6">
            Esta sección está siendo desarrollada. Pronto estará disponible con todas sus funcionalidades.
          </p>
          <a 
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Ir al Dashboard
          </a>
        </motion.div>
      </main>
    </div>
  );
}
