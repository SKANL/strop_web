/**
 * Daily grouped timeline for operational logs
 * With weather context and date headers
 */

"use client";

import { motion } from "motion/react";
import { Sun, Cloud, CloudRain, CloudLightning } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OperationalLog, DailyWeather, WeatherCondition } from "../types";
import { LogItemCard } from "./LogItemCard";
import { groupLogsByDate, getWeatherForDate } from "@/lib/mock/operational-logs";

interface DailyTimelineProps {
  logs: OperationalLog[];
  className?: string;
}

const weatherIcons: Record<WeatherCondition, React.ElementType> = {
  sun: Sun,
  cloud: Cloud,
  rain: CloudRain,
  storm: CloudLightning,
};

const weatherColors: Record<WeatherCondition, string> = {
  sun: "bg-warning/20 text-warning",
  cloud: "bg-muted text-muted-foreground",
  rain: "bg-info/20 text-info",
  storm: "bg-primary/20 text-primary",
};

function formatDateHeader(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateStr === today.toISOString().split("T")[0]) {
    return "Hoy";
  }
  if (dateStr === yesterday.toISOString().split("T")[0]) {
    return "Ayer";
  }

  return date.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function WeatherWidget({ weather }: { weather?: DailyWeather }) {
  if (!weather) return null;

  const WeatherIcon = weatherIcons[weather.condition];

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
        weatherColors[weather.condition]
      )}
    >
      <WeatherIcon className="h-4 w-4" />
      <span className="font-medium">{weather.temp}°C</span>
      {weather.precipitationMm > 0 && (
        <span className="text-xs opacity-75">{weather.precipitationMm}mm</span>
      )}
    </div>
  );
}

export function DailyTimeline({ logs, className }: DailyTimelineProps) {
  const groupedLogs = groupLogsByDate(logs);
  const sortedDates = Object.keys(groupedLogs).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">Sin eventos</p>
        <p className="text-sm">No hay eventos registrados para los filtros seleccionados.</p>
      </div>
    );
  }

  return (
    <ScrollArea className={cn("h-[calc(100vh-320px)]", className)}>
      <div className="space-y-8 pr-4">
        {sortedDates.map((date) => {
          const dayLogs = groupedLogs[date];
          const weather = getWeatherForDate(date);

          return (
            <motion.section
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              {/* Date header with weather */}
              <div className="flex items-center gap-3 mb-4 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">
                <h3 className="text-lg font-semibold capitalize">
                  {formatDateHeader(date)}
                </h3>
                <WeatherWidget weather={weather} />
                <Badge variant="outline" className="ml-auto">
                  {dayLogs.length} eventos
                </Badge>
              </div>

              {/* Timeline line and items */}
              <div className="relative pl-6 border-l-2 border-border space-y-3">
                {dayLogs.map((log, index) => (
                  <div key={log.id} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-[25px] top-4 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                    <LogItemCard log={log} index={index} />
                  </div>
                ))}
              </div>
            </motion.section>
          );
        })}
      </div>
    </ScrollArea>
  );
}
