import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Strop - Reporte de Incidencia",
  description: "Portal de resolución de incidencias para contratistas",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-sm relative flex flex-col">
          {children}
      </div>
    </div>
  );
}
