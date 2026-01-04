import { useState, useMemo } from "react";
import { toast } from "sonner";
import { 
  FileSpreadsheet,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell, LabelList } from "recharts";
import type { CriticalPathItem, CriticalPathStatus } from "@/lib/mock/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ExcelImportFlow } from "../import/ExcelImportFlow";

interface ProjectTimelineTabProps {
  items: CriticalPathItem[];
  projectId?: string;
}

// Configuración del chart para shadcn
// Configuración del chart para shadcn
const chartConfig = {
  completed: {
    label: "Completado",
    color: "var(--color-success)", 
  },
  remaining: {
    label: "Pendiente",
    color: "var(--color-muted)",
  },
} satisfies ChartConfig;

// Colores según status para las barras
const statusColors: Record<CriticalPathStatus, { completed: string; remaining: string }> = {
  COMPLETED: {
    completed: "var(--color-success)", 
    remaining: "var(--color-muted)", 
  },
  IN_PROGRESS: {
    completed: "var(--color-info)", 
    remaining: "var(--color-muted)", 
  },
  PENDING: {
    completed: "var(--color-warning)", 
    remaining: "var(--color-muted)", 
  },
};

export function ProjectTimelineTab({ items, projectId = "mock-project-id" }: ProjectTimelineTabProps) {
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Handle successful import
  const handleImportSuccess = (data: Record<string, unknown>[]) => {
    console.log("Imported data:", data);
    // TODO: In real implementation, this would update the items via a store or refetch
    setIsImportOpen(false);
    toast.success("Ruta Crítica importada", {
      description: `Se importaron ${data.length} actividades exitosamente`,
    });
  };

  // Estadísticas
  const stats = useMemo(() => {
    const total = items.length;
    const completed = items.filter(i => i.status === "COMPLETED").length;
    const inProgress = items.filter(i => i.status === "IN_PROGRESS").length;
    const pending = items.filter(i => i.status === "PENDING").length;
    const avgProgress = total > 0 
      ? Math.round(items.reduce((acc, i) => acc + i.progressPercentage, 0) / total)
      : 0;
    
    return { total, completed, inProgress, pending, avgProgress };
  }, [items]);

  // Transformar datos para Recharts - Bar Chart Stacked Horizontal
  const chartData = useMemo(() => {
    return items.map((item) => {
      // Calcular duración en meses
      const startDate = new Date(item.plannedStart);
      const endDate = new Date(item.plannedEnd);
      const durationMonths = Math.max(1, 
        Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
      );

      // Truncar nombre si es muy largo
      const shortName = item.activityName.length > 25 
        ? item.activityName.substring(0, 22) + "..." 
        : item.activityName;

      return {
        id: item.id,
        activity: shortName,
        fullName: item.activityName,
        completed: item.progressPercentage,
        remaining: 100 - item.progressPercentage,
        status: item.status,
        durationMonths,
        plannedStart: new Date(item.plannedStart).toLocaleDateString("es-MX", { 
          month: "short", 
          year: "2-digit" 
        }),
        plannedEnd: new Date(item.plannedEnd).toLocaleDateString("es-MX", { 
          month: "short", 
          year: "2-digit" 
        }),
        // Colores según status
        completedColor: statusColors[item.status].completed,
        remainingColor: statusColors[item.status].remaining,
      };
    });
  }, [items]);

  // Altura dinámica basada en cantidad de items
  const chartHeight = Math.max(300, items.length * 52);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Actividades</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-success/20 bg-success/10">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{stats.completed}</p>
                <p className="text-xs text-success/80">Completadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-info/20 bg-info/10">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-info/20">
                <Clock className="h-4 w-4 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-info">{stats.inProgress}</p>
                <p className="text-xs text-info/80">En Progreso</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-warning/20 bg-warning/10">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <AlertCircle className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{stats.pending}</p>
                <p className="text-xs text-warning/80">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Card */}
      <Card className="rounded-2xl border-border shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border py-5">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-foreground">
                Ruta Crítica (Timeline)
              </CardTitle>
              <CardDescription className="mt-1">
                Progreso de actividades del proyecto
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              {/* Leyenda visual */}
              <div className="flex gap-4 text-xs items-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-success" />
                  <span className="text-muted-foreground font-medium">Completado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-info" />
                  <span className="text-muted-foreground font-medium">En Progreso</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-muted" />
                  <span className="text-muted-foreground font-medium">Pendiente</span>
                </div>
              </div>

              <Sheet open={isImportOpen} onOpenChange={setIsImportOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="rounded-xl gap-2 border-border hover:bg-muted"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-success" />
                    Importar .xlsx
                  </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-2xl w-full" side="right">
                  <SheetHeader className="mb-4">
                    <SheetTitle>Importar Ruta Crítica</SheetTitle>
                    <SheetDescription>
                      Importa tu programa de obra desde Excel (.xlsx) o CSV.
                      El sistema detectará automáticamente las columnas compatibles.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
                    <ExcelImportFlow
                      type="critical_path"
                      projectId={projectId}
                      onSuccess={handleImportSuccess}
                      onCancel={() => setIsImportOpen(false)}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {items.length > 0 ? (
            <ChartContainer 
              config={chartConfig} 
              className="w-full"
              style={{ height: `${chartHeight}px` }}
            >
              <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{ left: 10, right: 40, top: 10, bottom: 10 }}
                barCategoryGap="20%"
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" opacity={0.3} />
                <YAxis
                  dataKey="activity"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={180}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                />
                <XAxis 
                  type="number" 
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <ChartTooltip
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                  content={
                    <ChartTooltipContent
                      labelKey="fullName"
                      formatter={(value, name, item) => {
                        const data = item.payload;
                        if (name === "completed") {
                          return (
                            <div className="flex flex-col gap-1">
                              <span className="font-medium text-foreground">{data.fullName}</span>
                              <span className="text-muted-foreground">
                                Progreso: <span className="font-semibold text-success">{value}%</span>
                              </span>
                              <span className="text-muted-foreground text-xs">
                                {data.plannedStart} → {data.plannedEnd} ({data.durationMonths} meses)
                              </span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  }
                />
                <Bar
                  dataKey="completed"
                  stackId="progress"
                  radius={[4, 0, 0, 4]}
                  name="completed"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-completed-${index}`} fill={entry.completedColor} />
                  ))}
                  <LabelList
                    dataKey="completed"
                    position="insideLeft"
                    offset={8}
                    className="fill-white font-medium"
                    fontSize={11}
                    formatter={(value: number) => value > 15 ? `${value}%` : ""}
                  />
                </Bar>
                <Bar
                  dataKey="remaining"
                  stackId="progress"
                  radius={[0, 4, 4, 0]}
                  name="remaining"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-remaining-${index}`} fill={entry.remainingColor} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium text-foreground mb-2">Sin actividades</p>
              <p className="text-sm mb-4">
                Importa tu programa de obra desde Excel
              </p>
              <Button variant="outline" className="rounded-xl gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Importar .xlsx
              </Button>
            </div>
          )}
        </CardContent>

        {items.length > 0 && (
          <CardFooter className="flex-col items-start gap-2 text-sm border-t border-border bg-muted/50 py-4">
            <div className="flex gap-2 font-medium leading-none text-foreground">
              <TrendingUp className="h-4 w-4 text-success" />
              Avance promedio del proyecto: {stats.avgProgress}%
            </div>
            <div className="leading-none text-muted-foreground text-xs">
              {stats.completed} de {stats.total} actividades completadas
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
