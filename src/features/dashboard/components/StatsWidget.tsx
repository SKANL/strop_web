// islands/StatsWidget.tsx - Widget de estadísticas con Charts
"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, RadialBar, RadialBarChart, PolarGrid, PolarRadiusAxis, Label } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

interface StatsWidgetProps {
  weeklyResolved: number;
  weeklyCreated: number;
  criticalActive: number;
  avgResolutionDays: number;
  projectProgress: { name: string; progress: number }[];
}

export function StatsWidget({
  weeklyResolved = 15,
  weeklyCreated = 12,
  criticalActive = 3,
  avgResolutionDays = 2.5,
  projectProgress = [],
}: Partial<StatsWidgetProps>) {
  const netChange = weeklyResolved - weeklyCreated;
  const isPositive = netChange >= 0;

  const avgProgress = projectProgress.length > 0
    ? Math.round(projectProgress.reduce((sum, p) => sum + p.progress, 0) / projectProgress.length)
    : 45;

  const weeklyData = [
    { day: "L", value: 8 },
    { day: "M", value: 12 },
    { day: "X", value: 6 },
    { day: "J", value: 15 },
    { day: "V", value: 9 },
    { day: "S", value: 11 },
    { day: "D", value: 14 },
  ];

  const barChartConfig = {
    value: {
      label: "Resueltas",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const radialData = [
    { name: "progress", value: avgProgress, fill: "hsl(var(--chart-2))" },
  ];

  const radialChartConfig = {
    value: { label: "Avance" },
    progress: { label: "Progreso", color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig;

  return (
    <Card className="rounded-3xl border-border shadow-sm h-full">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">Resumen</CardTitle>
          <Badge
            variant="outline"
            className={`px-1.5 h-5 border-0 gap-0.5 ${
              isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            }`}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isPositive ? "+" : ""}{netChange}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-foreground">{weeklyResolved}</span>
              <span className="text-xs text-muted-foreground">resueltas</span>
            </div>
            <ChartContainer config={barChartConfig} className="h-20 w-full">
              <BarChart data={weeklyData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={3} />
              </BarChart>
            </ChartContainer>
            <div className="flex justify-between text-xs text-muted-foreground px-0.5">
              <span>L</span>
              <span>D</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <ChartContainer config={radialChartConfig} className="h-24 w-24">
              <RadialBarChart
                data={radialData}
                startAngle={90}
                endAngle={90 - (avgProgress / 100) * 360}
                innerRadius={35}
                outerRadius={48}
              >
                <PolarGrid
                  gridType="circle"
                  radialLines={false}
                  stroke="none"
                  className="first:fill-muted last:fill-background"
                  polarRadius={[38, 32]}
                />
                <RadialBar dataKey="value" background cornerRadius={10} />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-lg font-bold">
                              {avgProgress}%
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
            <span className="text-xs text-muted-foreground -mt-1">avance</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-destructive/5">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-foreground">{criticalActive}</span>
              <span className="text-xs text-muted-foreground">críticas</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-info/10">
            <span className="w-1.5 h-1.5 rounded-full bg-info" />
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-foreground">{avgResolutionDays}d</span>
              <span className="text-xs text-muted-foreground">tiempo</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
