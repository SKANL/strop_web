// components/dashboard/projects/detail/ProjectTimelineTab.tsx - Tab de ruta crítica con vista Gantt (Recharts)
"use client";

import { useMemo } from "react";
import { 
  FileSpreadsheet,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell, LabelList } from "recharts";
import type { CriticalPathItem, CriticalPathStatus } from "@/lib/mock/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface ProjectTimelineTabProps {
  items: CriticalPathItem[];
}

// Configuración del chart para shadcn
const chartConfig = {
  completed: {
    label: "Completado",
    color: "hsl(160, 84%, 39%)", // emerald-500
  },
  remaining: {
    label: "Pendiente",
    color: "hsl(215, 20%, 85%)", // slate-300
  },
} satisfies ChartConfig;

// Colores según status para las barras
const statusColors: Record<CriticalPathStatus, { completed: string; remaining: string }> = {
  COMPLETED: {
    completed: "hsl(160, 84%, 39%)", // emerald-500
    remaining: "hsl(160, 84%, 85%)", // emerald-200
  },
  IN_PROGRESS: {
    completed: "hsl(217, 91%, 60%)", // blue-500
    remaining: "hsl(214, 32%, 91%)", // slate-200
  },
  PENDING: {
    completed: "hsl(215, 20%, 65%)", // slate-400
    remaining: "hsl(214, 32%, 91%)", // slate-200
  },
};

export function ProjectTimelineTab({ items }: ProjectTimelineTabProps) {
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
        <Card className="border-slate-200">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100">
                <Calendar className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-xs text-slate-500">Actividades</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700">{stats.completed}</p>
                <p className="text-xs text-emerald-600">Completadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{stats.inProgress}</p>
                <p className="text-xs text-blue-600">En Progreso</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <AlertCircle className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
                <p className="text-xs text-amber-600">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Card */}
      <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 py-5">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">
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
                  <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                  <span className="text-slate-600 font-medium">Completado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-blue-500" />
                  <span className="text-slate-600 font-medium">En Progreso</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-slate-300" />
                  <span className="text-slate-600 font-medium">Pendiente</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="rounded-xl gap-2 border-slate-200 hover:bg-slate-50"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                Importar .xlsx
              </Button>
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
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <XAxis 
                  type="number" 
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
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
                                Progreso: <span className="font-semibold text-emerald-600">{value}%</span>
                              </span>
                              <span className="text-muted-foreground text-[10px]">
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
            <div className="text-center py-16 text-slate-400">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium text-slate-600 mb-2">Sin actividades</p>
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
          <CardFooter className="flex-col items-start gap-2 text-sm border-t border-slate-100 bg-slate-50/50 py-4">
            <div className="flex gap-2 font-medium leading-none text-slate-700">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
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
