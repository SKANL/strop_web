

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectGrid } from "@/components/dashboard/project-grid"
import { PanicRoom } from "@/components/dashboard/panic-room"

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full gap-4">
        {/* Top Row: KPIs - Fixed Height */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 shrink-0">
            {/* KPI 1: Dinero en Juego */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Dinero en Riesgo</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive font-mono">$145,000.00</div>
                    <p className="text-xs text-muted-foreground">+12% vs semana pasada</p>
                    <p className="text-xs text-muted-foreground mt-1">En 34 incidencias</p>
                </CardContent>
            </Card>

            {/* KPI 2: Dinero Recuperado */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Dinero Recuperado (YTD)</CardTitle>
                     <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                </CardHeader>
                 <CardContent>
                    <div className="text-2xl font-bold text-green-600 font-mono">$850,000.00</div>
                    <p className="text-xs text-muted-foreground">Cobradas a contratistas</p>
                </CardContent>
            </Card>

             {/* KPI 3: Velocidad */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Velocidad Resolución</CardTitle>
                     <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                </CardHeader>
                 <CardContent>
                    <div className="text-2xl font-bold font-mono">4.2 Días</div>
                    <p className="text-xs text-muted-foreground">Meta: &lt; 3.0 Días</p>
                </CardContent>
            </Card>

             {/* KPI 4: Proyectos Críticos */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Proyectos Críticos</CardTitle>
                     <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                </CardHeader>
                 <CardContent>
                    <div className="text-2xl font-bold font-mono">2 / 8</div>
                    <p className="text-xs text-muted-foreground">Requieren atención</p>
                </CardContent>
            </Card>
        </div>

        {/* Bottom Section: Grid + Panic Room - Flex Grow to fill rest of screen */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-0">
             <div className="lg:col-span-3 h-full min-h-0">
                <ProjectGrid />
             </div>
             <div className="lg:col-span-1 h-full min-h-0">
                <PanicRoom />
             </div>
        </div>
    </div>
  )
}
